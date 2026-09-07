"use client";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

interface LinkedDevicesModalProps {
  onClose: () => void;
}

export default function LinkedDevicesModal({ onClose }: LinkedDevicesModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#202124] rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-100 dark:border-neutral-800">
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#2e2f33] flex items-center justify-center text-slate-500 dark:text-neutral-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Linked Devices
          </h2>
        </div>

        <div className="p-6 pt-4 flex-1 overflow-y-auto space-y-6">
          <div className="flex flex-col items-center justify-center pt-2 pb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#2C6BED] mb-4">
              <span className="material-symbols-outlined text-[32px]">devices</span>
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-neutral-400">
              Signal messages are seamlessly and securely synced to your linked devices.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-3 px-2">
              Your Devices
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-neutral-800">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#2a2b2e] flex items-center justify-center text-slate-600 dark:text-neutral-400">
                  <span className="material-symbols-outlined text-[20px]">smartphone</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-slate-900 dark:text-white font-medium text-sm">iPhone 14 Pro</span>
                  <span className="text-xs text-slate-500 dark:text-neutral-500">This device</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#18181b] transition-colors border border-transparent">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#2a2b2e] flex items-center justify-center text-slate-600 dark:text-neutral-400">
                  <span className="material-symbols-outlined text-[20px]">laptop_mac</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-slate-900 dark:text-white font-medium text-sm">MacBook Pro (M2)</span>
                  <span className="text-xs text-green-600 dark:text-green-500">Active now</span>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors" title="Unlink Device">
                  <span className="material-symbols-outlined text-[20px]">link_off</span>
                </button>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#18181b] transition-colors border border-transparent">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#2a2b2e] flex items-center justify-center text-slate-600 dark:text-neutral-400">
                  <span className="material-symbols-outlined text-[20px]">desktop_windows</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-slate-900 dark:text-white font-medium text-sm">Windows 11 PC</span>
                  <span className="text-xs text-slate-500 dark:text-neutral-500">Last active 3 days ago</span>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors" title="Unlink Device">
                  <span className="material-symbols-outlined text-[20px]">link_off</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Link New Device Button */}
        <div className="p-4 border-t border-slate-100 dark:border-neutral-800">
          <button 
            onClick={() => alert("QR code scanning mock coming soon!")}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2C6BED] text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            Link New Device
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
