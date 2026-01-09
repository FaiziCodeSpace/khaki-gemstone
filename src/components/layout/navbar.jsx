import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const closeMenu = () => setMenu(false);

  // 1. Condition: Hide Navbar on Login and Registration
  const hiddenPages = ["/login", "/register", "/signup"];
  if (hiddenPages.includes(path)) {
    return null;
  }

  // 2. Condition: Identify "Dark Gray" pages
  // Default is white. ProductDetail (e.g., /product/123) and Cart use #4B4B4B
  const isDarkGray = path.includes("/product/") || path === "/cart";

  // 3. Dynamic Styles
  const themeColor = isDarkGray ? "#4B4B4B" : "#FFFFFF";
  const iconBg = isDarkGray ? "white" : "rgba(255, 255, 255, 0.3)";
  const borderColor = isDarkGray ? "border-[#4B4B4B]/20" : "border-white/20";

  return (
    <nav className="absolute top-0 left-0 w-full z-20">
      <div className="pt-5.5 px-6 md:px-[50px] flex justify-between items-center">

        {/* Logo - Using CSS filter to change SVG color dynamically */}
        <Link to="/" className="inline-block" onClick={closeMenu}>
          <img
            className="w-[110px] md:w-[130px] transition-all duration-300"
            src="./Logos/Logo-svg.svg"
            alt="logo"
            style={{
              // This filter converts white SVG to #4B4B4B (approx)
              filter: isDarkGray
                ? "invert(70%) sepia(0%) saturate(0%) hue-rotate(164deg) brightness(96%) contrast(88%)"
                : "none"
            }}
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
              <span
                style={{ backgroundColor: themeColor }}
                className={`absolute block h-0.5 w-full transition-all duration-300 ${menu ? 'top-2 rotate-45' : 'top-0'}`}
              ></span>
              <span
                style={{ backgroundColor: themeColor }}
                className={`absolute block h-0.5 w-full top-2 transition-all duration-300 ${menu ? 'opacity-0' : 'opacity-100'}`}
              ></span>
              <span
                style={{ backgroundColor: themeColor }}
                className={`absolute block h-0.5 w-full transition-all duration-300 ${menu ? 'top-2 -rotate-45' : 'top-4'}`}
              ></span>
            </div>
          </button>

          {/* Floating Dropdown Menu (Fixed Dark Background for visibility) */}
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

        {/* Icons & Text */}
        <div className="hidden md:flex gap-4 justify-between items-center">
          <button style={{ backgroundColor: iconBg }} className="rounded-full cursor-pointer transition-colors"
          >
            <img
              className="p-3"
              src="./Icons/heart.svg"
              alt="heart-icon"
              style={{ filter: isDarkGray ? "invert(70%)" : "none" }}
            />
          </button>

          <Link to="/cart" className="flex items-center gap-4">
            <button style={{ backgroundColor: iconBg }} className="rounded-full cursor-pointer transition-colors">
              <img
                className="p-3"
                src="./Icons/bag.svg"
                alt="bag-icon"
                style={{ filter: isDarkGray ? "invert(70%)" : "none" }}
              />
            </button>
            <p style={{ color: themeColor }} className="font-semibold text-nowrap transition-colors">
              CART (1)
            </p>
          </Link>
        </div>
      </div>

      <hr className={`border-t-2 border-dashed mt-4 mx-6 md:mx-[50px] transition-colors ${borderColor}`} />
    </nav>
  );
}