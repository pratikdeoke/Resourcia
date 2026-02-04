import { Router } from "express";
import {
  loginAdmin,
  loginUser,
} from "../controllers/auth.controller.js";

const router = Router();

// router.post("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);
router.post("/login-user", loginUser);

export default router;