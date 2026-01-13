import api from "./api";

export const addToCart = async (productId) => {
  return api.post(
    "/addCart",
    { productId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const fetchCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const res = await api.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.items || [];
};