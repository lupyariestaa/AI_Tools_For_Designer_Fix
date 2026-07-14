import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  History, 
  Download, 
  Settings, 
  LogOut, 
  Coins, 
  Menu, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: {
    name: string;
    email: string;
    role: 'GUEST' | 'FREE_USER' | 'PREMIUM_USER' | 'ADMIN';
    credits: number;
    avatar: string;
  } | null;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout
}: SidebarProps) {
  // Default to collapsed on tablet (medium screens) and expanded on large screens
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    // Set initial
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'workbench', label: 'Studio Workspace', icon: Sparkles },
    { id: 'batch', label: 'Batch Processing', icon: Layers },
    { id: 'history', label: 'Activity History', icon: History },
    { id: 'downloads', label: 'Download Center', icon: Download },
    { id: 'settings', label: 'Settings Center', icon: Settings },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shrink-0 z-30 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header / Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in whitespace-nowrap">
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                Studio Vision
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-widest text-brand-600">
                SaaS v1.0
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button inside Sidebar */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Credit Tokens Widget */}
      {currentUser && !isCollapsed && (
        <div className="p-4 mx-4 mt-4 rounded-xl bg-amber-50 border border-amber-200/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <div className="text-left">
              <p className="text-[10px] text-amber-600 uppercase font-bold tracking-wider">Remaining</p>
              <p className="text-xs font-bold text-amber-900">{currentUser.credits} Tokens</p>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-white text-slate-600 border border-amber-200">
            {currentUser.role === 'PREMIUM_USER' ? 'PRO' : 'FREE'}
          </span>
        </div>
      )}

      {currentUser && isCollapsed && (
        <div className="my-4 flex justify-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600" title={`${currentUser.credits} Tokens Available`}>
            <Coins className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
        <span className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-2 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? '•' : 'Dashboard Menu'}
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              title={item.label}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Profile / Footer Area */}
      {currentUser && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt="Avatar" 
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={onLogout}
                title="Log out"
                className="w-8 h-8 rounded-lg border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isCollapsed && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={onLogout}
                title="Log out"
                className="w-8 h-8 rounded-lg border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
