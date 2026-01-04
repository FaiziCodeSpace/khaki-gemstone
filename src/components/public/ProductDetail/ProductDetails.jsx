import { useState } from 'react';

const Details = {
    productId: '23G-VA5',
    name: 'Vasaka - Cushion Cut Tanzanite',
    description: 'A stunning tanzanite gem with a classic cushion cut. This rare stone is known for its deep blue-violet hue and exceptional clarity. Sourced from the Merelani Hills of Tanzania.',
    Gem_Size: "8.2 x 6.4 x 4.9 mm",
    Details: {
        gemstone: "Tanzanite",
        cut: "Cushion Cut",
        color: "Deep Blue-Violet",
        clarity: "Excellent"
    },
    More_Information: {
        caratWeight: "2.15 ct",
        origin: "Tanzania",
        treatment: "Heated",
        refractiveIndex: "1.691-1.700"
    },
    colors: ['#5D5656', '#556D84', '#8E9295'],
    price: 4750.00,
    labTestImage: "./Images/productDetail/LabTest.jpg", // Replace with your path
    certificateImage: "./Images/productDetail/Certificate.jpg", // Replace with your path
};

export function ProductDetails() {
    const [activeTab, setActiveTab] = useState('description');

    return (
        /* Use max-width instead of fixed width for responsiveness */
        <section className="flex flex-col w-full lg:max-w-[580px] px-4 md:px-0 mx-auto">
            
            {/* Header Section */}
            <div className="mb-8 md:mb-12">
                <p className="text-xs md:text-[18px] font-mono text-gray-500 tracking-widest uppercase">{Details.productId}</p>
                {/* Fluid Typography: text-4xl on mobile, text-7xl on desktop */}
                <h1 className="text-[42px] md:text-[42px] lg:text-[72px] leading-tight md:leading-none font-bold text-gray-900 mt-3">
                    {Details.name}
                </h1>
                <p className="text-gray-600 text-sm md:text-[18px] leading-relaxed mt-4">
                    {Details.description}
                </p>
            </div>

            {/* Navigation Tabs - Added overflow-x-auto for small screens */}
            <div className="flex bg-white px-6 lg:px-14 py-4 justify-between rounded-full border border-gray-100 mb-6 overflow-x-auto gap-4">
                {['description', 'laboratory test', 'certificate'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab-button text-sm lg:text-4.5 ${activeTab === tab ? 'text-[#CA0A7F]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content Display */}
            <div className="min-h-[200px] mb-8">
                {activeTab === 'description' && (
                    <div className="animate-fadeIn">
                        <div className="flex flex-col gap-6 mt-4 md:mt-8">
                            <div>
                                <h2 className="list-heading">Gem Size</h2>
                                <ul className='list-styling'>
                                    <li>{Details.Gem_Size}</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h2 className="list-heading">Details</h2>
                                <ul className='list-styling'>
                                    {Object.entries(Details.Details).map(([key, val]) => (
                                        <li key={key}>
                                            <span className="font-medium capitalize">{key}:</span> {val}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h2 className="list-heading">More Information</h2>
                                {/* Inline row becomes a simple column-gap row on mobile */}
                                <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 text-gray-600">
                                    {Object.entries(Details.More_Information).map(([key, val], index, array) => (
                                        <div key={key} className="flex items-center gap-3 md:gap-4">
                                            <p className="text-xs md:text-[18px]">
                                                <span className="font-medium text-gray-900">
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                                </span>
                                                {" "}{val}
                                            </p>
                                            {index !== array.length - 1 && (
                                                <span className="text-gray-300 hidden sm:block">|</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Images now responsive with h-auto on mobile */}
                {(activeTab === 'laboratory test' || activeTab === 'certificate') && (
                    <div className="animate-fadeIn">
                        <img 
                            src={activeTab === 'laboratory test' ? Details.labTestImage : Details.certificateImage} 
                            alt={activeTab} 
                            className="rounded-lg w-full h-auto md:h-[320px] object-cover border border-gray-200" 
                        />
                    </div>
                )}
            </div>

            {/* Color Swatches */}
            <div className="pb-10">
                <p className="list-heading font-normal">Colors:</p>
                <div className="flex gap-3 md:gap-4">
                    {Details.colors.map((color, index) => (
                        <div key={index} className="group cursor-pointer flex flex-col items-center gap-2">
                            <span
                                style={{ backgroundColor: color }}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"
                            ></span>
                            <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{color}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}