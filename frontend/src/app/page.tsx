export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Sidebar Skeleton */}
        <aside className="w-96 flex-shrink-0 bg-surface-container-lowest flex flex-col h-full shadow-sm z-10 select-none border-r border-outline-variant/30">
          <div className="flex items-center justify-center h-full text-outline">
            Sidebar will go here
          </div>
        </aside>
        
        {/* Right Active Chat Pane Skeleton */}
        <section className="flex-1 flex flex-col h-full bg-surface-container-low relative min-w-0">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0052cd_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="flex items-center justify-center h-full text-outline z-10 relative">
            Select a conversation
          </div>
        </section>
      </div>
    </div>
  );
}
