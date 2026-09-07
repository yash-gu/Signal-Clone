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
    <footer className="p-space-base bg-surface-container-lowest shadow-md z-20 flex flex-col">
      {replyingTo && (
        <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-t-xl mb-1 border-l-4 border-primary max-w-chat-max-width mx-auto w-full">
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs text-primary font-medium">Replying to {replyingTo.sender_name || "User"}</span>
            <span className="text-sm text-on-surface truncate">{replyingTo.content || "Attachment"}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-outline hover:text-on-surface p-1">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-space-sm max-w-chat-max-width mx-auto w-full">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*,video/*,application/pdf"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-colors cursor-pointer ${isUploading ? 'text-outline animate-pulse' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`} 
          title="Attach file or photo" 
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">attach_file</span>
        </button>
        <div className={`flex-1 relative flex items-center bg-surface-container-low px-space-md py-space-xs focus-within:bg-surface-container-lowest focus-within:shadow-sm transition-all ${replyingTo ? 'rounded-b-full rounded-tr-full' : 'rounded-full'}`}>
          <input 
            autoComplete="off" 
            className="w-full bg-transparent text-on-surface placeholder:text-outline font-body-md text-body-md outline-none py-1.5 pr-20" 
            placeholder={expiresIn ? `Message (disappears in ${expiresIn}s)` : "Signal message"} 
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-3 flex items-center gap-space-2xs text-outline">
            <div className="relative" ref={emojiPickerRef}>
              <button 
                className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${showEmojiPicker ? 'text-primary' : 'hover:text-on-surface'}`} 
                title="Insert Emoji" 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-4 z-[9999] shadow-2xl rounded-xl overflow-hidden border border-outline-variant/20">
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
            <button className="w-8 h-8 flex items-center justify-center hover:text-on-surface transition-colors cursor-pointer" title="Voice note" type="button">
              <span className="material-symbols-outlined text-xl">mic</span>
            </button>
          </div>
        </div>
        <button 
          disabled={!content.trim() && !isUploading}
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
          title="Send Encrypted Message" 
          type="submit"
        >
          <span className="material-symbols-outlined text-xl leading-none">send</span>
        </button>
      </form>
    </footer>
  );
}
