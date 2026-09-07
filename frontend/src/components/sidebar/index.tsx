import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";

export default function Sidebar() {
  return (
    <aside className="w-full h-full bg-surface-container-lowest flex flex-col shadow-sm z-10 select-none">
      <SidebarHeader />
      <ConversationList />
    </aside>
  );
}
