/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [appointments, setAppointments] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [dashData, setDashData] = useState(null);

    // Fetch all sellers
    const getAllSeller = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-Seller`, {
                headers: { aToken },
            });
            if (data.success) {
                setSellers(data.Seller || []);
                console.log(data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching sellers:", error);
            toast.error(error.response?.data?.message || "Failed to fetch sellers");
        }
    };

    // Toggle seller availability
    const changeAvailability = async (sellerId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`,
                { sellerId },
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                setSellers((prevSellers) =>
                    prevSellers.map((seller) =>
                        seller._id === sellerId ? { ...seller, available: !seller.available } : seller
                    )
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error changing availability:", error);
            toast.error(error.response?.data?.message || "Failed to update availability");
        }
    };

    // Fetch all appointments
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
                headers: { aToken },
            });
            if (data.success) {
                setAppointments([...data.appointments].reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error(error.response?.data?.message || "Failed to fetch appointments");
        }
    };

    // Cancel an appointment
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`,
                { appointmentId },
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                setAppointments((prevAppointments) =>
                    prevAppointments.filter((appointment) => appointment._id !== appointmentId)
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error canceling appointment:", error);
            toast.error(error.response?.data?.message || "Failed to cancel appointment");
        }
    };

    // Fetch admin dashboard data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: { aToken },
            });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
        }
    };

    const value = {
        aToken,
        setAToken,
        sellers,
        getAllSeller,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContextProvider;