export default function SecurityBanner() {
  return (
    <div className="py-space-xs px-space-base bg-surface-container flex justify-center items-center gap-space-xs shadow-xs z-10">
      <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
      <span className="font-label-sm text-label-sm text-on-surface font-medium">End-to-end encrypted</span>
      <span className="font-timestamp text-timestamp text-outline-variant">•</span>
      <span className="font-code-sm text-[0.6875rem] text-on-surface-variant">Curve25519 Double Ratchet</span>
      <button className="ml-space-xs text-primary font-label-sm text-label-sm underline hover:text-on-primary-fixed-variant cursor-pointer">Verify Safety Numbers</button>
    </div>
  );
}
