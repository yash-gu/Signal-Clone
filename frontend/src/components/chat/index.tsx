import { useSocket } from "@/context/SocketContext";
import ChatHeader from "./ChatHeader";
import SecurityBanner from "./SecurityBanner";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatPane() {
  const { activeConversation } = useSocket();

  if (!activeConversation) {
    return (
      <section className="flex-1 flex flex-col items-center justify-center h-full bg-surface-container-low relative min-w-0">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0052cd_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="text-center z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 shadow-sm overflow-hidden p-4">
            <img src="/logo.png" alt="Signal Web Clone Logo" className="w-full h-full object-contain opacity-60" />
          </div>
          <h2 className="text-title-lg font-title-lg text-on-surface mb-2 tracking-tight">Signal Web Clone</h2>
          <p className="text-body-md text-on-surface-variant max-w-sm">Select a conversation from the sidebar or start a new chat to begin messaging.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col h-full bg-surface-container-low relative min-w-0">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0052cd_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <ChatHeader />
      <SecurityBanner />
      <MessageList />
      <MessageInput />
    </section>
  );
}
