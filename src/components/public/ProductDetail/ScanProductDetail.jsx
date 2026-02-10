import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Share2, Loader2, ShieldCheck, Gem, MapPin } from 'lucide-react';
import { fetchProduct } from '../../../services/productsService';

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function ScanProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const getProductData = async () => {
            try {
                setLoading(true);
                const data = await fetchProduct(id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to load asset details", err);
            } finally {
                setLoading(false);
            }
        };
        getProductData();
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.name,
                text: `Verified Gemstone: ${product?.productNumber}`,
                url: window.location.href,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] px-4 text-center gap-4">
                <Loader2 className="animate-spin text-[#CA0A7F]" size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Decrypting Vault Data...</p>
            </div>
        );
    }

    if (!product) return <div className="text-center py-20 font-bold text-gray-400 uppercase px-6">Asset not found in registry.</div>;

    return (
        <section className="flex flex-col w-full lg:max-w-[650px] px-4 sm:px-6 mx-auto mb-12 animate-in fade-in duration-700 overflow-x-hidden">
            
            {/* Verification Badge */}
            <div className="flex items-center gap-2 mb-4 md:mb-6 bg-emerald-50 w-fit px-3 md:px-4 py-1.5 rounded-full border border-emerald-100">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-emerald-700">Verified Authentic Asset</span>
            </div>

            {/* Header */}
            <div className="mb-6 md:mb-10">
                <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] md:text-sm font-mono text-[#CA0A7F] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase truncate">
                            {product.productNumber}
                        </p>
                        <h1 className="text-2xl xs:text-3xl md:text-5xl font-black text-gray-900 mt-1 tracking-tighter uppercase leading-[0.9] break-words">
                            {product.name}
                        </h1>
                    </div>
                    <button 
                        onClick={handleShare}
                        className="p-2.5 md:p-3 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 text-gray-400 hover:text-[#CA0A7F] transition-colors shrink-0"
                    >
                        <Share2 size={18} />
                    </button>
                </div>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-4 md:mt-6 italic border-l-2 border-pink-100 pl-4">
                    {product.description}
                </p>
            </div>

            {/* Navigation Tabs - Scrollable for small screens */}
            <div className="flex bg-gray-50 p-1 rounded-xl md:rounded-2xl mb-6 md:mb-8 overflow-x-auto no-scrollbar scroll-smooth">
                {['description', 'laboratory test', 'certificate'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 min-w-[100px] whitespace-nowrap py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl transition-all text-[8px] md:text-[10px] uppercase font-black tracking-widest ${
                            activeTab === tab 
                            ? 'bg-white text-[#CA0A7F] ring-1 ring-black/5' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[250px] mb-8 md:mb-10">
                {activeTab === 'description' && (
                    <div className="animate-in slide-in-from-bottom-2 duration-500 space-y-6 md:space-y-8">
                        {/* Essential Specs Grid */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="bg-white border border-gray-100 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm">
                                <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Dimensions</p>
                                <p className="text-sm md:text-lg font-bold text-gray-900">{product.gem_size} mm</p>
                            </div>
                            <div className="bg-white border border-gray-100 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm">
                                <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Origin</p>
                                <p className="text-sm md:text-lg font-bold text-gray-900 truncate">{product.more_information?.origin || 'N/A'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Gem size={12} className="text-[#CA0A7F]" /> Composition Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 md:gap-y-3 gap-x-8 border-t border-gray-100 pt-4">
                                {product.details && Object.entries(product.details).map(([key, val]) => (
                                    <div key={key} className="flex justify-between items-center py-0.5">
                                        <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold">{key.replace('_', ' ')}</span>
                                        <span className="text-xs md:text-sm font-bold text-gray-800">{val}</span>
                                    </div>
                                ))}
                                {product.more_information?.weight && (
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold">Carat Weight</span>
                                        <span className="text-xs md:text-sm font-bold text-gray-800">{product.more_information.weight} ct</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {product.location && (
                            <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-3.5 md:p-4 rounded-xl md:rounded-2xl border border-gray-100">
                                <MapPin size={14} className="text-[#CA0A7F] shrink-0" />
                                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider truncate">Storage: {product.location}</span>
                            </div>
                        )}
                    </div>
                )}

                {(activeTab === 'laboratory test' || activeTab === 'certificate') && (
                    <div className="animate-in zoom-in-95 duration-500">
                        <div className="relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-4 border-white shadow-xl md:shadow-2xl">
                            <img
                                src={activeTab === 'laboratory test' ? `${API_URL}${product.lab_test_img_src}` : `${API_URL}${product.certificate_img_src}`}
                                alt={activeTab}
                                className="w-full h-auto object-cover max-h-[400px] md:max-h-[500px]"
                            />
                        </div>
                        <p className="text-center mt-3 md:mt-4 text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Official {activeTab} Document
                        </p>
                    </div>
                )}
            </div>

            {/* Market Value Footer */}
            <div className='w-full bg-gray-900 p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden'>
                <div className="relative z-10">
                    <p className='text-pink-400/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2'>Current Valuation</p>
                    <p className='font-black text-2xl xs:text-3xl md:text-4xl text-white tracking-tighter leading-none'>
                        {product.publicPrice?.toLocaleString()} <span className="text-sm md:text-lg text-pink-500 ml-1">PKR</span>
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-[#CA0A7F]/20 blur-[40px] md:blur-[60px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-blue-500/10 blur-[40px] md:blur-[60px] rounded-full"></div>
            </div>
        </section>
    );
}