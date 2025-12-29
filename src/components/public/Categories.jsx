import React from 'react';

export function Categories() {
    const categories = [
        { name: "Beads", img: "./Images/Beads.png" },
        { name: "Rings", img: "./Images/Rings.png" },
        { name: "Rough Stones", img: "./Images/RoughStones.png" },
        { name: "Specimen Stones", img: "./Images/SpecimenStones.png" },
    ];

    return (
        /* Added 'relative' so the absolute image positions against this div.
           Added 'overflow-x-clip' to allow the 2075px image to bleed out without scrollbars.
        */
        <section className="relative flex flex-col justify-center text-center items-center mt-20 md:mt-60 w-full overflow-x-clip">
            
            {/* BACKGROUND IMAGE 
                1. 'max-w-none' prevents Tailwind from capping it at 100%.
                2. 'left-1/2 -translate-x-1/2' centers the giant image perfectly.
            */}
            <img 
                className='w-[3075px] hidden max-w-none absolute top-90 left-1/2 -translate-x-1/2 half-circle z-0' 
                src="./Icons/half-circle.svg" 
                alt="Half-Circle" 
            />

            {/* Header Section - Set relative z-10 to stay above the background */}
            <div className="relative z-10 mb-10 px-4">
                <h1 className="text-[12vw] md:text-[120px] lg:text-[222px] font-bold bg-gradient-to-b from-white to-[#F5F5F5] bg-clip-text text-transparent leading-none">
                    CATEGORY
                </h1>
                <p className="mt-[-4vw] md:mt-[-10%] text-[5vw] md:text-[42px] lg:text-[52px] text-[#525252] font-normal">
                    SHOP BY CATEGORY
                </p>
            </div>

            {/* CARDS CONTAINER - Ensure z-20 for stacking */}
            <div className="relative w-full flex flex-nowrap overflow-x-auto snap-x snap-mandatory px-[10%] gap-[4vw] pb-10
                            md:flex-wrap md:justify-center md:overflow-visible md:px-6 md:gap-8 md:max-w-[1300px]
                            scrollbar-hide z-20 img-category-container">

                {categories.map((item, index) => (
                    <div
                        key={index}
                        className="
                            w-[75vw] max-w-[285px] shrink-0 snap-center
                            md:w-[285px] md:shrink-1
                            bg-white flex flex-col justify-center text-center items-center p-2.5 rounded-2xl transition-all duration-300
                            category-card shadow-sm
                        "
                    >
                        <div className="w-full overflow-hidden rounded-[13px] bg-gray-100">
                            <img
                                className="w-[264px] h-[216px] object-cover"
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
                @media (min-width: 1440px) {
                    .half-circle{
                        display: block;
                    }
                    .img-category-container {
                        gap: 37px;
                        margin-top: 20px;
                        margin-bottom: 100px;
                    }
                    .category-card:nth-child(1) {
                        rotate: -16deg;
                        transform: translate(-50px, 50px);
                    }
                    .category-card:nth-child(2) {
                        rotate: -4deg;
                        transform: translate(-10px, 0px);
                    }
                    .category-card:nth-child(3) {
                        rotate: 4deg;
                        transform: translate(10px, 0px);
                    }    
                    .category-card:nth-child(4) {
                        rotate: 16deg;
                        transform: translate(50px, 50px);
                    }
                }
            `}</style>
        </section>
    );
}