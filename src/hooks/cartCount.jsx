import { useState, useEffect } from "react";
import { fetchCart } from "../services/cartService";
import { getGuestCart } from "../utils/guestCart";

export default function useCartCount() {
  const [count, setCount] = useState(0);

  const updateCount = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = await fetchCart();
      // Handle the standardized { items: [] } format
      const items = Array.isArray(data) ? data : data.items || [];
      setCount(items.length);
    } else {
      const guestItems = getGuestCart();
      setCount(guestItems.length);
    }
  };

  useEffect(() => {
    updateCount();
    // Listen for custom events if you want it to update instantly across components
    window.addEventListener("cartUpdated", updateCount);
    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  return count;
}