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

export default function ChatHeader() {
  const { activeConversation, setActiveConversation, typingUser } = useSocket();
  const { token, user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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

  const getDisplayName = () => {
    if (!conversation) return "Unknown Conversation";
    if (conversation.name) return conversation.name;
    const otherUser = conversation.participants.find((p: any) => p.user_id !== user?.id);
    return otherUser?.user?.display_name || otherUser?.user?.username || "Unknown Conversation";
  };

  const displayName = getDisplayName();

  return (
    <header className="h-16 px-2 md:px-space-xl bg-surface-container-lowest flex items-center justify-between border-b border-outline-variant/30 z-10 shadow-sm relative">
      <div className="flex items-center gap-2 md:gap-space-sm min-w-0">
        <button 
          onClick={() => setActiveConversation(null)} 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[1.375rem]">arrow_back</span>
        </button>
        <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center shadow-xs overflow-hidden border border-outline-variant/20">
          {conversation?.is_group ? (
             <span className="material-symbols-outlined text-xl">hub</span>
           ) : (
             <span className="font-headline-sm text-headline-sm text-on-surface flex items-center justify-center">
               {displayName.charAt(0).toUpperCase()}
             </span>
           )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface-container-lowest"></span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">{displayName}</span>
            {!conversation?.is_group && <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }} title="Verified Safety Number">verified</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal truncate">
              {typingUser ? `${conversation?.participants.find(p => p.user_id === typingUser)?.user?.display_name || 'Someone'} is typing...` : "online"} <span className="text-outline-variant">•</span> end-to-end encrypted
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button onClick={() => alert("Voice calls coming soon!")} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer" title="Voice Call (Coming Soon)">
          <span className="material-symbols-outlined text-[1.375rem]">call</span>
        </button>
        <button onClick={() => alert("Video calls coming soon!")} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer" title="Video Call (Coming Soon)">
          <span className="material-symbols-outlined text-[1.375rem]">videocam</span>
        </button>
        <div className="w-px h-5 bg-outline-variant/30 mx-1"></div>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer" title="Search">
          <span className="material-symbols-outlined text-[1.375rem]">search</span>
        </button>
        {!!conversation?.is_group && (
          <button onClick={() => setShowSettings(!showSettings)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer" title="Group Info">
            <span className="material-symbols-outlined text-[1.375rem]">info</span>
          </button>
        )}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer" title="More options">
          <span className="material-symbols-outlined text-[1.375rem]">more_vert</span>
        </button>
      </div>

      {showSettings && conversation && (
        <div className="absolute top-16 right-0 h-[calc(100vh-4rem)] z-50">
          <GroupSettingsPanel 
            conversationId={conversation.id} 
            onClose={() => setShowSettings(false)} 
          />
        </div>
      )}
    </header>
  );
}
