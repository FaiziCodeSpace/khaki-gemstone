import api from "./api";

// ================= ADD TO CART =================
export const addToCart = async (productId) => {
  const { data } = await api.post("/addCart", { productId });
  return data;
};

// ================= FETCH CART =================
export const fetchCart = async () => {
  try {
    const { data } = await api.get("/cart");
    const items = data.items || [];
    return items.map((product) => ({
      _id: product._id,           
      name: product.name,         
      price: product.price,       
      imgs_src: product.imgs_src, 
    }));
  } catch (error) {
    console.error("Fetch cart service error:", error);
    return [];
  }
};

// ... other functions (addToCart, etc.)

// =============== DELETE CART ITEM ===============
export const deleteFromCart = async (productId) => {
  const { data } = await api.delete(`/deleteCartItem/${productId}`);
  return data;
};