import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SellerModel from "../models/SellerModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API for Seller Login 
const loginSeller = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await SellerModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get Seller appointments for Seller panel
const appointmentsSeller = async (req, res) => {
    try {

        const { SelId } = req.body
        const appointments = await appointmentModel.find({ SelId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for Seller panel
const appointmentCancel = async (req, res) => {
    try {

        const { SelId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.SelId === SelId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for Seller panel
const appointmentComplete = async (req, res) => {
    try {

        const { SelId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.SelId === SelId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all Seller list for Frontend
const SellerList = async (req, res) => {
    try {

        const Seller = await SellerModel.find({}).select(['-password', '-email'])
        res.json({ success: true, Seller })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change Seller availablity for Admin and Seller Panel
const changeAvailablity = async (req, res) => {
    try {

        const { SelId } = req.body
         console.log(SelId);
        const SelData = await SellerModel.findById(SelId)
        await SellerModel.findByIdAndUpdate(SelId, { available: !SelData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get Seller profile for  Seller Panel
const SellerProfile = async (req, res) => {
    try {

        const { SelId } = req.body
        const profileData = await SellerModel.findById(SelId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update Seller profile data from  Seller Panel
const updateSellerProfile = async (req, res) => {
    try {

        const { SelId, fees, address, available } = req.body

        await SellerModel.findByIdAndUpdate(SelId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for Seller panel
const SellerDashboard = async (req, res) => {
    try {

        const { SelId } = req.body

        const appointments = await appointmentModel.find({ SelId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let buyers = []

        appointments.map((item) => {
            if (!buyers.includes(item.userId)) {
                buyers.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            buyers: buyers.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginSeller,
    appointmentsSeller,
    appointmentCancel,
    SellerList,
    changeAvailablity,
    appointmentComplete,
    SellerDashboard,
    SellerProfile,
    updateSellerProfile
}