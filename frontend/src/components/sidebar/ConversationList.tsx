"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

interface Conversation {
  id: number;
  name: string | null;
  is_group: boolean;
  participants: any[];
  created_at: string;
  last_message?: string | null;
  last_message_time?: string | null;
  unread_count: number;
}

export default function ConversationList() {
  const { token, user } = useAuth();
  const { activeConversation, setActiveConversation, messages } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Re-fetch conversations when a new message is received (messages array changes length)
  useEffect(() => {
    if (!token) return;
    fetch(`/api/conversations/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        console.error("Expected array of conversations but got:", data);
        setConversations([]);
      }
    })
    .catch(console.error);
  }, [token, messages.length]); // Refresh list when messages arrive

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim() || !token) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const delay = setTimeout(() => {
      fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSearchResults(data);
        } else {
          console.error("Expected array for search results but got:", data);
          setSearchResults([]);
        }
      })
      .catch(console.error);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, token]);

  const handleContactClick = async (contactId: number) => {
    try {
      const res = await fetch(`/api/conversations/direct`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ contact_id: contactId })
      });
      if (res.ok) {
        const data = await res.json();
        
        // Fetch updated conversations list so the new chat appears in the sidebar
        const convsRes = await fetch(`/api/conversations/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (convsRes.ok) {
          setConversations(await convsRes.json());
        }
        
        setActiveConversation(data.conversation_id);
        setSearchQuery(""); // Clear search
      }
    } catch (e) {
      console.error("Error creating direct conversation", e);
    }
  };
  return (
    <>
      {/* Filter Tabs / Search Bar */}
      <div className="px-space-md py-space-xs mb-2">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">search</span>
          <input 
            type="text" 
            placeholder="Search contacts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-high text-on-surface pl-10 pr-4 py-2 rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant"
          />
          {searchQuery && (
             <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
               <span className="material-symbols-outlined text-sm">close</span>
             </button>
          )}
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto px-space-xs space-y-space-2xs divide-y divide-transparent pb-4">
        {isSearching ? (
          <div className="px-2">
            <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2 pl-2 mt-2">Contacts</h3>
            {searchResults.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant p-2 text-center mt-4">No contacts found</p>
            ) : (
              searchResults.map(user => (
                <div 
                  key={user.id}
                  onClick={() => handleContactClick(user.id)}
                  className="flex items-center gap-space-md p-space-sm rounded-xl cursor-pointer transition-all hover:bg-surface-container-low"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-headline-sm">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">{user.display_name}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">@{user.username}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : conversations.map(conv => {
          const isActive = conv.id === activeConversation;
          let displayName = conv.name || "Unknown Conversation";
          
          if (!conv.is_group && conv.participants) {
            const otherUser = conv.participants.find((p: any) => p.user_id !== user?.id);
            if (otherUser && otherUser.user) {
              displayName = otherUser.user.display_name || otherUser.user.username;
            }
          }

          return (
            <div 
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`flex items-center gap-space-md p-space-sm rounded-xl cursor-pointer transition-all relative overflow-hidden group ${isActive ? "bg-primary-fixed/30 shadow-xs" : "hover:bg-surface-container-low"}`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container rounded-r-full"></div>}
              <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center shadow-xs overflow-hidden">
                 {conv.is_group ? (
                   <span className="material-symbols-outlined text-2xl">hub</span>
                 ) : (
                   <span className="font-headline-sm text-headline-sm text-on-surface flex items-center justify-center">
                     {displayName.charAt(0).toUpperCase()}
                   </span>
                 )}
                {!conv.is_group && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-surface-container-lowest rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-baseline justify-between mb-0.5">
                  <span className={`font-headline-sm text-headline-sm truncate ${conv.unread_count > 0 ? "text-on-surface font-bold" : "text-on-surface"}`}>
                    {displayName}
                  </span>
                  <span className={`text-[11px] font-medium whitespace-nowrap ml-2 ${conv.unread_count > 0 ? "text-primary" : "text-on-surface-variant"}`}>
                    {new Date(conv.last_message_time || conv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-space-xs">
                  <p className={`font-body-sm text-body-sm truncate ${conv.unread_count > 0 ? "text-on-surface font-semibold" : "text-on-surface-variant"}`}>
                    {conv.last_message || "No messages yet"}
                  </p>
                  {conv.unread_count > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                      {conv.unread_count > 99 ? '99+' : conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
