"use client";
import MessageBubble from "./MessageBubble";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef } from "react";

export default function MessageList() {
  const { messages, activeConversation, typingUser } = useSocket();
  const { user } = useAuth();
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  if (!activeConversation) return null;
  return (
    <div className="flex-1 overflow-y-auto px-space-xl py-space-lg space-y-space-md z-0 flex flex-col justify-start" id="message-container">
      <div className="flex items-center justify-center my-space-base">
        <span className="px-space-md py-space-2xs rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-xs select-none">
          Today
        </span>
      </div>
      
      {messages.map((msg) => (
        <MessageBubble 
          key={msg.id}
          isOutgoing={msg.sender_id === user?.id}
          msg={msg}
        />
      ))}
      
      {typingUser && (
        <div className="text-on-surface-variant text-sm flex items-center gap-2 italic">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse"></span>
          {messages.find(m => m.sender_id === typingUser)?.sender_name || "Someone"} is typing...
        </div>
      )}
      
      <div id="new-messages-anchor" ref={anchorRef}></div>
    </div>
  );
}
