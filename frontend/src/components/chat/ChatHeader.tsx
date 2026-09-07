"use client";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import GroupSettingsPanel from "./GroupSettingsPanel";

interface Conversation {
  id: number;
  name: string | null;
  is_group: boolean;
  participants: any[];
}

interface ChatHeaderProps {
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
}

export default function ChatHeader({ showSettings, setShowSettings }: ChatHeaderProps) {
  const { activeConversation, setActiveConversation, typingUser } = useSocket();
  const { token, user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUserStatus, setOtherUserStatus] = useState<{ is_online: boolean; last_seen: string | null } | null>(null);

  useEffect(() => {
    if (!activeConversation || !token) return;
    fetch(`/api/conversations/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      const conv = data.find((c: any) => c.id === activeConversation);
      setConversation(conv || null);
    });
  }, [activeConversation, token]);

  useEffect(() => {
    if (!conversation || conversation.is_group || !token) return;
    
    const otherUser = conversation.participants.find((p: any) => p.user_id !== user?.id);
    if (!otherUser) return;
    
    const fetchStatus = () => {
      fetch(`/api/users/${otherUser.user_id}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setOtherUserStatus(data);
      })
      .catch(console.error);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [conversation, token, user]);

  const getDisplayInfo = () => {
    let name = "Unknown Conversation";
    let avatarUrl = null;
    
    if (!conversation) return { name, avatarUrl };
    if (conversation.name) {
      name = conversation.name;
    } else {
      const otherUser = conversation.participants.find((p: any) => p.user_id !== user?.id);
      if (otherUser && otherUser.user) {
        name = otherUser.user.display_name || otherUser.user.username || "Unknown Conversation";
        avatarUrl = otherUser.user.avatar_url;
      }
    }
    return { name, avatarUrl };
  };

  const { name: displayName, avatarUrl } = getDisplayInfo();

  return (
    <header className="h-16 px-2 md:px-space-xl bg-surface-container-lowest flex items-center justify-between border-b border-outline-variant/30 z-10 shadow-sm relative">
      <div className="flex items-center gap-2 md:gap-space-sm min-w-0">
        <button 
          onClick={() => setActiveConversation(null)} 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[1.375rem]">arrow_back</span>
        </button>
        <div className="relative flex-shrink-0 w-10 h-10">
          <div className="w-full h-full rounded-full bg-surface-container-high text-primary flex items-center justify-center shadow-xs overflow-hidden border border-outline-variant/20">
            {conversation?.is_group ? (
               <span className="material-symbols-outlined text-xl">hub</span>
             ) : avatarUrl ? (
               <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
             ) : (
               <span className="font-headline-sm text-headline-sm text-on-surface flex items-center justify-center">
                 {displayName.charAt(0).toUpperCase()}
               </span>
             )}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-surface-container-lowest"></span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">{displayName}</span>
            {!conversation?.is_group && <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }} title="Verified Safety Number">verified</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${otherUserStatus?.is_online ? 'bg-secondary' : 'bg-slate-400 dark:bg-neutral-500'}`}></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal truncate">
              {typingUser ? `${typingUser.name} is typing...` : conversation?.is_group ? "Group Chat" : otherUserStatus?.is_online ? "online" : otherUserStatus?.last_seen ? `last seen ${new Date(otherUserStatus.last_seen + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' })}` : "offline"} <span className="text-outline-variant">•</span> end-to-end encrypted
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button onClick={() => alert("Voice calls coming soon!")} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer" title="Voice Call">
          <span className="material-symbols-outlined text-[1.375rem]">call</span>
        </button>
        <button onClick={() => alert("Video calls coming soon!")} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer" title="Video Call">
          <span className="material-symbols-outlined text-[1.375rem]">videocam</span>
        </button>
        {!!conversation?.is_group && (
          <button onClick={() => setShowSettings(!showSettings)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer" title="Group Info">
            <span className="material-symbols-outlined text-[1.375rem]">info</span>
          </button>
        )}
      </div>

    </header>
  );
}
