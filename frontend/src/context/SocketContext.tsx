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
  sender_name?: string;
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
      fetch(`/api/messages/${activeConversation}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        // Automatically send a read receipt when we open a conversation
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
    }
  }, [activeConversation, token]);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/messages/ws?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message") {
        setMessages((prev) => [...prev, data.message]);
        
        // If we received a message from someone else, mark it as delivered
        if (data.message.sender_id !== user?.id) {
          ws.send(JSON.stringify({
            action: "message_delivered",
            message_id: data.message.id,
            conversation_id: data.message.conversation_id
          }));
          
          // If we are actively looking at this conversation, mark as read
          if (activeConversation === data.message.conversation_id) {
            ws.send(JSON.stringify({
              action: "messages_read",
              conversation_id: data.message.conversation_id
            }));
          }
        }
      } else if (data.type === "message_status_update") {
        // Update the status of a specific message
        if (data.conversation_id === activeConversation) {
          setMessages(prev => prev.map(msg => 
            msg.id === data.message_id ? { ...msg, status: data.status } : msg
          ));
        }
      } else if (data.type === "conversation_read") {
        // Mark all outgoing messages in this conversation as READ
        if (data.conversation_id === activeConversation) {
          setMessages(prev => prev.map(msg => 
            (msg.sender_id === user?.id && (msg.status === "SENT" || msg.status === "DELIVERED")) 
              ? { ...msg, status: "READ" } 
              : msg
          ));
        }
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
