import adminApi from "./api.authService";

export const getTransactions = async (params) => {
  try {
    const response = await adminApi.get("/transactions", { params });
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error fetching transactions";
  }
};

export const getTransactionDetail = async (id) => {
  try {
    const response = await adminApi.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Transaction not found";
  }
};


export const formatEnum = (slug) => {
  if (!slug) return "";
  return slug.split("_").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(" ");
};