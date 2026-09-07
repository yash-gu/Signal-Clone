"use client";
import { useState, useRef, useEffect } from "react";
import ComposeModal from "@/components/modals/ComposeModal";
import LinkedDevicesModal from "@/components/modals/LinkedDevicesModal";

export default function SidebarHeader() {
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLinkedDevices, setShowLinkedDevices] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <header className="px-4 py-3 h-14 flex items-center justify-between z-20 relative">
      <div className="flex items-center gap-4">
        {/* Profile Hamburger */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors" 
            title="Menu"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2a2b2e] flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute top-10 left-0 w-56 bg-white dark:bg-[#202124] rounded-xl shadow-lg border border-slate-200 dark:border-neutral-800 py-2 z-50">
              <button 
                className="w-full px-4 py-2 text-left flex items-center gap-3 text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-[#2a2b2e] transition-colors"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowLinkedDevices(true);
                }}
              >
                <span className="material-symbols-outlined text-[18px]">devices</span>
                Linked Devices
              </button>
              <button 
                className="w-full px-4 py-2 text-left flex items-center gap-3 text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-[#2a2b2e] transition-colors"
                onClick={() => {
                  setShowProfileMenu(false);
                  alert("Settings coming soon!");
                }}
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
              </button>
              <div className="h-px bg-slate-100 dark:bg-neutral-800 my-1 mx-2"></div>
            </div>
          )}
        </div>
        <h1 className="text-slate-900 dark:text-white font-semibold text-xl">Chats</h1>
      </div>

      <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 relative">
        <button onClick={() => setShowComposeModal(true)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-[#2a2b2e] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" title="New Message">
          <span className="material-symbols-outlined text-[20px]">edit_square</span>
        </button>
      </div>

      {showComposeModal && <ComposeModal onClose={() => setShowComposeModal(false)} />}
      {showLinkedDevices && <LinkedDevicesModal onClose={() => setShowLinkedDevices(false)} />}
    </header>
  );
}
