import { Helmet } from 'react-helmet-async';
import { MapPin, Code, User, Gem, Globe, ShieldCheck } from 'lucide-react';
import bgTexture from "../../assets/textures/bgTexture.png";

export default function AboutUsPage() {
    const accentColor = "#CA0A7F";

    return (
        <>
            <Helmet>
                <title>About | Gemstone Store - Natural & Authentic</title>
                <meta name="description" content="A gemstone e-commerce platform specializing in ethically sourced, natural gemstones. Built by Muhammad Faizan Khan." />
                <meta name="keywords" content="gemstone store, natural gemstones, gemstone ecommerce, Pakistan" />
                <link rel="canonical" href="https://khakigemstone.com/aboutUs" />
            </Helmet>

            <div className="bg-white text-black font-sans">

                {/* Hero Section */}
                <section className="relative md:pt-70 py-50 bg-[#CA0A7F] text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10 z-10">
                        <div className="absolute transform -rotate-12 -right-10 -bottom-10">
                            <Gem size={450} strokeWidth={0.5} />
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tighter">
                            About <br />
                            <span className="text-gray-900">This</span> Project
                        </h1>
                        <p className="text-xl md:text-xl text-[#fbfff6d6] max-w-2xl font-light leading-relaxed">
                            A full-stack gemstone e-commerce platform. 100% natural products. Built from scratch.
                        </p>
                    </div>
                    <img
                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                        src={bgTexture}
                        alt="bg-texture"
                    />
                </section>

                {/* Narrative Section */}
                <section className="py-24 max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-sm uppercase tracking-[0.4em] mb-8 font-bold" style={{ color: accentColor }}>
                                Project Overview
                            </h2>
                            <p className="text-3xl md:text-4xl font-serif leading-tight mb-8">
                                "Real stones carry real value."
                            </p>
                            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                                <p>
                                    A full-featured e-commerce platform built for a gemstone business,
                                    handling product listings, categories, and an investor portal.
                                </p>
                                <p>
                                    The platform showcases natural gemstones — ethically sourced,
                                    carefully categorized, with a clean and conversion-focused UI.
                                </p>
                                <p>
                                    From rough stones to finely cut gems, the store is designed to
                                    present each piece with clarity and character.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Client Card */}
                            <div className="p-8 border border-gray-100 bg-gray-50 flex items-center space-x-6">
                                <div className="p-4 bg-black rounded-full text-white">
                                    <User size={30} style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-gray-500">Client</h3>
                                    <p className="text-2xl font-bold italic">Gemstone Business, Pakistan</p>
                                </div>
                            </div>

                            {/* Developer Card */}
                            <div className="p-8 border border-gray-100 bg-white shadow-xl shadow-gray-100 flex items-center space-x-6">
                                <div className="p-4 bg-black rounded-full text-white">
                                    <Code size={30} style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-gray-500">Designed & Developed by</h3>
                                    <p className="text-xl font-bold">Muhammad Faizan Khan</p>
                                    <div className="flex items-center gap-4 mt-2">

                                        <a href="https://github.com/FaiziCodeSpace"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-gray-500 hover:text-black transition-colors inline-flex items-center gap-1"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                            </svg>
                                            GitHub
                                        </a>

                                        <a href="https://www.linkedin.com/in/faizan-k-a62526375/"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-gray-500 hover:text-black transition-colors inline-flex items-center gap-1"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                            LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Grid */}
                <section className="py-20 border-t border-gray-100 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">

                            <div>
                                <MapPin className="mb-4 mx-auto md:mx-0" style={{ color: accentColor }} />
                                <h4 className="font-bold uppercase tracking-widest mb-4">Built For</h4>
                                <p className="text-gray-600">Peshawar, Pakistan</p>
                                <p className="text-gray-600">Dera Ismail Khan, Pakistan</p>
                            </div>

                            <div>
                                <ShieldCheck className="mb-4 mx-auto md:mx-0" style={{ color: accentColor }} />
                                <h4 className="font-bold uppercase tracking-widest mb-4">Stack</h4>
                                <p className="text-gray-600">React + Tailwind CSS</p>
                                <p className="text-gray-600">Node.js + MongoDB</p>
                            </div>

                            <div>
                                <Globe className="mb-4 mx-auto md:mx-0" style={{ color: accentColor }} />
                                <h4 className="font-bold uppercase tracking-widest mb-4">Developer</h4>

                                <a href="https://github.com/FaiziCodeSpace"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-black font-bold hover:underline inline-flex items-center"
                                >
                                    GitHub Profile <Globe size={14} className="ml-2" />
                                </a>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 bg-white text-center border-t border-gray-100">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">
                        Portfolio Project — Muhammad Faizan Khan
                    </p>
                </footer>
            </div>
        </>
    );
}