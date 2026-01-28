import {
  createResourceService,
  getResourcesService,
  getResourceByIdService,
  updateResourceService,
  deleteResourceService,
} from "../services/resource.service.js";

//  Create a new resource
export const createResourceController = async (req, res) => {
  try {
    const resource = await createResourceService(req.body);

    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all resources for an organization
export const getResourcesController = async (req, res) => {
  try {
    const resources = await getResourcesService(req.user.organizationId);

    res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single resource by ID
export const getResourceByIdController = async (req, res) => {
  try {
    const resource = await getResourceByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


// Update a resource
export const updateResourceController = async (req, res) => {
  try {
    const resource = await updateResourceService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Soft delete a resource
export const deleteResourceController = async (req, res) => {
  try {
    const resource = await deleteResourceService(req.params.id);

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};