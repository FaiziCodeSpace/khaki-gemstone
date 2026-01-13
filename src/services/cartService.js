import api from "./api";

// ================= ADD TO CART =================
export const addToCart = async (productId) => {
  const { data } = await api.post("/addCart", { productId });
  return data;
};

// ================= FETCH CART =================
export const fetchCart = async () => {
  const { data } = await api.get("/cart");

  // normalize backend cart
  return (data.items || []).map((item) => ({
    id: item._id,
    product: item.product,
    quantity: item.quantity,
  }));
};

// =============== DELETE CART ITEM ===============
export const deleteFromCart = async (productId) => {
  const { data } = await api.delete(`/deleteCartItem/${productId}`);
  return data;
};