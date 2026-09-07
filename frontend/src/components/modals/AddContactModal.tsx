"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface AddContactModalProps {
  onClose: () => void;
  onContactAdded: () => void;
}

export default function AddContactModal({ onClose, onContactAdded }: AddContactModalProps) {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);

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
        setSearchResults(data);
      })
      .catch(console.error);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, token]);

  const addContact = async (userId: number) => {
    setIsAdding(true);
    try {
      const res = await fetch(`/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ contact_id: userId })
      });
      if (res.ok) {
        showToast("Contact added successfully", "success");
        onContactAdded();
        onClose();
      } else {
        const errorData = await res.json();
        showToast(errorData.detail || "Failed to add contact", "error", "Error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error while adding contact", "error", "Error");
    } finally {
      setIsAdding(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#202124] rounded-3xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden">
        
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#2e2f33] flex items-center justify-center text-slate-500 dark:text-neutral-400 transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Add Contact</h2>
        </div>

        <div className="p-6 pt-2">
          <p className="text-sm text-slate-500 dark:text-neutral-400 mb-4">
            Search for people by their phone number or username.
          </p>

          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">search</span>
            <input 
              type="text" 
              placeholder="Phone number or username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#18181b] text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2C6BED]/50 transition-all placeholder:text-slate-400 border border-slate-200 dark:border-neutral-800"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1">
            {searchResults.map(user => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#2e2f33] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#18181b] flex items-center justify-center text-slate-600 dark:text-neutral-400 font-bold">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-slate-900 dark:text-white font-medium text-sm">{user.display_name}</span>
                    <span className="text-xs text-slate-500 dark:text-neutral-500">@{user.username}</span>
                  </div>
                </div>
                <button 
                  onClick={() => addContact(user.id)}
                  disabled={isAdding}
                  className="px-3 py-1.5 bg-[#2C6BED]/10 text-[#2C6BED] font-medium rounded-lg text-sm hover:bg-[#2C6BED] hover:text-white transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            ))}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-center text-slate-500 dark:text-neutral-500 py-4 text-sm">No users found.</p>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
