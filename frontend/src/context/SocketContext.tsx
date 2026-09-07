"use client";
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  status: "SENT" | "DELIVERED" | "READ";
  created_at: string;
}

interface SocketContextType {
  messages: Message[];
  activeConversation: number | null;
  setActiveConversation: (id: number | null) => void;
  sendMessage: (content: string) => void;
  sendTyping: () => void;
  typingUser: number | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Re-fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation && token) {
      fetch(`http://localhost:8000/api/messages/${activeConversation}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(console.error);
    } else {
      setMessages([]);
    }
  }, [activeConversation, token]);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8000/api/messages/ws?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message") {
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === "typing") {
        if (data.conversation_id === activeConversation) {
          setTypingUser(data.user_id);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [token, activeConversation]);

  const sendMessage = (content: string) => {
    if (socketRef.current && activeConversation) {
      socketRef.current.send(JSON.stringify({
        action: "send_message",
        conversation_id: activeConversation,
        content
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

  return (
    <SocketContext.Provider value={{
      messages,
      activeConversation,
      setActiveConversation,
      sendMessage,
      sendTyping,
      typingUser
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
