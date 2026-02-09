const CART_KEY = "guest_cart";

export const getGuestCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const addToGuestCart = (product) => {
  const cart = getGuestCart();
  // Ensure uniqueness by checking _id
  const exists = cart.find(item => item._id === product._id);

  if (!exists) {
    cart.push(product);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
};

export const removeFromGuestCart = (productId) => {
  window.dispatchEvent(new Event("cartUpdated"));
  const cart = getGuestCart().filter(item => item._id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearGuestCart = () => {
  localStorage.removeItem(CART_KEY);
};

export const clearGuestItem = (productId) => {
  try {
    const cart = getGuestCart();
    const updatedCart = cart.filter(item => item._id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated")); 
    return updatedCart;
  } catch (error) {
    console.error("Error removing guest item:", error);
    return [];
  }
};

