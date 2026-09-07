export default function LeftRail() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-16 bg-surface-container-low border-r border-outline-variant/30 flex flex-col items-center py-space-base z-40 justify-between">
      <nav className="flex flex-col items-center gap-space-sm">
        <a aria-current="page" className="w-10 h-10 flex items-center justify-center transition-all bg-primary-container text-on-primary-container rounded-xl" href="#">
          <span className="material-symbols-outlined">chat</span>
        </a>
        <a className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" href="#">
          <span className="material-symbols-outlined">archive</span>
        </a>
        <a className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" href="#">
          <span className="material-symbols-outlined">contacts</span>
        </a>
      </nav>
      <div className="flex flex-col items-center gap-space-sm">
        <a className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" href="#">
          <span className="material-symbols-outlined">settings</span>
        </a>
      </div>
    </aside>
  );
}
