import api from "../api";

export const fetchUsers = async (role) => {
  try {
    const response = await api.get(`/admin/getUsers?role=${role}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};