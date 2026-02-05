import adminApi from "./api.authService";

//  Admin Orders Services
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
    const response = await adminApi.patch(`/updateOrder/${orderId}/status`, payload);
    return response.data;
  } catch (error) {
    console.error("Error in updateOrderStatus service:", error);
    throw error.response?.data || error.message;
  }
};

// Publish the service functions

import api from "../api"; // Your standard axios instance

export const bookOrder = async (orderPayload) => {
  try {
    const response = await api.post("/placeOrder", orderPayload);
    
    // Check if the backend returned PayFast data
    if (response.data.payfast) {
      handlePayfastRedirect(response.data.payfast);
      return { type: 'PAYFAST_REDIRECT' };
    }

    // Otherwise, it's COD or a free order
    return { type: 'SUCCESS', data: response.data };
  } catch (error) {
    console.error("Order Booking Error:", error);
    throw error.response?.data || { message: "Failed to place order" };
  }
};

const handlePayfastRedirect = (payfastData) => {
  const { url, ...fields } = payfastData;
  
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};