"use client";
import Sidebar from "@/components/sidebar";
import ChatPane from "@/components/chat";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useState } from "react";

export default function Home() {
  const { token, login } = useAuth();
  const { activeConversation } = useSocket();
  
  // Auth Form State
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authStep, setAuthStep] = useState<"identifier" | "code" | "profile">("identifier");
  const [identifierType, setIdentifierType] = useState<"phone" | "username">("phone");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    const handleNextStep = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      
      if (authStep === "identifier") {
        if (identifierType === "phone") {
          const digitsOnly = phone.replace(/\D/g, "");
          if (digitsOnly.length < 7) {
            setError("Please enter a valid phone number (digits only).");
            return;
          }
        }
        if (identifierType === "username" && username.trim().length < 3) {
          setError("Please enter a valid username.");
          return;
        }
        setAuthStep("code");
      } else if (authStep === "code") {
        if (mode === "login") {
          // Login Flow
          try {
            const res = await fetch(`/api/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(identifierType === "phone" ? { phone_number: phone, otp } : { username, otp })
            });
            if (res.ok) {
              const data = await res.json();
              login(data.access_token);
            } else {
              const data = await res.json();
              if (res.status === 404) {
                setError("User not found. Please sign up.");
              } else {
                setError(data.detail || "Invalid code. Try 1234.");
              }
            }
          } catch (err) {
            setError("Server not responding.");
          }
        } else {
          // Register Flow -> Move to Profile Step
          setAuthStep("profile");
        }
      } else if (authStep === "profile") {
        // Submit Register Flow
        try {
          const res = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: phone || "0000000000", username, display_name: displayName, otp: otp || "1234" })
          });
          if (res.ok) {
            const data = await res.json();
            login(data.access_token);
          } else {
            const data = await res.json();
            setError(data.detail || "Registration failed.");
          }
        } catch (err) {
          setError("Server not responding.");
        }
      }
    };
    
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-screen px-4 pb-12">
        {/* Main Auth Card */}
        <div className="w-full max-w-[26rem] bg-white dark:bg-[#18181b] rounded-[24px] shadow-sm border border-slate-200 dark:border-neutral-800 overflow-hidden flex flex-col mb-8 relative z-20">
          
          {/* Dynamic Tab Navigation based on Mode */}
          <div className="bg-slate-50 dark:bg-[#121214] border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between px-6 py-4">
            <div className={`text-xs font-medium ${authStep === 'identifier' ? 'text-[#2C6BED]' : 'text-slate-400 dark:text-neutral-500'}`}>1. Identifier</div>
            <div className={`h-px flex-1 mx-2 ${authStep === 'code' || authStep === 'profile' ? 'bg-[#2C6BED]' : 'bg-slate-200 dark:bg-neutral-800'}`}></div>
            <div className={`text-xs font-medium ${authStep === 'code' ? 'text-[#2C6BED]' : 'text-slate-400 dark:text-neutral-500'}`}>2. Code</div>
            {mode === "register" && (
              <>
                <div className={`h-px flex-1 mx-2 ${authStep === 'profile' ? 'bg-[#2C6BED]' : 'bg-slate-200 dark:bg-neutral-800'}`}></div>
                <div className={`text-xs font-medium ${authStep === 'profile' ? 'text-[#2C6BED]' : 'text-slate-400 dark:text-neutral-500'}`}>3. Profile</div>
              </>
            )}
          </div>

          <form onSubmit={handleNextStep} className="p-8 flex flex-col items-center">
            
            {/* Branding & Header */}
            <div className="bg-[#2C6BED] text-white p-3 rounded-2xl shadow-sm inline-block mb-4">
              <span className="material-symbols-outlined text-2xl block">lock</span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-2">
              {authStep === "profile" ? "Create your profile" : (mode === "login" ? "Log in to Signal" : "Sign up for Signal")}
            </h1>
            
            <p className="text-sm text-slate-500 dark:text-neutral-400 text-center mb-6">
              {authStep === "identifier" && (mode === "login" ? "Enter your details to log in to your account." : "Enter your details to create a new account.")}
              {authStep === "code" && "Enter the 4-digit verification code."}
              {authStep === "profile" && "Set how you appear to your contacts."}
            </p>

            {/* Error Message */}
            {error && (
              <div className="w-full mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {/* Step 1: Identifier */}
            {authStep === "identifier" && (
              <div className="w-full flex flex-col gap-6">
                
                {/* Prominent Login/Signup Toggle */}
                <div className="flex bg-slate-100 dark:bg-[#121214] p-1 rounded-xl -mt-2">
                  <button type="button" onClick={() => setMode("login")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white dark:bg-[#202124] shadow-sm text-[#2C6BED]' : 'text-slate-500 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300'}`}>Log In</button>
                  <button type="button" onClick={() => setMode("register")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white dark:bg-[#202124] shadow-sm text-[#2C6BED]' : 'text-slate-500 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300'}`}>Sign Up</button>
                </div>
                
                {/* Identifier Type Segmented Toggle */}
                <div className="flex bg-slate-50 dark:bg-[#121214] p-1 rounded-xl border border-slate-100 dark:border-neutral-800">
                  <button type="button" onClick={() => setIdentifierType("phone")} className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${identifierType === 'phone' ? 'bg-white dark:bg-[#202124] shadow-sm text-slate-900 dark:text-white border border-slate-200/60 dark:border-neutral-800' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}>Phone Number</button>
                  <button type="button" onClick={() => setIdentifierType("username")} className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${identifierType === 'username' ? 'bg-white dark:bg-[#202124] shadow-sm text-slate-900 dark:text-white border border-slate-200/60 dark:border-neutral-800' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}>Username</button>
                </div>

                {/* Input Fields */}
                <div className="w-full">
                  {identifierType === "phone" ? (
                    <div className="flex items-center bg-white dark:bg-[#121214] border border-slate-200 dark:border-neutral-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2C6BED]/20 focus-within:border-[#2C6BED] transition-all">
                      <div className="relative border-r border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#18181b] flex items-center group hover:bg-slate-100 dark:hover:bg-[#202124] transition-colors">
                        <select 
                          className="appearance-none bg-transparent pl-3 pr-7 py-3 text-sm font-medium text-slate-600 dark:text-neutral-400 outline-none cursor-pointer relative z-10"
                          defaultValue="+1"
                          onChange={(e) => {}}
                        >
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+61">🇦🇺 +61</option>
                          <option value="+49">🇩🇪 +49</option>
                        </select>
                        <span className="material-symbols-outlined text-sm absolute right-2 text-slate-500 dark:text-neutral-500 pointer-events-none z-0 group-hover:text-slate-700 dark:group-hover:text-neutral-300">arrow_drop_down</span>
                      </div>
                      <input 
                        type="tel" 
                        required 
                        autoFocus
                        className="flex-1 p-3 text-slate-900 dark:text-white outline-none w-full bg-transparent placeholder-slate-400 dark:placeholder-neutral-600" 
                        placeholder="Phone Number" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                      />
                    </div>
                  ) : (
                    <div className="flex items-center bg-white dark:bg-[#121214] border border-slate-200 dark:border-neutral-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2C6BED]/20 focus-within:border-[#2C6BED] transition-all">
                      <div className="px-3 py-3 bg-slate-50 dark:bg-[#18181b] border-r border-slate-200 dark:border-neutral-800 text-slate-400 dark:text-neutral-500 font-medium">@</div>
                      <input 
                        type="text" 
                        required 
                        autoFocus
                        className="flex-1 p-3 text-slate-900 dark:text-white outline-none w-full bg-transparent placeholder-slate-400 dark:placeholder-neutral-600" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Code */}
            {authStep === "code" && (
              <div className="w-full flex flex-col gap-6">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      autoFocus={index === 0}
                      className="w-14 h-16 text-center text-3xl font-semibold bg-white dark:bg-[#121214] text-slate-900 dark:text-white border border-slate-200 dark:border-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-[#2C6BED]/20 focus:border-[#2C6BED] transition-all shadow-sm"
                      value={otp[index] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!/^\d*$/.test(val)) return; // Only allow digits
                        
                        const newOtp = otp.split('');
                        newOtp[index] = val;
                        setOtp(newOtp.join(''));
                        
                        // Focus next input
                        if (val && index < 3) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-neutral-500 font-medium -mt-2">Enter test code: 1234</p>
              </div>
            )}

            {/* Step 3: Profile */}
            {authStep === "profile" && (
              <div className="w-full flex flex-col gap-4">
                <div className="flex justify-center mb-2">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-[#121214] rounded-full border border-slate-200 dark:border-neutral-800 flex items-center justify-center text-slate-400 dark:text-neutral-500">
                    <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  </div>
                </div>
                
                {identifierType === "phone" && (
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 bg-white dark:bg-[#121214] border border-slate-200 dark:border-neutral-800 rounded-lg outline-none focus:ring-2 focus:ring-[#2C6BED]/20 focus:border-[#2C6BED] transition-all placeholder-slate-400 dark:placeholder-neutral-600 text-slate-900 dark:text-white" 
                    placeholder="Create a Username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                  />
                )}
                
                <input 
                  type="text" 
                  required
                  className="w-full p-3 bg-white dark:bg-[#121214] border border-slate-200 dark:border-neutral-800 rounded-lg outline-none focus:ring-2 focus:ring-[#2C6BED]/20 focus:border-[#2C6BED] transition-all placeholder-slate-400 dark:placeholder-neutral-600 text-slate-900 dark:text-white" 
                  placeholder="Display Name (e.g. John Doe)" 
                  value={displayName} 
                  onChange={e => setDisplayName(e.target.value)} 
                />
              </div>
            )}

            {/* Buttons & Privacy Footer */}
            <div className="w-full mt-8">
              <button type="submit" className="bg-[#2C6BED] hover:bg-blue-600 text-white font-medium py-3 rounded-xl w-full transition-colors active:scale-[0.98]">
                {authStep === "profile" ? "Complete Setup" : (mode === "login" ? "Log In →" : "Sign Up →")}
              </button>
              
              <div className="mt-6 p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-100/50 dark:border-teal-900/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-500 text-xl shrink-0 mt-0.5">verified_user</span>
                <p className="text-xs text-teal-800/80 dark:text-teal-400/80 leading-relaxed font-medium">
                  Signal does not sell or share your data. All messages and calls are end-to-end encrypted with zero server logs.
                </p>
              </div>
            </div>

          </form>
        </div>

        {/* Muted Bottom Watermark */}
        <div className="text-center text-[11px] font-medium text-slate-400/80 uppercase tracking-widest flex flex-wrap justify-center gap-2 max-w-lg mt-auto relative z-10">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">lock</span> Post-quantum ready Double Ratchet</span>
          <span>•</span>
          <span>Zero telemetry logs</span>
          <span>•</span>
          <span>Signal Protocol v4</span>
        </div>
      </div>
    );
  }

  // Authenticated State (Handled by AppLayout structure)
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full h-full md:h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-96 flex-shrink-0 border-r border-outline-variant/30 ${activeConversation ? 'hidden md:flex' : 'flex'} h-[100dvh] md:h-auto`}>
          <Sidebar />
        </div>
        
        {/* ChatPane */}
        <div className={`flex-1 min-w-0 ${activeConversation ? 'flex' : 'hidden md:flex'} h-[100dvh] md:h-auto`}>
          <ChatPane />
        </div>
      </div>
    </div>
  );
}
