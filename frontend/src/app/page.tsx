import Sidebar from "@/components/sidebar";
import ChatPane from "@/components/chat";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden">
        <Sidebar />
        
        <ChatPane />
      </div>
    </div>
  );
}
