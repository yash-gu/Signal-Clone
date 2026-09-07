"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || "");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#202124] rounded-2xl w-full max-w-3xl h-[80vh] shadow-2xl flex overflow-hidden border border-slate-200 dark:border-neutral-800">
        
        {/* Settings Sidebar */}
        <div className="w-64 bg-slate-50 dark:bg-[#18181b] border-r border-slate-200 dark:border-neutral-800 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2C6BED] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {displayName.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-slate-900 dark:text-white truncate">{displayName || "User"}</span>
              <span className="text-xs text-slate-500 dark:text-neutral-500 truncate">{user?.phone_number || "Signal User"}</span>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            <button 
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'account' ? 'bg-slate-200 dark:bg-[#2a2b2e] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-[#2a2b2e]/50 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">person</span> Account
            </button>
            <button 
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-slate-200 dark:bg-[#2a2b2e] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-[#2a2b2e]/50 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">palette</span> Appearance
            </button>
            <button 
              onClick={() => setActiveTab("privacy")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'privacy' ? 'bg-slate-200 dark:bg-[#2a2b2e] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-[#2a2b2e]/50 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">lock</span> Privacy
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-slate-200 dark:bg-[#2a2b2e] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-[#2a2b2e]/50 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span> Notifications
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#202124]">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-neutral-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{activeTab} Settings</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#2e2f33] flex items-center justify-center text-slate-500 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto">
            {activeTab === "account" && (
              <div className="max-w-md space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Profile</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-full bg-[#2C6BED] text-white flex items-center justify-center font-bold text-2xl">
                        {displayName.charAt(0).toUpperCase() || "S"}
                       </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Display Name</label>
                      <input 
                        type="text" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2C6BED]/50 transition-all" 
                      />
                    </div>
                  </div>
                </div>
                
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="max-w-md space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Theme</h3>
                  <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Dark Mode</div>
                      <div className="text-sm text-slate-500 dark:text-neutral-400">Toggle dark and light theme</div>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="max-w-md space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Messaging</h3>
                  <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-neutral-800 rounded-xl divide-y divide-slate-200 dark:divide-neutral-800">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">Read Receipts</div>
                        <div className="text-sm text-slate-500 dark:text-neutral-400 mt-1">If read receipts are disabled, you won't be able to see read receipts from others.</div>
                      </div>
                      <div className="w-10 h-6 bg-[#2C6BED] rounded-full relative ml-4 shrink-0 opacity-50 cursor-not-allowed">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">Typing Indicators</div>
                        <div className="text-sm text-slate-500 dark:text-neutral-400 mt-1">See and share when messages are being typed.</div>
                      </div>
                      <div className="w-10 h-6 bg-[#2C6BED] rounded-full relative ml-4 shrink-0 opacity-50 cursor-not-allowed">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="max-w-md space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded-xl text-sm font-medium flex gap-3">
                  <span className="material-symbols-outlined">construction</span>
                  Notification settings are coming soon.
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
