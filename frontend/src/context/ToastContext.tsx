"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info", title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== "undefined" && createPortal(
        <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div 
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border w-80 transform transition-all duration-300 animate-in slide-in-from-right-8 fade-in 
                ${toast.type === 'error' ? 'bg-red-50 border-red-100 dark:bg-red-950/40 dark:border-red-900/50' : ''}
                ${toast.type === 'success' ? 'bg-green-50 border-green-100 dark:bg-green-950/40 dark:border-green-900/50' : ''}
                ${toast.type === 'info' ? 'bg-white border-slate-100 dark:bg-[#202124] dark:border-neutral-800' : ''}
              `}
            >
              <div className={`mt-0.5 shrink-0 ${toast.type === 'error' ? 'text-red-500' : toast.type === 'success' ? 'text-green-500' : 'text-[#2C6BED]'}`}>
                <span className="material-symbols-outlined text-[20px]">
                  {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
                </span>
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                {toast.title && <span className={`font-semibold text-sm truncate ${toast.type === 'error' ? 'text-red-900 dark:text-red-200' : toast.type === 'success' ? 'text-green-900 dark:text-green-200' : 'text-slate-900 dark:text-white'}`}>{toast.title}</span>}
                <span className={`text-sm break-words ${toast.type === 'error' ? 'text-red-700 dark:text-red-300' : toast.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-slate-600 dark:text-neutral-300'}`}>{toast.message}</span>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className={`shrink-0 rounded-lg p-1 transition-colors ${toast.type === 'error' ? 'hover:bg-red-100 dark:hover:bg-red-900/50 text-red-400' : toast.type === 'success' ? 'hover:bg-green-100 dark:hover:bg-green-900/50 text-green-400' : 'hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400'}`}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
