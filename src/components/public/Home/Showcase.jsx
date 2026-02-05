import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../services/productsService";
import { addToCart, fetchCart } from "../../../services/cartService";
import { addToGuestCart, getGuestCart } from "../../../utils/guestCart";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function Showcase() {
  const [products, setProducts] = useState([]);
  const [cartIds, setCartIds] = useState([]); // Track IDs in cart
  const navigate = useNavigate();

  useEffect(() => {
    async function initShowcase() {
      try {
        const data = await fetchAllProducts({
          limited: false,
          limit: 12, 
        });
        
        if (data && data.products) {
          const filtered = data.products.filter(p => 
            p.portal === "PUBLIC" || p.portal === "PUBLIC BY INVESTED"
          ).slice(0, 6); 
          
          setProducts(filtered);
        } else if (Array.isArray(data)) {
          const filtered = data.filter(p => 
            p.portal === "PUBLIC" || p.portal === "PUBLIC BY INVESTED"
          ).slice(0, 6);
          setProducts(filtered);
        }

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
        console.error("Showcase Init Error:", err);
      }
    }
    initShowcase();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    // Prevent adding if already in cart
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

      // Update local state so icon changes immediately
      setCartIds((prev) => [...prev, product._id]);
    } catch (err) {
      console.error("Add to cart failed", err);
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <section className="flex flex-col justify-center items-center mt-25 md:mt-60 w-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col px-6 lg:px-10 items-start lg:flex-row lg:items-end w-full max-w-[1440px] justify-between">
        <h1 className="text-[clamp(32px,6vw,72px)] tracking-tight leading-none font-regular max-w-[800px] uppercase">
          Our Premium Collection of Natural Gemstones
        </h1>
        <button 
          onClick={() => navigate('/shop')}
          className="mt-7 text-[12px] font-bold text-[#282930] text-nowrap border-[1px] px-5.5 py-2 flex justify-center items-center gap-2 rounded-[40px]
                lg:w-[250px] lg:h-[54px] lg:gap-2.5 lg:text-[18px] font-['Satoshi'] hover:bg-[#282930] hover:text-white transition-all group"
        >
          View All <img className="w-4 h-4 lg:w-6 lg:h-6 transition-all group-hover:invert" src="./Icons/arrow.svg" alt="Arrow" />
        </button>
      </div>

      <div className="w-full mt-10 flex flex-nowrap overflow-x-auto snap-x snap-mandatory px-6 gap-6 pb-10
                      md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:px-10 lg:px-10 md:max-w-[1440px]
                      scrollbar-hide">

        {products.map((product) => {
          const isInCart = cartIds.includes(product._id);

          // Calculate display price: Use virtual publicPrice or calculate manually for INVESTED products
          const displayPrice = product.publicPrice || (
            product.portal === "PUBLIC BY INVESTED" 
            ? (product.price + (product.price * (product.profitMargin / 100))).toFixed(0)
            : product.price
          );

          return (
            <div
              key={product._id}
              onClick={() => handleCardClick(product._id)}
              className="relative group overflow-hidden rounded-[32px] border-white border-[5px] shadow-sm
                         w-[85vw] aspect-square max-w-[400px] shrink-0 snap-center
                         md:w-full md:max-w-none cursor-pointer"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={`${API_URL}${product.imgs_src[0]}`}
                alt={product.name}
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] z-10 
                              p-4 flex justify-between items-center bg-white rounded-2xl shadow-lg">

                <div className="flex flex-col">
                  <p className="text-[16px] font-normal text-[#282930] font-satoshi">
                    {product.name}
                  </p>
                  <p className="text-[12px] text-[#282930]/60 uppercase font-satoshi font-medium">
                    Rs {displayPrice}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-6 w-[1px] bg-black/10" />

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`p-2 rounded-xl transition-all duration-300 ${isInCart
                        ? "bg-[#CA0A7F] text-white"
                        : "bg-transparent hover:scale-110"
                      }`}
                    aria-label={isInCart ? "Already in cart" : "Add to cart"}
                  >
                    {isInCart ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <img className="w-6 h-6" src="./Icons/cart-2.svg" alt="Cart" />
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Utilities */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}