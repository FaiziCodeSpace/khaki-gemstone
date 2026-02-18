import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import useCartCount from "../../hooks/cartCount";

export function Navbar() {
  const [menu, setMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const cartCount = useCartCount();

  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLoggedIn(!!token);
    setUser(storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
      }
    };

    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUser(null);
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
  const accentColor = "#CA0A7F";

 // Inside Navbar.js
const getInvestorLink = () => {
  if (!isLoggedIn || !user) {
    return { text: "Join as Investor", path: "/investor-register" };
  }

  const status = user.status || user.investor?.status;
  if (status === "approved") {
    return { text: "Investor Portal", path: "/investor/dashboard", disabled: false };
  }
  if (status === "pending") {
    return { text: "Application Submitted", path: "/investor-application-submitted", disabled: false };
  }
  return { text: "Join as Investor", path: "/investor-register", disabled: false };
};
  const investorLink = getInvestorLink();

  return (
    <nav className="absolute top-0 left-0 w-full z-20">
      <div className="pt-5.5 px-6 md:px-[50px] flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="inline-block" onClick={closeMenu}>
          <img
            className="w-27.5 md:w-32.5 transition-all duration-300"
            src="./Logos/Logo-svg.svg"
            alt="logo"
            style={{
              filter: isDarkGray
                ? "invert(70%) sepia(0%) saturate(0%) hue-rotate(164deg) brightness(96%) contrast(88%)"
                : "none"
            }}
          />
        </Link>

        {/* Menu Toggle & Dropdown */}
        <div className="flex relative justify-center" ref={menuRef}>
          <button onClick={() => setMenu(!menu)} className="z-30 focus:outline-none cursor-pointer p-2">
            <div className="relative w-6 h-4">
              <span style={{ backgroundColor: themeColor }} className={`absolute block h-0.5 w-full transition-all duration-300 ${menu ? 'top-2 rotate-45' : 'top-0'}`}></span>
              <span style={{ backgroundColor: themeColor }} className={`absolute block h-0.5 w-full top-2 transition-all duration-300 ${menu ? 'opacity-0' : 'opacity-100'}`}></span>
              <span style={{ backgroundColor: themeColor }} className={`absolute block h-0.5 w-full transition-all duration-300 ${menu ? 'top-2 -rotate-45' : 'top-4'}`}></span>
            </div>
          </button>

          <ul className={`flex flex-col text-nowrap top-14 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 text-center absolute px-2 py-4 bg-[#000000ce] backdrop-blur-2xl rounded-[20px] text-white font-normal border border-white/10 transition-all duration-300 ease-in-out origin-top z-40 ${menu ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"} min-w-60 shadow-2xl`}>

            {/* MOBILE ONLY CART LINK */}
            <li className="md:hidden text-[16px] transition-colors duration-200">
              <Link to="/cart" onClick={closeMenu} className="flex items-center justify-center gap-3 w-full py-3 px-6 text-[#CA0A7F] font-bold">
                <img src="./Icons/bag.svg" alt="bag" className="w-5 h-5 invert" />
                MY CART ({cartCount})
              </Link>
            </li>

            <li className="text-[16px] border-t border-white/5 transition-colors duration-200">
              <Link to="/shop" onClick={closeMenu} className="block w-full py-3 px-6 hover:text-[#CA0A7F]">Shop</Link>
            </li>

            <li className="text-[16px] border-t border-white/5 transition-colors duration-200">
              <Link
                to={investorLink.path}
                onClick={(e) => {
                  if (investorLink.disabled) e.preventDefault();
                  closeMenu();
                }}
                className={`block w-full py-3 px-6 hover:text-[#CA0A7F] ${investorLink.disabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {investorLink.text}
              </Link>
            </li>

            <li className="text-[16px] border-t border-white/5 transition-colors duration-200">
              <Link to="/aboutUs" onClick={closeMenu} className="block w-full py-3 px-6 hover:text-[#CA0A7F]">About Us</Link>
            </li>

            <li className="text-[16px] border-t border-white/5 transition-colors duration-200">
              <Link to="/terms" onClick={closeMenu} className="block w-full py-3 px-6 hover:text-[#CA0A7F]">Terms & Conditions</Link>
            </li>

            {isLoggedIn ? (
              <li className="text-[16px] border-t border-white/5 py-3 px-6 hover:text-red-500 cursor-pointer transition-colors duration-200" onClick={handleLogout}>
                Logout
              </li>
            ) : (
              <li className="text-[16px] border-t border-white/5 transition-colors duration-200">
                <Link to="/login" onClick={closeMenu} className="block w-full py-3 px-6 hover:text-[#CA0A7F]">Login || Sign up</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Desktop Icons Only */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/cart" className="flex items-center gap-4 group">
            <button style={{ backgroundColor: iconBg }} className="rounded-full p-3 transition-transform duration-300 group-hover:scale-110">
              <img src="./Icons/bag.svg" alt="bag" style={{ filter: isDarkGray ? "invert(70%)" : "none" }} />
            </button>
            <p style={{ color: themeColor }} className="font-semibold transition-colors group-hover:opacity-70">
              CART ({cartCount})
            </p>
          </Link>
        </div>
      </div>
      <hr className={`border-t-2 border-dashed mt-4 mx-6 md:mx-[50px] transition-colors ${borderColor}`} />
    </nav>
  );
}