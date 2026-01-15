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
    
    // The backend returns { items: [...] }
    const items = data.items || [];

    // Map the populated products to the format your Showcase needs
    return items.map((product) => ({
      _id: product._id,           // Match Showcase's 'product._id'
      name: product.name,         // Match Showcase's 'product.name'
      price: product.price,       // Match Showcase's 'product.price'
      primary_imgSrc: product.primary_imgSrc, // Match image field
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