import { useState } from "react";

const CardData = [
    { id: 1, name: "Heliodor Beryl", description: "This is a description of Heliodor Beryl", price: "$180.00" },
    { id: 2, name: "Aquamarine Beryl", description: "This is a description of Aquamarine Beryl", price: "$150.00" },
    { id: 3, name: "Morganite Beryl", description: "This is a description of Morganite Beryl", price: "$200.00" },
    { id: 4, name: "Goshenite Beryl", description: "This is a description of Goshenite Beryl", price: "$120.00" },
    { id: 5, name: "Red Beryl", description: "This is a description of Red Beryl", price: "$300.00" },
    { id: 6, name: "Emerald Beryl", description: "This is a description of Emerald Beryl", price: "$250.00" },
    { id: 7, name: "Yellow Beryl", description: "This is a description of Yellow Beryl", price: "$170.00" },
    { id: 8, name: "Green Beryl", description: "This is a description of Green Beryl", price: "$160.00" },
];

export function Card() {
    /* State Management */
    const [likedItems, setLikedItems] = useState({});

    /* Logic Handlers */
    const toggleLike = (id) => {
        setLikedItems((prev) => ({
            ...prev,
            [id]: !Boolean(prev[id]),
        }));
    };

    return (
        <>
            {/* Layout Container */}
            <section className="flex flex-col mid:flex-row mid:flex-wrap gap-6 items-start justify-center px-6 mid:px-12 pb-12 flex-5">
                {CardData.map((item) => (
                    <div
                        key={item.id}
                        className="group relative flex flex-row mid:flex-col bg-white p-3 mid:p-4 rounded-[24px] mid:rounded-[32px] w-full mid:w-[260px] shadow-sm hover:shadow-xl mid:hover:-translate-y-2 transition-all duration-500 ease-out"
                    >
                        {/* Favorite / Like Button */}
                        <button
                            onClick={() => toggleLike(item.id)}
                            className="absolute rounded-full bg-white/80 backdrop-blur-sm top-4 right-4 mid:top-6 mid:right-6 p-2 z-20 cursor-pointer shadow-md active:scale-90 transition-transform"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill={likedItems[item.id] ? "#FF4B4B" : "#9C9C9CC4"}
                                stroke={likedItems[item.id] ? "#FF4B4B" : "#9C9C9C"}
                                strokeWidth="1.5"
                                className="transition-colors duration-300"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>

                        {/* Media Content */}
                        <div className="relative w-[120px] h-[120px] shrink-0 mid:w-full mid:h-[268px] rounded-[18px] mid:rounded-[24px] overflow-hidden bg-gray-100">
                            <img
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                src="./Images/CardPic.png"
                                alt={item.name}
                            />
                        </div>

                        {/* Card Info & CTA */}
                        <div className="flex flex-col justify-between flex-1 ml-4 mid:ml-0 mid:mt-4 mid:px-1">
                            <div>
                                <h2 className="font-bold text-lg mid:text-xl text-gray-800 tracking-tight leading-tight">
                                    {item.name}
                                </h2>
                                <p className="mt-1 text-gray-400 text-xs mid:text-sm line-clamp-2 mid:truncate">
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-auto pt-2 mid:mt-5 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[9px] mid:text-[10px] uppercase text-gray-400 font-bold tracking-widest">
                                        Price
                                    </span>
                                    <h3 className="font-black text-base mid:text-lg text-[#2D2636] leading-none">
                                        {item.price}
                                    </h3>
                                </div>

                                <button className="active:scale-95 bg-[#2D2636] hover:bg-black px-4 mid:px-6 py-2 mid:py-2.5 text-xs mid:text-sm font-medium text-white rounded-full shadow-lg transition-all duration-300">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
}
