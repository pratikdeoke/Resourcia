import {
  createOrganizationWithOwner,
  findOrganizationByName
} from "../repositories/organization.repository.js";

export const createOrganizationService = async (data) => {
  const { organization, owner } = data;

  if (!organization || !owner) {
    throw new Error("Organization and owner details are required");
  }

  const { name, domain, timezone } = organization;

  if (!name || !timezone) {
    throw new Error("Organization name and timezone are required");
  }

  if (!owner.name || !owner.email || !owner.password) {
    throw new Error("Owner name, email and password are required");
  }

  if (name) {
  const existingOrg = await findOrganizationByName(name);
  if (existingOrg) {
    throw new Error("Organization with this name already exists");
  }
}
  return await createOrganizationWithOwner({
    organization,
    owner,
  });
};