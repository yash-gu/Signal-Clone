"use client";
import { useSocket, Message, MessageReaction } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

export default function MessageBubble({ 
  isOutgoing, 
  msg
}: { 
  isOutgoing: boolean;
  msg: Message;
}) {
  const { addReaction, removeReaction, setReplyingTo, messages } = useSocket();
  const { user } = useAuth();
  const { content, status, sender_name, created_at, attachment_url, reply_to_id, reactions, id } = msg;

  const timestamp = new Date(created_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
  const quotedMessage = reply_to_id ? messages.find(m => m.id === reply_to_id) : null;
  const myReaction = reactions?.find(r => r.user_id === user?.id);

  return (
    <div className={`flex flex-col ${isOutgoing ? "items-end ml-auto" : "items-start"} max-w-lg group relative`}>
      {/* Hover Action Menu */}
      <div className={`absolute top-0 -mt-6 hidden group-hover:flex items-center gap-1 bg-surface-container-high rounded-lg shadow-sm border border-outline-variant/30 p-1 z-10 ${isOutgoing ? "right-0" : "left-0"}`}>
        <button onClick={() => setReplyingTo(msg)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant transition-colors" title="Reply">
          <span className="material-symbols-outlined text-[16px]">reply</span>
        </button>
        <button onClick={() => addReaction(id, "👍")} className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant transition-colors" title="Thumbs Up">
          <span className="text-sm">👍</span>
        </button>
        <button onClick={() => addReaction(id, "❤️")} className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant transition-colors" title="Heart">
          <span className="text-sm">❤️</span>
        </button>
      </div>

      <div className={`relative max-w-[100%] ${isOutgoing ? "order-1" : "order-2"}`}>
        {!isOutgoing && sender_name && (
          <div className="text-label-sm font-label-sm text-on-surface-variant mb-1 ml-1">{sender_name}</div>
        )}
        <div className={`px-4 py-2.5 rounded-2xl relative shadow-sm group ${isOutgoing ? "bg-primary text-on-primary rounded-br-sm" : "bg-surface-container-high text-on-surface rounded-bl-sm"}`}>
          
          {/* Quoted Reply */}
          {quotedMessage && (
            <div className={`mb-2 p-2 rounded-lg border-l-4 text-xs opacity-90 ${isOutgoing ? "bg-primary-container text-on-primary-container border-on-primary" : "bg-surface-container-highest text-on-surface border-primary"}`}>
              <div className="font-semibold mb-0.5">{quotedMessage.sender_name || (quotedMessage.sender_id === user?.id ? "You" : "User")}</div>
              <div className="truncate">{quotedMessage.content || "Attachment"}</div>
            </div>
          )}

          {/* Attachment */}
          {attachment_url && (
            <div className="mb-2 rounded-lg overflow-hidden max-w-full">
              {attachment_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img src={attachment_url} alt="Attachment" className="max-w-[250px] rounded-lg object-contain" />
              ) : (
                <a href={attachment_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline text-sm">
                  <span className="material-symbols-outlined text-lg">description</span>
                  Download File
                </a>
              )}
            </div>
          )}

          <p className={`font-body-md text-body-md leading-relaxed ${isOutgoing ? "text-white" : ""}`}>
            {content}
          </p>
          <div className={`flex items-center justify-end gap-1 mt-1 ${isOutgoing ? "text-white/80" : "text-on-surface-variant"} select-none`}>
            <span className="font-timestamp text-timestamp">{timestamp}</span>
            {isOutgoing && status && (
              <span 
                className={`material-symbols-outlined text-[15px] leading-none ${status === "READ" ? "text-secondary-fixed" : ""}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {status === 'READ' ? 'done_all' : status === 'DELIVERED' ? 'done_all' : 'check'}
              </span>
            )}
          </div>
        </div>

        {/* Reactions underneath */}
        {reactions && reactions.length > 0 && (
          <div className={`flex items-center gap-1 mt-1 absolute -bottom-3 ${isOutgoing ? "right-1" : "left-1"}`}>
            {Array.from(new Set(reactions.map(r => r.emoji))).map(emoji => {
              const count = reactions.filter(r => r.emoji === emoji).length;
              const hasReacted = reactions.some(r => r.emoji === emoji && r.user_id === user?.id);
              return (
                <button 
                  key={emoji} 
                  onClick={() => hasReacted ? removeReaction(id) : addReaction(id, emoji)}
                  className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full border bg-surface text-on-surface shadow-sm ${hasReacted ? "border-primary text-primary bg-primary-container" : "border-outline-variant"}`}
                >
                  <span>{emoji}</span>
                  {count > 1 && <span className="font-bold">{count}</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
