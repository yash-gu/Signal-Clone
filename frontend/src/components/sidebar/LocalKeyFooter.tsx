export default function LocalKeyFooter() {
  return (
    <div className="p-space-base bg-surface-container-low m-space-xs rounded-xl flex items-center justify-between mt-auto shrink-0">
      <div className="flex items-center gap-space-sm">
        <span className="material-symbols-outlined text-secondary text-lg">vpn_key</span>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface font-semibold">Local Key Store</span>
          <span className="font-code-sm text-[0.625rem] text-on-surface-variant uppercase tracking-wider">Ratchet ID #8841-FC9A</span>
        </div>
      </div>
      <button className="text-outline hover:text-primary transition-colors cursor-pointer" title="Verify Identity">
        <span className="material-symbols-outlined text-lg">qr_code_2</span>
      </button>
    </div>
  );
}
