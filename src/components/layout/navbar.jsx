export function Navbar() {
  return (
    <nav className="absolute bg-gray-300 top-0 left-0 w-full z-20">
      <div className="pt-5.5 px-[50px] flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="inline-block">
          <img
            className="w-[120px]"
            src="./Logos/white-logo.png"
            alt="white-logo"
          />
        </a>

        {/* Menu Icon */}
        <button
          type="button"
          className="w-[22px] focus:outline-none cursor-pointer"
          onClick={() => console.log("Menu clicked")}
        >
          <img
            src="./Icons/menu.svg"
            alt="menu-icon"
          />
        </button>

        {/* Cart Icon */}
        <div className="hidden md:flex gap-4 justify-between items-center">
           <button className="bg-[rgb(255,255,255,0.33)] rounded-full cursor-pointer"><img className="p-3" src="./Icons/heart.svg" alt="heart-icon" /></button>
           <button className="bg-[rgb(255,255,255,0.33)] rounded-full cursor-pointer"><img className="p-3" src="./Icons/bag.svg" alt="bag-icon" /></button>
           <p className="text-white font-semibold">CART (1)</p>
        </div>
      </div>

      {/* Dashed divider */}
      <hr className="border-t-2 border-dashed border-gray-100 opacity-30 mt-4" />
    </nav>
  );
}