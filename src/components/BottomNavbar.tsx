import React from 'react';
import { Sparkles, Layers, History, Download, Settings } from 'lucide-react';

interface BottomNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNavbar({ activeTab, setActiveTab }: BottomNavbarProps) {
  return (
    <div className="fixed bottom-6 left-4 right-4 md:hidden z-50">
      {/* Floating menu background */}
      <div className="relative bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-2xl h-16 flex items-center px-2 justify-around">
        
        {/* Left Item 1: Batch */}
        <button
          onClick={() => setActiveTab('batch')}
          className="flex flex-col items-center justify-center w-12 h-12 relative transition-all"
        >
          <Layers 
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'batch' 
                ? 'text-brand-600 scale-110' 
                : 'text-slate-400 hover:text-slate-600'
            }`} 
          />
          {activeTab === 'batch' && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-brand-600 animate-pulse" />
          )}
        </button>

        {/* Left Item 2: History */}
        <button
          onClick={() => setActiveTab('history')}
          className="flex flex-col items-center justify-center w-12 h-12 relative transition-all"
        >
          <History 
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'history' 
                ? 'text-brand-600 scale-110' 
                : 'text-slate-400 hover:text-slate-600'
            }`} 
          />
          {activeTab === 'history' && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-brand-600 animate-pulse" />
          )}
        </button>

        {/* Center Prominent Bulging Button: Studio Workspace */}
        <div className="relative -mt-8 flex flex-col items-center justify-center">
          <button
            onClick={() => setActiveTab('workbench')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              activeTab === 'workbench'
                ? 'bg-brand-600 text-white shadow-brand-500/40 ring-4 ring-brand-100 scale-110'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-6 h-6" />
          </button>
          
          {/* Active dot below the center bulging button */}
          {activeTab === 'workbench' && (
            <span className="absolute -bottom-4 w-1 h-1 rounded-full bg-brand-600 animate-pulse" />
          )}
        </div>

        {/* Right Item 1: Downloads */}
        <button
          onClick={() => setActiveTab('downloads')}
          className="flex flex-col items-center justify-center w-12 h-12 relative transition-all"
        >
          <Download 
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'downloads' 
                ? 'text-brand-600 scale-110' 
                : 'text-slate-400 hover:text-slate-600'
            }`} 
          />
          {activeTab === 'downloads' && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-brand-600 animate-pulse" />
          )}
        </button>

        {/* Right Item 2: Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className="flex flex-col items-center justify-center w-12 h-12 relative transition-all"
        >
          <Settings 
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'settings' 
                ? 'text-brand-600 scale-110' 
                : 'text-slate-400 hover:text-slate-600'
            }`} 
          />
          {activeTab === 'settings' && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-brand-600 animate-pulse" />
          )}
        </button>

      </div>
    </div>
  );
}
