export function ContentBlock() {
    return (
        <section className="flex flex-col md:flex-row mt-12 md:mt-25 lg:mt-35 px-7 md:justify-between w-full gap-10 lg:gap-22">
            {/* Left Image */}
            <img
                className="hidden md:block h-[clamp(300px,45vw,561px)] w-[clamp(195px,35vw,366px)] object-contain"
                src="./Images/ContentBlockTopImg.png"
                alt="Content Block Top"
            />

            {/* Right Content */}
            <div className="flex flex-col justify-between gap-4 w-full">

                {/* Heading */}
                <div className="flex flex-col gap-4">
                    {/* Subheading */}
                    <p className="text-[12px] tracking-[1.77px] text-[#282930]">
                        || MINIMALISTIC
                    </p>

                    {/* Main Heading */}
                    <h1
                        className="text-[clamp(28px,5vw,72px)] 
                                   tracking-[0.01em] 
                                   leading-[1.1] 
                                   font-normal 
                                   text-[#282930]"
                    >
                        OUR PREMIUM <br />
                        COLLECTION OF <br />
                        NATURAL GEMSTONES
                    </h1>
                </div>

                {/* Description + Bottom Image */}
                <div className="flex flex-col md:flex-row gap-10 md:gap-6 lg:gap-10 xl:gap-18 items-start md:items-stretch justify-between">
                    
                    {/* Paragraph */}
                    <p className="text-[#7E8492] text-[clamp(12px,1.5vw,20px)] md:flex-1 text-justify">
                        Every stone is meticulously chosen for its exceptional quality, vibrant
                        color, and unique natural energy. This careful selection process ensures
                        that each gemstone not only stands out but also resonates with its own
                        distinct character. As a result, these stones are perfect for collectors
                        who appreciate the artistry of nature, professional jewelers seeking to
                        create stunning pieces.
                    </p>

                    {/* Bottom Image */}
                    <img
                        className="w-full md:w-[clamp(150px,22vw,239px)] md:h-[clamp(163px,22vw,252px)] object-cover"
                        src="./Images/ContentBlockBottomImg.png"
                        alt="Content Block Bottom"
                    />
                </div>

            </div>
        </section>
    );
}
