import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CartItems } from "../../components/public/Cart/CartItems";
import { PriceDetails } from "../../components/public/Cart/PriceDetails";
import { Footer } from "../../components/common/Footer";
import { fetchCart, deleteFromCart } from "../../services/cartService";
import { getGuestCart, removeFromGuestCart } from "../../utils/guestCart";

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function loadCart() {
      const token = localStorage.getItem("token");
      try {
        if (!token) {
          setCartItems(getGuestCart());
        } else {
          const backendItems = await fetchCart();
          setCartItems(Array.isArray(backendItems) ? backendItems : []);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, [location.pathname]);

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        removeFromGuestCart(productId);
      } else {
        await deleteFromCart(productId);
      }
      setCartItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  if (loading) return <div className="pt-60 text-center font-satoshi text-lg">Loading your gems...</div>;

  return (
    <>
      <main className="mb-20 pt-55 px-6 md:px-22 flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6 font-satoshi uppercase tracking-tight">Your Cart ({cartItems.length})</h1>
          <CartItems
            cartItems={cartItems}
            onRemove={handleRemoveItem} 
          />
        </div>
        <div className="lg:w-[600px]">
          <PriceDetails cartItems={cartItems} />
        </div>
      </main>
      <Footer />
    </>
  );
}