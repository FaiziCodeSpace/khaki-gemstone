import adminApi from "./api.authService";

export const fetchOrders = async ({ status = "", page = 1, limit = 10 } = {}) => {
  try {
    const response = await adminApi.get("/orders", {
      params: { status, page, limit },
    });
    return response.data; 
  } catch (error) {
    console.error("Error in fetchOrders service:", error);
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (orderId, payload) => {
  try {
    const response = await adminApi.patch(`/admin/updateOrder/${orderId}/status`, payload);
    return response.data;
  } catch (error) {
    console.error("Error in updateOrderStatus service:", error);
    throw error.response?.data || error.message;
  }
};