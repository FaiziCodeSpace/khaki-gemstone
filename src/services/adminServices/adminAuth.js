import adminApi from "./api.authService";

export const createAdmin = async (adminData) => {
  try {
    const response = await adminApi.post("/admin/create", adminData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create admin";
    throw new Error(message);
  }
};

export const editAdmin = async (id, adminData) => {
  try {
    // Passes the id in the URL to match: router.post("/editAdmin/:id", editAdmin);
    // or whatever your specific route string is
    const response = await adminApi.post(`/admin/editAdmin/${id}`, adminData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update admin";
    throw new Error(message);
  }
};

