"use client";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";

export default function MessageInput() {
  const { sendMessage, sendTyping, replyingTo, setReplyingTo, expiresIn } = useSocket();
  const { token } = useAuth();
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData: any) => {
    setContent(prev => prev + emojiData.emoji);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage(content.trim(), undefined, replyingTo?.id, expiresIn || undefined);
      setContent("");
      setReplyingTo(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e as any);
    } else {
      sendTyping();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/messages/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        // Send a message with the attachment url
        sendMessage(content.trim(), data.url, replyingTo?.id, expiresIn || undefined);
        setContent("");
        setReplyingTo(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <footer className="w-full bg-slate-50 dark:bg-[#121214] z-20 flex flex-col">
      {replyingTo && (
        <div className="flex items-center justify-between bg-white dark:bg-[#18181b] p-2 rounded-t-xl mb-1 border-l-4 border-blue-500 max-w-chat-max-width mx-auto w-full">
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs text-blue-500 font-medium">Replying to {replyingTo.sender_name || "User"}</span>
            <span className="text-sm text-slate-900 dark:text-white truncate">{replyingTo.content || "Attachment"}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-4 px-4 py-3 w-full max-w-chat-max-width mx-auto">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*,video/*,application/pdf"
        />
        
        {/* Emoji Button */}
        <div className="relative shrink-0 flex items-center" ref={emojiPickerRef}>
          <button 
            className={`flex items-center justify-center transition-colors cursor-pointer ${showEmojiPicker ? 'text-blue-500' : 'text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200'}`} 
            title="Insert Emoji" 
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <span className="material-symbols-outlined text-[26px]">sentiment_satisfied</span>
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-4 z-[9999] shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800">
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                theme={document.documentElement.classList.contains('dark') ? Theme.DARK : Theme.LIGHT}
                autoFocusSearch={false}
                lazyLoadEmojis={true}
                skinTonesDisabled
              />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex-1 flex items-center bg-slate-200 dark:bg-[#2a2b2e] rounded-full px-4 py-2 border border-transparent dark:border-[#383a3f]">
          <input 
            autoComplete="off" 
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-neutral-500 text-sm outline-none" 
            placeholder={expiresIn ? `Message (disappears in ${expiresIn}s)` : "Message"} 
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {content.trim() || isUploading ? (
            <button 
              disabled={isUploading}
              className={`w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`} 
              title="Send" 
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px] ml-1">send</span>
            </button>
          ) : (
            <button 
              onClick={() => alert("Voice notes coming soon!")} 
              className="flex items-center justify-center text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200 transition-colors cursor-pointer" 
              title="Voice note" 
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">mic</span>
            </button>
          )}

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 dark:bg-[#2a2b2e] text-slate-600 dark:text-neutral-300 transition-colors cursor-pointer border border-transparent dark:border-[#383a3f] ${isUploading ? 'animate-pulse' : 'hover:bg-slate-300 dark:hover:bg-[#383a3f]'}`} 
            title="Attach file" 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </form>
    </footer>
  );
}
