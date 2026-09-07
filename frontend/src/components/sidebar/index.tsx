import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";

export default function Sidebar() {
  return (
    <aside className="w-80 md:w-96 shrink-0 h-full bg-white dark:bg-[#202124] border-r border-slate-200 dark:border-[#2e2f33] flex flex-col z-10 select-none">
      <SidebarHeader />
      <ConversationList />
    </aside>
  );
}
