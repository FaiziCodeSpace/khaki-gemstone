import { Link } from "react-router-dom";

export function AboutUs() {
    return (
        <>
            <section className="px-6 mt-25 relative lg:px-[clamp(50px,15vw,115px)]">
                <div className="flex flex-col gap-3">
                    
                    <p className="text-[12px] text-[#282930] tracking-[1.7px] font-normal lg:hidden">
                        || MINIMALISTIC
                    </p>

                    <h2 className="
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
                    </h2>

                    <div>
                        <p className="text-[12px] text-[#7E8492] text-justify text-normal tracking-[0.8px] lg:text-[clamp(12px,1.2vw,16px)] lg:w-[40vw]">
                            Khaki Gem Stone is built on one simple belief — real stones carry real value.We specialize in sourcing and delivering 100% natural gemstones, carefully selected for their authenticity, quality, and natural beauty.Each gemstone in our collection is ethically sourced from trusted origins and handpicked by experts to ensure clarity, color, and character. From raw and rough stones to finely cut gems and collector specimens, every piece tells a story shaped by nature itself.
                        </p>

                        <Link to="/aboutUs" className="group inline-block">
                            <button className="mt-7 text-[12px] font-bold text-[#282930] text-nowrap flex justify-left items-center gap-2
                                lg:gap-2.5 lg:text-[18px] font-['Satoshi'] transition-all cursor-pointer hover:underline">

                                Learn more

                                <img
                                    className="w-4 h-4 lg:w-5 lg:h-6 invert-0 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                                    src="./Icons/arrow.svg"
                                    alt="arrow icon"
                                />

                            </button>
                        </Link>
                    </div>

                    <div className="md:flex md:gap-2">

                        <img
                            className="
                            mt-10 lg:mt-0 w-full h-[252px] md:h-[300px]
                            object-cover
                            lg:absolute
                            lg:w-[142px] lg:h-[139px] 
                            lgx:w-[183px] lgx:h-[179px]
                            lgxx:w-[200px] lgxx:h-[195px]
                            
                            lg:left-1/2 
                            lg:transform lg:-translate-x-1/2 
                            
                            lg:ml-[250px]
                            lgx:ml-[330px]
                            lgxx:ml-[360px]

                            lg:top-88 
                            lgx:top-100 
                            lgxx:top-104 

                            lg:z-20 
                        "
                            src="./Images/AboutUs-Image.png"
                            alt="Natural gemstone showcase"
                        />

                        <img
                            className="
                            w-full h-[252px] md:h-[300px]    
                            mt-10 lg:mt-0
                            hidden md:block lg:absolute lg:z-0 object-cover
                            lg:w-[236px] lg:h-[199px]
                            lgx:w-[304px] lgx:h-[257px]
                            lgxx:w-[332px] lgxx:h-[280px]
                            
                            lg:left-1/2 
                            lg:transform lg:-translate-x-1/2

                            lg:-ml-[285px]
                            lgx:-ml-[365px]
                            lgxx:-ml-[400px]

                            lg:top-33 
                            lgx:top-28 
                            lgxx:top-26 
                            opacity-70
                        "
                            src="./Images/AboutUs-Background.png"
                            alt="decorative gemstone background"
                        />

                    </div>

                </div>
            </section>
        </>
    );
}