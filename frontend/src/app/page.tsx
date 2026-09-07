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
        setAuthStep("code");
      } else if (authStep === "code") {
        if (identifierType === "phone") {
          // Login Flow
          try {
            const res = await fetch(`/api/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone_number: phone, otp })
            });
            if (res.ok) {
              const data = await res.json();
              login(data.access_token);
            } else {
              const data = await res.json();
              if (res.status === 404) {
                // User not found, need to register
                setAuthStep("profile");
              } else {
                setError(data.detail || "Invalid code. Try 1234.");
              }
            }
          } catch (err) {
            setError("Server not responding.");
          }
        } else {
          // Username login logic goes here if backend supports it. For now, fallback to profile registration.
          setAuthStep("profile");
        }
      } else if (authStep === "profile") {
        // Register Flow
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
        <div className="w-full max-w-[26rem] bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden flex flex-col mb-8 relative z-20">
          
          {/* 3-Step Tab Navigation */}
          <div className="bg-slate-50 border-b border-slate-100 flex items-center justify-between px-6 py-4">
            <div className={`text-xs font-medium ${authStep === 'identifier' ? 'text-[#2C6BED]' : 'text-slate-400'}`}>1. Identifier</div>
            <div className={`h-px flex-1 mx-2 ${authStep === 'code' || authStep === 'profile' ? 'bg-[#2C6BED]' : 'bg-slate-200'}`}></div>
            <div className={`text-xs font-medium ${authStep === 'code' ? 'text-[#2C6BED]' : 'text-slate-400'}`}>2. Code</div>
            <div className={`h-px flex-1 mx-2 ${authStep === 'profile' ? 'bg-[#2C6BED]' : 'bg-slate-200'}`}></div>
            <div className={`text-xs font-medium ${authStep === 'profile' ? 'text-[#2C6BED]' : 'text-slate-400'}`}>3. Profile</div>
          </div>

          <form onSubmit={handleNextStep} className="p-8 flex flex-col items-center">
            
            {/* Branding & Header */}
            <div className="bg-[#2C6BED] text-white p-3 rounded-2xl shadow-sm inline-block mb-4">
              <span className="material-symbols-outlined text-2xl block">lock</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1 mb-2">
              {authStep === "profile" ? "Create your profile" : "Set up Signal"}
            </h1>
            <p className="text-sm text-slate-500 text-center mb-8">
              {authStep === "identifier" && "Enter your phone number or username to get started."}
              {authStep === "code" && "Enter the 4-digit verification code."}
              {authStep === "profile" && "Set how you appear to your contacts."}
            </p>

            {/* Error Message */}
            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            {/* Step 1: Identifier */}
            {authStep === "identifier" && (
              <div className="w-full flex flex-col gap-6">
                
                {/* Segmented Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button type="button" onClick={() => setIdentifierType("phone")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${identifierType === 'phone' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Phone Number</button>
                  <button type="button" onClick={() => setIdentifierType("username")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${identifierType === 'username' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Username</button>
                </div>

                {/* Input Fields */}
                <div className="w-full">
                  {identifierType === "phone" ? (
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2C6BED]/20 focus-within:border-[#2C6BED] transition-all">
                      <div className="px-3 py-3 bg-slate-50 border-r border-slate-200 text-slate-600 text-sm font-medium flex items-center gap-1 cursor-not-allowed">
                        🇺🇸 +1 <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                      </div>
                      <input 
                        type="tel" 
                        required 
                        autoFocus
                        className="flex-1 p-3 text-slate-900 outline-none w-full bg-transparent placeholder-slate-400" 
                        placeholder="Phone Number" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                      />
                    </div>
                  ) : (
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2C6BED]/20 focus-within:border-[#2C6BED] transition-all">
                      <div className="px-3 py-3 bg-slate-50 border-r border-slate-200 text-slate-400 font-medium">@</div>
                      <input 
                        type="text" 
                        required 
                        autoFocus
                        className="flex-1 p-3 text-slate-900 outline-none w-full bg-transparent placeholder-slate-400" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                      />
                    </div>
                  )}
                </div>
                
                {/* Small Muted Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-mono border border-slate-200/60">
                    <span className="material-symbols-outlined text-[14px]">lock</span> 
                    SMS Protocol Token: SHA-256
                  </span>
                </div>
              </div>
            )}

            {/* Step 2: Code */}
            {authStep === "code" && (
              <div className="w-full flex flex-col gap-6">
                <input 
                  type="text" 
                  required 
                  autoFocus
                  className="w-full p-4 text-center text-2xl tracking-[0.5em] font-mono bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2C6BED]/20 focus:border-[#2C6BED] transition-all placeholder-slate-300" 
                  placeholder="----" 
                  maxLength={4}
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                />
              </div>
            )}

            {/* Step 3: Profile */}
            {authStep === "profile" && (
              <div className="w-full flex flex-col gap-4">
                <div className="flex justify-center mb-2">
                  <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  </div>
                </div>
                
                {identifierType === "phone" && (
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2C6BED]/20 focus:border-[#2C6BED] transition-all placeholder-slate-400 text-slate-900" 
                    placeholder="Create a Username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                  />
                )}
                
                <input 
                  type="text" 
                  required
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2C6BED]/20 focus:border-[#2C6BED] transition-all placeholder-slate-400 text-slate-900" 
                  placeholder="Display Name (e.g. John Doe)" 
                  value={displayName} 
                  onChange={e => setDisplayName(e.target.value)} 
                />
              </div>
            )}

            {/* Buttons & Privacy Footer */}
            <div className="w-full mt-8">
              <button type="submit" className="bg-[#2C6BED] hover:bg-blue-600 text-white font-medium py-3 rounded-xl w-full transition-colors active:scale-[0.98]">
                {authStep === "profile" ? "Complete Setup" : "Continue →"}
              </button>
              
              <div className="mt-6 p-4 bg-teal-50/50 rounded-xl border border-teal-100/50 flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 text-xl shrink-0 mt-0.5">verified_user</span>
                <p className="text-xs text-teal-800/80 leading-relaxed font-medium">
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
