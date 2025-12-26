import { Navbar } from "../layout/navbar";

export function HeroPortion() {
    return (<>
        <section className="bg-[#CA0A7F] pb-10 overflow-hidden relative ">
            <Navbar />
            <div className="px-[12px] mt-[34px] flex flex-col items-center justify-center text-white relative z-10 ">
                <div className="flex w-full justify-between px-[15px] text-[8.9px] sm:text-[14px]">
                    <p>SINCE</p>
                    <p>[1997]</p>
                </div>
                <div className="text-center flex flex-col gap-[19px]">
                    <h1 className="m-0 text-[68px] text-[#fbfff6d6] font-[700] tracking-[-4.76px] leading-none">AUTHENTIC</h1>
                    <img className="h-[401px] rounded-[14.62px] border-white border-[6.58px] " src="./Images/hero-Picture.png" alt="hero-pic" />
                    <h1 className="text-[68px] font-[700] tracking-[-4.76px] leading-none">NATURAL</h1>
                </div>
            </div>
            <div className="relative mt-10 z-10 px-5.5 sm:flex sm:items-center sm:justify-between">
                {/* Scoll Now */}
                <div className="hidden sm:flex items-center gap-5 text-white">
                    <img src="./Icons/scroll.svg" alt="scroll-icon" />
                    <p className="text-[18px]">Scoll Now</p>
                </div>
                {/* Rating */}
                <div className="hidden sm:flex items-center gap-[16px] text-white">
                    <h1 className="text-[40px] font-semibold">4.9/5</h1>
                    <div className="flex items-center gap-1">
                        <img src="./Icons/star.svg" alt="star-icon" />
                        <p className="text-[18px]">18,921</p>
                    </div>
                </div>

                {/* Text + Button */}
                <div
                    className="flex w-full mt-[30px] text-white text-[12px]
        items-end justify-between gap-4
        sm:mt-0 sm:flex-col sm:w-fit sm:items-start"
                >
                    <p className="font-medium sm:w-[160px] md:w-[196px]">
                        trusted by collectors, jewelers, and gemstone lovers worldwide.
                    </p>

                    <button
                        onClick={() => { console.log('SHOP NOW CLICKED!') }}
                        className="flex items-center justify-center gap-2
            bg-white px-[22px] py-[9.96px]
            rounded-[62.24px] whitespace-nowrap
            text-[9.96px] font-semibold text-black
            sm:w-[160px] sm:h-[45px] sm:text-[14px]
            md:w-[196px] md:h-[56px] sm:text-[16px]
            "
                    >
                        SHOP NOW
                        <img
                            src="./Icons/cart.svg"
                            alt="cart-icon"
                            className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px]"
                        />
                    </button>
                </div>
            </div>


            <div className="absolute bg-[#4C7A13] w-[1019px] h-[1019px] top-[500px] right-0 blur-[1000px] rounded-full opacity-90"></div>
            <img className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" src="src/assets/textures/bgTexture.png" alt="bg-texture" />

        </section>
        h1
    </>);
}