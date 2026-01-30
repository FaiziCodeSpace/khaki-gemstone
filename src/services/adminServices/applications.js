import api from "../api";

export const fetchUsers = async (role, status) => {
  try {
    const response = await api.get(`/admin/getUsers?role=${role}&status=${status || "pending"}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
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