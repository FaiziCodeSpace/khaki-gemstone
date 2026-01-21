import api from "./api";
import { getGuestCart, clearGuestCart } from "../utils/guestCart";

const AUTH_URL = "/auth";

const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  clearGuestCart();
};

// ================= REGISTER =================
export const registerUser = async (formData) => {
  const guestCart = formData.guestCart || getGuestCart();

  const { data } = await api.post(`${AUTH_URL}/register`, {
    ...formData,
    guestCart,
  });

  saveAuth(data);
  return data;
};

// ================= LOGIN =================
export const loginUser = async (loginData) => {
  const guestCart = loginData.guestCart || getGuestCart();

  const { data } = await api.post(`${AUTH_URL}/login`, {
    ...loginData,
    guestCart,
    role: "user",
  });

  saveAuth(data);
  return data;
};

// ================= APPLY INVESTOR =================
export const applyInvestor = async (formData) => {
  const guestCart = formData.guestCart || getGuestCart();

  const { data } = await api.post(`${AUTH_URL}/investor-register`, {
    ...formData,
    guestCart,
  });

  // Token might not be returned; save user anyway
  if (data.token) localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

// ================= LOGIN INVESTOR =================
export const loginInvestor = async (loginData) => {
  const guestCart = loginData.guestCart || getGuestCart();

  const { data } = await api.post(`${AUTH_URL}/login`, {
    ...loginData,
    guestCart,
    role: "investor",
  });

  saveAuth(data);
  return data;
};

// ================= LOGOUT =================
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
