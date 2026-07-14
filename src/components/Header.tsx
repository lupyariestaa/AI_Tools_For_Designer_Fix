import React from 'react';
import { Sparkles, LogOut, Coins } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serverStatus: {
    online: boolean;
    gemini_api_active: boolean;
    queue_length: number;
  };
  currentUser: {
    name: string;
    email: string;
    role: 'GUEST' | 'FREE_USER' | 'PREMIUM_USER' | 'ADMIN';
    credits: number;
    avatar: string;
  } | null;
  onLogout: () => void;
}

export default function Header({ 
  darkMode, 
  setDarkMode, 
  activeTab, 
  setActiveTab, 
  serverStatus,
  currentUser,
  onLogout
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md smooth-all">
      <div className="px-6 h-16 flex items-center justify-between gap-4">
        {/* Project Branding Identity - Visible only on mobile since desktop has it in the Sidebar */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              Vision Studio
            </h1>
          </div>
        </div>

        {/* Desktop-only page title placeholder */}
        <div className="hidden md:block">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {activeTab === 'workbench' && 'Studio Workspace'}
            {activeTab === 'batch' && 'Batch Processing'}
            {activeTab === 'history' && 'Activity History'}
            {activeTab === 'downloads' && 'Download Center'}
            {activeTab === 'settings' && 'Settings Center'}
          </h2>
        </div>

        {/* Server State and Token Indicators */}
        <div className="flex items-center gap-3">
          {/* Diagnostic Stats */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/40 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Processor Engine:</span>
            <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[10px]">Active</span>
          </div>

          {/* User authenticated metrics (Credits & Quick Info) */}
          {currentUser && (
            <div className="flex items-center gap-2">
              {/* Credit Token Display (Mobile visible, compact) */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/20 text-xs font-semibold font-mono">
                <Coins className="w-3.5 h-3.5" />
                <span>{currentUser.credits} Tokens</span>
              </div>

              {/* Mobile Logout Button (Quick access in header) */}
              <button
                onClick={onLogout}
                title="Disconnect security session"
                className="md:hidden w-8 h-8 rounded-lg border border-rose-100 bg-rose-50 text-rose-600 flex items-center justify-center smooth-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
