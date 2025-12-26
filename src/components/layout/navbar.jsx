export function Navbar() {
  return (
    <>
      <section className="pt-[15px] px-[30px] flex justify-between items-center z-20 relative">
        {/* Logo as link */}
        <a href="/" className="inline-block">
          <img
            className="w-[120px]"
            src="./Logos/white-logo.png"
            alt="white-logo"
          />
        </a>

        {/* Menu icon as button */}
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
      </section>

      {/* Dashed divider */}
      <hr className="border-t-2 border-dashed border-gray-100 opacity-30 my-4" />
    </>
  );
}
