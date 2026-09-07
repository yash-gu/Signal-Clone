export default function MessageBubble({ 
  isOutgoing, 
  content, 
  timestamp, 
  status,
  senderName
}: { 
  isOutgoing: boolean;
  content: string;
  timestamp: string;
  status?: "SENT" | "DELIVERED" | "READ";
  senderName?: string;
}) {
  return (
    <div className={`flex flex-col ${isOutgoing ? "items-end ml-auto" : "items-start"} max-w-lg group`}>
      <div className={`relative max-w-[75%] ${isOutgoing ? "order-1" : "order-2"}`}>
        {!isOutgoing && senderName && (
          <div className="text-label-sm font-label-sm text-on-surface-variant mb-1 ml-1">{senderName}</div>
        )}
        <div className={`px-4 py-2.5 rounded-2xl relative shadow-sm group ${isOutgoing ? "bg-primary text-on-primary rounded-br-sm" : "bg-surface-container-high text-on-surface rounded-bl-sm"}`}>
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
      </div>
    </div>
  );
}
