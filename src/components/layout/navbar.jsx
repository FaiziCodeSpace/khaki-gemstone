import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link

export function Navbar() {
  const [menu, setMenu] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setMenu(false);

  return (
    <nav className="absolute top-0 left-0 w-full z-20">
      <div className="pt-5.5 px-6 md:px-[50px] flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="inline-block" onClick={closeMenu}>
          <img
            className="w-[110px] md:w-[130px]"
            src="./Logos/white-logo.png"
            alt="white-logo"
          />
        </Link>

        {/* The Menu Toggle */}
        <div className="flex relative justify-center">
          <button
            type="button"
            className="flex w-[24px] h-[24px] focus:outline-none justify-center items-center cursor-pointer z-30"
            onClick={() => setMenu(!menu)}
          >
            <div className="relative w-6 h-4">
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-300 ${menu ? 'top-2 rotate-45' : 'top-0'}`}></span>
              <span className={`absolute block h-0.5 w-full bg-white top-2 transition-all duration-300 ${menu ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-300 ${menu ? 'top-2 -rotate-45' : 'top-4'}`}></span>
            </div>
          </button>

          {/* Floating Dropdown Menu */}
          <ul
            className={`
              flex flex-col text-nowrap top-12 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 
              text-center absolute px-6 py-4 bg-[#000000a6] backdrop-blur-xl 
              rounded-[25px] text-white font-normal gap-1 border border-white/10
              transition-all duration-300 ease-in-out origin-top
              ${menu 
                ? "opacity-100 scale-100 translate-y-0 visible" 
                : "opacity-0 scale-95 -translate-y-4 invisible"
              }
              min-w-[220px] shadow-2xl
            `}
          >
            <li className="border-b-[0.5px] text-[17px] py-3 border-white/10 hover:text-gray-300 cursor-pointer transition-colors">
              <Link to="/shop" onClick={closeMenu} className="block w-full">Shop</Link>
            </li>
            
            <li className="md:hidden border-b-[0.5px] text-[17px] py-3 border-white/10 hover:text-gray-300 cursor-pointer">
              <Link to="/cart" onClick={closeMenu} className="block w-full">Cart</Link>
            </li>
            
            <li className="border-b-[0.5px] text-[17px] py-3 border-white/10 hover:text-gray-300 cursor-pointer">
              <Link to="/login" onClick={closeMenu} className="block w-full">Join as Investor</Link>
            </li>

            <li className="border-b-[0.5px] text-[17px] py-3 border-white/10 hover:text-gray-300 cursor-pointer">
              <Link to="/login" onClick={closeMenu} className="block w-full">Login || Sign up</Link>
            </li>

            <li className="text-[17px] py-3 hover:text-gray-300 cursor-pointer">
              <Link to="/about" onClick={closeMenu} className="block w-full">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Cart Icon (Desktop) */}
        <div className="hidden md:flex gap-4 justify-between items-center">
          <button className="bg-[rgb(255,255,255,0.33)] rounded-full cursor-pointer">
            <img className="p-3" src="./Icons/heart.svg" alt="heart-icon" />
          </button>

          <Link to="/cart" className="flex items-center gap-4">
            <button className="bg-[rgb(255,255,255,0.33)] rounded-full cursor-pointer">
              <img className="p-3" src="./Icons/bag.svg" alt="bag-icon" />
            </button>
            <p className="text-white font-semibold text-nowrap">CART (1)</p>
          </Link>
        </div>
      </div>

      <hr className="border-t-2 border-dashed border-white/20 mt-4 mx-6 md:mx-[50px]" />
    </nav>
  );
}