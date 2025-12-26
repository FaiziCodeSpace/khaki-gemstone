import { Navbar } from "../layout/navbar";

export function HeroPortion() {
    return (
        <>
            <section className="bg-[#CA0A7F] pb-10 overflow-hidden relative">
                {/* Navbar */}
                <Navbar />

                {/* Hero Content */}
                {/* Added clamp to margin-top: Scales from 32px (mt-8) to 100px */}
                <div className="px-6 flex flex-col items-center text-white relative z-10 mt-[clamp(32px,10vw,100px)]">
                    <div className="flex w-full justify-between px-4 text-[9px] sm:text-[14px]">
                        <p>SINCE</p>
                        <p>[1997]</p>
                    </div>

                    {/* Main Headings */}
                    <div className="text-center flex flex-col gap-5 mt-5 lg:mt-10 lg:gap-0">
                        {/* Since 1997 */}

                        {/* AUTHENTIC */}
                        {/* Added clamp to text size: Scales from 68px to 180px based on viewport width */}
                        <h1 className="m-0 font-bold text-[#fbfff6d6] tracking-[-4.76px] leading-none 
                                       text-[clamp(68px,17vw,180px)] 
                                       lg:tracking-[-12px] 
                                       xl:text-[235px]">
                            AUTHENTIC
                        </h1>

                        {/* Hero Image */}
                        <img
                            className="h-[clamp(401px,70vw,620px)] object-cover rounded-[14.62px] border-white border-[6.58px] lg:absolute lg:hidden"
                            src="./Images/hero-Picture.png"
                            alt="hero-pic"
                        />

                        {/* NATURAL + Subtext */}
                        <div className="lg:flex lg:items-center lg:justify-between lg:gap-4">
                            <p className="hidden lg:flex lg:text-[14px] lg:w-[170px] lg:text-left lg:mt-16">
                                We source, curate, and deliver 100% natural gemstones
                            </p>

                            {/* Added clamp to text size: Scales from 68px to 180px based on viewport width */}
                            <h1 className="font-bold tracking-[-4.76px] leading-[0.8] 
                                           text-[clamp(68px,17vw,180px)] 
                                           lg:tracking-[-12px] 
                                           xl:text-[235px]">
                                NATURAL
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Scroll / Rating / Button Section */}
                <div className="relative mt-10 z-10 px-6 sm:flex sm:items-center sm:justify-between gap-6">
                    {/* Scroll Now */}
                    <div className="hidden sm:flex items-center gap-4 text-white">
                        <img src="./Icons/scroll.svg" alt="scroll-icon" />
                        <p className="text-[18px]">Scroll Now</p>
                    </div>

                    {/* Rating */}
                    <div className="hidden sm:flex items-center gap-4 text-white">
                        <h1 className="text-[40px] font-semibold">4.9/5</h1>
                        <div className="flex items-center gap-1">
                            <img src="./Icons/star.svg" alt="star-icon" className="w-5 h-5" />
                            <p className="text-[18px]">18,921</p>
                        </div>
                    </div>

                    {/* Text + Button */}
                    <div className="flex w-full mt-6 text-white text-[12px] items-end justify-between gap-4 sm:mt-0 sm:flex-col sm:w-fit sm:items-start">
                        <p className="font-medium sm:w-[160px] md:w-[196px]">
                            trusted by collectors, jewelers, and gemstone lovers worldwide.
                        </p>

                        <button
                            onClick={() => console.log("SHOP NOW CLICKED!")}
                            className="flex items-center justify-center gap-2
                bg-white px-6 py-[10px] rounded-[62px] whitespace-nowrap
                text-[9.96px] font-semibold text-black
                sm:w-[160px] sm:h-[45px] sm:text-[14px]
                md:w-[196px] md:h-[56px] md:text-[16px]"
                        >
                            SHOP NOW
                            <img
                                src="./Icons/cart.svg"
                                alt="cart-icon"
                                className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
                            />
                        </button>
                    </div>
                </div>

                {/* Background Blur Circle */}
                <div className="absolute bg-[#4C7A13] w-[1019px] h-[1019px] top-[500px] right-0 blur-[1000px] rounded-full opacity-90"></div>

                {/* Background Texture */}
                <img
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                    src="src/assets/textures/bgTexture.png"
                    alt="bg-texture"
                />
            </section>
        </>
    );
}