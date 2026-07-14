import React, { useState, useRef } from 'react';
import { AIJob, BatchJob } from '../types/index.ts';
import { Upload, X, Play, AlertCircle, RefreshCw, Layers, CheckSquare, Terminal, Eye, Download, Info } from 'lucide-react';

interface BatchProcessorProps {
  batchJobs: BatchJob[];
  submitBatchJob: (batchId: string, jobs: any[]) => Promise<void>;
  logDownload: (id: string, format: 'png' | 'jpg' | 'webp', quality: 'preview' | 'standard' | 'hd') => void;
  serverStatus: { online: boolean; gemini_api_active: boolean };
}

export default function BatchProcessor({
  batchJobs,
  submitBatchJob,
  logDownload,
  serverStatus
}: BatchProcessorProps) {
  const [selectedFiles, setSelectedFiles] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [modelSelected, setModelSelected] = useState('Gemini High-Fi Segmentation');
  const [concurrency, setConcurrency] = useState(2); // standard concurrent workers
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const nextFiles = files.map(file => {
      return {
        id: 'file_' + Math.random().toString(36).substring(2, 11),
        file,
        preview: URL.createObjectURL(file)
      };
    });
    setSelectedFiles(prev => [...prev, ...nextFiles]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  // Convert files to Base64 strings to feed the backend Express queue properly
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleStartBatch = async () => {
    if (selectedFiles.length === 0) return;
    setIsSubmitting(true);

    const batchId = 'batch_' + Math.random().toString(36).substring(2, 11);

    try {
      const jobsToSubmit = await Promise.all(
        selectedFiles.map(async (sf) => {
          const base64Data = await fileToBase64(sf.file);
          
          return {
            id: 'job_' + Math.random().toString(36).substring(2, 11),
            batchId,
            status: 'QUEUED' as const,
            progress: 0,
            filename: sf.file.name,
            fileSize: sf.file.size,
            mimeType: sf.file.type || 'image/png',
            originalUrl: base64Data, // send raw base64 data to Express
            toolType: 'BG_REMOVER' as const,
            modelSelected: modelSelected,
            resolution: { width: 1200, height: 800 }
          };
        })
      );

      await submitBatchJob(batchId, jobsToSubmit);
      setSelectedFiles([]); // clear workbench
    } catch (err) {
      console.error("Batch submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerDownload = (job: AIJob) => {
    if (!job.processedUrl) return;
    const link = document.createElement('a');
    link.href = job.processedUrl;
    link.download = `batch_processed_${job.filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logDownload(job.id, 'png', 'hd');
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Batch Upload Workbench (Left Column) */}
      <div className="lg:col-span-1 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-5 h-fit">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-brand-500" />
            Bulk Processing Workbench
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Drop multiple images to perform concurrent AI background masking operations instantly.
          </p>
        </div>

        {/* Drag Over Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files)); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-brand-500 bg-brand-50/20 text-brand-600'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500 dark:text-slate-400'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2.5" />
          <div className="text-xs font-semibold">Click or drag images to batch</div>
          <div className="text-[10px] text-slate-400 mt-1">Supports PNG, JPEG, WebP up to 10MB each</div>
        </div>

        {/* Selected Batch Items Stack */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Queued files ({selectedFiles.length})
              </span>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-[10px] text-rose-500 font-semibold hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {selectedFiles.map((sf) => (
                <div key={sf.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 text-[11px]">
                  <span className="truncate max-w-xs text-slate-700 dark:text-slate-300 font-medium">
                    {sf.file.name}
                  </span>
                  <button
                    onClick={() => removeFile(sf.id)}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Model select & worker options */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">AI Model</label>
                <select
                  value={modelSelected}
                  onChange={(e) => setModelSelected(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="Gemini High-Fi Segmentation">Gemini High-Fi Segmentation</option>
                  <option value="Edge Adaptive Net">Edge Adaptive Net (V2)</option>
                  <option value="BiRefNet Studio">BiRefNet Studio (Max Detail)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 flex justify-between">
                  <span>Concurrency Limit</span>
                  <span className="font-mono text-[10px] font-bold text-brand-600">{concurrency} threads</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={concurrency}
                  onChange={(e) => setConcurrency(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>

              <button
                onClick={handleStartBatch}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-md flex items-center justify-center gap-2 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 smooth-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Preparing queue...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Execute Batch Jobs
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Concurrent Worker Queue Console (Right 2 Columns) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Active and history batches */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-brand-500" />
            Parallel Worker Pipeline
          </h2>

          {batchJobs.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/20 dark:bg-slate-900/10">
              <Layers className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Triggered batches will render here as parallel child-tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {batchJobs.map((batch) => (
                <div key={batch.id} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 space-y-3.5">
                  {/* Parent level info */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 font-mono">
                        Batch: #{batch.id}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Submitted: {new Date(batch.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Progress Badge */}
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        batch.status === 'COMPLETED'
                          ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                          : batch.status === 'RUNNING'
                          ? 'bg-brand-100 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {batch.status}
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                        {batch.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Line Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-600 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${batch.progress}%` }}
                    />
                  </div>

                  {/* Diagnostic stats */}
                  <div className="flex gap-4 text-[11px] font-mono text-slate-500">
                    <div>Completed: <strong className="text-emerald-600">{batch.completedCount}</strong></div>
                    <div>Failed: <strong className="text-rose-500">{batch.failedCount}</strong></div>
                    <div>Pending: <strong className="text-slate-700 dark:text-slate-300">{batch.totalCount - batch.completedCount - batch.failedCount}</strong></div>
                  </div>

                  {/* Child Jobs Checklist items */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                    {batch.jobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 text-[11px]">
                        <div className="flex items-center gap-2.5 truncate max-w-xs sm:max-w-md">
                          <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${
                            job.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'
                          }`} />
                          <span className="truncate text-slate-700 dark:text-slate-300 font-medium font-mono">
                            {job.filename}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-400">
                            {job.status === 'RUNNING' && `Processing... ${job.progress}%`}
                            {job.status === 'QUEUED' && 'Queued...'}
                            {job.status === 'COMPLETED' && `Done in ${job.duration || 1200}ms`}
                            {job.status === 'FAILED' && 'Failed'}
                          </span>

                          {job.status === 'COMPLETED' && job.processedUrl && (
                            <button
                              onClick={() => triggerDownload(job)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-600"
                              title="Download single file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
