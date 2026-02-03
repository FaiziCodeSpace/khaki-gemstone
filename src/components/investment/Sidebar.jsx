import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import {
  LayoutDashboard,
  Package,
  FileText,
  Wallet,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    logoutUser();         
    setIsOpen(false);      
    navigate("/investor-login", { replace: true });   
  };

  return (
    <>
      {/* --- MOBILE HAMBURGER --- */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-2 left-4 z-30 p-2.5 md:hidden"
        >
          <Menu size={24} className="text-[#3F3F46]" />
        </button>
      )}

      {/* --- BACKDROP --- */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        w-[280px] fixed md:relative z-50
        h-full p-4 md:p-6  
        top-0 md:top-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}>

        {/* The Actual Sidebar Card */}
        <div className="h-full w-full bg-white flex flex-col justify-between rounded-2xl px-4 py-6 shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center justify-between mb-6 md:hidden">
              <span className="text-[#CA0A7F] text-xl px-2 font-bold">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2"><X size={24} /></button>
            </div>

            <ul className="space-y-2 text-[#3F3F46]">
              <SidebarItem onClick={() => setIsOpen(false)} to="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <SidebarItem onClick={() => setIsOpen(false)} to="products" icon={Package} label="Products" />
              <SidebarItem onClick={() => setIsOpen(false)} to="policy" icon={FileText} label="Terms & Policy" />
              <SidebarItem onClick={() => setIsOpen(false)} to="wallet" icon={Wallet} label="My Wallet" />
            </ul>
          </div>

          <div>
            <ul className="space-y-2 pt-4 border-t border-gray-100">
              {/* Logout */}
              <SidebarItem onClick={handleLogout} icon={LogOut} label="Logout" />
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon: Icon, label, to, onClick }) {
  const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] transition-all duration-200 cursor-pointer";
  const activeClass = "bg-[#CA0A7F] text-white";
  const inactiveClass = "hover:bg-gray-50 text-[#3F3F46]";

  // 🔴 ACTION ITEM (Logout / Non-navigation)
  if (!to) {
    return (
      <li>
        <button
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          className={`${baseClass} ${inactiveClass} w-full text-left`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      </li>
    );
  }

  // 🟢 NAVIGATION ITEM
  return (
    <li>
      <NavLink
        onClick={onClick}
        to={`/investor/${to}`}
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