export default function SidebarHeader() {
  return (
    <div className="h-16 px-space-base flex items-center justify-between bg-surface-container-lowest">
      <div className="flex items-center gap-space-md">
        <div className="relative">
          <img 
            className="w-10 h-10 rounded-full object-cover shadow-xs" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwRMEmqQN1lFA6tu5de-Xaf9u5ZnTMK6bdgBmmkL4W0aOGCpcZAdnlQd9VjcfssWUQcottGAaueBUedelodwXnFKDuxd1K1A77V6WSYNO9QfNrN4WLzoR5Ujid30bIXU0qaTS8jcEgyDwdHlTPOPPL9aTMgV_bmeSzyv0eF2KTD9Ws_aLvZd_DDXSD-1DlpYwvavtoC2O6FNkclZKcIhi5PV9gVAyt1mYcY6EB2zTjJXC42UnQ90t9" 
            alt="Profile"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full shadow-xs"></span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-headline-sm text-headline-sm text-on-surface truncate">Sarah Chen</span>
          <span className="font-timestamp text-timestamp text-secondary flex items-center gap-space-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse"></span>
            Encrypted Session
          </span>
        </div>
      </div>
      <div className="flex items-center gap-space-xs text-on-surface-variant">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer" title="New Chat">
          <span className="material-symbols-outlined text-lg">edit_square</span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer" title="New Group">
          <span className="material-symbols-outlined text-lg">group_add</span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer" title="More Options">
          <span className="material-symbols-outlined text-lg">more_vert</span>
        </button>
      </div>
    </div>
  );
}
