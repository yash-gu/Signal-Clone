"use client";
import { useState } from "react";
import ComposeModal from "@/components/modals/ComposeModal";

export default function SidebarHeader() {
  const [showComposeModal, setShowComposeModal] = useState(false);
  
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
      </div>

      {showComposeModal && <ComposeModal onClose={() => setShowComposeModal(false)} />}
    </header>
  );
}
