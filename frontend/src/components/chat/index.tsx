import { useSocket } from "@/context/SocketContext";
import ChatHeader from "./ChatHeader";
import SecurityBanner from "./SecurityBanner";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import GroupSettingsPanel from "./GroupSettingsPanel";
import { useState } from "react";

export default function ChatPane() {
  const { activeConversation } = useSocket();
  const [showSettings, setShowSettings] = useState(false);

  if (!activeConversation) {
    return (
      <section className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-[#121214] relative min-w-0">
        <div className="text-center z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-neutral-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px] text-slate-300 dark:text-neutral-700" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          </div>
          <h2 className="text-slate-800 dark:text-white font-bold text-xl mt-4">Welcome to Signal</h2>
          <p className="text-slate-500 dark:text-neutral-400 mt-2 text-sm">See what's new in this update</p>
        </div>
      </section>
    );
  }

  return (
    <div className="flex w-full h-full">
      <section className="flex-1 flex flex-col h-full bg-white dark:bg-[#121214] relative min-w-0">
        <ChatHeader showSettings={showSettings} setShowSettings={setShowSettings} />
        <SecurityBanner />
        <MessageList />
        <MessageInput />
      </section>
      
      {showSettings && activeConversation && (
        <GroupSettingsPanel 
          conversationId={activeConversation} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
}
