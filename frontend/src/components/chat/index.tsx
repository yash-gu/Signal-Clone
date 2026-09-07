import ChatHeader from "./ChatHeader";
import SecurityBanner from "./SecurityBanner";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatPane() {
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
