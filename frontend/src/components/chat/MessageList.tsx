import MessageBubble from "./MessageBubble";

export default function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto px-space-xl py-space-lg space-y-space-md z-0 flex flex-col justify-start" id="message-container">
      <div className="flex items-center justify-center my-space-base">
        <span className="px-space-md py-space-2xs rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-xs select-none">
          Today
        </span>
      </div>
      
      <MessageBubble 
        isOutgoing={false}
        content="Hey Sarah! Did you push the latest commit for the Signal protocol upgrade?"
        timestamp="12:40 PM"
      />
      
      <MessageBubble 
        isOutgoing={true}
        content="Just did! All automated tests passed and the handshake is verified."
        timestamp="12:42 PM"
        status="READ"
      />
      
      <MessageBubble 
        isOutgoing={false}
        content="Awesome. Let me know when you want to run the live test session."
        timestamp="12:44 PM"
      />
      
      <MessageBubble 
        isOutgoing={true}
        content="Sounds good! See you at 4pm then"
        timestamp="12:45 PM"
        status="DELIVERED"
      />
      
      <div id="new-messages-anchor"></div>
    </div>
  );
}
