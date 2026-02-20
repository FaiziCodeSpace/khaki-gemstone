import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, TrendingUp, ShieldCheck } from 'lucide-react';
import { fetchProduct } from '../../../services/productsService';

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function ProductDetails() {
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
                console.error("Failed to load product", err);
            } finally {
                setLoading(false);
            }
        };
        getProductData();
    }, [id]);

    const calculateInvestorReturn = (price, margin, sharingModel) => {
        const p = Number(price) || 0;
        const m = Number(margin) || 0;
        const s = Number(sharingModel) || 0;
        const totalProfit = p * (m / 100);
        const investorShare = totalProfit * (s / 100);
        return p + investorShare;
    };

    const formatCurrency = (val) => {
        if (!val) return '—';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0
        }).format(val).replace('PKR', 'Rs.');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[450px]">
                <Loader2 className="animate-spin text-gray-300" size={48} />
            </div>
        );
    }

    if (!product) return <div className="text-center py-20 font-medium text-gray-500">Asset data unavailable.</div>;

    // Combined Logic: Show "Certificate" tab if either lab test or certificate image exists
    const availableTabs = [
        { id: 'description', label: 'Description', show: true },
        { 
            id: 'certificate', 
            label: 'Certificate', 
            show: !!product.lab_test_img_src || !!product.certificate_img_src 
        }
    ].filter(tab => tab.show);

    return (
        <section className="flex flex-col w-full lg:max-w-[640px] md:px-0 mx-auto mb-12">
            {/* Asset Header */}
            <header className="mb-10">
                <div className="flex items-center gap-2 mb-3">
                    {product.productNumber && (
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded font-mono font-bold tracking-tighter">
                            ASSET ID: {product.productNumber}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                        <ShieldCheck size={12} /> Verified Asset
                    </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {product.name || "Unnamed Asset"}
                </h1>
                {product.description && (
                    <p className="text-gray-500 text-base md:text-lg mt-4 leading-relaxed border-l-2 border-gray-200 pl-4">
                        {product.description}
                    </p>
                )}
            </header>

            {/* Navigation Tabs - Only show if more than one tab exists */}
            {availableTabs.length > 1 && (
                <div className="flex bg-gray-50 p-1.5 justify-between rounded-xl border border-gray-200 mb-8 overflow-x-auto">
                    {availableTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-all rounded-lg ${
                                activeTab === tab.id 
                                ? 'bg-white text-[#CA0A7F] shadow-sm ring-1 ring-black/5' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Content Area */}
            <div className="min-h-[250px]">
                {activeTab === 'description' && (
                    <div className="animate-fadeIn space-y-10">
                        {/* 1. Financial Performance Grid */}
                        <section>
                            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                                <div className="p-1.5 bg-gray-100 rounded-lg">
                                    <TrendingUp size={16} className="text-gray-600" />
                                </div> 
                                Financial Overview
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {(product.publicPrice || product.price) && (
                                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Public Price</p>
                                        <p className="text-xl font-bold text-gray-900">{formatCurrency(product.publicPrice || product.price)}</p>
                                    </div>
                                )}
                                {product.profitMargin !== undefined && (
                                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Profit Margin</p>
                                        <p className="text-xl font-bold text-green-600">{product.profitMargin}%</p>
                                    </div>
                                )}
                                {product.profitSharingModel !== undefined && (
                                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Sharing Model</p>
                                        <p className="text-xl font-bold text-gray-900">{product.profitSharingModel}% <span className="text-[10px] text-gray-400">of profit</span></p>
                                    </div>
                                )}
                                {product.price && (
                                    <div className="bg-[#CA0A7F]/5 border border-[#CA0A7F]/10 p-5 rounded-2xl">
                                        <p className="text-[10px] font-bold text-[#CA0A7F] uppercase mb-1">Est. Return</p>
                                        <p className="text-xl font-black text-[#CA0A7F]">
                                            {formatCurrency(calculateInvestorReturn(product.price, product.profitMargin, product.profitSharingModel))}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 2. Physical Specifications */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {product.gem_size && (
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Gemstone Specs</h3>
                                    <div className="flex items-center gap-2 text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg w-fit">
                                        <span className="text-gray-400 text-sm">Size:</span> {product.gem_size} mm
                                    </div>
                                </div>
                            )}
                            
                            {product.details && Object.keys(product.details).length > 0 && (
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Technical Details</h3>
                                    <ul className="space-y-2">
                                        {Object.entries(product.details).map(([key, val]) => (
                                            val && (
                                                <li key={key} className="flex justify-between text-sm border-b border-gray-50 pb-1">
                                                    <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                                    <span className="font-bold text-gray-900">{val}</span>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>

                        {/* 3. Additional Meta Information */}
                        {product.more_information && Object.keys(product.more_information).length > 0 && (
                            <footer className="pt-6 border-t border-gray-100">
                                <div className="flex flex-wrap gap-4">
                                    {Object.entries(product.more_information).map(([key, val]) => (
                                        val && (
                                            <div key={key} className="bg-gray-100 flex-1 min-w-[120px] px-3 py-1.5 rounded-md">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase block leading-none mb-1">{key.replace(/_/g, ' ')}</span>
                                                <span className="text-sm font-bold text-gray-700">
                                                    {val}{key.toLowerCase().includes('weight') ? ' ct' : ''}
                                                </span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </footer>
                        )}
                    </div>
                )}

                {activeTab === 'certificate' && (
                    <div className="animate-fadeIn space-y-6">
                        {[product.lab_test_img_src, product.certificate_img_src].map((src, index) => (
                            src && (
                                <div key={index} className="relative group overflow-hidden rounded-2xl border-4 border-white shadow-xl bg-gray-50">
                                    <img
                                        src={`${API_URL}${src}`}
                                        alt="Documentation"
                                        className="w-full h-auto md:max-h-[600px] object-contain"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                </div>
                            )
                        ))}
                        <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.3em]">Official Documentation - Internal Use Only</p>
                    </div>
                )}
            </div>
        </section>
    );
}