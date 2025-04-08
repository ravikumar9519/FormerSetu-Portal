import express from 'express';
import { loginSeller, appointmentsSeller, appointmentCancel, SellerList, changeAvailablity, appointmentComplete, SellerDashboard, SellerProfile, updateSellerProfile } from '../controllers/SellerController.js';
import authSeller from '../middleware/authSeller.js';
const SellerRouter = express.Router();

SellerRouter.post("/login", loginSeller)
SellerRouter.post("/cancel-appointment", authSeller, appointmentCancel)
SellerRouter.get("/appointments", authSeller, appointmentsSeller)
SellerRouter.get("/list", SellerList)
SellerRouter.post("/change-availability", authSeller, changeAvailablity)
SellerRouter.post("/complete-appointment", authSeller, appointmentComplete)
SellerRouter.get("/dashboard", authSeller, SellerDashboard)
SellerRouter.get("/profile", authSeller, SellerProfile)
SellerRouter.post("/update-profile", authSeller, updateSellerProfile)

export default SellerRouter;