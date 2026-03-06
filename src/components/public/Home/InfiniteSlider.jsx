import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllProducts } from "../../../services/productsService";

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function InfiniteCardSlider() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchAllProducts({ limited: false, limit: 10 });
        const items = data?.products || (Array.isArray(data) ? data : []);

        const filtered = items.filter(
          (p) => p.portal === "PUBLIC" || p.portal === "PUBLIC BY INVESTED"
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Slider Fetch Error:", err);
      }
    }

    getProducts();
  }, []);

  if (products.length === 0) return null;

  const ProductTrack = () => (
    <div className="flex shrink-0">
      {products.map((product, index) => {
        const displayPrice =
          product.publicPrice ||
          (product.portal === "PUBLIC BY INVESTED"
            ? (
                product.price +
                product.price * (product.profitMargin / 100)
              ).toFixed(0)
            : product.price);

        return (
          <Link
            key={`${product._id}-${index}`}
            to={`/product/${product._id}`}
            className="w-[280px] md:w-[350px] shrink-0 cursor-pointer mt-5 px-3 group block"
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-[32px] border-[5px] border-[#F8F8F8] shadow-sm bg-white/5 backdrop-blur-sm">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={`${API_URL}${product.imgs_src?.[0]}`}
                alt={product.name}
                loading="lazy"
              />

              {/* Floating Price Tag */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
                <p className="text-[14px] font-bold text-[#282930]">
                  Rs {Number(displayPrice).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Info Container */}
            <div className="mt-4 px-2 text-center">
              <h3 className="text-[18px] font-medium text-white drop-shadow-md truncate uppercase">
                {product.name}
              </h3>

              <p className="text-[12px] text-white/80 font-bold tracking-widest mt-1">
                NATURAL GEMSTONE
              </p>

              <div className="h-[2px] w-0 bg-white mx-auto mt-2 transition-all duration-500 group-hover:w-12 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <section className="w-full py-10 overflow-hidden bg-transparent relative">
      <div className="flex w-max justify-start items-center animate-marquee-infinite hover:[animation-play-state:paused]">
        <ProductTrack />
        <ProductTrack />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee-infinite {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          .animate-marquee-infinite {
            display: flex;
            width: max-content;
            animation: marquee-infinite 35s linear infinite;
            will-change: transform;
          }

          @media (max-width: 768px) {
            .animate-marquee-infinite {
              animation-duration: 20s;
            }
          }
        `,
        }}
      />
    </section>
  );
}