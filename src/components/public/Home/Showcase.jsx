import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../services/productsService";
import { addToCart } from "../../../services/cartService";
import { addToGuestCart } from "../../../utils/guestCart";
import { useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";

export function Showcase() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProducts() {
      const data = await fetchAllProducts(false, 6);
      if (data) setProducts(data);
    }
    getProducts();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation(); // ⛔ stop navigation

    const token = localStorage.getItem("token");

    try {
      if (!token) {
        addToGuestCart(product);
        alert("Added to cart (guest)");
        return;
      }

      await addToCart(product._id);
      alert("Added to cart");
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center mt-25 md:mt-60 w-full overflow-hidden">
      {/* header omitted for brevity */}

      <div className="w-full mt-10 flex flex-nowrap overflow-x-auto snap-x snap-mandatory px-6 gap-6 pb-10
                      md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:px-10 lg:px-10 md:max-w-[1440px]
                      scrollbar-hide">

        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => handleCardClick(product._id)}
            className="relative group overflow-hidden rounded-[32px] border-white border-[5px] shadow-sm
                       w-[85vw] aspect-square max-w-[400px] shrink-0 snap-center
                       md:w-full md:max-w-none cursor-pointer"
          >
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={product.primary_imgSrc}
              alt={product.name}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] z-10 
                            p-4 flex justify-between items-center bg-white rounded-2xl shadow-lg">

              <div className="flex flex-col">
                <p className="text-[16px] font-normal text-[#282930]">
                  {product.name}
                </p>
                <p className="text-[12px] text-[#282930]/60 uppercase">
                  From: Rs {product.price}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-6 w-[1px] bg-black/10" />

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="p-1 hover:scale-110 transition-transform"
                  aria-label="Add to cart"
                >
                  <img className="w-6 h-6" src="./Icons/cart-2.svg" alt="Cart" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
