import api from "../api";

export const fetchUsers = async (role, status, page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    if (status) params.append("status", status);
    params.append("page", page);
    params.append("limit", limit);

    const response = await api.get(`/admin/getUsers?${params.toString()}`);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to connect to server";
    console.error("Fetch Users Error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const updateInvestorStatus = async (id, status) => {
  try {
    await api.post(`/admin/update-investor-status?status=${status}`, { id });
  } catch (error) {
    console.error(`Error updating status to ${status} for investor ${id}:`, error);
    throw error;
  }
}