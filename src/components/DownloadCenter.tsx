import React, { useState } from 'react';
import { DownloadRecord, HistoryItem } from '../types/index.ts';
import { Download, FileType, CheckCircle, Flame, Grid, Server, Sparkles, SlidersHorizontal, Image, RefreshCw, Archive } from 'lucide-react';

interface DownloadCenterProps {
  downloads: DownloadRecord[];
  history: HistoryItem[];
  logDownload: (id: string, format: 'png' | 'jpg' | 'webp', quality: 'preview' | 'standard' | 'hd') => void;
}

export default function DownloadCenter({ downloads, history, logDownload }: DownloadCenterProps) {
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [exportQuality, setExportQuality] = useState<'preview' | 'standard' | 'hd'>('hd');
  const [convertingId, setConvertingId] = useState<string | null>(null);

  // Trigger browser download with modified export parameters (simulating server-side format conversions instantly)
  const triggerExport = async (item: HistoryItem) => {
    if (!item.processedUrl) return;
    setConvertingId(item.id);
    
    // Simulate background conversion process delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // For a real PNG output on the browser, we use a canvas to draw the base64 image
    // and extract it as the user specified format & quality
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = item.processedUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = item.resolution.width;
      canvas.height = item.resolution.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // If converting to JPG, we should fill a solid white background since transparent PNGs turn black
        if (exportFormat === 'jpg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        const mimeMap = {
          png: 'image/png',
          jpg: 'image/jpeg',
          webp: 'image/webp'
        };

        const qualityVal = exportQuality === 'preview' ? 0.4 : exportQuality === 'standard' ? 0.85 : 1.0;
        const exportedUrl = canvas.toDataURL(mimeMap[exportFormat], qualityVal);

        const link = document.createElement('a');
        link.href = exportedUrl;
        link.download = `optimized_${item.filename.replace(/\.[^/.]+$/, "")}.${exportFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Record in central analytics logs
        logDownload(item.id, exportFormat, exportQuality);
      }
      setConvertingId(null);
    };

    img.onerror = () => {
      setConvertingId(null);
    };
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Export Configuration Controls (Left) */}
      <div className="lg:col-span-1 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-6 h-fit">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-500" />
            Global Export Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Specify output format compression ratios and color space mappings before pulling files.
          </p>
        </div>

        {/* Format select */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileType className="w-3.5 h-3.5 text-slate-400" />
            Container Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['png', 'jpg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className={`py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                  exportFormat === fmt
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            {exportFormat === 'png' && 'Lossless compression supporting transparent alpha background layers. Recommended.'}
            {exportFormat === 'jpg' && 'Standard digital image format with adjustable lossy compression. Transparencies render white.'}
            {exportFormat === 'webp' && 'Modern, web-optimized format offering superior image compression and transparent layers.'}
          </p>
        </div>

        {/* Quality select */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Compression Profile
          </label>
          <div className="space-y-2">
            {[
              { id: 'hd', label: 'Lossless HD / Max Quality', desc: '100% pixel mapping, no chroma subsampling.' },
              { id: 'standard', label: 'Balanced Standard', desc: '85% optimized compression, ideal for screens.' },
              { id: 'preview', label: 'Low-Fi Web Preview', desc: '40% size reduction, highly compressed.' }
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => setExportQuality(q.id as any)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  exportQuality === q.id
                    ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400'
                    : 'border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{q.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{q.desc}</div>
                </div>
                {exportQuality === q.id && <CheckCircle className="w-4 h-4 text-brand-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Processed Assets & Logs List (Right 2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Main files listing */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            <Image className="w-4.5 h-4.5 text-brand-500" />
            Download Center Hub
          </h2>

          {history.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/20 dark:bg-slate-900/10">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Processed AI images will register here for download automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50 space-y-4">
              {history.map((item) => {
                const isConverting = convertingId === item.id;
                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {/* Image Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-950 transparent-checkerboard flex items-center justify-center overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
                        {item.processedUrl ? (
                          <img 
                            src={item.processedUrl} 
                            alt="Thumbnail" 
                            className="max-w-full max-h-full object-contain p-1"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Archive className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      {/* File Metadata */}
                      <div>
                        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-xs">
                          {item.filename}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                            {item.resolution.width}x{item.resolution.height}
                          </span>
                          <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                            {(item.fileSize / 1024).toFixed(1)} KB
                          </span>
                          <span className="text-[9px] font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/20 px-1.5 py-0.5 rounded">
                            {item.toolType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pull Action Triggers */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-slate-400 font-mono">Downloads</div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                          {item.downloadCount} pulls
                        </div>
                      </div>

                      <button
                        onClick={() => triggerExport(item)}
                        disabled={isConverting || !item.processedUrl}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm flex items-center gap-2 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400 smooth-all"
                      >
                        {isConverting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Converting...
                          </>
                        ) : !item.processedUrl ? (
                          <>
                            <Archive className="w-3.5 h-3.5" />
                            Archived
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            Export {exportFormat.toUpperCase()}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Real-time pulls ledger tracking */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" />
            Global Downloads Log Ledger
          </h2>

          {downloads.length === 0 ? (
            <p className="text-[11px] text-slate-500 font-mono">
              [Log Console] Ledger currently empty. Export standard files to see active logs.
            </p>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-200/40 dark:border-slate-800/40 space-y-1.5 font-mono text-[10px] max-h-48 overflow-y-auto">
              {downloads.map((record) => (
                <div key={record.id} className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>
                    &gt; User pulled <strong className="text-slate-700 dark:text-slate-200">{record.filename}</strong> as [.{record.format.toUpperCase()} / {record.quality.toUpperCase()}]
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {new Date(record.downloadedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
