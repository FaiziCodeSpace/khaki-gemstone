
export const getGuestCart = () => {
  return JSON.parse(localStorage.getItem("guest_cart")) || [];
};

export const addToGuestCart = (product) => {
  const cart = getGuestCart();

  const exists = cart.find(item => item._id === product._id);

  if (!exists) {
    cart.push({ ...product, quantity: 1 });
  } else {
    exists.quantity += 1;
  }

  localStorage.setItem("guest_cart", JSON.stringify(cart));
};

export const removeFromGuestCart = (productId) => {
  const cart = getGuestCart().filter(item => item._id !== productId);
  localStorage.setItem("guest_cart", JSON.stringify(cart));
};

export const clearGuestCart = () => {
  localStorage.removeItem("guest_cart");
};
