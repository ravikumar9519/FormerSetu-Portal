/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [Seller, setSeller] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);

  // 🔹 Memoized function for getting Seller data
  const getSellerData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/Seller/list`);
      if (data.success) {
        setSeller(data.Seller);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }, [backendUrl]); // Only re-create when `backendUrl` changes

  // 🔹 Memoized function for getting user profile data
  const loadUserProfileData = useCallback(async () => {
    if (!token) return; // 🛑 Prevents unnecessary API calls when no token
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }, [backendUrl, token]); // Only re-create when `backendUrl` or `token` changes

  // 🔹 Fetch seller data once on mount
  useEffect(() => {
    getSellerData();
  }, [getSellerData]); // ✅ No infinite re-renders

  // 🔹 Fetch user profile only when token is available
  useEffect(() => {
    loadUserProfileData();
  }, [loadUserProfileData]); // ✅ Avoid unnecessary updates

  const value = {
    Seller,
    getSellerData, // Exposing function
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
