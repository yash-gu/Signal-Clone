export default function MessageBubble({ 
  isOutgoing, 
  content, 
  timestamp, 
  status 
}: { 
  isOutgoing: boolean;
  content: string;
  timestamp: string;
  status?: "SENT" | "DELIVERED" | "READ";
}) {
  return (
    <div className={`flex flex-col ${isOutgoing ? "items-end ml-auto" : "items-start"} max-w-lg group`}>
      <div className="flex items-end gap-space-xs">
        <div className={`${isOutgoing ? "bg-primary-container text-on-primary rounded-br-xs" : "bg-surface-container-highest text-on-surface rounded-bl-xs"} rounded-2xl px-space-md py-space-sm shadow-xs`}>
          <p className={`font-body-md text-body-md leading-relaxed ${isOutgoing ? "text-white" : ""}`}>
            {content}
          </p>
          <div className={`flex items-center justify-end gap-1 mt-1 ${isOutgoing ? "text-white/80" : "text-on-surface-variant"} select-none`}>
            <span className="font-timestamp text-timestamp">{timestamp}</span>
            {isOutgoing && status && (
              <span className={`material-symbols-outlined text-[15px] leading-none ${status === "READ" ? "text-secondary-fixed" : ""}`}>
                {status === "SENT" ? "check" : "done_all"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
