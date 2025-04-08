import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addSeller, allSeller, adminDashboard } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/SellerController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-Seller", authAdmin, upload.single('image'), addSeller)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-Seller", authAdmin, allSeller)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;