import React from 'react';
import { ShieldCheck, FileText, Gavel, Truck, RotateCcw, Gem, Info } from 'lucide-react';
import bgTexture from "../../assets/textures/bgTexture.png"; 

export default function TermsAndConditions() {
    const accentColor = "#CA0A7F";
    const currentDate = new Date().toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="bg-white text-black font-sans">
            {/* Hero Section */}
            <section className="relative py-24 md:py-40 bg-[#CA0A7F] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10 z-10">
                    <div className="absolute transform -rotate-12 -right-10 -bottom-10 color-white">
                        <FileText size={450} strokeWidth={0.5} />
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tighter">
                        Terms <br />
                        <span className="text-gray-900">& Conditions</span>
                    </h1>
                    <p className="text-xl text-[#fbfff6d6] max-w-2xl font-light leading-relaxed">
                        Please review our contractual terms carefully. By interacting with Khaki Gemstone, you agree to these legal standards.
                    </p>
                </div>
                
                <img
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                    src={bgTexture}
                    alt="bg-texture"
                />
            </section>

            {/* Content Section */}
            <section className="py-24 max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16">
                    {/* Sticky Sidebar Info */}
                    <div className="md:w-1/3 space-y-8">
                        <div className="sticky top-12">
                            <h2 className="text-sm uppercase tracking-[0.4em] mb-4 font-bold" style={{ color: accentColor }}>
                                Effective Date
                            </h2>
                            <p className="text-lg font-serif mb-8">{currentDate}</p>
                            
                            <div className="p-6 bg-gray-50 border-l-4" style={{ borderColor: accentColor }}>
                                <Info size={24} className="mb-4" style={{ color: accentColor }} />
                                <h3 className="font-bold mb-2">Legal Summary</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    These terms govern the purchase of natural gemstones and the use of our digital platforms under the jurisdiction of Pakistan.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Terms List */}
                    <div className="md:w-2/3 space-y-12">
                        {/* 01. General */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold px-2 py-1 bg-black text-white">01</span>
                                <h3 className="text-xl font-bold uppercase tracking-widest">General Terms</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Khaki Gemstone operates as a specialized purveyor of natural and authentic gemstones. By accessing this website or purchasing our products, you warrant that you are at least 18 years of age and possess the legal authority to enter into binding agreements.
                            </p>
                        </div>

                        {/* 02. Authenticity */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold px-2 py-1 bg-black text-white">02</span>
                                <h3 className="text-xl font-bold uppercase tracking-widest">Product Authenticity</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Every specimen provided by Khaki Gemstone is guaranteed 100% natural unless explicitly labeled as "Enhanced" or "Synthetic." 
                            </p>
                            <blockquote className="border-l-2 border-gray-200 pl-4 italic text-gray-500">
                                "Natural inclusions, fissures, and color zoning are inherent characteristics of earth-mined stones and are not considered defects."
                            </blockquote>
                        </div>

                        {/* 03. Visuals */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold px-2 py-1 bg-black text-white">03</span>
                                <h3 className="text-xl font-bold uppercase tracking-widest">Visual Representation</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                While we strive for 100% accuracy, gemstone appearance can vary significantly based on lighting conditions and display settings. Descriptions are provided to the best of our expert knowledge.
                            </p>
                        </div>

                        {/* 04. Logistics */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold px-2 py-1 bg-black text-white">04</span>
                                <h3 className="text-xl font-bold uppercase tracking-widest">Payments & Logistics</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4 text-gray-700">
                                <p>• All transactions are processed in PKR unless otherwise stated.</p>
                                <p>• Full payment clearance is mandatory prior to shipment.</p>
                                <p>• Delivery timelines are estimates; Khaki Gemstone is not liable for third-party courier delays.</p>
                            </div>
                        </div>

                        {/* 05. Returns */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold px-2 py-1 bg-black text-white">05</span>
                                <h3 className="text-xl font-bold uppercase tracking-widest text-[#CA0A7F]">Returns & Refunds</h3>
                            </div>
                            <div className="p-6 bg-pink-50 rounded-sm">
                                <p className="text-gray-800 leading-relaxed">
                                    Due to the high-value nature of natural gemstones, we maintain a **Strict No-Return Policy**. Exceptions are made exclusively for items that arrive damaged or incorrect, provided they are reported via official channels within **24 hours of delivery receipt**.
                                </p>
                            </div>
                        </div>

                        {/* 06. Law */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold px-2 py-1 bg-black text-white">06</span>
                                <h3 className="text-xl font-bold uppercase tracking-widest">Governing Law</h3>
                            </div>
                            <div className="flex items-start gap-4">
                                <Gavel style={{ color: accentColor }} size={40} />
                                <p className="text-gray-700 leading-relaxed">
                                    These Terms and Conditions are governed by and construed in accordance with the laws of the **Islamic Republic of Pakistan**. Any disputes shall be subject to the exclusive jurisdiction of the courts in Peshawar/Dera Ismail Khan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Brand Signal */}
            <footer className="py-16 bg-gray-50 text-center border-t border-gray-100">
                <Gem className="mx-auto mb-6 opacity-20" size={40} />
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">
                    Khaki Gem Stone — Ethical. Authentic. Eternal.
                </p>
            </footer>
        </div>
    );
}