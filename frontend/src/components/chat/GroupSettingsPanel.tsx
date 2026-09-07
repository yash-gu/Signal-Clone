"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

interface GroupSettingsPanelProps {
  conversationId: number;
  onClose: () => void;
}

export default function GroupSettingsPanel({ conversationId, onClose }: GroupSettingsPanelProps) {
  const { token, user } = useAuth();
  const [participants, setParticipants] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // For adding members
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, [conversationId]);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`/api/conversations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const convs = await res.json();
        const conv = convs.find((c: any) => c.id === conversationId);
        if (conv && conv.participants) {
          setParticipants(conv.participants);
          const me = conv.participants.find((p: any) => p.user_id === user?.id);
          setIsAdmin(me?.user?.is_admin || false);
        }
      }
    } catch (e) {
      console.error("Failed to fetch participants", e);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim() || !token) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(() => {
      fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Filter out existing participants
        const filtered = data.filter((u: any) => !participants.some(p => p.user_id === u.id));
        setSearchResults(filtered);
      })
      .catch(console.error);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, token, participants]);

  const handleAddMember = async (userId: number) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId })
      });
      if (res.ok) {
        setSearchQuery("");
        fetchParticipants();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/participants/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchParticipants();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-80 border-l border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#202124] flex flex-col h-full flex-shrink-0 shadow-xl">
      <div className="h-16 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between px-4 flex-shrink-0">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Group Settings</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-[#2e2f33] text-slate-500 transition-colors">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isAdmin && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Add Members</h4>
            <div className="relative mb-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">search</span>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white pl-9 pr-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2C6BED]/50 transition-all placeholder:text-slate-400"
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="bg-slate-50 dark:bg-[#18181b] rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-800 mb-4 max-h-40 overflow-y-auto">
                {searchResults.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-[#2e2f33] transition-colors">
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.display_name}</span>
                    <button onClick={() => handleAddMember(u.id)} className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/20 text-[#2C6BED] flex items-center justify-center hover:bg-[#2C6BED] hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-3">Members ({participants.length})</h4>
          <div className="space-y-3">
            {participants.map(p => {
              const u = p.user;
              const isMe = u.id === user?.id;
              const pIsAdmin = u.is_admin;
              
              return (
                <div key={u.id} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2a2b2e] text-[#2C6BED] flex items-center justify-center font-bold text-sm">
                    {u.display_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {isMe ? "You" : u.display_name}
                      </span>
                      {pIsAdmin && <span className="text-[9px] bg-slate-200 dark:bg-neutral-700 text-slate-600 dark:text-neutral-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Admin</span>}
                    </div>
                  </div>
                  
                  {isAdmin && !isMe && (
                    <button 
                      onClick={() => handleRemoveMember(u.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="Remove Member"
                    >
                      <span className="material-symbols-outlined text-[16px]">person_remove</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
