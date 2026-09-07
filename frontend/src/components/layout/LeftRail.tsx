"use client";
export default function LeftRail() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-16 bg-surface-container-low border-r border-outline-variant/30 flex flex-col items-center py-space-base z-40 justify-between">
      <nav className="flex-1 w-full flex flex-col items-center gap-space-sm pt-space-md">
        <button className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs transition-transform active:scale-95" title="Chats">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
        </button>
        
        <button onClick={() => alert("Stories feature coming soon!")} className="w-12 h-12 rounded-2xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all active:scale-95 flex items-center justify-center relative" title="Stories (Coming Soon)">
          <span className="material-symbols-outlined">data_usage</span>
          <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"></span>
        </button>
      </nav>
      <div className="flex flex-col items-center gap-space-sm">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer" onClick={() => alert("Settings coming soon!\\n- Privacy\\n- Notifications\\n- Appearance")}>
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </aside>
  );
}
