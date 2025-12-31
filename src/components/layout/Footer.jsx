import { Instagram, Facebook, Youtube } from 'lucide-react'; // Using lucide-react for icons

export function Footer() {
    return (
        <footer className="bg-white px-6 py-12 md:px-20 md:py-16 text-[#1D212C]">
            <div className="max-w-7xl mx-auto">
                {/* Top Section: Logo & Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16">
                    <div className="max-w-sm">
                        <img 
                            className="w-24 h-auto mb-6 object-contain" 
                            src="./Logos/logo.png" 
                            alt="Khaki Gemstone Logo" 
                        />
                        <p className="text-[#747986] leading-relaxed">
                            Khaki Gem Stone is a trusted online gemstone store offering 
                            authentic natural stones sourced directly from nature.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h2 className="font-bold text-xl">Newsletter</h2>
                        <div className="flex items-center justify-between w-[292px] md:w-[473px] p-1.5 pl-6 bg-[#F5F5F5] rounded-full">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-transparent outline-none grow text-[12px] md:text-sm text-gray-700 placeholder:text-[#747986]"
                            />
                            <button className="bg-[#C8107E] text-white px-3 py-2.5 md:px-8 md:py-3 rounded-full font-medium hover:bg-[#b00e6e] transition-colors text-[12px] md:text-sm">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Contact & Links */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
                    {/* Brand/Contact */}
                    <div className="md:col-span-2 font-medium">
                        <h3 className="md:text-xl lg:text-2xl mb-4">ABCD anywhere on earth</h3>
                        <p className="md:text-xl lg:text-2xl text-[#1D212C]">(+1) 234-567-890</p>
                    </div>

                    {/* Useful Links */}
                    <div className="flex flex-col gap-4 border-r border-gray-100 md:pl-8">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Useful Links</h4>
                        <ul className="text-[#747986] space-y-3 text-sm font-medium">
                            <li className="hover:text-[#C8107E] cursor-pointer">Home</li>
                            <li className="hover:text-[#C8107E] cursor-pointer">Shop</li>
                            <li className="hover:text-[#C8107E] cursor-pointer">About Us</li>
                            <li className="hover:text-[#C8107E] cursor-pointer">Blogs</li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-col gap-4 border-r border-gray-100 md:pl-8">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Product Categories</h4>
                        <ul className="text-[#747986] space-y-3 text-sm font-medium">
                            <li className="hover:text-[#C8107E] cursor-pointer">Beads</li>
                            <li className="hover:text-[#C8107E] cursor-pointer">Rings</li>
                            <li className="hover:text-[#C8107E] cursor-pointer">Cut Stones</li>
                            <li className="hover:text-[#C8107E] cursor-pointer">Rough Stones</li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div className="flex flex-col gap-4 border-gray-100 md:pl-8">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Information</h4>
                        <ul className="text-[#747986] space-y-3 text-sm font-medium">
                            <li className="hover:text-[#C8107E] cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-[#C8107E] cursor-pointer">Terms & Conditions</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Copyright & Socials */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:row md:flex-row justify-between items-center gap-6">
                    <p className="text-[#747986] text-sm">
                        All Rights Reserved - Khaki Gemstone
                    </p>
                    <div className="flex gap-4">
                        <SocialIcon Icon={Instagram} />
                        <SocialIcon Icon={Facebook} />
                        <SocialIcon Icon={Youtube} />
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Helper component for social icons
function SocialIcon({ Icon }) {
    return (
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-[#C8107E] hover:text-white hover:border-[#C8107E] transition-all cursor-pointer">
            <Icon size={18} />
        </div>
    );
}