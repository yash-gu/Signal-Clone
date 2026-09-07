import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";
import LocalKeyFooter from "./LocalKeyFooter";

export default function Sidebar() {
  return (
    <aside className="w-96 flex-shrink-0 bg-surface-container-lowest flex flex-col h-full shadow-sm z-10 select-none border-r border-outline-variant/30">
      <SidebarHeader />
      <SearchBar />
      <ConversationList />
      <LocalKeyFooter />
    </aside>
  );
}
