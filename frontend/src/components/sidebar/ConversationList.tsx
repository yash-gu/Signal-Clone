export default function ConversationList() {
  return (
    <>
      {/* Filter Tabs */}
      <div className="px-space-base py-space-xs flex items-center justify-between text-on-surface-variant">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Direct &amp; Groups</span>
        <span className="font-code-sm text-[0.6875rem] text-primary flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full">
          <span className="material-symbols-outlined text-xs">lock</span> E2EE
        </span>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto px-space-xs space-y-space-2xs divide-y divide-transparent pb-4">
        
        {/* Active Conversation Item */}
        <div className="flex items-center gap-space-md p-space-sm rounded-xl bg-primary-fixed/30 cursor-pointer shadow-xs transition-all relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container rounded-r-full"></div>
          <div className="relative flex-shrink-0">
            <img 
              className="w-12 h-12 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMxFp_S9S8SF06GkE580psfTN3S0sSUkPzaEwSacGfAiPJbAgrx79WJmd7w9xt5c16KG-5MFpZSlPEvP2QZwgvhr3_H20l2WCTprkO6blD_GTBe7UWy02GedjiByP1leD5qz3dQIdtlV6Rcbmto3FCHZOYt2Yo9csqmQnD9eRI2XuvH73JTZa7-qOCFCuIGRhvzxxCOE4CBVgFF-TUaECh7-q-b4CaQK3Mfr1GTdaZFzvTTXZEyC27" 
              alt="Alex"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full shadow-xs"></span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-baseline justify-between mb-0.5">
              <span className="font-headline-sm text-headline-sm text-on-surface truncate">Alex Rivera</span>
              <span className="font-timestamp text-timestamp text-primary font-medium">12:45 PM</span>
            </div>
            <div className="flex items-center justify-between gap-space-xs">
              <p className="font-body-sm text-body-sm text-on-surface truncate font-medium">Sounds good! See you at 4pm then 🔒</p>
              <span className="flex-shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold flex items-center justify-center">
                2
              </span>
            </div>
          </div>
        </div>

        {/* Group Conversation */}
        <div className="flex items-center gap-space-md p-space-sm rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors">
          <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-2xl">hub</span>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-surface-container-lowest rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-baseline justify-between mb-0.5">
              <span className="font-headline-sm text-headline-sm text-on-surface truncate flex items-center gap-1">
                Core Engineering
              </span>
              <span className="font-timestamp text-timestamp text-outline">11:20 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                <span className="text-on-surface font-medium">Elena:</span> PR #142 is merged to main
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}
