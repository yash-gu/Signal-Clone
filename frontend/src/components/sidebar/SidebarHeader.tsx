"use client";
import { useState } from "react";
import ComposeModal from "@/components/modals/ComposeModal";

export default function SidebarHeader() {
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <header className="px-4 py-3 h-14 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        {/* Profile Hamburger */}
        <button className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Menu">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2a2b2e] flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
        </button>
        <h1 className="text-slate-900 dark:text-white font-semibold text-xl">Chats</h1>
      </div>

      <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 relative">
        <button onClick={() => setShowComposeModal(true)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-[#2a2b2e] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" title="New Message">
          <span className="material-symbols-outlined text-[20px]">edit_square</span>
        </button>
        <button onClick={() => setShowDropdown(!showDropdown)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-[#2a2b2e] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" title="More options">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
        
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
            <div className="absolute right-0 top-10 w-48 bg-white dark:bg-[#202124] border border-slate-200 dark:border-neutral-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-[#2a2b2e] flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-[#2a2b2e] flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                Profile
              </button>
              <div className="h-px bg-slate-200 dark:bg-neutral-800 my-1"></div>
              <button 
                onClick={() => {
                  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  window.location.reload();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Log Out
              </button>
            </div>
          </>
        )}
      </div>

      {showComposeModal && <ComposeModal onClose={() => setShowComposeModal(false)} />}
    </header>
  );
}
