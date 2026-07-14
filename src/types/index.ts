export type JobStatus = 'PENDING' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface AIJob {
  id: string;
  batchId?: string;
  status: JobStatus;
  progress: number; // 0 to 100
  filename: string;
  fileSize: number;
  mimeType: string;
  resolution: {
    width: number;
    height: number;
  };
  originalUrl: string;
  processedUrl?: string;
  error?: string;
  duration?: number; // processing duration in ms
  startedAt?: string;
  completedAt?: string;
  toolType: 'BG_REMOVER' | 'UPSCALER' | 'ENHANCER' | 'OBJECT_REMOVER' | 'OCR';
  modelSelected: string;
  colorHex?: string; // color used in chromakey thresholding
  smoothing?: number; // edge smoothing level
}

export interface BatchJob {
  id: string;
  status: JobStatus;
  progress: number;
  completedCount: number;
  failedCount: number;
  totalCount: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  toolType: 'BG_REMOVER' | 'UPSCALER' | 'ENHANCER' | 'OBJECT_REMOVER' | 'OCR';
  jobs: AIJob[];
}

export interface HistoryItem {
  id: string;
  jobId: string;
  batchId?: string;
  toolType: 'BG_REMOVER' | 'UPSCALER' | 'ENHANCER' | 'OBJECT_REMOVER' | 'OCR';
  modelSelected: string;
  filename: string;
  fileSize: number;
  resolution: {
    width: number;
    height: number;
  };
  originalUrl: string;
  processedUrl: string;
  createdAt: string;
  duration: number;
  creditsUsed: number;
  isFavorite: boolean;
  downloadCount: number;
  tags: string[];
}

export interface DownloadRecord {
  id: string;
  historyId: string;
  filename: string;
  fileSize: number;
  resolution: {
    width: number;
    height: number;
  };
  toolType: 'BG_REMOVER' | 'UPSCALER' | 'ENHANCER' | 'OBJECT_REMOVER' | 'OCR';
  processedUrl: string;
  downloadedAt: string;
  format: 'png' | 'jpg' | 'webp';
  quality: 'preview' | 'standard' | 'hd';
}

export interface AppUser {
  name: string;
  email: string;
  role: 'Developer' | 'User';
  subscription?: 'Free' | 'Pro' | 'Business' | 'Enterprise';
  credits: number;
  avatar: string;
}

