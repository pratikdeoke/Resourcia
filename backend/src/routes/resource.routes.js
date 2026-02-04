import { Router } from "express";
import {
  createResourceController,
  getResourcesController,
  getResourceByIdController,
  updateResourceController,
  deleteResourceController,
} from "../controllers/resource.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/rbac.middleware.js";

const router = Router();

// Create a new resource
// Only ADMIN can create
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  createResourceController
);

// Get all resources for the organization
// All authenticated users can see
router.get(
  "/",
  authenticate,
  getResourcesController
);

// Get single resource by ID
// All authenticated users can see
router.get(
  "/:id",
  authenticate,
  getResourceByIdController
);

// Update a resource
// Only ADMIN can update
router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  updateResourceController
);

// Soft delete a resource
// Only ADMIN can delete
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  deleteResourceController
);

export default router;