export default function SearchBar() {
  return (
    <div className="px-space-base pb-space-sm pt-space-xs">
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3.5 text-outline text-lg pointer-events-none">search</span>
        <input 
          className="w-full h-10 pl-10 pr-9 bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-xl outline-none focus:bg-surface-container-lowest focus:shadow-sm transition-all" 
          id="chat-search-input" 
          placeholder="Search messages, contacts" 
          type="text"
        />
        <button className="absolute right-3 hidden text-outline hover:text-on-surface transition-colors cursor-pointer" id="clear-search-btn">
          <span className="material-symbols-outlined text-base">cancel</span>
        </button>
      </div>
    </div>
  );
}
