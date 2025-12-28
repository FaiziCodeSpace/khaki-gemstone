import React from 'react';

export function Categories() {
    const categories = [
        { name: "Beads", img: "./Images/Beads.png" },
        { name: "Rings", img: "./Images/Rings.png" },
        { name: "Rough Stones", img: "./Images/RoughStones.png" },
        { name: "Specimen Stones", img: "./Images/SpecimenStones.png" },
    ];

    return (
        <div className="flex flex-col justify-center text-center items-center mt-20 w-full overflow-hidden">
            {/* Header Section */}
            <div className="mb-10 px-4">
                <h1 className="text-[12vw] md:text-[70px] font-bold bg-gradient-to-b from-white to-[#F5F5F5] bg-clip-text text-transparent leading-none">
                    CATEGORY
                </h1>
                <p className="mt-[-4vw] md:mt-[-10%] text-[5vw] md:text-[32px] text-[#525252] font-normal">
                    SHOP BY CATEGORY
                </p>
            </div>

            {/* CONTAINER LOGIC:
                - Mobile: flex-nowrap + overflow-x-auto (creates the slider)
                - md (768px+): flex-wrap + overflow-visible (stacks cards and allows wrapping)
            */}
            <div className="w-full flex flex-nowrap overflow-x-auto snap-x snap-mandatory px-[10%] gap-[4vw] pb-10
                            md:flex-wrap md:justify-center md:overflow-visible md:px-6 md:gap-8 md:max-w-[1300px]
                            scrollbar-hide">
                
                {categories.map((item, index) => (
                    <div 
                        key={index}
                        className="
                            /* Mobile: Scalable width until 768px */
                            w-[75vw] max-w-[285px] shrink-0 snap-center
                            
                            /* Desktop (768px+): Fixed base width for consistent wrapping */
                            md:w-[285px] md:shrink-1
                            
                            bg-white flex flex-col justify-center text-center items-center p-2.5 rounded-2xl shadow-md transition-all duration-300
                        "
                    >
                        <div className="w-full aspect-square overflow-hidden rounded-[13px] bg-gray-100">
                            <img 
                                className="w-full h-full object-cover" 
                                src={item.img} 
                                alt={item.name} 
                            />
                        </div>
                        <p className="my-5 text-[20px] md:text-[23px] font-bold text-[#525252] whitespace-nowrap">
                            {item.name}
                        </p>
                    </div>
                ))}
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}