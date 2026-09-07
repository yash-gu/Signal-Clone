export default function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="h-16 w-full px-space-base flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-sm">
            <img 
              alt="Signal Messenger Logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsVliTSUnzQTMtGl1WHRXFkQtCjmADqCj1z_DikSgT3mjI0ux_D43fRpJwsWX9Sp6pKuFA2Xqd2Bwv5RN4Mv6OhiU3I6SiMioPSRceXplehNNHjDaU5n3sEyxkCRuEn3zlFdgLlc2unuovmRAIAh1sT1Vfg1emNamhR7DmVMBkgjZ2UtFJc3PxoVhJ0bGteydmCLB37oRkkX2vdpp9bYn5jsSJ8x_I6I7Vy-Z0WvIprZRA_Jcg0Gxf"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Signal</span>
          </div>
          <div className="h-4 w-px bg-outline-variant/40 hidden md:block"></div>
          <nav className="flex items-center gap-space-xs">
            <a aria-current="page" className="px-space-md py-space-xs rounded-xl transition-colors bg-surface-container-high text-on-surface font-semibold" href="#">Chats</a>
            <a className="px-space-md py-space-xs rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors" href="#">New Group</a>
            <a className="px-space-md py-space-xs rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors" href="#">Account Setup</a>
          </nav>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-2xs rounded-full">
            <span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
            <span className="font-label-sm text-label-sm text-secondary font-medium">E2EE Active</span>
          </div>
          <div className="relative flex items-center justify-center cursor-pointer">
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZxLdspWpUESe_QrNiewU1oZjdk3AiApPBOSnqyb4rEXKuCXHIZyeHLUog1z53_8m112827cRb8OrU_iHceijaz_tduw7zZ3khuLUes0nkuSfXDRyjjY6YC8kfhzSyCLtOW90-hlEEKJz8Qi1hVOoLFyW45iFDtIfGc_zKDdgnNH2KF0O7o7Xq_hhrt-whR5yz0aw8599H6batxEXU5K7Vvg8hsOQj8AlThiGNn7OTtRGXfPqX0ic8"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
