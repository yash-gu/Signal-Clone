export default function MessageInput() {
  return (
    <footer className="p-space-base bg-surface-container-lowest shadow-md z-20">
      <form className="flex items-center gap-space-sm max-w-chat-max-width mx-auto">
        <button className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer" title="Attach file or photo" type="button">
          <span className="material-symbols-outlined text-2xl">attach_file</span>
        </button>
        <div className="flex-1 relative flex items-center bg-surface-container-low rounded-full px-space-md py-space-xs focus-within:bg-surface-container-lowest focus-within:shadow-sm transition-all">
          <input 
            autocomplete="off" 
            className="w-full bg-transparent text-on-surface placeholder:text-outline font-body-md text-body-md outline-none py-1.5 pr-20" 
            placeholder="Signal message" 
            type="text"
          />
          <div className="absolute right-3 flex items-center gap-space-2xs text-outline">
            <button className="w-8 h-8 flex items-center justify-center hover:text-on-surface transition-colors cursor-pointer" title="Insert Emoji" type="button">
              <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:text-on-surface transition-colors cursor-pointer" title="Voice note" type="button">
              <span className="material-symbols-outlined text-xl">mic</span>
            </button>
          </div>
        </div>
        <button className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer" title="Send Encrypted Message" type="submit">
          <span className="material-symbols-outlined text-xl leading-none">send</span>
        </button>
      </form>
    </footer>
  );
}
