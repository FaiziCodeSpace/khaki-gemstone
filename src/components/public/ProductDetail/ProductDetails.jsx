import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Share2, Heart, Loader2 } from 'lucide-react';
import { fetchProduct } from '../../../services/productsService';

export function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const getProductData = async () => {
            try {
                setLoading(true);
                const data = await fetchProduct(id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to load product", err);
            } finally {
                setLoading(false);
            }
        };
        getProductData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="animate-spin text-gray-400" size={40} />
            </div>
        );
    }

    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <section className="flex flex-col w-full lg:max-w-[580px] px-4 md:px-0 mx-auto mb-8 lg:mb-15">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <p className="text-xs md:text-[18px] font-mono text-gray-500 tracking-widest uppercase">
                    {product.productNumber}
                </p>
                <h1 className="text-[42px] lg:text-[clamp(42px,5vw,72px)] leading-tight md:leading-none font-bold text-gray-900 mt-3">
                    {product.name}
                </h1>
                <p className="text-gray-600 text-sm md:text-[18px] leading-relaxed mt-4">
                    {product.description}
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white px-8 md:px-12 lg:px-14 py-4 justify-between rounded-full border border-gray-100 mb-6 overflow-x-auto gap-4">
                {['description', 'laboratory test', 'certificate'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap transition-colors text-sm lg:text-4.5 capitalize tracking-wider ${
                            activeTab === tab ? 'text-[#CA0A7F] font-bold' : 'text-gray-500 hover:text-gray-800'
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
                            <h2 className="list-heading text-lg font-bold">Gem Size</h2>
                            <ul className='list-styling'><li>{product.gem_size}</li></ul>
                        </div>

                        <div>
                            <h2 className="list-heading text-lg font-bold">Details</h2>
                            <ul className='list-styling'>
                                {product.details && Object.entries(product.details).map(([key, val]) => (
                                    <li key={key}>
                                        <span className="font-medium capitalize">{key.replace('_', ' ')}:</span> {val}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="list-heading text-lg font-bold">More Information</h2>
                            <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 text-gray-600">
                                {product.more_information && Object.entries(product.more_information).map(([key, val], index, array) => (
                                    <div key={key} className="flex items-center gap-3 md:gap-4">
                                        <p className="text-xs md:text-[18px]">
                                            <span className="font-medium text-gray-900 capitalize">
                                                {key.replace('_', ' ')}:
                                            </span> {val} {key === 'weight' ? 'ct' : ''}
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
                            src={activeTab === 'laboratory test' ? product.lab_test_img_src : product.certificate_img_src}
                            alt={activeTab}
                            className="rounded-lg w-full h-auto md:h-[320px] object-cover border border-gray-200"
                        />
                    </div>
                )}
            </div>

            {/* Color Swatches */}
            <div className="pb-10">
                <p className="list-heading font-normal mb-2">Colors:</p>
                <div className="flex gap-3 md:gap-4">
                    {product.colors?.map((color, index) => (
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
                            {product.price?.toLocaleString()} PKR
                        </p>
                    </div>
                    <button className='flex w-full md:flex-1 h-12 md:h-[64px] justify-center items-center bg-black text-white text-lg md:text-[20px] font-normal px-6 rounded-full transition-all hover:bg-gray-800 active:scale-95'>
                        Shop Now <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2.5" />
                    </button>
                </div>

                <div className='flex gap-3 md:gap-8'>
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className='flex items-center justify-center w-full text-[12px] md:text-[18px] py-3 md:py-3.5 border-2 border-[#1111111A] rounded-full bg-[#FAFAFA] transition-all hover:bg-gray-100'
                    >
                        <Heart
                            className={`w-5 h-5 md:w-6 md:h-6 mr-2.5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-black'}`}
                        />
                        Favorites
                    </button>
                    <button className='flex items-center justify-center w-full text-[12px] md:text-[18px] py-3 md:py-3.5 border-2 border-[#1111111A] rounded-full bg-[#FAFAFA] transition-all hover:bg-gray-100'>
                        <Share2 className='w-5 h-5 md:w-6 md:h-6 mr-2.5' /> Share
                    </button>
                </div>
            </div>
        </section>
    );
}