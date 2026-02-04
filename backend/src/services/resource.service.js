import {
  createResource,
  findResourceById,
  getResourcesByOrganization,
  updateResource,
  deleteResource,
} from "../repositories/resource.repository.js";

export const createResourceService = async ({
  organizationId,
  name,
  type,
  capacity = 0,
  location = null,
}) => {
  if (!organizationId || !name || !type) {
    throw new Error("Organization ID, name, and type are required");
  }

  if (capacity < 0) {
    throw new Error("Capacity must be a positive number");
  }

  const existingResources = await getResourcesByOrganization(organizationId);
  if (existingResources.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Resource with this name already exists in the organization");
  }

  return await createResource({ organizationId, name, type, capacity, location });
};

export const getResourcesService = async (organizationId) => {
  if (!organizationId) throw new Error("Organization ID is required");
  return await getResourcesByOrganization(organizationId);
};

// Get single resource
export const getResourceByIdService = async (id) => {
  if (!id) throw new Error("Resource ID is required");

  const resource = await findResourceById(id);
  if (!resource) throw new Error("Resource not found");

  return resource;
};

export const updateResourceService = async (id, data) => {
  if (!id) throw new Error("Resource ID is required");

  if (data.capacity && data.capacity < 0) {
    throw new Error("Capacity must be a positive number");
  }

  return await updateResource(id, data);
};

// Soft delete a resource
export const deleteResourceService = async (id) => {
  if (!id) throw new Error("Resource ID is required");

  return await deleteResource(id);
};