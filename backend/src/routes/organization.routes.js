import { Router } from "express";
import { createOrganizationController } from "../controllers/organization.controller.js";

const router = Router();
router.post("/", createOrganizationController);

export default router;