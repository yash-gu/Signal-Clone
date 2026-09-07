"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

interface CreateGroupModalProps {
  onClose: () => void;
}

export default function CreateGroupModal({ onClose }: CreateGroupModalProps) {
  const { token, user } = useAuth();
  const { setActiveConversation } = useSocket();
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
        // Filter out already selected contacts
        const filtered = data.filter((u: any) => !selectedContacts.some(c => c.id === u.id));
        setSearchResults(filtered);
      })
      .catch(console.error);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, token, selectedContacts]);

  const toggleContact = (contact: any) => {
    setSelectedContacts([...selectedContacts, contact]);
    setSearchQuery("");
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

  return (
    <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-low rounded-3xl w-full max-w-md shadow-lg border border-outline-variant/30 flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <h2 className="text-title-lg font-title-lg text-on-surface">New Group</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Group Name</label>
            <input 
              type="text" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="E.g. Weekend Plans"
              className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl text-body-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant"
            />
          </div>

          <div>
            <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Members ({selectedContacts.length})</label>
            
            {/* Selected Pills */}
            {selectedContacts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedContacts.map(c => (
                  <div key={c.id} className="flex items-center gap-1.5 bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full text-label-md">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[10px]">
                      {c.display_name.charAt(0).toUpperCase()}
                    </div>
                    {c.display_name}
                    <button onClick={() => removeContact(c.id)} className="ml-1 hover:text-primary">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative mb-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">search</span>
              <input 
                type="text" 
                placeholder="Search contacts to add..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-high text-on-surface pl-10 pr-4 py-2.5 rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="bg-surface-container-highest rounded-xl max-h-40 overflow-y-auto mt-2">
                {searchResults.map(user => (
                  <div 
                    key={user.id}
                    onClick={() => toggleContact(user)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface-container-lowest transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      {user.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body-md font-medium text-on-surface">{user.display_name}</span>
                      <span className="text-body-sm text-on-surface-variant">@{user.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container">
          <button 
            onClick={createGroup}
            disabled={!groupName.trim() || selectedContacts.length === 0 || isCreating}
            className="w-full h-12 bg-primary text-on-primary rounded-xl font-label-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? "Creating..." : "Create Group"}
          </button>
        </div>

      </div>
    </div>
  );
}
