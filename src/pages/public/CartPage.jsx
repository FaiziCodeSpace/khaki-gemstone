import { useEffect, useState } from "react";
import { CartItems } from "../../components/public/Cart/CartItems";
import { PriceDetails } from "../../components/public/Cart/PriceDetails";
import { Footer } from "../../components/common/Footer";
import { fetchCart, deleteFromCart } from "../../services/cartService";
import { getGuestCart, removeFromGuestCart } from "../../utils/guestCart";

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState({});

  // In CartPage.js
  useEffect(() => {
    async function loadCart() {
      const token = localStorage.getItem("token");

      if (!token) {
        setCartItems(getGuestCart());
      } else {
        try {
          const backendItems = await fetchCart();
          setCartItems(Array.isArray(backendItems) ? backendItems : []);
        } catch (err) {
          console.error("Error loading cart:", err);
        }
      }
    }

    loadCart();
  }, [location.pathname]);

  // Handle Removal Logic
  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        // Logic for Guest
        removeFromGuestCart(productId);
      } else {
        // Logic for Logged-in User
        await deleteFromCart(productId);
      }

      // Update UI State immediately (Filter out the removed item)
      setCartItems((prev) => prev.filter((item) => item._id !== productId));

      // Clean up selection state if the removed item was currently selected
      setSelectedIds((prev) => {
        const newSelected = { ...prev };
        delete newSelected[productId];
        return newSelected;
      });

    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Something went wrong while removing the item.");
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 🔹 Use _id for MongoDB compatibility
  const selectedItemsList = cartItems.filter(
    (item) => selectedIds[item._id]
  );

  return (
    <>
      <main className="mb-20 pt-55 px-6 md:px-22 flex flex-col lg:flex-row gap-6">
        <CartItems
          cartItems={cartItems}
          selectedIds={selectedIds}
          onToggle={toggleSelectItem}
          onRemove={handleRemoveItem} 
        />
        <PriceDetails selectedItems={selectedItemsList} />
      </main>
      <Footer />
    </>
  );
}