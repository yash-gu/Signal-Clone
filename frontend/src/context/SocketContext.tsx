"use client";
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

export interface MessageReaction {
  user_id: number;
  emoji: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  status: "SENT" | "DELIVERED" | "READ";
  created_at: string;
  sender_name?: string;
  attachment_url?: string;
  reply_to_id?: number;
  expires_at?: string;
  reactions?: MessageReaction[];
}

interface SocketContextType {
  messages: Message[];
  activeConversation: number | null;
  setActiveConversation: (id: number | null) => void;
  sendMessage: (content: string, attachment_url?: string, reply_to_id?: number, expires_in?: number) => void;
  sendTyping: () => void;
  typingUser: { id: number; name: string } | null;
  addReaction: (message_id: number, emoji: string) => void;
  removeReaction: (message_id: number) => void;
  replyingTo: Message | null;
  setReplyingTo: (msg: Message | null) => void;
  expiresIn: number | null;
  setExpiresIn: (seconds: number | null) => void;
  refreshConversations: () => void;
  refreshConversationsTrigger: number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<{ id: number; name: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [refreshConversationsTrigger, setRefreshConversationsTrigger] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refreshConversations = () => {
    setRefreshConversationsTrigger(prev => prev + 1);
  };

  // Re-fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation && token) {
      setReplyingTo(null); // Reset reply state
      fetch(`/api/messages/${activeConversation}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({
            action: "messages_read",
            conversation_id: activeConversation
          }));
        }
      })
      .catch(console.error);
    } else {
      setMessages([]);
      setReplyingTo(null);
    }
  }, [activeConversation, token]);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/messages/ws?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message") {
        if (data.message.conversation_id === activeConversation) {
          setMessages((prev) => [...prev, data.message]);
        }
        
        // Always trigger a refresh so the sidebar updates its last message preview
        setRefreshConversationsTrigger(prev => prev + 1);
        
        if (data.message.sender_id !== user?.id) {
          ws.send(JSON.stringify({
            action: "message_delivered",
            message_id: data.message.id,
            conversation_id: data.message.conversation_id
          }));
          
          if (activeConversation === data.message.conversation_id) {
            ws.send(JSON.stringify({
              action: "messages_read",
              conversation_id: data.message.conversation_id
            }));
          } else {
            // Toast for incoming message in other chat
            showToast(data.message.content || "Sent an attachment", "info", `New Message`);
          }
        }
      } else if (data.type === "message_status_update") {
        if (data.conversation_id === activeConversation) {
          setMessages(prev => prev.map(msg => 
            msg.id === data.message_id ? { ...msg, status: data.status } : msg
          ));
        }
      } else if (data.type === "conversation_read") {
        if (data.conversation_id === activeConversation) {
          setMessages(prev => prev.map(msg => 
            (msg.sender_id === user?.id && (msg.status === "SENT" || msg.status === "DELIVERED")) 
              ? { ...msg, status: "READ" } 
              : msg
          ));
        }
      } else if (data.type === "typing") {
        if (data.conversation_id === activeConversation && data.user_id !== user?.id) {
          setTypingUser({ id: data.user_id, name: data.display_name });
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
        }
      } else if (data.type === "reaction_update") {
        if (data.conversation_id === activeConversation) {
          setMessages(prev => prev.map(msg => {
            if (msg.id === data.message_id) {
              const currentReactions = msg.reactions || [];
              if (data.action === "add") {
                const existingIndex = currentReactions.findIndex(r => r.user_id === data.user_id);
                if (existingIndex > -1) {
                  currentReactions[existingIndex].emoji = data.emoji;
                  return { ...msg, reactions: [...currentReactions] };
                } else {
                  return { ...msg, reactions: [...currentReactions, { user_id: data.user_id, emoji: data.emoji }] };
                }
              } else if (data.action === "remove") {
                return { ...msg, reactions: currentReactions.filter(r => r.user_id !== data.user_id) };
              }
            }
            return msg;
          }));
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [token, activeConversation, user, showToast]);

  const sendMessage = (content: string, attachment_url?: string, reply_to_id?: number, expires_in?: number) => {
    if (socketRef.current && activeConversation) {
      socketRef.current.send(JSON.stringify({
        action: "send_message",
        conversation_id: activeConversation,
        content,
        attachment_url,
        reply_to_id,
        expires_in
      }));
    }
  };

  const sendTyping = () => {
    if (socketRef.current && activeConversation) {
      socketRef.current.send(JSON.stringify({
        action: "typing",
        conversation_id: activeConversation
      }));
    }
  };
  
  const addReaction = (message_id: number, emoji: string) => {
    if (socketRef.current && activeConversation) {
      socketRef.current.send(JSON.stringify({
        action: "add_reaction",
        conversation_id: activeConversation,
        message_id,
        emoji
      }));
    }
  };

  const removeReaction = (message_id: number) => {
    if (socketRef.current && activeConversation) {
      socketRef.current.send(JSON.stringify({
        action: "remove_reaction",
        conversation_id: activeConversation,
        message_id
      }));
    }
  };

  return (
    <SocketContext.Provider value={{
      messages,
      activeConversation,
      setActiveConversation,
      sendMessage,
      sendTyping,
      typingUser,
      addReaction,
      removeReaction,
      replyingTo,
      setReplyingTo,
      expiresIn,
      setExpiresIn,
      refreshConversations,
      refreshConversationsTrigger
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
