import { Router } from "express";
import { createOrganizationController } from "../controllers/organization.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/rbac.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  createOrganizationController
);

export default router;