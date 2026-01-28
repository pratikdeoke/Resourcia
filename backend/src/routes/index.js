import { Router } from "express";
import authRoutes from "./auth.routes.js";
import orgRoutes from "./organization.routes.js";
import resourceRoutes from "./resource.routes.js";
import bookingRoutes from "./booking.routes.js";
import userRoutes from "./user.routes.js";
import userBookingRoutes from "./userBooking.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/register-organization", orgRoutes);
router.use("/resources", resourceRoutes);
router.use("/bookings", bookingRoutes);
router.use('/users', userRoutes);
router.use('/user-bookings', userBookingRoutes);

export default router;