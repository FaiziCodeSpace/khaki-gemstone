import { useState } from 'react';
import { ArrowRight, Share2, Heart } from 'lucide-react';

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
    labTestImage: "./Images/productDetail/LabTest.jpg",
    certificateImage: "./Images/productDetail/Certificate.jpg",
};

export function ProductDetails() {
    const [activeTab, setActiveTab] = useState('description');
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <section className="flex flex-col w-full lg:max-w-[580px] px-4 md:px-0 mx-auto mb-8 lg:mb-15 lgxx:mb-35">

            {/* Header */}
            <div className="mb-8 md:mb-12">
                <p className="text-xs md:text-[18px] font-mono text-gray-500 tracking-widest uppercase">{Details.productId}</p>
                <h1 className="text-[42px] lg:text-[clamp(42px,5vw,72px)] leading-tight md:leading-none font-bold text-gray-900 mt-3">
                    {Details.name}
                </h1>
                <p className="text-gray-600 text-sm md:text-[18px] leading-relaxed mt-4">
                    {Details.description}
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white px-8 md:px-12 lg:px-14 py-4 justify-between rounded-full border border-gray-100 mb-6 overflow-x-auto gap-4">
                {['description', 'laboratory test', 'certificate'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap transition-colors text-sm lg:text-4.5 capitalize tracking-wider ${activeTab === tab ? 'text-[#CA0A7F] font-bold' : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {/* Tab Content */}
            <div className="min-h-[200px] mb-8">
                {activeTab === 'description' && (
                    <div className="animate-fadeIn flex flex-col gap-6 mt-4 md:mt-8">
                        <div>
                            <h2 className="list-heading">Gem Size</h2>
                            <ul className='list-styling'><li>{Details.Gem_Size}</li></ul>
                        </div>

                        <div>
                            <h2 className="list-heading">Details</h2>
                            <ul className='list-styling'>
                                {Object.entries(Details.Details).map(([key, val]) => (
                                    <li key={key}><span className="font-medium capitalize">{key}:</span> {val}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="list-heading">More Information</h2>
                            <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 text-gray-600">
                                {Object.entries(Details.More_Information).map(([key, val], index, array) => (
                                    <div key={key} className="flex items-center gap-3 md:gap-4">
                                        <p className="text-xs md:text-[18px]">
                                            <span className="font-medium text-gray-900">
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                            </span> {val}
                                        </p>
                                        {index !== array.length - 1 && <span className="text-gray-300 hidden sm:block">|</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

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
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white ring-1 ring-gray-200 transition-transform group-hover:scale-110"
                            ></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing and Actions Card */}
            <div className='w-full flex flex-col bg-white p-4 md:p-6 rounded-3xl gap-4 md:gap-5.5 border border-gray-100'>
                <div className='flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-end'>
                    <div className='w-full md:w-auto'>
                        <p className='text-[#111111B2] text-sm md:text-base'>Price</p>
                        <p className='font-normal text-3xl md:text-[40px] leading-none'>
                            {Details.price.toLocaleString()} PKR
                        </p>
                    </div>
                    <button className='flex w-full md:flex-1 h-12 md:h-[64px] justify-center items-center bg-black text-white text-lg md:text-[20px] font-normal px-6 rounded-full transition-all hover:bg-gray-800 active:scale-95 text-nowrap'>
                        Shop Now <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2.5" />
                    </button>
                </div>

                <div className='flex gap-3 md:gap-8'>
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className='flex items-center justify-center w-full text-[12px] md:text-[18px] py-3 md:py-3.5 border-2 border-[#1111111A] rounded-full bg-[#FAFAFA] transition-all hover:bg-gray-100 active:scale-95'
                    >
                        <Heart
                            className={`w-5 h-5 md:w-6 md:h-6 mr-2.5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-black'}`}
                        />
                        Favorites
                    </button>
                    <button className='flex items-center justify-center w-full text-[12px] md:text-[18px] py-3 md:py-3.5 border-2 border-[#1111111A] rounded-full bg-[#FAFAFA] transition-all hover:bg-gray-100 active:scale-95'>
                        <Share2 className='w-5 h-5 md:w-6 md:h-6 mr-2.5' /> Share
                    </button>
                </div>
            </div>
        </section>
    );
}