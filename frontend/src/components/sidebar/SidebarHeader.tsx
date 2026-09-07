"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import CreateGroupModal from "@/components/modals/CreateGroupModal";

export default function SidebarHeader() {
  const { user, logout } = useAuth();
  const displayName = user?.display_name || user?.username || "Unknown User";
  const [showGroupModal, setShowGroupModal] = useState(false);
  
  return (
    <header className="px-space-md py-space-sm h-16 flex items-center justify-between z-20">
      <div className="flex items-center gap-space-sm min-w-0">
        <div className="relative cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary font-headline-sm text-headline-sm flex items-center justify-center shadow-xs border border-outline-variant/20 overflow-hidden">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface-container-lowest"></span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-headline-sm text-headline-sm text-on-surface truncate pr-2">
            {displayName}
          </span>
          <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Encrypted Session
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-on-surface-variant">
        <button onClick={() => alert("Linked Devices coming soon!")} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer" title="Linked Devices">
          <span className="material-symbols-outlined text-[1.375rem]">devices</span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer" title="New Message">
          <span className="material-symbols-outlined text-[1.375rem]">edit_square</span>
        </button>
        <button onClick={() => setShowGroupModal(true)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer" title="New Group">
          <span className="material-symbols-outlined text-[1.375rem]">group_add</span>
        </button>
        <button onClick={logout} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-high hover:text-error transition-colors cursor-pointer" title="Logout">
          <span className="material-symbols-outlined text-[1.375rem]">logout</span>
        </button>
      </div>

      {showGroupModal && <CreateGroupModal onClose={() => setShowGroupModal(false)} />}
    </header>
  );
}
