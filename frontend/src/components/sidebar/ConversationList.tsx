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
  last_message_sender_id?: number | null;
  last_message_status?: string | null;
  unread_count: number;
}

const formatMessageTime = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString + 'Z');
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffHours < 48) return "Yesterday";
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });
};

export default function ConversationList() {
  const { token, user } = useAuth();
  const { activeConversation, setActiveConversation, messages, refreshConversationsTrigger } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);

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
  }, [token, messages.length, refreshConversationsTrigger]); // Refresh list when messages arrive or trigger changes

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
  }, [searchQuery]);

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
      <div className="px-4 pb-3 flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 dark:text-neutral-500 text-[18px] pointer-events-none">search</span>
          <input 
            type="text" 
            placeholder={filterUnread ? "Search unread chats" : "Search"} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-[#2a2b2e] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-neutral-500 pl-9 pr-8 py-2 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all border border-transparent dark:border-[#383a3f]"
          />
          {searchQuery && (
             <button onClick={() => setSearchQuery("")} className="absolute right-2 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300">
               <span className="material-symbols-outlined text-[18px]">close</span>
             </button>
          )}
        </div>
        
        <button 
          onClick={() => setFilterUnread(!filterUnread)} 
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${filterUnread ? 'bg-[#3b82f6] text-white' : 'text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hover:bg-[#2a2b2e]'}`} 
          title="Filter unread"
        >
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
        </button>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto px-space-xs space-y-space-2xs divide-y divide-transparent pb-4">
        {isSearching ? (() => {
          const term = searchQuery.toLowerCase();
          const filteredConvs = conversations.filter(c => {
            const nameMatch = c.name?.toLowerCase().includes(term);
            const participantMatch = c.participants?.some((p: any) => 
                p.user?.display_name?.toLowerCase().includes(term) || 
                p.user?.username?.toLowerCase().includes(term)
            );
            return nameMatch || participantMatch;
          });
          
          if (filteredConvs.length === 0) {
            return (
              <div className="px-2">
                <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2 pl-2 mt-2">Contacts</h3>
                <p className="text-body-sm text-on-surface-variant p-2 text-center mt-4">No contacts found</p>
              </div>
            );
          }
          
          return (
            <div className="px-2">
              <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2 pl-2 mt-2">Contacts</h3>
              {filteredConvs.map(conv => {
                let displayName = conv.name || "Unknown Conversation";
                let avatarUrl: string | null = null;
                if (!conv.is_group && conv.participants) {
                  const otherUser = conv.participants.find((p: any) => p.user_id !== user?.id);
                  if (otherUser && otherUser.user) {
                    displayName = otherUser.user.display_name || otherUser.user.username;
                    avatarUrl = otherUser.user.avatar_url;
                  }
                }
                return (
                  <div 
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv.id);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-space-md p-space-sm rounded-xl cursor-pointer transition-all hover:bg-surface-container-low"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-headline-sm overflow-hidden">
                      {conv.is_group ? (
                        <span className="material-symbols-outlined text-[20px]">hub</span>
                      ) : avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-on-surface">{displayName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })() : (() => {
          const displayedConversations = filterUnread ? conversations.filter(c => c.unread_count > 0) : conversations;
          if (displayedConversations.length === 0) {
            return (
              <div className="flex flex-col items-center h-full pt-12">
                {filterUnread ? (
                  <>
                    <h2 className="text-slate-900 dark:text-white font-semibold mb-12">Filtered by unread</h2>
                    <h3 className="text-slate-800 dark:text-neutral-300 font-medium text-lg">No unread chats</h3>
                    <button 
                      onClick={() => setFilterUnread(false)} 
                      className="mt-6 px-6 py-2 bg-slate-200 dark:bg-[#383a3f] hover:bg-slate-300 dark:hover:bg-[#4a4d53] text-slate-900 dark:text-white font-medium rounded-full transition-colors"
                    >
                      Clear filter
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-slate-800 dark:text-neutral-300 font-medium text-lg mt-32">No chats</h3>
                    <p className="text-slate-500 dark:text-neutral-400 text-sm mt-2">Recent chats will appear here.</p>
                  </>
                )}
              </div>
            );
          }
          return displayedConversations.map(conv => {
          const isActive = conv.id === activeConversation;
          let displayName = conv.name || "Unknown Conversation";
          let avatarUrl: string | null = null;
          
          if (!conv.is_group && conv.participants) {
            const otherUser = conv.participants.find((p: any) => p.user_id !== user?.id);
            if (otherUser && otherUser.user) {
              displayName = otherUser.user.display_name || otherUser.user.username;
              avatarUrl = otherUser.user.avatar_url;
            }
          }

          return (
            <div 
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all relative overflow-hidden group ${isActive ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-slate-50 dark:hover:bg-[#2a2b2e]"}`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500 rounded-r-full"></div>}
              <div className="relative flex-shrink-0 w-12 h-12">
                <div className={`w-full h-full rounded-full text-slate-700 dark:text-neutral-200 flex items-center justify-center shadow-sm overflow-hidden ${conv.is_group ? 'bg-[#f6f0ce] dark:bg-[#4a452a] text-[#795f00] dark:text-[#f6f0ce]' : 'bg-[#c3e6cb] dark:bg-[#2a4534] text-[#155724] dark:text-[#c3e6cb]'}`}>
                   {conv.is_group ? (
                     <span className="material-symbols-outlined text-[24px]">group</span>
                   ) : avatarUrl ? (
                     <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                   ) : (
                     <span className="font-semibold text-lg flex items-center justify-center">
                       {displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || displayName.charAt(0).toUpperCase()}
                     </span>
                   )}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className={`text-sm truncate ${conv.unread_count > 0 ? "text-slate-900 dark:text-white font-bold" : "text-slate-900 dark:text-neutral-200 font-medium"}`}>
                      {displayName}
                    </span>
                    {!conv.is_group && (
                      <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    )}
                  </div>
                  <span className={`text-[11px] font-medium whitespace-nowrap ml-2 ${conv.unread_count > 0 ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-neutral-500"}`}>
                    {formatMessageTime(conv.last_message_time || conv.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 min-w-0">
                    {conv.last_message_sender_id === user?.id && !conv.unread_count && (
                      <span className="material-symbols-outlined text-[14px] text-slate-400 dark:text-neutral-500 shrink-0" style={{ fontVariationSettings: "'FILL' 0" }}>done_all</span>
                    )}
                    <p className={`text-xs truncate ${conv.unread_count > 0 ? "text-slate-900 dark:text-white font-semibold" : "text-slate-500 dark:text-neutral-400"}`}>
                      {conv.last_message || "No messages yet"}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                      {conv.unread_count > 99 ? '99+' : conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })})()}
      </div>
    </>
  );
}
