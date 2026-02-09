import api from "./api";

// ================= ADD TO CART =================
export const addToCart = async (productId) => {
  const { data } = await api.post("/addCart", { productId });
  // Ensure we return the items array
  return data.items || data; 
};

// ================= FETCH CART =================
export const fetchCart = async () => {
  try {
    const { data } = await api.get("/cart");
    
    const items = data.items || data || [];
    
    return items; 
  } catch (error) {
    console.error("Fetch cart service error:", error);
    return [];
  }
};

// =============== DELETE CART ITEM ===============
export const deleteFromCart = async (productId) => {
  const { data } = await api.delete(`/deleteCartItem/${productId}`);
  return data.items || data;
};

// =============== DELETE CART ITEM ===============
export const clearCart = async () => {
  try {
    const { data } = await api.delete("/clearCart");
    return data.items || []; 
  } catch (error) {
    console.error("Frontend Clear Cart Error:", error);
    throw error; 
  }
}