import { useEffect, useState } from "react";
import { CartItems } from "../../components/public/Cart/CartItems";
import { PriceDetails } from "../../components/public/Cart/PriceDetails";
import { Footer } from "../../components/layout/Footer";
import { fetchCart } from "../../services/cartService";
import { getGuestCart } from "../../utils/guestCart";

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState({});

  useEffect(() => {
    async function loadCart() {
      const token = localStorage.getItem("token");

      if (!token) {
        setCartItems(getGuestCart());
        return;
      }

      const backendCart = await fetchCart();
      setCartItems(backendCart);
    }

    loadCart();
  }, []);

  const toggleSelectItem = (id) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
        />

        <PriceDetails selectedItems={selectedItemsList} />
      </main>

      <Footer />
    </>
  );
}
