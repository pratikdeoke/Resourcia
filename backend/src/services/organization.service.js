import {
  createOrganization,
  findOrganizationByDomain,
} from "../repositories/organization.repository.js";

export const createOrganizationService = async (data) => {
  const { name, domain, timezone } = data;

  if (!name || !timezone) {
    throw new Error("Name and timezone are required");
  }

  if (domain) {
    const existingOrg = await findOrganizationByDomain(domain);
    if (existingOrg) {
      throw new Error("Organization with this domain already exists");
    }
  }

  return await createOrganization(data);
};