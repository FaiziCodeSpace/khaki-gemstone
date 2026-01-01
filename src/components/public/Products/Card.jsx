
const CardData = [
    { id: 1, name: "Heliodor Beryl", description: "This is a description of Heliodor Beryl", price: "$180.00" },
    { id: 2, name: "Aquamarine Beryl", description: "This is a description of Aquamarine Beryl", price: "$150.00" },
    { id: 3, name: "Morganite Beryl", description: "This is a description of Morganite Beryl", price: "$200.00" },
    { id: 4, name: "Goshenite Beryl", description: "This is a description of Goshenite Beryl", price: "$120.00" },
]

export function Card() {
    return (
        <section className="flex flex-wrap gap-8 justify-center py-12">
            {CardData.map((item) => (
                <div 
                    key={item.id} 
                    className="group relative bg-white p-4 rounded-[32px] w-[260px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out"
                >
                    {/* 1. IMPROVED FLOATING DETAIL BOX (The "Windows" Effect) */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full w-[220px] 
                                    opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 
                                    transition-all duration-300 pointer-events-none z-50">
                        <div className="bg-white/90 backdrop-blur-md border border-white shadow-2xl p-4 rounded-2xl text-sm text-gray-700 leading-relaxed">
                            <p className="font-semibold text-gray-900 mb-1">Product Details</p>
                            {item.description}
                            {/* Decorative Arrow */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 rotate-45 border-r border-b border-white"></div>
                        </div>
                    </div>

                    {/* 2. ENHANCED IMAGE CONTAINER */}
                    <div className="relative w-full h-[268px] rounded-[24px] overflow-hidden bg-gray-100 cursor-pointer">
                        <img 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                            src="./Images/CardPic.png" 
                            alt={item.name} 
                        />
                        {/* Subtle Gradient Overlay on Image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* 3. REFINED TEXT CONTENT */}
                    <div className="mt-4 px-1">
                        <h2 className="font-bold text-xl text-gray-800 tracking-tight truncate">
                            {item.name}
                        </h2>
                        
                        {/* Preview Description */}
                        <p className="mt-1 text-gray-400 text-sm truncate">
                            {item.description}
                        </p>

                        <div className="mt-5 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Price</span>
                                <h3 className="font-black text-lg text-[#2D2636]">{item.price}</h3>
                            </div>
                            
                            <button className="active:scale-95 bg-[#2D2636] hover:bg-black px-6 py-2.5 text-sm font-medium text-white rounded-full shadow-lg transition-all duration-300 cursor-pointer">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}