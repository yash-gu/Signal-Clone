"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

interface ComposeModalProps {
  onClose: () => void;
}

export default function ComposeModal({ onClose }: ComposeModalProps) {
  const { token } = useAuth();
  const { setActiveConversation } = useSocket();
  
  const [mode, setMode] = useState<"direct" | "group">("direct");
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

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
        const filtered = data.filter((u: any) => !selectedContacts.some(c => c.id === u.id));
        setSearchResults(filtered);
      })
      .catch(console.error);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, token, selectedContacts]);

  const toggleContact = async (contact: any) => {
    if (mode === "group") {
      setSelectedContacts([...selectedContacts, contact]);
      setSearchQuery("");
    } else {
      // Direct mode: instantly start 1-1 chat
      setIsCreating(true);
      try {
        const res = await fetch(`/api/conversations/direct`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ contact_id: contact.id })
        });
        if (res.ok) {
          const data = await res.json();
          setActiveConversation(data.conversation_id);
          onClose();
        } else {
          alert("Failed to create chat");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const removeContact = (id: number) => {
    setSelectedContacts(selectedContacts.filter(c => c.id !== id));
  };

  const createGroup = async () => {
    if (!groupName.trim() || selectedContacts.length === 0) return;
    setIsCreating(true);
    try {
      const res = await fetch(`/api/conversations/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: groupName,
          contact_ids: selectedContacts.map(c => c.id)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveConversation(data.conversation_id);
        onClose();
      } else {
        alert("Failed to create group");
      }
    } catch (e) {
      console.error(e);
      alert("Error creating group");
    } finally {
      setIsCreating(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#202124] rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#2e2f33] flex items-center justify-center text-slate-500 dark:text-neutral-400 transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {mode === "direct" ? "New Message" : "New Group"}
          </h2>
        </div>

        <div className="p-6 pt-2 flex-1 overflow-y-auto space-y-6">
          
          {/* New Group Button (Only in direct mode) */}
          {mode === "direct" && (
            <button 
              onClick={() => { setMode("group"); setSearchQuery(""); }}
              className="flex items-center gap-4 w-full p-2 hover:bg-slate-50 dark:hover:bg-[#2e2f33] rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#2a2b2e] flex items-center justify-center text-slate-600 dark:text-neutral-300 group-hover:bg-[#2C6BED] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">group_add</span>
              </div>
              <span className="text-slate-800 dark:text-neutral-200 font-medium">New Group</span>
            </button>
          )}

          {/* Group Details (Only in group mode) */}
          {mode === "group" && (
            <div>
              <input 
                type="text" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name (e.g. Weekend Plans)"
                className="w-full bg-slate-50 dark:bg-[#18181b] text-slate-900 dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2C6BED]/50 transition-all placeholder:text-slate-400 border border-slate-200 dark:border-neutral-800"
              />
            </div>
          )}

          {/* Members / Search Area */}
          <div>
            {mode === "group" && selectedContacts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedContacts.map(c => (
                  <div key={c.id} className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#2a2b2e] text-slate-800 dark:text-neutral-200 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200 dark:border-neutral-700">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#2C6BED] dark:text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      {c.display_name.charAt(0).toUpperCase()}
                    </div>
                    {c.display_name}
                    <button onClick={() => removeContact(c.id)} className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative mb-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">search</span>
              <input 
                type="text" 
                placeholder={mode === "direct" ? "Search by name or username..." : "Add members..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#18181b] text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2C6BED]/50 transition-all placeholder:text-slate-400 border border-slate-200 dark:border-neutral-800"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-1">
                {searchResults.map(user => (
                  <div 
                    key={user.id}
                    onClick={() => toggleContact(user)}
                    className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-[#2e2f33] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#18181b] flex items-center justify-center text-slate-600 dark:text-neutral-400 font-bold">
                      {user.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-slate-900 dark:text-white font-medium">{user.display_name}</span>
                      <span className="text-sm text-slate-500 dark:text-neutral-500">@{user.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-center text-slate-500 dark:text-neutral-500 py-4">No users found.</p>
            )}
          </div>
        </div>

        {/* Group Create Button */}
        {mode === "group" && (
          <div className="p-4 border-t border-slate-100 dark:border-neutral-800">
            <button 
              onClick={createGroup}
              disabled={!groupName.trim() || selectedContacts.length === 0 || isCreating}
              className="w-full py-3 bg-[#2C6BED] text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Creating..." : "Create Group"}
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
