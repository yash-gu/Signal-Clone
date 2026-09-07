export default function SearchBar() {
  return (
    <div className="px-4 pb-3">
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3 text-slate-400 dark:text-neutral-500 text-[18px] pointer-events-none">search</span>
        <input 
          className="w-full bg-slate-100 dark:bg-[#2a2b2e] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-neutral-500 rounded-lg pl-9 pr-10 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all border border-transparent dark:border-[#383a3f]" 
          id="chat-search-input" 
          placeholder="Search" 
          type="text"
        />
        <button className="absolute right-2 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer" title="Filter unread">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
        </button>
      </div>
    </div>
  );
}
