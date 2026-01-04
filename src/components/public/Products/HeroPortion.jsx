export function ProductsHeroPortion() {
    return (<>
        <section className="bg-[#CA0A7F] font-[Poppins] relative flex flex-col items-center justify-center overflow-hidden">
            <h1 className="text-[35px] md:text-[84px] font-bold text-[#FBFFF6D6] z-10 pt-40 pb-15 lg:pt-[234px] lg:pb-[175px]">PRODUCTS</h1>
            <img
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                src="src/assets/textures/bgTexture.png"
                alt="bg-texture"
            />
        </section>
    </>)
}