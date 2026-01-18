const pricingTable = [
    { label: "Basic", value: 10000 },
    { label: "Standard", value: 20000 },
    { label: "Premium", value: 30000 }
];

export default function PricingTable() {
    return (
        <section className="flex flex-col gap-10 py-10">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-center md:text-left">
                    Packages
                </h2>
            </div>

            {/* Change: added flex-col and md:flex-row */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
                {pricingTable.map((card, index) => (
                    <div 
                        key={index}
                        className="flex flex-col flex-1 gap-3 bg-white p-8 border border-slate-100 shadow-sm rounded-xl transition-hover hover:shadow-md"
                    >
                        <h2 className="text-gray-500 text-[20.26px] font-semibold">
                            {card.label}
                        </h2>
                        <div className="flex items-baseline gap-1">
                            <span className="text-gray-800 text-2xl font-bold">Rs</span>
                            <h2 className="text-gray-800 text-[50px] font-extrabold leading-tight">
                                {card.value.toLocaleString()}
                            </h2>
                        </div>
                                    

                        <button className="w-full py-3 bg-[#CA0A7F] hover:bg-[#a8086a] transition-colors text-white text-[14.74px] font-bold rounded-lg mt-auto">
                            GET STARTED
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}