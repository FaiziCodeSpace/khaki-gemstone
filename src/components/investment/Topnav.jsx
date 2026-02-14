import { Bell } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm">
      {/* Left Section: Logo & Brand */}
      <div className="flex items-center gap-5 md:ml-0">
        <img 
          src="/Logos/logo.png" 
          alt="Logo" 
          className="hidden md:block w-20 object-contain" 
        />
        <h1 className="hidden md:block text-xl font-bold text-[#CA0A7C] md:text-2xl">
          INVESTOR PORTAL
        </h1>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <Bell className="size-6 md:size-7.5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#CA0A7C] text-[10px] font-bold text-white">
            1
          </span>
        </div>

       
      </div>
    </nav>
  );
}