"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

type AccountSubView = "main" | "name" | "about" | "username";

export default function SettingsView() {
  const { user, logout } = useAuth();
  const { setActiveView } = useUI();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [accountSubView, setAccountSubView] = useState<AccountSubView>("main");

  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [firstName, setFirstName] = useState("Yash");
  const [lastName, setLastName] = useState("Gupta");
  const [about, setAbout] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex w-full h-full bg-white dark:bg-[#121214]">
      {/* Settings Sidebar */}
      <div className="w-[320px] bg-slate-50 dark:bg-[#18181b] flex flex-col border-r border-slate-200 dark:border-neutral-800">
        <div className="p-4 flex items-center gap-4 text-slate-900 dark:text-white">
          <button 
            onClick={() => setActiveView("main")} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
          <span className="font-semibold text-lg">Settings</span>
        </div>
        
        <div className="px-4 pb-2">
          <button 
            onClick={() => {
              setActiveTab("profile");
              setAccountSubView("main");
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-slate-200 dark:bg-[#2a2b2e]' : 'bg-slate-100 dark:bg-[#202124] hover:bg-slate-200 dark:hover:bg-[#2a2b2e]'}`}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold text-lg shrink-0">
              {displayName.substring(0, 2).toUpperCase() || "YG"}
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className="font-medium text-slate-900 dark:text-white truncate w-full">{displayName || "Yash Gupta"}</span>
              <span className="text-xs text-slate-500 dark:text-neutral-400 truncate w-full">{user?.phone_number || "070148 64776"}</span>
            </div>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5`}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">settings</span> General
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === 'appearance' ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">brightness_medium</span> Appearance
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5`}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">chat_bubble</span> Chats
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5`}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">call</span> Calls
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5`}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">notifications</span> Notifications
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5`}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">lock</span> Privacy
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5`}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">data_usage</span> Data usage
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5`}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">history</span> Backups
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5`}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-neutral-400">favorite</span> Donate to Signal
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#121214]">
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="w-full h-full flex flex-col">
            {accountSubView === "main" && (
              <div className="w-full max-w-2xl mx-auto mt-12 flex flex-col items-center animate-in fade-in">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-10">
                  <div className="w-24 h-24 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl font-medium mb-3 cursor-pointer hover:opacity-90 transition-opacity">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      displayName.substring(0, 2).toUpperCase() || "YG"
                    )}
                  </div>
                </div>

                <div className="w-full max-w-xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                  <div 
                    onClick={() => setAccountSubView("name")}
                    className="flex items-center gap-4 text-slate-900 dark:text-white p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-200 dark:border-neutral-800"
                  >
                    <span className="material-symbols-outlined text-[24px] text-slate-400 dark:text-neutral-400">person</span>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium">{displayName || "Yash Gupta"}</span>
                      <span className="text-xs text-slate-500 dark:text-neutral-500">Name</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setAccountSubView("about")}
                    className="flex items-center gap-4 text-slate-900 dark:text-white p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-200 dark:border-neutral-800"
                  >
                    <span className="material-symbols-outlined text-[24px] text-slate-400 dark:text-neutral-400">edit</span>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium">Speak Freely</span>
                      <span className="text-xs text-slate-500 dark:text-neutral-500">About</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setAccountSubView("username")}
                    className="flex items-center gap-4 text-slate-900 dark:text-white p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[24px] text-slate-400 dark:text-neutral-400">alternate_email</span>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium">{user?.username || "Username"}</span>
                      <span className="text-xs text-slate-500 dark:text-neutral-500">People can now message you using your optional username so you don't have to give out your phone number.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {accountSubView === "name" && (
              <div className="flex flex-col w-full h-full">
                <div className="h-14 flex items-center px-4 shrink-0 bg-white dark:bg-[#18181b] border-b border-slate-200 dark:border-neutral-800 relative z-10">
                  <button 
                    onClick={() => setAccountSubView("main")}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors absolute left-4 text-slate-500 dark:text-neutral-400"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
                  </button>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white text-center w-full">Your Name</h2>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-[#121214] p-8 flex justify-center animate-in slide-in-from-right-4 duration-200">
                  <div className="w-full max-w-[500px]">
                    <div className="space-y-3 mb-6">
                      <div className="relative">
                        <input 
                          type="text" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-white dark:bg-[#202124] border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                          placeholder="First name"
                        />
                        {firstName && (
                          <button onClick={() => setFirstName("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-white dark:bg-[#202124] border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                          placeholder="Last name (optional)"
                        />
                        {lastName && (
                          <button onClick={() => setLastName("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setAccountSubView("main")} className="px-5 py-2 rounded-full bg-slate-200 dark:bg-[#2a2b2e] hover:bg-slate-300 dark:hover:bg-[#333538] text-slate-700 dark:text-white font-medium text-sm transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => { setDisplayName(`${firstName} ${lastName}`.trim()); setAccountSubView("main"); }} className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {accountSubView === "about" && (
              <div className="flex flex-col w-full h-full">
                <div className="h-14 flex items-center px-4 shrink-0 bg-white dark:bg-[#18181b] border-b border-slate-200 dark:border-neutral-800 relative z-10">
                  <button 
                    onClick={() => setAccountSubView("main")}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors absolute left-4 text-slate-500 dark:text-neutral-400"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
                  </button>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white text-center w-full">About</h2>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-[#121214] p-8 flex justify-center animate-in slide-in-from-right-4 duration-200">
                  <div className="w-full max-w-[600px] flex flex-col">
                    <div className="relative mb-6">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-400">sentiment_satisfied</span>
                      <input 
                        type="text" 
                        value={about} 
                        onChange={(e) => setAbout(e.target.value)}
                        className="w-full bg-white dark:bg-[#202124] border border-slate-200 dark:border-[#4285f4] text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4285f4] shadow-sm"
                        placeholder="Write something about yourself..."
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col space-y-1 mt-2">
                      <button onClick={() => setAbout("Speak Freely")} className="w-full flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white text-sm text-left">
                        <span className="text-xl">👋</span> Speak Freely
                      </button>
                      <button onClick={() => setAbout("Encrypted")} className="w-full flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white text-sm text-left">
                        <span className="text-xl">🤐</span> Encrypted
                      </button>
                      <button onClick={() => setAbout("Free to chat")} className="w-full flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white text-sm text-left">
                        <span className="text-xl">👍</span> Free to chat
                      </button>
                      <button onClick={() => setAbout("Coffee lover")} className="w-full flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white text-sm text-left">
                        <span className="text-xl">☕</span> Coffee lover
                      </button>
                      <button onClick={() => setAbout("Taking a break")} className="w-full flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white text-sm text-left">
                        <span className="text-xl">📴</span> Taking a break
                      </button>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setAccountSubView("main")} className="px-5 py-2 rounded-full bg-slate-200 dark:bg-[#2a2b2e] hover:bg-slate-300 dark:hover:bg-[#333538] text-slate-700 dark:text-white font-medium text-sm transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => setAccountSubView("main")} className="px-5 py-2 rounded-full bg-[#5d5feF] hover:bg-blue-600 text-white font-medium text-sm transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {accountSubView === "username" && (
              <div className="flex flex-col w-full h-full">
                <div className="h-14 flex items-center px-4 shrink-0 bg-white dark:bg-[#18181b] border-b border-slate-200 dark:border-neutral-800 relative z-10">
                  <button 
                    onClick={() => setAccountSubView("main")}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors absolute left-4 text-slate-500 dark:text-neutral-400"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
                  </button>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white text-center w-full">Username</h2>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-[#121214] p-8 flex flex-col items-center animate-in slide-in-from-right-4 duration-200">
                  <div className="w-full max-w-[600px] flex flex-col items-center pt-8">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-[#323336] rounded-full flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-[40px] text-slate-500 dark:text-white">alternate_email</span>
                    </div>
                    <h3 className="text-lg text-slate-900 dark:text-white mb-8">Choose your username</h3>
                    
                    <div className="w-full mb-4">
                      <input 
                        type="text" 
                        value={usernameInput} 
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full bg-white dark:bg-[#202124] border border-slate-300 dark:border-neutral-600 text-slate-900 dark:text-white px-4 py-3.5 rounded-lg focus:outline-none focus:border-slate-400 dark:focus:border-neutral-500"
                        placeholder="Username"
                      />
                    </div>
                    
                    <p className="w-full text-sm text-slate-500 dark:text-neutral-400 mb-12 text-left">
                      Usernames are always paired with a set of numbers. <a href="#" className="text-blue-500 hover:underline">Learn More</a>
                    </p>
                    
                    <div className="w-full flex justify-end gap-3">
                      <button onClick={() => setAccountSubView("main")} className="px-6 py-2.5 rounded-full bg-slate-200 dark:bg-[#2a2b2e] hover:bg-slate-300 dark:hover:bg-[#333538] text-slate-700 dark:text-white font-medium text-sm transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => setAccountSubView("main")} className="px-6 py-2.5 rounded-full bg-[#5d5feF] hover:bg-blue-600 text-white font-medium text-sm transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="flex flex-col w-full h-full">
            <div className="h-14 flex items-center px-4 shrink-0 bg-white dark:bg-[#18181b] border-b border-slate-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Appearance</h2>
            </div>
            <div className="flex-1 p-8">
              <div className="w-full max-w-2xl mt-4">
                <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-slate-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                      <span className="material-symbols-outlined text-[20px] text-slate-500 dark:text-neutral-400">language</span>
                      <span className="text-[15px]">Language</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-neutral-400 text-sm">
                      System Language
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-slate-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                      <span className="material-symbols-outlined text-[20px] text-slate-500 dark:text-neutral-400">contrast</span>
                      <span className="text-[15px]">Theme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const isDark = document.documentElement.classList.contains("dark");
                          if (isDark) {
                            document.documentElement.classList.remove("dark");
                            localStorage.setItem("theme", "light");
                          } else {
                            document.documentElement.classList.add("dark");
                            localStorage.setItem("theme", "dark");
                          }
                          window.dispatchEvent(new Event("themechange"));
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors rounded-full flex items-center gap-2 text-sm text-slate-700 dark:text-white"
                      >
                        Toggle
                        <span className="material-symbols-outlined text-[16px]">sync</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-slate-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                      <span className="material-symbols-outlined text-[20px] text-slate-500 dark:text-neutral-400">palette</span>
                      <span className="text-[15px]">Chat color</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                      <span className="material-symbols-outlined text-[20px] text-slate-500 dark:text-neutral-400">zoom_in</span>
                      <span className="text-[15px]">Zoom level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full flex items-center gap-2 text-sm text-slate-700 dark:text-white">
                        100%
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
