
const LIMITED_EDITION_DATA = [
    { id: 1, img: "./Images/Showcase1.png", alt: "Pair of Red Garnet gemstones", name: "Red Garnet Pair", price: "$250" },
    { id: 2, img: "./Images/Showcase2.png", alt: "Polished Blue Sapphire crystal", name: "Blue Sapphire", price: "$300" },
    { id: 3, img: "./Images/Showcase3.png", alt: "Deep green Emerald gemstone", name: "Emerald", price: "$280" },
    { id: 4, img: "./Images/Showcase4.png", alt: "Purple Amethyst quartz", name: "Amethyst", price: "$150" },
    { id: 5, img: "./Images/Showcase5.png", alt: "Brilliant red Ruby stone", name: "Ruby", price: "$400" },
    { id: 6, img: "./Images/Showcase6.png", alt: "Golden Topaz gem", name: "Topaz", price: "$220" },
];

export function LimitedEdition() {
    return (
        <section className="flex flex-col justify-center items-center mt-25 md:mt-60 w-full overflow-hidden" aria-labelledby="limited-edition-title">
            
            {/* HEADER SECTION */}
            <header className="flex flex-col px-6 lg:px-10 items-start md:flex-row md:items-center w-full max-w-[1440px] justify-between">
                <h2 id="limited-edition-title" className="text-[clamp(32px,6vw,72px)] tracking-tight leading-none font-regular max-w-[800px] uppercase">
                    Our Limited Edition
                </h2>
                <button 
                    className="mt-7 md:mt-0 text-[12px] font-bold text-[#282930] text-nowrap border-[1px] px-5.5 py-2 flex justify-center items-center gap-2 rounded-[40px] lg:w-[250px] lg:h-[54px] lg:gap-2.5 lg:text-[18px] font-['Satoshi'] hover:bg-[#282930] hover:text-white transition-all group"
                    aria-label="View all limited edition products"
                >
                    View All 
                    <img className="w-4 h-4 lg:w-6 lg:h-6 transition-all group-hover:invert" src="./Icons/arrow.svg" alt="" aria-hidden="true" />
                </button>
            </header>

            {/* PRODUCT GRID & SLIDER */}
            <div 
                role="list"
                className="w-full mt-10 flex flex-nowrap overflow-x-auto snap-x snap-mandatory px-6 gap-6 pb-10 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:px-10 lg:px-10 md:max-w-[1440px] scrollbar-hide"
            >
                {LIMITED_EDITION_DATA.map((product) => (
                    <article 
                        key={product.id} 
                        role="listitem"
                        className="relative group overflow-hidden rounded-[32px] border-white border-[5px] shadow-sm w-[85vw] aspect-square max-w-[400px] shrink-0 snap-center md:w-full md:max-w-none md:shrink-1"
                    >
                        <img
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={product.img}
                            alt={product.alt}
                            loading="lazy"
                        />

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] z-10 p-4 flex justify-between items-center bg-white rounded-2xl shadow-lg">
                            <div className="flex flex-col">
                                <h3 className="font-satoshi text-[16px] md:text-[18px] lg:text-[16px] font-normal text-[#282930] leading-tight">
                                    {product.name}
                                </h3>
                                <p className="font-satoshi font-medium text-[12px] text-[#282930]/60 uppercase mt-0.5">
                                    <span className="sr-only">Price: </span> From: {product.price}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-6 w-[1px] bg-black/10" aria-hidden="true" />
                                <button 
                                    className="cursor-pointer p-1 hover:scale-110 transition-transform"
                                    aria-label={`Add ${product.name} to cart`}
                                >
                                    <img className="w-6 h-6" src="./Icons/cart-2.svg" alt="" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* UTILITY STYLES */}
            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </section>
    );
}