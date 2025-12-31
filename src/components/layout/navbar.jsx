export function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-20">
      <div className="pt-[15px] px-[30px] flex justify-between items-center">
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
      </div>

      {/* Dashed divider */}
      <hr className="border-t-2 border-dashed border-gray-100 opacity-30 mt-4" />
    </nav>
  );
}