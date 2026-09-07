"use client";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LeftRail() {
  return (
    <aside className="w-14 shrink-0 flex flex-col justify-between items-center py-4 bg-slate-100 dark:bg-[#18181b] border-r border-slate-200 dark:border-neutral-800 z-40 h-full">
      <nav className="w-full flex flex-col items-center gap-2 mt-2">
        {/* Active Chat Icon */}
        <button className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 flex items-center justify-center shadow-sm transition-transform active:scale-95" title="Chats">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
        </button>
        
        {/* Calls Icon */}
        <button onClick={() => alert("Calls coming soon!")} className="w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center" title="Calls">
          <span className="material-symbols-outlined text-[20px]">call</span>
        </button>

        {/* Stories Icon */}
        <button onClick={() => alert("Stories feature coming soon!")} className="w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center relative" title="Stories">
          <span className="material-symbols-outlined text-[20px]">data_usage</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#2C6BED] rounded-full border border-slate-100 dark:border-[#18181b]"></span>
        </button>
      </nav>

      <div className="flex flex-col items-center gap-2 mb-2">
        <ThemeToggle />
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer" onClick={() => alert("Settings coming soon!")} title="Settings">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>
    </aside>
  );
}
