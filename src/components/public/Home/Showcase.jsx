export function Showcase() {
    const showCaseImages = [
        { img: "./Images/Showcase1.png", alt: "Showcase1", name: "Red Garnet Pair", price: "$250" },
        { img: "./Images/Showcase2.png", alt: "Showcase2", name: "Blue Sapphire", price: "$300" },
        { img: "./Images/Showcase3.png", alt: "Showcase3", name: "Emerald", price: "$280" },
        { img: "./Images/Showcase4.png", alt: "Showcase4", name: "Amethyst", price: "$150" },
        { img: "./Images/Showcase5.png", alt: "Showcase5", name: "Ruby", price: "$400" },
        { img: "./Images/Showcase6.png", alt: "Showcase6", name: "Topaz", price: "$220" },
    ];

    return (
        <section className="flex flex-col justify-center items-center mt-25 md:mt-60 w-full overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col px-6 lg:px-10 items-start lg:flex-row lg:items-end w-full max-w-[1440px] justify-between">
                <h1 className="text-[clamp(32px,6vw,72px)] tracking-tight leading-none font-regular max-w-[800px]">
                    OUR PREMIUM COLLECTION OF NATURAL GEMSTONES
                </h1>
                <button className="mt-7 text-[12px] font-bold text-[#282930] text-nowrap border-[1px] px-5.5 py-2 flex justify-center items-center gap-2 rounded-[40px]
                lg:w-[250px] lg:h-[54px] lg:gap-2.5 lg:text-[18px] font-['Satoshi'] hover:bg-[#282930] hover:text-white transition-all
                ">
                    View All <img className="w-4 h-4 lg:w-6 lg:h-6 invert-0 hover:invert" src="./Icons/arrow.svg" alt="Arrow" />
                </button>
            </div>

            {/* SLIDER / GRID CONTAINER
                - Mobile: flex-nowrap + overflow-x-auto (Slider)
                - md (768px+): grid-cols-2 or 3 + flex-wrap (Grid)
            */}
            <div className="w-full mt-10 flex flex-nowrap overflow-x-auto snap-x snap-mandatory px-6 gap-6 pb-10
                            md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:px-10 lg:px-10 md:max-w-[1440px]
                            scrollbar-hide">
                
                {showCaseImages.map((image, index) => (
                    <div 
                        key={index} 
                        className="relative group overflow-hidden rounded-[32px] border-white border-[5px] shadow-sm
                                   /* Mobile scaling */
                                   w-[85vw] aspect-square max-w-[400px] shrink-0 snap-center
                                   /* Desktop reset */
                                   md:w-full md:max-w-none md:shrink-1"
                    >
                        {/* Base Image */}
                        <img
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={image.img}
                            alt={image.alt}
                        />

                        {/* Floating Overlay Container */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] z-10 
                                        p-4 flex justify-between items-center bg-white rounded-2xl shadow-lg">
                            
                            <div className="flex flex-col">
                                <p className="font-satoshi text-[16px] md:text-[18px] lg:text-[16px] font-normal text-[#282930] leading-tight">
                                    {image.name}
                                </p>
                                <p className="font-satoshi font-medium text-[12px] text-[#282930]/60 uppercase mt-0.5">
                                    From: {image.price}
                                </p>
                            </div>

                            {/* Separator and Cart */}
                            <div className="flex items-center gap-4">
                                <div className="h-6 w-[1px] bg-black/10" />
                                <div className="cursor-pointer p-1 hover:scale-110 transition-transform">
                                    <img className="w-6 h-6" src="./Icons/cart-2.svg" alt="Cart" />
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