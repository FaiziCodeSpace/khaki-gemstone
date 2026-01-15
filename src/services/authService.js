import api from "./api";
import { getGuestCart, clearGuestCart } from "../utils/guestCart";

const AUTH_URL = "/auth";

const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  clearGuestCart();
};

export const registerUser = async (formData) => {
  const guestCart = getGuestCart();

  const { data } = await api.post(`${AUTH_URL}/register`, {
    ...formData,
    guestCart,
  });

  saveAuth(data);
  return data;
};

export const loginUser = async (formData) => {
  const guestCart = getGuestCart();

  const { data } = await api.post(`${AUTH_URL}/login`, {
    ...formData,
    guestCart,
  });

  saveAuth(data);
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};