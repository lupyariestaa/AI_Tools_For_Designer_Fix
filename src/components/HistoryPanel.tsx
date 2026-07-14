import React, { useState } from 'react';
import { HistoryItem } from '../types/index.ts';
import { Search, Heart, Trash2, Calendar, FileType, CheckSquare, Square, Download, Share2, Tag, Archive } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  toggleFavorite: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  logDownload: (id: string, format: 'png' | 'jpg' | 'webp', quality: 'preview' | 'standard' | 'hd') => void;
  clearAllHistory: () => void;
}

export default function HistoryPanel({
  history,
  toggleFavorite,
  deleteHistoryItem,
  logDownload,
  clearAllHistory
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [toolFilter, setToolFilter] = useState<'ALL' | 'BG_REMOVER' | 'UPSCALER' | 'OCR'>('ALL');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'FILENAME' | 'SIZE'>('NEWEST');

  // Multi-select helpers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (filteredHistory: HistoryItem[]) => {
    if (selectedIds.length === filteredHistory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredHistory.map(item => item.id));
    }
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteHistoryItem(id));
    setSelectedIds([]);
  };

  const handleBulkDownload = () => {
    selectedIds.forEach(id => {
      const histItem = history.find(h => h.id === id);
      if (histItem) {
        triggerDownload(histItem);
      }
    });
    setSelectedIds([]);
  };

  const triggerDownload = (item: HistoryItem) => {
    if (!item.processedUrl) return;
    // Generate a secure, actual download trigger on the browser
    const link = document.createElement('a');
    link.href = item.processedUrl;
    link.download = `ai-vision-${item.filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Track download in analytics / download center
    logDownload(item.id, 'png', 'hd');
  };

  // Filter & sort logic
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTool = toolFilter === 'ALL' || item.toolType === toolFilter;
    const matchesFav = !showFavoritesOnly || item.isFavorite;
    return matchesSearch && matchesTool && matchesFav;
  }).sort((a, b) => {
    if (sortBy === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'FILENAME') return a.filename.localeCompare(b.filename);
    if (sortBy === 'SIZE') return b.fileSize - a.fileSize;
    return 0;
  });

  return (
    <div className="w-full space-y-6">
      {/* Universal Search & Filter Panel */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
              Universal Activity History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trails of all server processes and generative image outputs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                showFavoritesOnly
                  ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
              Favorites Only
            </button>
            {history.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200/40 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Flush Database
              </button>
            )}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 smooth-all"
            />
          </div>

          {/* Tool filter */}
          <select
            value={toolFilter}
            onChange={(e: any) => setToolFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
          >
            <option value="ALL">All AI Tools</option>
            <option value="BG_REMOVER">Background Remover</option>
            <option value="UPSCALER">AI Image Upscaler</option>
            <option value="OCR">AI OCR Reader</option>
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
          >
            <option value="NEWEST">Date: Newest First</option>
            <option value="OLDEST">Date: Oldest First</option>
            <option value="FILENAME">Filename: A - Z</option>
            <option value="SIZE">File Size: Largest First</option>
          </select>
        </div>
      </div>

      {/* Bulk operation toolbar */}
      {filteredHistory.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-brand-50/60 dark:bg-brand-950/10 border border-brand-100/60 dark:border-brand-900/40 rounded-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSelectAll(filteredHistory)}
              className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {selectedIds.length === filteredHistory.length && filteredHistory.length > 0 ? (
                <CheckSquare className="w-4.5 h-4.5 text-brand-600" />
              ) : (
                <Square className="w-4.5 h-4.5" />
              )}
            </button>
            <span className="text-xs text-slate-700 dark:text-slate-300">
              Selected <strong>{selectedIds.length}</strong> of <strong>{filteredHistory.length}</strong> outputs
            </span>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDownload}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-brand-600 text-white hover:bg-brand-700 shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Selected
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500 hover:bg-rose-600 text-white shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid List */}
      {filteredHistory.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 bg-slate-50/40 dark:bg-slate-900/10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <Archive className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            No Records Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            {history.length === 0
              ? 'Your AI generated creations will appear here automatically.'
              : 'Try relaxing your search terms or filter constraints.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHistory.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`relative group rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md smooth-all overflow-hidden ${
                  isSelected
                    ? 'border-brand-500 ring-1 ring-brand-500'
                    : 'border-slate-200/60 dark:border-slate-800/60'
                }`}
              >
                {/* Checkbox Trigger Overlay */}
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="absolute top-3 left-3 z-30 w-5 h-5 bg-white/90 dark:bg-slate-900/90 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center text-brand-600 shadow-sm hover:scale-105 smooth-all"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-brand-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Favorite Trigger Overlay */}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 smooth-all text-slate-400"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      item.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-slate-300'
                    }`}
                  />
                </button>

                {/* Image checkerboard rendering */}
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-950 transparent-checkerboard border-b border-slate-100 dark:border-slate-800/40 flex items-center justify-center">
                  {item.processedUrl ? (
                    <img
                      src={item.processedUrl}
                      alt={item.filename}
                      className="max-w-full max-h-full object-contain p-2"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <Archive className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500">Image Archived</span>
                      <span className="text-[9px] text-slate-400 max-w-[200px] mt-0.5">Cleared from cache to preserve storage quota</span>
                    </div>
                  )}
                </div>

                {/* Content Diagnostics */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate pr-6">
                      {item.filename}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()} • {item.resolution.width}x{item.resolution.height}
                    </p>
                  </div>

                  {/* Badges for parameters */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                      {item.toolType.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/20 px-1.5 py-0.5 rounded">
                      {item.modelSelected}
                    </span>
                    <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                      {(item.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/40">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Latency: <strong className="text-slate-600 dark:text-slate-300">{item.duration}ms</strong>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => triggerDownload(item)}
                        disabled={!item.processedUrl}
                        className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 smooth-all ${
                          !item.processedUrl
                            ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-950/20'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title={item.processedUrl ? "Download standard PNG" : "Image archived"}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 smooth-all"
                        title="Delete output"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
