"use client";
import Sidebar from "@/components/sidebar";
import ChatPane from "@/components/chat";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useState, useEffect } from "react";

export default function Home() {
  const { token, login, loading } = useAuth();
  const { activeConversation } = useSocket();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("1111111111");
  const [otp, setOtp] = useState("1234");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  if (loading) return <div className="flex h-screen items-center justify-center bg-surface">Loading...</div>;

  if (!token) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (mode === "login") {
          const res = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: phone, otp })
          });
          if (res.ok) {
            const data = await res.json();
            login(data.access_token);
          } else {
            alert("Login failed. Check your phone number/OTP.");
          }
        } else {
          const res = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: phone, username, display_name: displayName, otp })
          });
          if (res.ok) {
            const data = await res.json();
            login(data.access_token);
          } else {
            const err = await res.json();
            alert(`Registration failed: ${err.detail}`);
          }
        }
      } catch (err) {
        alert("Server not responding. Is the backend running?");
      }
    };
    
    return (
      <div className="flex h-screen items-center justify-center bg-surface w-full">
        <form onSubmit={handleSubmit} className="p-8 bg-surface-container-low rounded-2xl shadow-sm w-[28rem] border border-outline-variant/30 flex flex-col">
          <div className="flex justify-center mb-6">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">chat</span>
              Signal Web Clone
            </span>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-surface-container p-1 rounded-lg">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 py-2 rounded-md font-label-md transition-all ${mode === "login" ? "bg-surface-container-lowest shadow-xs text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>Login</button>
            <button type="button" onClick={() => { setMode("register"); setPhone(""); }} className={`flex-1 py-2 rounded-md font-label-md transition-all ${mode === "register" ? "bg-surface-container-lowest shadow-xs text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>Register</button>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 ml-1">Phone Number</label>
              <input required className="block w-full p-3 rounded-xl bg-surface-container-highest text-on-surface outline-none focus:ring-2 ring-primary transition-all" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 5550123" />
            </div>
            
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 ml-1">Username</label>
                  <input required className="block w-full p-3 rounded-xl bg-surface-container-highest text-on-surface outline-none focus:ring-2 ring-primary transition-all" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. myusername" />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 ml-1">Display Name</label>
                  <input required className="block w-full p-3 rounded-xl bg-surface-container-highest text-on-surface outline-none focus:ring-2 ring-primary transition-all" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. John Doe" />
                </div>
              </>
            )}

            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 ml-1">Mock OTP Code (Use 1234)</label>
              <input required className="block w-full p-3 rounded-xl bg-surface-container-highest text-on-surface outline-none focus:ring-2 ring-primary transition-all" value={otp} onChange={e => setOtp(e.target.value)} placeholder="1234" />
            </div>
          </div>

          <button type="submit" className="bg-primary text-on-primary font-label-md text-label-md w-full py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-sm mt-auto">
            {mode === "login" ? "Login to Signal" : "Complete Registration"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full h-full md:h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar - Show if no active conversation on mobile, always show on desktop */}
        <div className={`w-full md:w-96 flex-shrink-0 border-r border-outline-variant/30 ${activeConversation ? 'hidden md:flex' : 'flex'} h-[100dvh] md:h-auto`}>
          <Sidebar />
        </div>
        
        {/* ChatPane - Show if active conversation on mobile, always show on desktop */}
        <div className={`flex-1 min-w-0 ${activeConversation ? 'flex' : 'hidden md:flex'} h-[100dvh] md:h-auto`}>
          <ChatPane />
        </div>
      </div>
    </div>
  );
}
