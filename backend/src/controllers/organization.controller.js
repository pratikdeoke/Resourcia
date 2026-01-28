import { createOrganizationService } from "../services/organization.service.js";

export const createOrganizationController = async (req, res) => {
  try {
    const organization = await createOrganizationService(req.body);

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};