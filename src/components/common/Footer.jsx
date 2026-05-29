import { Link } from 'react-router-dom'; // Added Link for navigation

export function Footer() {
    return (
        <footer className="bg-white px-6 py-12 md:px-20 md:py-16 text-[#1D212C]">
            <div className="max-w-7xl mx-auto">
                {/* Top Section: Logo & Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16">
                    <div className="max-w-sm">
                        <Link to="/">
                            <img
                                className="w-24 h-auto mb-6 object-contain cursor-pointer"
                                src="/Logos/logo.png"
                                alt="Khaki Gemstone Logo"
                            />
                        </Link>
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
                        <h3 className="md:text-xl lg:text-2xl mb-4">Dera ismail khan & Peshawar <br /> KP, Pakistan</h3>
                        <p className="md:text-xl lg:text-2xl text-[#1D212C] tracking-tight hover:text-[#C8107E] transition-colors">
                            <a href="tel:+9234567890">(+92) 334 1927178</a>
                        </p>
                    </div>

                    {/* Useful Links */}
                    <div className="flex flex-col gap-4 border-r border-gray-100 md:pl-8">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Useful Links</h4>
                        <ul className="text-[#747986] space-y-3 text-sm font-medium">
                            <li><Link to="/" className="hover:text-[#C8107E] transition-colors">Home</Link></li>
                            <li><Link to="/shop" className="hover:text-[#C8107E] transition-colors">Shop</Link></li>
                            <li><Link to="/aboutUs" className="hover:text-[#C8107E] transition-colors">About Us</Link></li>
                            <li><Link to="/investor-login" className="hover:text-[#C8107E] transition-colors">Investor Portal</Link></li>
                        </ul>
                    </div>

                    {/* Categories - Linking to Shop with State or Query filters recommended later */}
                    <div className="flex flex-col gap-4 border-r border-gray-100 md:pl-8">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Product Categories</h4>
                        <ul className="text-[#747986] space-y-3 text-sm font-medium">
                            <li><Link to="/shop?category=beads" className="hover:text-[#C8107E] transition-colors">Beads</Link></li>
                            <li><Link to="/shop?category=rings" className="hover:text-[#C8107E] transition-colors">Rings</Link></li>
                            <li><Link to="/shop?category=cut-stones" className="hover:text-[#C8107E] transition-colors">Cut Stones</Link></li>
                            <li><Link to="/shop?category=rough-stones" className="hover:text-[#C8107E] transition-colors">Rough Stones</Link></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div className="flex flex-col gap-4 border-gray-100 md:pl-8">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Information</h4>
                        <ul className="text-[#747986] space-y-3 text-sm font-medium">
                            {/* <li><Link to="/terms" className="hover:text-[#C8107E] transition-colors">Privacy Policy</Link></li> */}
                            <li><Link to="/terms" className="hover:text-[#C8107E] transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/aboutUs" className="hover:text-[#C8107E] transition-colors">About Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Copyright & Socials */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[#747986] text-sm">
                        &copy; {new Date().getFullYear()} All Rights Reserved - Good Developers 24
                    </p>
                    <div className="flex gap-4">
                        <SocialIcon link="https://github.com/FaiziCodeSpace" label="GitHub">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </SocialIcon>
                        <SocialIcon link="https://www.linkedin.com/in/faizan-k-a62526375/" label="LinkedIn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </SocialIcon>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ children, link, label }) {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-[#C8107E] hover:text-white hover:border-[#C8107E] transition-all cursor-pointer"
        >
            {children}
        </a>
    );
}