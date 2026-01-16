import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* --- HAMBURGER BUTTON (Hidden when menu is open) --- */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-6 left-6 z-30 p-2.5 bg-white rounded-xl shadow-lg md:hidden border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Menu size={24} className="text-[#3F3F46]" />
        </button>
      )}

      {/* --- BACKDROP --- */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} 
        onClick={() => setIsOpen(false)} 
      />

      {/* --- SIDEBAR --- */}
      <aside className={`
        /* Layout */
        w-[280px] fixed md:sticky top-0 md:top-4 z-50
        h-screen md:h-[calc(100vh-64px)] bg-white font-bold px-4 py-6 
        flex flex-col justify-between shadow-2xl md:shadow-sm
        
        /* Shape: Square on mobile (full height), Rounded on Desktop */
        md:rounded-2xl md:ml-6 md:mb-8
        
        /* Animation */
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}>
        
        <div>
          {/* Internal Close Button for Mobile */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <span className="text-[#CA0A7F] text-xl px-2">Menu</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-[#3F3F46]" />
            </button>
          </div>

          <ul className="space-y-2 text-[#3F3F46]">
            <SidebarItem onClick={() => setIsOpen(false)} to="/Home" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem onClick={() => setIsOpen(false)} to="/products" icon={Package} label="Products" />
            <SidebarItem onClick={() => setIsOpen(false)} to="/policy" icon={FileText} label="Terms & Policy" />
            <SidebarItem onClick={() => setIsOpen(false)} to="/wallet" icon={Wallet} label="My Wallet" />
          </ul>
        </div>

        <div>
          <ul className="space-y-2 pt-4 text-black border-t border-gray-100">
            <SidebarItem onClick={() => setIsOpen(false)} to="/settings" icon={Settings} label="Settings" />
            <SidebarItem onClick={() => setIsOpen(false)} to="/logout" icon={LogOut} label="Logout" />
          </ul>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon: Icon, label, to, onClick }) {
  const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] transition-all duration-200";
  const activeClass = "bg-[#CA0A7F] text-white shadow-md shadow-[#CA0A7F]/20"; 
  const inactiveClass = "hover:bg-gray-50 text-[#3F3F46]";

  return (
    <li>
      <NavLink 
        onClick={onClick}
        to={`/investor/dashboard${to}`} 
        className={({ isActive }) => 
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <Icon size={18} />
        <span>{label}</span>
      </NavLink>
    </li>
  );
}