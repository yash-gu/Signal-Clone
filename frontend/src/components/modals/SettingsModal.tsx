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
              <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-10">
                  <div className="w-24 h-24 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl font-medium mb-3">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      displayName.substring(0, 2).toUpperCase() || "YG"
                    )}
                  </div>
                  <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium rounded-full">
                    Edit photo
                  </button>
                </div>

                {/* Profile Info Section */}
                <div className="w-full max-w-xl self-start">
                  <div className="flex items-center gap-4 text-white mb-6">
                    <span className="material-symbols-outlined text-[24px] text-neutral-400">person</span>
                    <span className="text-[15px]">{displayName || "Yash Gupta"}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-white mb-4">
                    <span className="material-symbols-outlined text-[24px] text-neutral-400">edit</span>
                    <span className="text-[15px]">About</span>
                  </div>
                  
                  <div className="text-neutral-400 text-sm mb-8 pl-10">
                    Your profile and changes to it will be visible to people you message, contacts and groups.
                  </div>

                  <div className="h-px bg-neutral-800 w-full mb-8"></div>

                  <div className="flex items-center gap-4 text-white mb-4">
                    <span className="material-symbols-outlined text-[24px] text-neutral-400">alternate_email</span>
                    <span className="text-[15px]">{user?.username || "Username"}</span>
                  </div>
                  
                  <div className="text-neutral-400 text-sm pl-10">
                    People can now message you using your optional username so you don't have to give out your phone number.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="w-full max-w-2xl mx-auto mt-4">
                <div className="bg-[#1e1e1e] border border-neutral-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors border-b border-neutral-800">
                    <div className="flex items-center gap-4 text-white">
                      <span className="material-symbols-outlined text-[20px] text-neutral-400">language</span>
                      <span className="text-[15px]">Language</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400 text-sm">
                      System Language
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors border-b border-neutral-800">
                    <div className="flex items-center gap-4 text-white">
                      <span className="material-symbols-outlined text-[20px] text-neutral-400">contrast</span>
                      <span className="text-[15px]">Theme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-white/10 rounded-full flex items-center gap-2 text-sm text-white">
                        System
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors border-b border-neutral-800">
                    <div className="flex items-center gap-4 text-white">
                      <span className="material-symbols-outlined text-[20px] text-neutral-400">palette</span>
                      <span className="text-[15px]">Chat color</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4 text-white">
                      <span className="material-symbols-outlined text-[20px] text-neutral-400">zoom_in</span>
                      <span className="text-[15px]">Zoom level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-white/10 rounded-full flex items-center gap-2 text-sm text-white">
                        100%
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                      </div>
                    </div>
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
