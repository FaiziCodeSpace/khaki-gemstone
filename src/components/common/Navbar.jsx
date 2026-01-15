import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService"
import useCartCount from "../../hooks/cartCount"

export function Navbar() {
  const [menu, setMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const cartCount = useCartCount(); 

  // Check auth status on route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    closeMenu();
    navigate("/login");
  };

  const closeMenu = () => setMenu(false);

  const hiddenPages = ["/login", "/register", "/signup"];
  if (hiddenPages.includes(path)) return null;

  const isDarkGray = path.includes("/product/") || path === "/cart";
  const themeColor = isDarkGray ? "#4B4B4B" : "#FFFFFF";
  const iconBg = isDarkGray ? "white" : "rgba(255, 255, 255, 0.3)";
  const borderColor = isDarkGray ? "border-[#4B4B4B]/20" : "border-white/20";

  return (
    <nav className="absolute top-0 left-0 w-full z-20">
      <div className="pt-5.5 px-6 md:px-[50px] flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="inline-block" onClick={closeMenu}>
          <img
            className="w-[110px] md:w-[130px] transition-all duration-300"
            src="./Logos/Logo-svg.svg"
            alt="logo"
            style={{
              filter: isDarkGray
                ? "invert(70%) sepia(0%) saturate(0%) hue-rotate(164deg) brightness(96%) contrast(88%)"
                : "none"
            }}
          />
        </Link>

        {/* Menu Toggle */}
        <div className="flex relative justify-center">
          <button onClick={() => setMenu(!menu)} className="z-30 focus:outline-none">
            <div className="relative w-6 h-4">
              <span style={{ backgroundColor: themeColor }} className={`absolute block h-0.5 w-full transition-all duration-300 ${menu ? 'top-2 rotate-45' : 'top-0'}`}></span>
              <span style={{ backgroundColor: themeColor }} className={`absolute block h-0.5 w-full top-2 transition-all duration-300 ${menu ? 'opacity-0' : 'opacity-100'}`}></span>
              <span style={{ backgroundColor: themeColor }} className={`absolute block h-0.5 w-full transition-all duration-300 ${menu ? 'top-2 -rotate-45' : 'top-4'}`}></span>
            </div>
          </button>

          {/* Dropdown Menu */}
          <ul className={`flex flex-col text-nowrap top-12 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 text-center absolute px-6 py-4 bg-[#000000a6] backdrop-blur-xl rounded-[25px] text-white font-normal gap-1 border border-white/10 transition-all duration-300 ease-in-out origin-top ${menu ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"} min-w-[220px] shadow-2xl`}>
            
            <li className="border-b-[0.5px] text-[17px] py-3 border-white/10 hover:text-gray-300">
              <Link to="/shop" onClick={closeMenu} className="block w-full">Shop</Link>
            </li>

            <li className="border-b-[0.5px] text-[17px] py-3 border-white/10 hover:text-gray-300">
              <Link to="/investor" onClick={closeMenu} className="block w-full">Join as Investor</Link>
            </li>

            {isLoggedIn ? (
              <li className="border-b-[0.5px] text-[17px] py-3 border-white/10 hover:text-red-400 cursor-pointer" onClick={handleLogout}>
                Logout
              </li>
            ) : (
              <li className="border-b-[0.5px] text-[17px] py-3 border-white/10 hover:text-gray-300">
                <Link to="/login" onClick={closeMenu} className="block w-full">Login || Sign up</Link>
              </li>
            )}

            <li className="text-[17px] py-3 hover:text-gray-300">
              <Link to="/about" onClick={closeMenu} className="block w-full">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Icons */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/cart" className="flex items-center gap-4">
    <button style={{ backgroundColor: iconBg }} className="rounded-full p-3 transition-colors">
      <img src="./Icons/bag.svg" alt="bag" style={{ filter: isDarkGray ? "invert(70%)" : "none" }} />
    </button>
    {/* 3. Use the dynamic count */}
    <p style={{ color: themeColor }} className="font-semibold transition-colors">
      CART ({cartCount})
    </p>
  </Link>
        </div>
      </div>
      <hr className={`border-t-2 border-dashed mt-4 mx-6 md:mx-[50px] transition-colors ${borderColor}`} />
    </nav>
  );
}