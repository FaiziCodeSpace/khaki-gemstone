export function AboutUs() {
    return (
        <>
            <section className="px-6 mt-25 relative lg:px-[clamp(50px,15vw,115px)]">
                <div className="flex flex-col gap-3">
                    <p className="text-[12px] text-[#282930] tracking-[1.7px] font-normal lg:hidden">
                        || MINIMALISTIC
                    </p>

                    <h1 className="
                        text-[32px] text-[#282930] font-normal
                        md:font-medium
                        md:text-[54px]
                        lg:text-[162px] lgx:text-[208px] lgxx:text-[228px]
                        lg:tracking-[-.6vw]
                        lg:font-black
                        lg:text-center
                        lg:mt-50
                        relative 
                        w-full
                    ">
                        {/* Layer 1: The first part of the text (Below Image) */}
                        <span className="relative z-10">ABOUT U</span>

                        {/* Layer 2: The S (Above Image) */}
                        <span className="inline-block lg:rotate-[-10deg] lg:ml-2 origin-center relative z-30">
                            S
                        </span>
                    </h1>

                    {/* RESTORED: Paragraph exactly as provided */}
                    <div>
                        <p className="text-[12px] text-[#7E8492] text-justify text-normal tracking-[0.8px] lg:text-[clamp(12px,1.2vw,16px)] lg:w-[40vw]">
                            Khaki Gem Stone is built on one simple belief — real stones carry real value.We specialize in sourcing and delivering 100% natural gemstones, carefully selected for their authenticity, quality, and natural beauty.Each gemstone in our collection is ethically sourced from trusted origins and handpicked by experts to ensure clarity, color, and character. From raw and rough stones to finely cut gems and collector specimens, every piece tells a story shaped by nature itself.
                        </p>
                        <a href="https://yourlink.com" className="group inline-block">
                            <button className="mt-7 text-[12px] font-bold text-[#282930] text-nowrap flex justify-left items-center gap-2
                                lg:gap-2.5 lg:text-[18px] font-['Satoshi'] transition-all cursor-pointer hover:underline">

                                Learn more

                                <img
                                    className="w-4 h-4 lg:w-5 lg:h-6 invert-0 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                                    src="./Icons/arrow.svg"
                                    alt="Arrow"
                                />

                            </button>
                        </a>
                    </div>

                    {/* Layer 1.5: The Image (Between ABOUT U and S) */}
                    <div className="md:flex md:gap-2">
                        <img
                            className="
                            mt-10 lg:mt-0 w-full h-[252px] md:h-[300px]
                            object-cover
                            lg:absolute
                            lg:w-[142px] lg:h-[139px] 
                            lgx:w-[183px] lgx:h-[179px]
                            lgxx:w-[200px] lgxx:h-[195px]
                            
                            /* LOCKED: Position relative to CENTER (left-1/2) instead of edges */
                            lg:left-1/2 
                            lg:transform lg:-translate-x-1/2 
                            
                            /* Horizontal Offset (Calculated to match your previous look) */
                            lg:ml-[250px]
                            lgx:ml-[330px]
                            lgxx:ml-[360px]

                            /* Vertical Position (Exact same as before) */
                            lg:top-88 
                            lgx:top-100 
                            lgxx:top-104 

                            /* Mid-level z-index */
                            lg:z-20 
                        "
                            src="./Images/hero-Picture.png"
                            alt="About-Us"
                        />

                        {/* Background Image remains at z-0 */}
                        <img
                            className="
                            w-full h-[252px] md:h-[300px]    
                            mt-10 lg:mt-0
                            hidden md:block lg:absolute lg:z-0 object-cover
                            lg:w-[236px] lg:h-[199px]
                            lgx:w-[304px] lgx:h-[257px]
                            lgxx:w-[332px] lgxx:h-[280px]
                            
                            /* LOCKED: Position relative to CENTER */
                            lg:left-1/2 
                            lg:transform lg:-translate-x-1/2

                            /* Horizontal Offset (Negative moves left of center) */
                            lg:-ml-[285px]
                            lgx:-ml-[365px]
                            lgxx:-ml-[400px]

                            /* Vertical Position (Exact same as before) */
                            lg:top-33 
                            lgx:top-28 
                            lgxx:top-26 
                        "
                            src="./Images/Showcase4.png"
                            alt="Background Decor"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}