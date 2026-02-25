import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function Card({ products }) {
    const [likedItems, setLikedItems] = useState({});
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/product/${id}`);
    };

    const toggleLike = (e, id) => {
        e.stopPropagation(); 
        setLikedItems((prev) => ({
            ...prev,
            [id]: !Boolean(prev[id]),
        }));
    };

    if (!products || products.length === 0) {
        return <div className="flex-5 text-center py-20 text-gray-400">No gemstones match your selection.</div>;
    }

    return (
        <section className="flex flex-col mid:flex-row mid:flex-wrap gap-10 items-start justify-center px-6 mid:px-12 pb-12 flex-5 w-full">
            {products.map((item) => (
                <div key={item._id}
                    onClick={() => handleCardClick(item._id)}
                    className="group relative flex flex-row mid:flex-col bg-white p-3 mid:p-4 rounded-[24px] mid:rounded-[32px] w-full mid:w-[300px] shadow-sm hover:shadow-xl mid:hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden"
                >
                    {/* Like Button */}
                    <button
                        onClick={(e) => toggleLike(e, item._id)}
                        className="absolute rounded-full bg-white/80 backdrop-blur-sm top-4 right-4 mid:top-6 mid:right-6 p-2 z-20 cursor-pointer shadow-md active:scale-90 transition-transform"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill={likedItems[item._id] ? "#FF4B4B" : "#9C9C9CC4"}
                            stroke={likedItems[item._id] ? "#FF4B4B" : "#9C9C9C"}
                            strokeWidth="1.5" className="transition-colors duration-300">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>

                    {/* Image Container - flex-shrink-0 is vital here */}
                    <div className="relative w-[120px] h-[120px] shrink-0 mid:w-full mid:h-[268px] rounded-[18px] mid:rounded-[24px] overflow-hidden bg-gray-100">
                        <img
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            src={`${API_URL}${item.imgs_src?.[0]}`}
                            alt={`${item.name} - Authentic Natural Gemstone`}
                        />
                    </div>

                    {/* Content Container - min-w-0 stops the overflow */}
                    <div className="flex flex-col justify-between flex-1 ml-4 mid:ml-0 mid:mt-4 mid:px-1 min-w-0">
                        <div className="min-w-0">
                            <h2 className="font-bold text-lg mid:text-xl text-gray-800 tracking-tight leading-tight truncate">
                                {item.name}
                            </h2>
                            <p className="mt-1 text-gray-400 text-xs mid:text-sm line-clamp-2 mid:truncate">
                                {item.description}
                            </p>
                        </div>

                        <div className="mt-auto pt-2 mid:mt-5 flex justify-between items-center gap-2">
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] mid:text-[10px] uppercase text-gray-400 font-bold tracking-widest">Price</span>
                                <h3 className="font-black text-sm mid:text-lg text-[#2D2636] leading-none truncate">
                                    {item.publicPrice?.toLocaleString() ?? 0} PKR
                                </h3>
                            </div>
                            <button className="active:scale-95 bg-[#2D2636] hover:bg-black px-3 mid:px-6 py-2 mid:py-2.5 text-[10px] mid:text-sm font-medium text-white rounded-full shadow-lg transition-all duration-300 cursor-pointer flex-shrink-0">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}