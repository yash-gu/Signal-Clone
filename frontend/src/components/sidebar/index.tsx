"use client";
import { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";

import NewChatSidebar from "./NewChatSidebar";

export default function Sidebar() {
  const [showNewChat, setShowNewChat] = useState(false);

  return (
    <aside className="w-80 md:w-96 shrink-0 h-full bg-white dark:bg-[#202124] border-r border-slate-200 dark:border-[#2e2f33] flex flex-col z-10 select-none">
      {showNewChat ? (
        <NewChatSidebar onClose={() => setShowNewChat(false)} />
      ) : (
        <>
          <SidebarHeader onNewChat={() => setShowNewChat(true)} />
          <ConversationList />
        </>
      )}
    </aside>
  );
}
