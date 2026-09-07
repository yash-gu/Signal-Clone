export default function SecurityBanner() {
  return (
    <div className="py-3 px-4 flex justify-center items-center gap-2 z-10">
      <span className="material-symbols-outlined text-slate-400 dark:text-neutral-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
      <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
        Messages and calls are end-to-end encrypted.
      </span>
    </div>
  );
}
