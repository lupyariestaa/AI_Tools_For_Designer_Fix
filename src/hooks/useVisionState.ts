import { useState, useEffect } from 'react';
import { AIJob, BatchJob, HistoryItem, DownloadRecord } from '../types/index.ts';

// Local storage key constants
const HISTORY_KEY = 'ai_studio_vision_history_v1';
const DOWNLOAD_RECORDS_KEY = 'ai_studio_vision_downloads_v1';

export function useVisionState() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [activeJobs, setActiveJobs] = useState<AIJob[]>([]);
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([]);
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    gemini_api_active: boolean;
    queue_length: number;
  }>({ online: false, gemini_api_active: false, queue_length: 0 });

  // Load from local storage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      const storedDownloads = localStorage.getItem(DOWNLOAD_RECORDS_KEY);
      if (storedDownloads) {
        setDownloads(JSON.parse(storedDownloads));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }

    // Ping system health api
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setServerStatus({
          online: true,
          gemini_api_active: data.gemini_api_active,
          queue_length: data.queue_length
        });
      })
      .catch(() => {
        setServerStatus({ online: false, gemini_api_active: false, queue_length: 0 });
      });
  }, []);

  // Sync state to local storage when changed with quota-exceeded pruning defense
  useEffect(() => {
    let items = [...history];
    let success = false;
    let attempts = 0;
    
    while (!success && attempts < 15 && items.length > 0) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
        success = true;
      } catch (e) {
        attempts++;
        let pruned = false;
        
        // 1. Clear originalUrl and processedUrl from non-favorite items starting from the oldest
        for (let i = items.length - 1; i >= 0; i--) {
          if (!items[i].isFavorite && (items[i].originalUrl || items[i].processedUrl)) {
            items[i] = {
              ...items[i],
              originalUrl: '',
              processedUrl: ''
            };
            pruned = true;
            break; // Try saving again after pruning one item
          }
        }
        
        // 2. If no non-favorite items could be stripped, strip favorite items starting from the oldest
        if (!pruned) {
          for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].originalUrl || items[i].processedUrl) {
              items[i] = {
                ...items[i],
                originalUrl: '',
                processedUrl: ''
              };
              pruned = true;
              break;
            }
          }
        }
        
        // 3. If no images can be stripped anymore, start dropping the oldest items entirely
        if (!pruned && items.length > 0) {
          items.pop(); // remove the oldest item completely
        }
      }
    }
    
    // If the list of history in memory was pruned during storage save, sync the pruned list to local state
    // so the UI and cache stay strictly in sync and prevent infinite storage retry cycles.
    if (items.length !== history.length || items.some((item, idx) => item.processedUrl !== history[idx].processedUrl || item.originalUrl !== history[idx].originalUrl)) {
      setHistory(items);
    }
  }, [history]);

  useEffect(() => {
    let items = [...downloads];
    let success = false;
    let attempts = 0;
    
    while (!success && attempts < 15 && items.length > 0) {
      try {
        localStorage.setItem(DOWNLOAD_RECORDS_KEY, JSON.stringify(items));
        success = true;
      } catch (e) {
        attempts++;
        let pruned = false;
        
        // 1. Clear processedUrl from oldest items
        for (let i = items.length - 1; i >= 0; i--) {
          if (items[i].processedUrl) {
            items[i] = {
              ...items[i],
              processedUrl: ''
            };
            pruned = true;
            break;
          }
        }
        
        // 2. If no images can be stripped, drop oldest records completely
        if (!pruned && items.length > 0) {
          items.pop();
        }
      }
    }

    if (items.length !== downloads.length || items.some((item, idx) => item.processedUrl !== downloads[idx].processedUrl)) {
      setDownloads(items);
    }
  }, [downloads]);

  // Submit an individual job
  const submitSingleJob = async (jobParams: Omit<AIJob, 'status' | 'progress' | 'logs'>) => {
    const newJob: AIJob = {
      ...jobParams,
      status: 'QUEUED',
      progress: 0,
    };

    setActiveJobs(prev => [...prev, newJob]);

    try {
      // Register job with Express backend queue
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newJob.id,
          batchId: newJob.batchId,
          filename: newJob.filename,
          fileSize: newJob.fileSize,
          mimeType: newJob.mimeType,
          originalData: newJob.originalUrl, // base64 string
          modelSelected: newJob.modelSelected,
          toolType: newJob.toolType,
        })
      });

      if (!res.ok) throw new Error("Backend queue registration failed");

      // Begin polling status
      pollJobStatus(newJob.id);
    } catch (err: any) {
      setActiveJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: 'FAILED', error: err.message || "Queue Error" } : j));
    }
  };

  // Poll job status from server
  const pollJobStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/status/${jobId}`);
        if (!res.ok) throw new Error("Failed to fetch job status");
        
        const data = await res.json();
        
        setActiveJobs(prev => prev.map(j => {
          if (j.id === jobId) {
            return {
              ...j,
              status: data.status,
              progress: data.progress,
              error: data.error,
              duration: data.duration,
              startedAt: data.startedAt,
              completedAt: data.completedAt,
              processedUrl: data.processedData // base64 string returned from server
            };
          }
          return j;
        }));

        if (data.status === 'COMPLETED' || data.status === 'FAILED' || data.status === 'CANCELLED') {
          clearInterval(interval);
          
          if (data.status === 'COMPLETED') {
            // Trigger automatic History registration
            const matchedJob = activeJobs.find(j => j.id === jobId) || {
              id: jobId,
              filename: data.filename || 'image.png',
              fileSize: data.fileSize || 500000,
              resolution: { width: 1200, height: 800 },
              originalUrl: data.originalData || '',
              toolType: 'BG_REMOVER' as const,
              modelSelected: 'Gemini High-Fi',
              processedUrl: data.processedData
            };

            const historyRecord: HistoryItem = {
              id: 'hist_' + Math.random().toString(36).substring(2, 11),
              jobId: jobId,
              batchId: data.batchId,
              toolType: matchedJob.toolType,
              modelSelected: matchedJob.modelSelected,
              filename: matchedJob.filename,
              fileSize: matchedJob.fileSize,
              resolution: (matchedJob as any).resolution || { width: 1224, height: 816 },
              originalUrl: (matchedJob as any).originalUrl || '',
              processedUrl: data.processedData, // final base64 string
              createdAt: new Date().toISOString(),
              duration: data.duration || 1200,
              creditsUsed: 1,
              isFavorite: false,
              downloadCount: 0,
              tags: ['AI Processed', matchedJob.toolType.toLowerCase().replace('_', ' ')],
            };

            setHistory(prev => [historyRecord, ...prev]);
          }
        }
      } catch (err) {
        console.error("Polling error for job", jobId, err);
        clearInterval(interval);
      }
    }, 1000);
  };

  // Submit batch processing
  const submitBatchJob = async (batchId: string, jobsToSubmit: Omit<AIJob, 'status' | 'progress' | 'logs'>[]) => {
    const parentJob: BatchJob = {
      id: batchId,
      status: 'QUEUED',
      progress: 0,
      completedCount: 0,
      failedCount: 0,
      totalCount: jobsToSubmit.length,
      createdAt: new Date().toISOString(),
      toolType: 'BG_REMOVER',
      jobs: jobsToSubmit.map(j => ({ ...j, status: 'QUEUED', progress: 0 }))
    };

    setBatchJobs(prev => [parentJob, ...prev]);

    // Submit each child job sequentially or with limited concurrency
    for (const job of jobsToSubmit) {
      await submitSingleJob({
        ...job,
        batchId: batchId
      });
    }
  };

  // Keep track of batch completion count dynamically
  useEffect(() => {
    if (activeJobs.length === 0) return;

    setBatchJobs(prev => prev.map(batch => {
      const childJobs = activeJobs.filter(j => j.batchId === batch.id);
      if (childJobs.length === 0) return batch;

      const completed = childJobs.filter(j => j.status === 'COMPLETED').length;
      const failed = childJobs.filter(j => j.status === 'FAILED' || j.status === 'CANCELLED').length;
      const running = childJobs.filter(j => j.status === 'RUNNING').length;
      const total = batch.totalCount;

      let status = batch.status;
      if (completed + failed === total) {
        status = 'COMPLETED';
      } else if (running > 0 || completed > 0) {
        status = 'RUNNING';
      }

      const progress = Math.round(((completed + failed) / total) * 100);

      return {
        ...batch,
        status,
        progress,
        completedCount: completed,
        failedCount: failed,
        jobs: childJobs
      };
    }));
  }, [activeJobs]);

  // Register an entry in Download Center
  const logDownload = (historyId: string, format: 'png' | 'jpg' | 'webp', quality: 'preview' | 'standard' | 'hd') => {
    const histItem = history.find(h => h.id === historyId);
    if (!histItem) return;

    // Update download counter on history item
    setHistory(prev => prev.map(h => h.id === historyId ? { ...h, downloadCount: h.downloadCount + 1 } : h));

    const newRecord: DownloadRecord = {
      id: 'dl_' + Math.random().toString(36).substring(2, 11),
      historyId,
      filename: histItem.filename,
      fileSize: histItem.fileSize,
      resolution: histItem.resolution,
      toolType: histItem.toolType,
      processedUrl: histItem.processedUrl,
      downloadedAt: new Date().toISOString(),
      format,
      quality
    };

    setDownloads(prev => [newRecord, ...prev]);
  };

  // Toggle Favorite
  const toggleFavorite = (historyId: string) => {
    setHistory(prev => prev.map(h => h.id === historyId ? { ...h, isFavorite: !h.isFavorite } : h));
  };

  // Delete history item (with soft-delete local state filter)
  const deleteHistoryItem = (historyId: string) => {
    setHistory(prev => prev.filter(h => h.id !== historyId));
    // Also remove any related downloads optionally
    setDownloads(prev => prev.filter(d => d.historyId !== historyId));
  };

  // Clear entire history database
  const clearAllHistory = () => {
    setHistory([]);
    setDownloads([]);
  };

  return {
    history,
    downloads,
    activeJobs,
    batchJobs,
    serverStatus,
    submitSingleJob,
    submitBatchJob,
    logDownload,
    toggleFavorite,
    deleteHistoryItem,
    clearAllHistory
  };
}
