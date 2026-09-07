export default function ChatHeader() {
  return (
    <header className="h-16 px-space-xl bg-surface-container-lowest flex items-center justify-between shadow-xs z-20 relative">
      <div className="flex items-center gap-space-md min-w-0">
        <div className="relative flex-shrink-0 cursor-pointer">
          <img 
            className="w-10 h-10 rounded-full object-cover shadow-xs" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP9W9D4ugnbgtgVW7yIJ4Yzhq58lOdhXJILVmYh5ySRkXuWHiXKK8sekoWWzSP_7Bdn6UL5IYpmD7tQiE3GzuEJXUe69DHoRambpdC124hHyRynFsayqnrBRwo292lHF3uLQXzDaDrSm-7ronVp7rNbwZQVl4mD8KluHILonvCcnpI-pANIgwlEsCBRqUOrAmRMhQAkxx0x9h8SoZVtquTvkV2tN4W6DnEj1EXPMJ8lmrkDvav8IXd" 
            alt="Contact Profile"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface-container-lowest"></span>
        </div>
        <div className="flex flex-col min-w-0 cursor-pointer">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">Alex Rivera</span>
            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }} title="Verified Safety Number">verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal truncate">
              online <span className="text-outline-variant">•</span> end-to-end encrypted
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-space-xs text-on-surface-variant">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors text-outline cursor-not-allowed opacity-60" title="Audio Call (Unavailable)">
          <span className="material-symbols-outlined text-xl">call</span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors text-outline cursor-not-allowed opacity-60" title="Video Call (Unavailable)">
          <span className="material-symbols-outlined text-xl">videocam</span>
        </button>
        <div className="w-px h-5 bg-surface-container-high mx-space-xs"></div>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer" title="Search in Conversation">
          <span className="material-symbols-outlined text-xl">search</span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer" title="Settings">
          <span className="material-symbols-outlined text-xl">more_vert</span>
        </button>
      </div>
    </header>
  );
}
