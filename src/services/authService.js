import api from "./api";
import { getGuestCart, clearGuestCart } from "../utils/guestCart";

const AUTH_URL = "/auth";

const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  clearGuestCart();
};

export const registerUser = async (formData) => {
  const guestCart = formData.guestCart || getGuestCart();
  const { data } = await api.post(`${AUTH_URL}/register`, {
    ...formData,
    guestCart,
  });
  saveAuth(data);
  return data;
};

export const loginUser = async (loginData) => {
  const guestCart = loginData.guestCart || getGuestCart();

  const { data } = await api.post(`${AUTH_URL}/login`, {
    ...loginData,
    guestCart,
  });

  saveAuth(data);
  return data;
};


export const applyInvestor = async (formData) => {
  const { data } = await api.post(`${AUTH_URL}/investor-register`, formData);

  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};