import { useState } from "react";
import { CartItems } from "../../components/public/Cart/CartItems";
import { PriceDetails } from "../../components/public/Cart/PriceDetails";
import { Footer } from "../../components/layout/Footer";

export function CartPage() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Raw Emerald", price: 1250, quantity: 1, img: "./Images/Showcase1.png" },
        { id: 2, name: "Polished Ruby", price: 890, quantity: 1, img: "./Images/Showcase2.png" },
        { id: 3, name: "Sapphire Gemstone", price: 1500, quantity: 1, img: "./Images/Showcase3.png" },
        { id: 4, name: "Diamond Pendant", price: 3000, quantity: 1, img: "./Images/Showcase4.png" },
        { id: 5, name: "Amethyst Stone", price: 750, quantity: 1, img: "./Images/Showcase5.png" }
    ]);

    // NEW: Selection state lives here now
    const [selectedIds, setSelectedIds] = useState({});

    const toggleSelectItem = (id) => {
        setSelectedIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Filter items based on what is selected in the UI
    const selectedItemsList = cartItems.filter(item => selectedIds[item.id]);

    return (
        <>
            <main className="mb-20 pt-55 px-6 md:px-22 flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 lgx:gap-15 lgxx:gap-20">
                <CartItems 
                    cartItems={cartItems} 
                    selectedIds={selectedIds} 
                    onToggle={toggleSelectItem} 
                />
                <PriceDetails 
                    selectedItems={selectedItemsList} 
                />
            </main>
            <Footer />
        </>
    );
}