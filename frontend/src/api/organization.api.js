import axios from "./axios";

export const createOrganization = (data) => {
  return axios.post("/register-organization", data);
};