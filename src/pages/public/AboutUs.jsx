import { Helmet } from 'react-helmet-async';
import { MapPin, Code, User, Facebook, Gem, Globe, ShieldCheck } from 'lucide-react';

export default function AboutUsPage() {
    const accentColor = "#CA0A7F";

    return (
        <>
            <Helmet>
                <title>About Us | Khaki Gemstone - 100% Natural & Authentic</title>
                <meta name="description" content="Learn about Khaki Gemstone, led by CEO Ayub. We specialize in ethically sourced, natural gemstones in Peshawar and Dera Ismail Khan, Pakistan." />
                <meta name="keywords" content="Khaki Gemstone history, gemstone sourcing Pakistan, natural gemstones Peshawar, Ayub Khaki Gemstone" />
                <link rel="canonical" href="https://khakigemstone.com/aboutUs" />
            </Helmet>
            
            <div className="bg-white text-black font-sans ">

                {/* Hero Section - High Impact with Icon Background */}
                <section className="relative py-24 md:py-40 bg-[#CA0A7F] text-white overflow-hidden">
                    {/* The "Iconic" Background Watermark from the first version */}
                    <div className="absolute inset-0 opacity-10 z-10">
                        <div className="absolute transform -rotate-12 -right-10 -bottom-10 color-white">
                            <Gem size={450} strokeWidth={0.5} />
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tighter">
                            About <br />
                            <span className="text-gray-900">Khaki</span> Gem Stone
                        </h1>
                        <p className="text-xl md:text-xl text-[#fbfff6d6] max-w-2xl font-light leading-relaxed">
                            Sourcing the earth's most silent stories. 100% natural. 100% authentic.
                        </p>
                    </div>
                    {/* Background Texture */}
                    <img
                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                        src="src/assets/textures/bgTexture.png"
                        alt="bg-texture"
                    />
                </section>

                {/* Narrative Section */}
                <section className="py-24 max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-sm uppercase tracking-[0.4em] mb-8 font-bold" style={{ color: accentColor }}>
                                Our Simple Belief
                            </h2>
                            <p className="text-3xl md:text-4xl font-serif leading-tight mb-8">
                                "Real stones carry real value."
                            </p>
                            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                                <p>
                                    We specialize in sourcing and delivering 100% natural gemstones,
                                    carefully selected for their authenticity, quality, and natural beauty.
                                </p>
                                <p>
                                    Each gemstone in our collection is ethically sourced from trusted origins
                                    and handpicked by experts to ensure clarity, color, and character.
                                </p>
                                <p>
                                    From raw and rough stones to finely cut gems and collector specimens,
                                    every piece tells a story shaped by nature itself.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* CEO Card */}
                            <div className="p-8 border border-gray-100 bg-gray-50 flex items-center space-x-6">
                                <div className="p-4 bg-black rounded-full text-white">
                                    <User size={30} style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-gray-500">Chief Executive</h3>
                                    <p className="text-2xl font-bold italic">Ayub</p>
                                </div>
                            </div>

                            {/* Developer / Agency Card */}
                            <div className="p-8 border border-gray-100 bg-white shadow-xl shadow-gray-100 flex items-center space-x-6">
                                <div className="p-4 bg-black rounded-full text-white">
                                    <Code size={30} style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-gray-500">Digital Architecture</h3>
                                    <p className="text-xl font-bold">ODA Agency</p>
                                    <p className="text-sm text-gray-400">Dev: Muhammad Faizan Khan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Locations & Socials - Iconic Grid */}
                <section className="py-20 border-t border-gray-100 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">

                            <div>
                                <MapPin className="mb-4 mx-auto md:mx-0" style={{ color: accentColor }} />
                                <h4 className="font-bold uppercase tracking-widest mb-4">Locations</h4>
                                <p className="text-gray-600">Peshawar, Pakistan</p>
                                <p className="text-gray-600">Dera Ismail Khan, Pakistan</p>
                            </div>

                            <div>
                                <ShieldCheck className="mb-4 mx-auto md:mx-0" style={{ color: accentColor }} />
                                <h4 className="font-bold uppercase tracking-widest mb-4">Promise</h4>
                                <p className="text-gray-600">Ethically Sourced</p>
                                <p className="text-gray-600">Certified Authentic</p>
                            </div>

                            <div>
                                <Facebook className="mb-4 mx-auto md:mx-0" style={{ color: accentColor }} />
                                <h4 className="font-bold uppercase tracking-widest mb-4">Connect</h4>
                                <a
                                    href="https://www.facebook.com/KHAKIGEMSTONE/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-black font-bold hover:underline inline-flex items-center"
                                >
                                    Facebook Official <Globe size={14} className="ml-2" />
                                </a>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Minimalistic Footer */}
                <footer className="py-12 bg-white text-center border-t border-gray-100">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">
                        Khaki Gem Stone — Pure Earth
                    </p>
                </footer>
            </div>
        </>

    );
}