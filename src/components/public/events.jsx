export function Events() {
    return (
        <section className="flex flex-col mt-14 mx-6 rounded-3xl overflow-hidden md:flex-row md:justify-between items-stretch border-[5px] border-white shadow-sm">
            
            {/* Pink Content Side */}
            <div className="flex flex-col justify-center items-center bg-[#FFCFE7] py-10 px-6 flex-1">
                <div className="bg-[#FFFFFF] w-10 h-10 flex justify-center items-center rounded-md overflow-hidden">
                    <img
                        className="w-7 h-auto block"
                        src="./Logos/pink-logo.png"
                        alt="pink-logo"
                    />
                </div>

                {/* Heading with Clamp: Min 18px, Preferred 2.5vw, Max 28px */}
                <h1 className="text-[clamp(18px,2.5vw,28px)] font-semibold text-[#003034] mt-4 text-center leading-tight">
                    Summer Sale is Live
                </h1>

                {/* Paragraph with Clamp: Min 11px, Preferred 1.2vw, Max 14px */}
                <p className="text-[clamp(11px,1.2vw,14px)] max-w-[280px] text-[#003034] text-center mt-2 mb-6 opacity-90">
                    Get up to 30% OFF on selected gemstones. Limited stock — Once Sold, They’re Gone.
                </p>

                <button className="text-[#0A0909] text-[9.96px] px-[22px] py-[10px] bg-[#FFFFFF] flex justify-center items-center gap-1.5 leading-none rounded-full transition-transform hover:scale-105">
                    <span className="inline-block">SHOP NOW</span>
                    <img className="w-3 h-3 block" src="./Icons/cart.svg" alt="Cart" />
                </button>            
            </div>

            {/* Image Side */}
            <div className="flex-1 min-h-[250px]">
                <img className="w-full h-full object-cover" src="./Images/Showcase2.png" alt="Event" />
            </div>
        </section>
    );
}