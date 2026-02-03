import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../../../services/productsService";
import { fetchCart, addToCart } from "../../../services/cartService";
import { getGuestCart, addToGuestCart } from "../../../utils/guestCart";
import { MoveRight, Check } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function LimitedEdition() {
    const [limitedProduct, setLimitedProduct] = useState([]);
    const [cartIds, setCartIds] = useState([]); // Track items in cart
    const navigate = useNavigate();

    useEffect(() => {
        const initLimitedEdition = async () => {
            try {
                // 1. Fetch Products
                const data = await fetchAllProducts({
                    limited: true,
                    limit: 6,
                    portal: "PUBLIC"
                });
                if (data) setLimitedProduct(data);

                // 2. Fetch Cart IDs to show current state
                const token = localStorage.getItem("token");
                if (!token) {
                    const guestItems = getGuestCart();
                    setCartIds(guestItems.map((item) => item._id));
                } else {
                    const dbItems = await fetchCart();
                    const items = Array.isArray(dbItems) ? dbItems : dbItems.items || [];
                    setCartIds(items.map((item) => item._id));
                }
            } catch (err) {
                console.error("Limited Products Error:", err);
            }
        };
        initLimitedEdition();
    }, []);

    const handleCardClick = (id) => {
        navigate(`/product/${id}`);
    };

    const handleAddToCart = async (e, product) => {
        e.stopPropagation();

        // If already in cart, redirect to cart page
        if (cartIds.includes(product._id)) {
            navigate("/cart");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            if (!token) {
                addToGuestCart(product);
            } else {
                await addToCart(product._id);
            }

            // Instantly update the icon state locally
            setCartIds((prev) => [...prev, product._id]);
        } catch (err) {
            console.error("Add to cart failed", err);
        }
        window.dispatchEvent(new Event("cartUpdated"));
    };

    return (
        <section className="flex flex-col justify-center items-center mt-40 lg:mt-60 w-full overflow-hidden" aria-labelledby="limited-edition-title">

            {/* HEADER SECTION */}
            <header className="flex flex-col px-6 lg:px-10 items-start md:flex-row md:items-center w-full max-w-[1440px] justify-between">
                <h2 id="limited-edition-title" className="text-[clamp(32px,6vw,72px)] tracking-tight leading-none font-regular max-w-[800px] uppercase">
                    Our Limited Edition
                </h2>
                <button
                    onClick={() => navigate(`/shop`)}
                    className="mt-7 md:mt-0 text-[12px] font-bold text-[#282930] text-nowrap border-[1px] px-5.5 py-2 flex justify-center items-center gap-2 rounded-[40px] lg:w-[250px] lg:h-[54px] lg:gap-2.5 lg:text-[18px] font-['Satoshi'] hover:bg-[#282930] hover:text-white transition-all group"
                    aria-label="View all limited edition products">
                    View All <MoveRight />
                </button>
            </header>

            {/* PRODUCT GRID & SLIDER */}
            <div
                role="list"
                className="w-full mt-10 flex flex-nowrap overflow-x-auto snap-x snap-mandatory px-6 gap-6 pb-10 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:px-10 lg:px-10 md:max-w-[1440px] scrollbar-hide"
            >
                {limitedProduct.map((product) => {
                    const isInCart = cartIds.includes(product._id);

                    return (
                        <article
                            key={product._id}
                            role="listitem"
                            onClick={() => handleCardClick(product._id)}
                            className="relative group overflow-hidden rounded-[32px] border-white border-[5px] shadow-sm w-[85vw] aspect-square max-w-[400px] shrink-0 snap-center md:w-full md:max-w-none md:shrink-1 cursor-pointer"
                        >
                            <img
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={`${API_URL}${product.imgs_src[0]}`}
                                alt={product.name}
                                loading="lazy"
                            />

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] z-10 p-4 flex justify-between items-center bg-white rounded-2xl shadow-lg">
                                <div className="flex flex-col">
                                    <h3 className="font-satoshi text-[16px] md:text-[18px] lg:text-[16px] font-normal text-[#282930] leading-tight">
                                        {product.name}
                                    </h3>
                                    <p className="font-satoshi font-medium text-[12px] text-[#282930]/60 uppercase mt-0.5">
                                        <span className="sr-only">Price: </span> From: Rs {product.price}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-6 w-[1px] bg-black/10" aria-hidden="true" />
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className={`cursor-pointer p-2 rounded-xl transition-all duration-300 ${isInCart
                                                ? "bg-[#CA0A7F] text-white"
                                                : "bg-transparent hover:scale-110"
                                            }`}
                                        aria-label={isInCart ? `${product.name} is in cart` : `Add ${product.name} to cart`}
                                    >
                                        {isInCart ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <img className="w-6 h-6" src="./Icons/cart-2.svg" alt="Cart-icon" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* UTILITY STYLES */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </section>
    );
}