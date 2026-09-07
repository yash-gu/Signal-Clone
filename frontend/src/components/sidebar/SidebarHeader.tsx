"use client";
import { useUI } from "@/context/UIContext";

interface SidebarHeaderProps {
  onNewChat: () => void;
}

export default function SidebarHeader({ onNewChat }: SidebarHeaderProps) {
  const { isLeftRailVisible, toggleLeftRail } = useUI();


  return (
    <header className={`px-4 py-3 ${isLeftRailVisible ? 'h-12' : 'h-14'} flex items-center justify-between z-20 relative`}>
      <div className="flex items-center gap-4">
        {!isLeftRailVisible && (
          <div className="relative">
            <button 
              onClick={toggleLeftRail}
              className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#2a2b2e]" 
              title="Show Tabs"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          </div>
        )}
        {!isLeftRailVisible && (
          <h1 className="text-slate-900 dark:text-white font-semibold text-lg">Chats</h1>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 relative ml-auto">
        <button onClick={onNewChat} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-[#2a2b2e] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" title="New Message">
          <span className="material-symbols-outlined text-[18px]">edit_square</span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-[#2a2b2e] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" title="More">
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>
      </div>

    </header>
  );
}
