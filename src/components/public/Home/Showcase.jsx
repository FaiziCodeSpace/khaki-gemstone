import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../services/productsService";
import { useNavigate } from "react-router-dom";
import { MoveRight } from 'lucide-react';

export function Showcase() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getProducts() {
            try {
                const data = await fetchAllProducts(false, 6);
                if (data) {
                    setProducts(data);
                }
            } catch (err) {
                console.error("Showcase Product Error:", err.msg);
            }
        }
        getProducts();
    }, []);

    const handleCardClick = (id) => {
        navigate(`/product/${id}`)
    }
    return (
        <section className="flex flex-col justify-center items-center mt-25 md:mt-60 w-full overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col px-6 lg:px-10 items-start lg:flex-row lg:items-end w-full max-w-[1440px] justify-between">
                <h1 className="text-[clamp(32px,6vw,72px)] tracking-tight leading-none font-regular max-w-[800px] z-50">
                    OUR PREMIUM COLLECTION OF NATURAL GEMSTONES
                </h1>
                  <button 
                         onClick={() => navigate(`/shop`)}
                    className="mt-7 z-50 text-[12px] font-bold text-[#282930] text-nowrap border-[1px] px-5.5 py-2 flex justify-center items-center gap-2 rounded-[40px] lg:w-[250px] lg:h-[54px] lg:gap-2.5 lg:text-[18px] font-['Satoshi'] hover:bg-[#282930] hover:text-white transition-all group"
                    aria-label="View all limited edition products"
                >
                    View All<MoveRight />
                </button>
            </div>

            <div className="w-full mt-10 flex flex-nowrap overflow-x-auto snap-x snap-mandatory px-6 gap-6 pb-10
                            md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:px-10 lg:px-10 md:max-w-[1440px]
                            scrollbar-hide">

                {products.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => handleCardClick(product._id)}
                        className="relative group overflow-hidden rounded-[32px] border-white border-[5px] shadow-sm
                                   /* Mobile scaling */
                                   w-[85vw] aspect-square max-w-[400px] shrink-0 snap-center
                                   /* Desktop reset */
                                   md:w-full md:max-w-none md:shrink-1 cursor-pointer"
                    >
                        {/* Base Image */}
                        <img
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={product.primary_imgSrc}
                            alt="Thumbnail Img"
                        />
                        {/* Floating Overlay Container */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] z-10 
                                        p-4 flex justify-between items-center bg-white rounded-2xl shadow-lg">

                            <div className="flex flex-col">
                                <p className="font-satoshi text-[16px] md:text-[18px] lg:text-[16px] font-normal text-[#282930] leading-tight">
                                    {product.name}
                                </p>
                                <p className="font-satoshi font-medium text-[12px] text-[#282930]/60 uppercase mt-0.5">
                                    From: Rs {product.price}
                                </p>
                            </div>

                            {/* Separator and Cart */}
                            <div className="flex items-center gap-4">
                                <div className="h-6 w-[1px] bg-black/10" />
                                <div className="cursor-pointer p-1 hover:scale-110 transition-transform">
                                    <img className="w-6 h-6" src="./Icons/cart-2.svg" alt="Cart-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
}