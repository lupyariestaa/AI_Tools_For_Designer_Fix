import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import BottomNavbar from './components/BottomNavbar.tsx';
import BeforeAfterSlider from './components/BeforeAfterSlider.tsx';
import HistoryPanel from './components/HistoryPanel.tsx';
import DownloadCenter from './components/DownloadCenter.tsx';
import BatchProcessor from './components/BatchProcessor.tsx';
import AuthPortal from './components/AuthPortal.tsx';
import SettingsCenter from './components/SettingsCenter.tsx';
import DeveloperDashboard from './components/DeveloperDashboard.tsx';
import { useVisionState } from './hooks/useVisionState.ts';
import { removeBackgroundImage } from './features/bg-remover/utils/canvasProcessor.ts';
import { AppUser } from './types/index.ts';
import { 
  Sparkles, 
  Upload, 
  X, 
  Palette, 
  SlidersHorizontal, 
  Layers, 
  ArrowRight, 
  Maximize2,
  Trash2,
  Bookmark,
  RefreshCw,
  LayoutGrid,
  Eye,
  Download,
  Info,
  Zap,
  Check,
  Lock,
  History,
  FileDown
} from 'lucide-react';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const savedAuth = localStorage.getItem('ai_studio_vision_auth');
      return savedAuth ? JSON.parse(savedAuth) : null;
    } catch (e) {
      return null;
    }
  });

  // Sync state to local storage when changed
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ai_studio_vision_auth', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ai_studio_vision_auth');
    }
  }, [currentUser]);

  // Load custom state manager
  const {
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
  } = useVisionState();

  // Current single file working states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [modelSelected, setModelSelected] = useState('Gemini High-Fi Segmentation');
  const [autoDetect, setAutoDetect] = useState(true);
  const [chromaColor, setChromaColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(15);
  const [smoothing, setSmoothing] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Creative backdrop overlay states
  const [backdropType, setBackdropType] = useState<'transparent' | 'color' | 'blur' | 'studio' | 'ai-prompt'>('transparent');
  const [backdropColor, setBackdropColor] = useState('#3b82f6');
  const [studioBackdropUrl, setStudioBackdropUrl] = useState('gradient-slate');

  // Feature 1: AI Prompt Backdrop States
  const [aiPromptText, setAiPromptText] = useState('Luxury marble table with soft studio lighting and warm gold reflections');
  const [aiPromptStyle, setAiPromptStyle] = useState('marble_slab');
  const [isGeneratingAiBackdrop, setIsGeneratingAiBackdrop] = useState(false);
  const [aiGeneratedGradient, setAiGeneratedGradient] = useState('radial-gradient(circle at 50% 50%, #fafaf9 0%, #e7e5e4 45%, #d6d3d1 100%)');

  // Feature 2: Drop Shadow & Lighting Match Caster
  const [enableShadow, setEnableShadow] = useState(false);
  const [shadowX, setShadowX] = useState(12);
  const [shadowY, setShadowY] = useState(16);
  const [shadowBlur, setShadowBlur] = useState(24);
  const [shadowOpacity, setShadowOpacity] = useState(0.35);
  const [shadowColor, setShadowColor] = useState('#020617');

  const [enableLightingMatch, setEnableLightingMatch] = useState(false);
  const [lightingMatchIntensity, setLightingMatchIntensity] = useState(0.18);
  const [lightingColor, setLightingColor] = useState('#f59e0b');

  // Feature 3: Bento Inspect & Export Deck States
  const [enableBentoInspect, setEnableBentoInspect] = useState(false);
  const [inspectZoom, setInspectZoom] = useState(100);
  const [exportFormat, setExportFormat] = useState<'png' | 'webp' | 'mask' | 'zip'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessToast, setExportSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const [pasteToast, setPasteToast] = useState(false);
  const [pastedFileName, setPastedFileName] = useState('');

  // Set body theme configuration on initial load
  useEffect(() => {
    document.body.classList.remove('dark');
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const downloadAlphaMask = (imgSrc: string, fileName: string) => {
    const img = new Image();
    img.src = imgSrc;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0);
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imgData;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha > 10) {
            data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;
            data[i+3] = 255;
          } else {
            data[i] = 0;
            data[i+1] = 0;
            data[i+2] = 0;
            data[i+3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = fileName;
        link.click();
      } catch (e) {
        console.error("Failed to generate mask canvas: ", e);
        // Fallback standard download
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = fileName;
        link.click();
      }
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setupFile(e.target.files[0]);
    }
  };

  const setupFile = (file: File) => {
    if (!currentUser) return;

    // Enforce size limits based on subscription tiers
    const maxSizes = {
      Free: 5 * 1024 * 1024,      // 5MB
      Pro: 20 * 1024 * 1024,     // 20MB
      Business: 50 * 1024 * 1024, // 50MB
    };
    const maxAllowed = currentUser.role === 'Developer' 
      ? 100 * 1024 * 1024 
      : (maxSizes[currentUser.subscription || 'Free'] || 5 * 1024 * 1024);

    if (file.size > maxAllowed) {
      alert(`File size exceeds limit for your current ${(currentUser.subscription || 'Free').toUpperCase()} Plan. Maximum allowed is ${maxAllowed / (1024 * 1024)}MB. Please upgrade your plan in the Settings Center.`);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setProcessedUrl('');
    setBackdropType('transparent');
  };

  // Global clipboard paste event listener to automatically select and load images
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Only process pastes when on the main workbench/workspace tab
      if (location.pathname !== '/workspace' && location.pathname !== '/') return;
      if (!currentUser) return;

      // Avoid intercepting text pasting if focused on typical textual inputs
      const activeEl = document.activeElement;
      const isTextInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      );

      const files = e.clipboardData?.files;
      const hasFiles = files && files.length > 0;

      if (isTextInput && !hasFiles) {
        return; // standard text entry paste
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const pastedFile = new File([file], `Pasted_Image_${timestamp.replace(/:/g, '-')}.png`, { type: 'image/png' });
            setupFile(pastedFile);
            setPastedFileName(pastedFile.name);
            setPasteToast(true);
            setTimeout(() => setPasteToast(false), 3500);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [location.pathname, currentUser, setupFile]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleProcessImage = async () => {
    if (!selectedFile || !currentUser) return;

    // Credit quota balance checking
    if (currentUser.role !== 'Developer' && currentUser.credits < 1) {
      alert(`Insufficient credit tokens (${currentUser.credits} left). Please upgrade your subscription or adjust credits inside the Settings Center.`);
      return;
    }

    setIsProcessing(true);

    const jobId = 'job_' + Math.random().toString(36).substring(2, 11);
    setActiveJobId(jobId);

    try {
      const base64Data = await fileToBase64(selectedFile);

      // Submit job to background pipeline
      await submitSingleJob({
        id: jobId,
        filename: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type || 'image/png',
        originalUrl: base64Data,
        toolType: 'BG_REMOVER',
        modelSelected: modelSelected,
        resolution: { width: 1200, height: 800 }
      });

      // Deduct credit
      if (currentUser.role !== 'Developer') {
        setCurrentUser(prev => prev ? { ...prev, credits: Math.max(0, prev.credits - 1) } : null);
      }
    } catch (err) {
      console.error("Single job process failed:", err);
      setIsProcessing(false);
    }
  };

  // Listen to background job state completions to draw processed canvas overlays
  useEffect(() => {
    if (!activeJobId) return;
    const currentJob = activeJobs.find(j => j.id === activeJobId);
    
    if (currentJob) {
      if (currentJob.status === 'COMPLETED' && currentJob.processedUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = currentJob.processedUrl;
        img.onload = () => {
          const transUrl = removeBackgroundImage(
            img,
            chromaColor,
            tolerance,
            smoothing,
            autoDetect
          );
          setProcessedUrl(transUrl);
          setIsProcessing(false);
          setActiveJobId(null);
        };
      } else if (currentJob.status === 'FAILED' || currentJob.status === 'CANCELLED') {
        setIsProcessing(false);
        setActiveJobId(null);
      }
    }
  }, [activeJobs, activeJobId, chromaColor, tolerance, smoothing, autoDetect]);

  // Handle immediate visual adjustment slide triggers
  useEffect(() => {
    if (originalUrl && !isProcessing && processedUrl) {
      const img = new Image();
      img.src = originalUrl;
      img.onload = () => {
        const transUrl = removeBackgroundImage(
          img,
          chromaColor,
          tolerance,
          smoothing,
          autoDetect
        );
        setProcessedUrl(transUrl);
      };
    }
  }, [chromaColor, tolerance, smoothing, autoDetect, originalUrl]);

  // Reset workspace
  const handleReset = () => {
    setSelectedFile(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalUrl('');
    setProcessedUrl('');
    setActiveJobId(null);
    setIsProcessing(false);
  };

  // Get active job status object
  const activeJob = activeJobId ? activeJobs.find(j => j.id === activeJobId) : null;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  // Protected Route Guards
  const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'User' | 'Developer' }) => {
    if (!currentUser) {
      return <Navigate to={allowedRole === 'Developer' ? '/dashboard/login' : '/'} replace />;
    }
    if (currentUser.role !== allowedRole) {
      return <Navigate to={currentUser.role === 'Developer' ? '/dashboard' : '/workspace'} replace />;
    }
    return <>{children}</>;
  };

  // User Workspace Layout Wrapper
  const UserWorkspaceLayout = ({ children, activeTab }: { children: React.ReactNode, activeTab: string }) => {
    return (
      <div className={`min-h-screen w-full ${darkMode ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'} smooth-all flex overflow-hidden`}>
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'workbench') navigate('/workspace');
            else if (tab === 'batch') navigate('/workspace/batch');
            else navigate(`/${tab}`);
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
          <Header 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              if (tab === 'workbench') navigate('/workspace');
              else if (tab === 'batch') navigate('/workspace/batch');
              else navigate(`/${tab}`);
            }}
            serverStatus={serverStatus}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          <div className="flex-1 overflow-y-auto pb-28 md:pb-12">
            <main className="max-w-7xl mx-auto px-6 py-8">
              {children}
            </main>

            <footer className="w-full border-t border-slate-200/50 py-8 bg-white mt-16 smooth-all text-xs text-slate-400 text-center pb-24 md:pb-8">
              <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  &copy; 2026 AI Studio Vision Inc. All rights reserved.
                </div>
                <div className="flex items-center gap-4 text-slate-400/85">
                  <span>SaaS Workspace</span>
                  <span>&bull;</span>
                  <span>Gemini AI Integration</span>
                </div>
              </div>
            </footer>
          </div>

          <BottomNavbar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              if (tab === 'workbench') navigate('/workspace');
              else if (tab === 'batch') navigate('/workspace/batch');
              else navigate(`/${tab}`);
            }} 
          />
        </div>
      </div>
    );
  };

  // Workbench component panel
  const WorkbenchTab = () => {
    return (
      !selectedFile ? (
        <div className="max-w-4xl mx-auto space-y-10 py-4 sm:py-8">
          <div className="text-center space-y-3.5 max-w-2xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Gemini-Powered Precision Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Separate Subjects Instantly with High Fidelity
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Upload an image and watch our AI isolate subjects, feather edges, and generate transparent layers with flawless edge detection.
            </p>
          </div>

          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) setupFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-slate-200 hover:border-brand-500/80 dark:border-slate-800/80 dark:hover:border-brand-500/80 rounded-[32px] p-10 sm:p-16 text-center cursor-pointer bg-gradient-to-br from-white via-slate-50/50 to-brand-50/15 dark:from-slate-900 dark:via-slate-900/85 dark:to-brand-950/20 hover:bg-white dark:hover:bg-slate-900 smooth-all shadow-xl shadow-slate-100/10 dark:shadow-none hover:shadow-2xl hover:shadow-brand-500/10 hover:scale-[1.005] duration-300"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {/* Pulsating backdrops for active hover */}
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-500/10 to-indigo-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-500/10 group-hover:scale-110 group-hover:rotate-1 duration-500 ease-out">
              <div className="absolute inset-0 rounded-3xl bg-brand-500/5 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Upload className="w-8 h-8 relative z-10" />
            </div>

            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Select or drag image here
            </h3>
            
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
              Supports PNG, JPG, WebP, and HEIC up to 50MB. Fully local edge adjustment controls available post-extraction.
            </p>

            {/* Keyboard shortcut feature spotlight badge */}
            <div className="mt-8 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-semibold tracking-wide shadow-sm group-hover:shadow group-hover:border-slate-300/60 dark:group-hover:border-slate-700/60 transition-all duration-300">
              <span className="px-1.5 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-xs">Ctrl</span>
              <span className="text-slate-400 font-sans">+</span>
              <span className="px-1.5 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-xs">V</span>
              <span className="ml-1 text-[10px] text-slate-500 dark:text-slate-400 font-sans font-medium">to paste image instantly</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                title: "Studio Tuning",
                desc: "Fine-tune feather thresholds, chroma tolerance, and border smoothers in real-time.",
                icon: SlidersHorizontal,
                color: "text-blue-500 bg-blue-500/5 border-blue-500/10"
              },
              {
                title: "Studio Backdrops",
                desc: "Quickly swap background layers with transparent grids, solid colors, or preset gradients.",
                icon: Palette,
                color: "text-purple-500 bg-purple-500/5 border-purple-500/10"
              },
              {
                title: "Batch Processor",
                desc: "Ditch repetitive clicks. Process queues of multiple files in parallel at max speed.",
                icon: Layers,
                color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
              }
            ].map((feat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{feat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Studio Module</span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-50">AI Background Remover</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Separates subjects from background layers with anti-aliased feathered borders.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5 uppercase tracking-wide">
                  <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                  Studio Tuning
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Processor Network</label>
                <select
                  value={modelSelected}
                  onChange={(e) => setModelSelected(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Gemini High-Fi Segmentation">Gemini High-Fi Segmentation</option>
                  <option value="Edge Adaptive Net">Edge Adaptive Net (V2)</option>
                  <option value="BiRefNet Studio">BiRefNet Studio (Max Detail)</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-50 dark:border-slate-800 pt-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Auto-Detect Chromakey</label>
                <button
                  onClick={() => setAutoDetect(!autoDetect)}
                  className={`w-10 h-6 rounded-full transition-all ${
                    autoDetect ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-800'
                  } relative`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all ${
                    autoDetect ? 'right-0.75' : 'left-0.75'
                  }`} />
                </button>
              </div>

              {!autoDetect && (
                <div className="space-y-1.5 transition-all">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 flex justify-between">
                    <span>Target Color Hex</span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase">{chromaColor}</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={chromaColor}
                      onChange={(e) => setChromaColor(e.target.value)}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={chromaColor}
                      onChange={(e) => setChromaColor(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-800/60">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-400">
                    <span>Tolerance Threshold</span>
                    <span className="font-mono text-[11px] font-bold text-brand-600">{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-400">
                    <span>Feather Smoothing</span>
                    <span className="font-mono text-[11px] font-bold text-brand-600">{smoothing}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={smoothing}
                    onChange={(e) => setSmoothing(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>
              </div>

              {!processedUrl ? (
                <button
                  onClick={handleProcessImage}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md disabled:opacity-50 flex items-center justify-center gap-2 smooth-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting Layers...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>Isolate Subjects Now</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 flex items-center justify-center gap-2 smooth-all cursor-pointer"
                >
                  <span>Reset & Upload New</span>
                </button>
              )}
            </div>

            {/* Feature 1: AI Background Lab Sidebar Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  AI Background Lab
                </h3>
                {!processedUrl && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-400 uppercase">Locked</span>
                )}
              </div>

              {!processedUrl ? (
                <div className="text-center py-4 space-y-1">
                  <Lock className="w-5 h-5 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-[10px] text-slate-400 leading-normal">Isolate subjects first to unlock AI studio neural backdrop generation.</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-400">Backdrop Style Preset</label>
                    <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                      {[
                        { id: 'marble_slab', label: 'Marble Slab', desc: 'Luxury clean gray & gold', gradient: 'radial-gradient(circle at 50% 50%, #fafaf9 0%, #e7e5e4 45%, #d6d3d1 100%)', prompt: 'Luxury marble table with soft studio lighting and warm gold reflections', lighting: '#f59e0b' },
                        { id: 'cyberpunk', label: 'Neon Cyberpunk', desc: 'Futuristic wet asphalt', gradient: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #311042 100%)', prompt: 'Cyberpunk neon street at night with wet asphalt reflections and vibrant cyan and magenta lights', lighting: '#d946ef' },
                        { id: 'synthwave', label: 'Retro Synthwave', desc: '80s digital sunset grid', gradient: 'linear-gradient(180deg, #1e1b4b 0%, #581c87 60%, #db2777 100%)', prompt: 'Retro synthwave sunset horizon with purple grids and neon laser skies', lighting: '#ec4899' },
                        { id: 'studio_spotlight', label: 'Studio Spotlight', desc: 'Dramatic backlighting', gradient: 'radial-gradient(circle at 50% 40%, #475569 0%, #0f172a 100%)', prompt: 'Professional photography studio backdrop with a dramatic spotlight centering on the subject', lighting: '#38bdf8' },
                        { id: 'tropical_sand', label: 'Golden Beach', desc: 'Cyan waves and sun flare', gradient: 'linear-gradient(135deg, #fef08a 0%, #fde047 30%, #06b6d4 100%)', prompt: 'Warm tropical beach sand with pristine cyan ocean wave ripples and golden hour sunflare', lighting: '#fbbf24' },
                        { id: 'wooden_deck', label: 'Rustic Walnut', desc: 'Warm plank walnut wood', gradient: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)', prompt: 'Cozy dark walnut wooden plank deck with warm backlight and organic leaf shadows', lighting: '#d97706' },
                        { id: 'minimal_mint', label: 'Minimalist Mint', desc: 'Pastel fresh green wash', gradient: 'radial-gradient(circle at 50% 50%, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)', prompt: 'Minimalist aesthetic clean mint pastel colored backdrop with dynamic shadow overlays', lighting: '#10b981' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setAiPromptStyle(item.id);
                            setAiPromptText(item.prompt);
                            setAiGeneratedGradient(item.gradient);
                            setLightingColor(item.lighting);
                          }}
                          className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                            aiPromptStyle === item.id
                              ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/10'
                              : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950'
                          }`}
                        >
                          <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200">{item.label}</span>
                          <span className="text-[9px] text-slate-400 leading-normal truncate">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-400">Custom Neural Prompt</label>
                    <textarea
                      value={aiPromptText}
                      onChange={(e) => setAiPromptText(e.target.value)}
                      placeholder="e.g. Luxury wooden board under warm glowing sunlight..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setIsGeneratingAiBackdrop(true);
                      setTimeout(() => {
                        setIsGeneratingAiBackdrop(false);
                        setBackdropType('ai-prompt');
                        setEnableLightingMatch(true);
                        setEnableShadow(true);
                      }, 1200);
                    }}
                    disabled={isGeneratingAiBackdrop}
                    className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isGeneratingAiBackdrop ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Rendering AI Backdrop...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-brand-200" />
                        <span>Render AI Backdrop</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Feature 2: Lighting & Shadow FX Sidebar Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5 uppercase tracking-wide">
                  <Palette className="w-4 h-4 text-indigo-500" />
                  Lighting & Shadow FX
                </h3>
                {!processedUrl && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-400 uppercase">Locked</span>
                )}
              </div>

              {!processedUrl ? (
                <div className="text-center py-4 space-y-1">
                  <Lock className="w-5 h-5 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-[10px] text-slate-400 leading-normal">Isolate subjects first to unlock shadow cast and color harmony engines.</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs font-semibold">
                  {/* Drop Shadow Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Cast Subject Shadow</span>
                      <button
                        onClick={() => setEnableShadow(!enableShadow)}
                        className={`w-10 h-6 rounded-full transition-all ${
                          enableShadow ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-855'
                        } relative`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all ${
                          enableShadow ? 'right-0.75' : 'left-0.75'
                        }`} />
                      </button>
                    </div>

                    {enableShadow && (
                      <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 transition-all">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                            <span>Shadow Blur</span>
                            <span>{shadowBlur}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            value={shadowBlur}
                            onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-brand-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                              <span>Offset X</span>
                              <span>{shadowX}px</span>
                            </div>
                            <input
                              type="range"
                              min="-40"
                              max="40"
                              value={shadowX}
                              onChange={(e) => setShadowX(parseInt(e.target.value))}
                              className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-brand-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                              <span>Offset Y</span>
                              <span>{shadowY}px</span>
                            </div>
                            <input
                              type="range"
                              min="-40"
                              max="40"
                              value={shadowY}
                              onChange={(e) => setShadowY(parseInt(e.target.value))}
                              className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-brand-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold">Shadow Opacity</span>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={shadowOpacity}
                              onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
                              className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-brand-600"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold">Shadow Color</span>
                            <div className="flex gap-1.5 items-center">
                              <input
                                type="color"
                                value={shadowColor}
                                onChange={(e) => setShadowColor(e.target.value)}
                                className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                              />
                              <span className="font-mono text-[9px] uppercase">{shadowColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ambient Lighting Match Controls */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        Ambient Glow Match
                        <Info className="w-3 h-3 text-slate-400 cursor-help" title="Overlays a color tint based on backdrop color to blend the subject into the background." />
                      </span>
                      <button
                        onClick={() => setEnableLightingMatch(!enableLightingMatch)}
                        className={`w-10 h-6 rounded-full transition-all ${
                          enableLightingMatch ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-850'
                        } relative`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all ${
                          enableLightingMatch ? 'right-0.75' : 'left-0.75'
                        }`} />
                      </button>
                    </div>

                    {enableLightingMatch && (
                      <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 transition-all">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                            <span>Overlay Intensity</span>
                            <span>{Math.round(lightingMatchIntensity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="0.5"
                            step="0.02"
                            value={lightingMatchIntensity}
                            onChange={(e) => setLightingMatchIntensity(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-brand-600"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold">Glow Light Color</span>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={lightingColor}
                              onChange={(e) => setLightingColor(e.target.value)}
                              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="font-mono text-[10px] uppercase text-slate-600 dark:text-slate-400">{lightingColor}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Precision Layer Viewport</span>
                  {enableBentoInspect && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-bold uppercase tracking-wide">Bento Inspect Active</span>
                  )}
                </div>
                {processedUrl && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 text-[10px] font-semibold gap-1">
                      {[
                        { id: 'transparent', label: 'Grid' },
                        { id: 'color', label: 'Color' },
                        { id: 'studio', label: 'Studio Presets' },
                        { id: 'ai-prompt', label: '✦ AI Backdrop' }
                      ].map((bt) => (
                        <button
                          key={bt.id}
                          onClick={() => setBackdropType(bt.id as any)}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            backdropType === bt.id
                              ? 'bg-white dark:bg-slate-900 shadow-sm text-brand-600 font-bold'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {bt.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setEnableBentoInspect(!enableBentoInspect)}
                      className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1 transition-all ${
                        enableBentoInspect
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Bento Inspect</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Viewport content */}
              {enableBentoInspect && processedUrl ? (
                /* Feature 3: Bento Grid Inspect Deck */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
                  
                  {/* Quadrant 1: Original RGB */}
                  <div className="aspect-[4/3] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden flex flex-col relative group">
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-slate-950/80 text-[8px] font-bold font-mono text-slate-300 uppercase tracking-wider">
                      CH_01 // Original Input
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden">
                      <img
                        src={originalUrl}
                        alt="Quadrant 1"
                        className="max-h-full max-w-full object-contain select-none transition-transform duration-200"
                        style={{ transform: `scale(${inspectZoom / 100})` }}
                      />
                    </div>
                  </div>

                  {/* Quadrant 2: Extracted Mask */}
                  <div className="aspect-[4/3] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden flex flex-col relative group">
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-slate-950/80 text-[8px] font-bold font-mono text-slate-300 uppercase tracking-wider">
                      CH_02 // Alpha Matte Channel
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2 bg-slate-950">
                      <img
                        src={processedUrl}
                        alt="Quadrant 2"
                        className="max-h-full max-w-full object-contain select-none transition-transform duration-200"
                        style={{ 
                          transform: `scale(${inspectZoom / 100})`,
                          filter: 'brightness(0) invert(1)' 
                        }}
                      />
                    </div>
                  </div>

                  {/* Quadrant 3: Silhouette Matte */}
                  <div className="aspect-[4/3] rounded-xl border border-slate-200 dark:border-slate-800 bg-emerald-950 overflow-hidden flex flex-col relative group">
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-slate-950/80 text-[8px] font-bold font-mono text-emerald-400 uppercase tracking-wider">
                      CH_03 // Edge Chroma difference
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2 bg-emerald-950/40">
                      <img
                        src={processedUrl}
                        alt="Quadrant 3"
                        className="max-h-full max-w-full object-contain select-none transition-transform duration-200"
                        style={{ 
                          transform: `scale(${inspectZoom / 100})`,
                          filter: 'contrast(180%) brightness(120%) saturate(150%) hue-rotate(90deg)' 
                        }}
                      />
                    </div>
                  </div>

                  {/* Quadrant 4: Composite Output */}
                  <div className="aspect-[4/3] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col relative group"
                    style={{
                      background: backdropType === 'transparent' 
                        ? 'repeating-conic-gradient(#f8fafc 0% 25%, #e2e8f0 0% 50%) 50% / 12px 12px'
                        : backdropType === 'color'
                        ? backdropColor
                        : backdropType === 'ai-prompt'
                        ? aiGeneratedGradient
                        : studioBackdropUrl === 'gradient-slate'
                        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                        : studioBackdropUrl === 'gradient-blue'
                        ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                        : '#f8fafc'
                    }}
                  >
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-slate-950/80 text-[8px] font-bold font-mono text-brand-400 uppercase tracking-wider">
                      CH_04 // Realtime Composite
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2 relative">
                      <img
                        src={processedUrl}
                        alt="Quadrant 4"
                        className="max-h-full max-w-full object-contain select-none transition-transform duration-200"
                        style={{ 
                          transform: `scale(${inspectZoom / 100})`,
                          filter: enableShadow 
                            ? `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`
                            : 'none'
                        }}
                      />
                      {enableLightingMatch && (
                        <div className="absolute inset-0 pointer-events-none mix-blend-color" style={{
                          maskImage: `url(${processedUrl})`,
                          WebkitMaskImage: `url(${processedUrl})`,
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          backgroundColor: lightingColor,
                          opacity: lightingMatchIntensity,
                          transform: `scale(${inspectZoom / 100})`
                        }} />
                      )}
                    </div>
                  </div>

                  {/* Inspector Zoom Slider */}
                  <div className="sm:col-span-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] font-mono text-slate-500">
                    <span>Inspect zoom scale: {inspectZoom}%</span>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={inspectZoom}
                      onChange={(e) => setInspectZoom(parseInt(e.target.value))}
                      className="w-44 h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                /* Standard Viewport */
                <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden relative border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 shadow-inner flex items-center justify-center">
                  {isProcessing ? (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-slate-200 p-6 space-y-4 font-mono">
                      <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white animate-spin">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-xs font-bold uppercase text-white tracking-widest animate-pulse">Running Background Segmentation</p>
                        <p className="text-[10px] text-slate-500">Estimating alpha-mattes and border vectors...</p>
                      </div>
                      {activeJob && (
                        <div className="w-full max-w-xs bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5 mt-4">
                          <div className="bg-brand-500 h-full animate-progress-bar rounded-full" />
                        </div>
                      )}
                    </div>
                  ) : null}

                  {!processedUrl ? (
                    <img
                      src={originalUrl}
                      alt="Original Upload"
                      ref={originalImgRef}
                      className="max-h-full max-w-full object-contain select-none"
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 flex items-center justify-center w-full h-full relative"
                      style={{
                        background: backdropType === 'transparent' 
                          ? 'repeating-conic-gradient(#f8fafc 0% 25%, #e2e8f0 0% 50%) 50% / 16px 16px'
                          : backdropType === 'color'
                          ? backdropColor
                          : backdropType === 'ai-prompt'
                          ? aiGeneratedGradient
                          : studioBackdropUrl === 'gradient-slate'
                          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                          : studioBackdropUrl === 'gradient-blue'
                          ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                          : '#f8fafc'
                      }}
                    >
                      <img
                        src={processedUrl}
                        alt="Isolated Subject Layer"
                        className="max-h-full max-w-full object-contain z-10 select-none animate-scale-up"
                        style={{
                          filter: enableShadow 
                            ? `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(2, 6, 23, ${shadowOpacity}))`
                            : 'none'
                        }}
                      />
                      {enableLightingMatch && (
                        <div className="absolute inset-0 pointer-events-none mix-blend-color z-12" style={{
                          maskImage: `url(${processedUrl})`,
                          WebkitMaskImage: `url(${processedUrl})`,
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          backgroundColor: lightingColor,
                          opacity: lightingMatchIntensity
                        }} />
                      )}
                    </div>
                  )}
                </div>
              )}

              {processedUrl && (
                <div className="space-y-4 pt-2">
                  <BeforeAfterSlider 
                    originalUrl={originalUrl} 
                    processedUrl={processedUrl} 
                  />

                  {backdropType === 'color' && (
                    <div className="flex gap-2.5 items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs">
                      <span className="font-semibold">Fill Color:</span>
                      <input 
                        type="color" 
                        value={backdropColor} 
                        onChange={(e) => setBackdropColor(e.target.value)} 
                        className="w-8 h-8 rounded cursor-pointer border-0"
                      />
                      <span className="font-mono text-slate-500 uppercase">{backdropColor}</span>
                    </div>
                  )}

                  {backdropType === 'studio' && (
                    <div className="flex gap-3 items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs overflow-x-auto">
                      {[
                        { id: 'gradient-slate', label: 'Slate Dark Studio', style: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
                        { id: 'gradient-blue', label: 'Ocean Blue', style: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
                        { id: 'minimal-white', label: 'Minimal Clean White', style: '#f8fafc' },
                      ].map((pr) => (
                        <button
                          key={pr.id}
                          onClick={() => setStudioBackdropUrl(pr.id)}
                          className={`px-3 py-2 rounded-xl flex items-center gap-2 border transition-all shrink-0 ${
                            studioBackdropUrl === pr.id
                              ? 'border-brand-500 bg-white dark:bg-slate-900 text-brand-600'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full shadow-sm" style={{ background: pr.style }} />
                          <span className="font-semibold">{pr.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Feature 3: Multi-Format Export Deck */}
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Multi-Format Export Deck</span>
                      <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-150 dark:border-slate-850 text-[10px] font-semibold gap-1">
                        {[
                          { id: 'png', label: 'Lossless PNG' },
                          { id: 'webp', label: 'WebP (Web)' },
                          { id: 'mask', label: 'B&W Mask' },
                          { id: 'zip', label: 'Layer ZIP' }
                        ].map((fmt) => (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() => setExportFormat(fmt.id as any)}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              exportFormat === fmt.id
                                ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600 dark:text-indigo-400 font-bold'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            {fmt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750 cursor-pointer"
                      >
                        Upload Another
                      </button>

                      <div className="flex items-center gap-3">
                        {exportSuccessToast && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                            <Check className="w-3.5 h-3.5" />
                            Compiled & saved!
                          </span>
                        )}

                        <button
                          onClick={async () => {
                            setIsExporting(true);
                            // Simulate compiling/rendering
                            await new Promise((resolve) => setTimeout(resolve, 800));

                            const matchedHist = history.find(h => h.originalUrl === originalUrl) || history[0];
                            const activeId = matchedHist ? matchedHist.id : 'temp_hist_id';
                            const fileBaseName = selectedFile?.name.split('.')[0] || 'studio_export';

                            if (exportFormat === 'png') {
                              // Standard PNG download
                              const link = document.createElement('a');
                              link.href = processedUrl;
                              link.download = `${fileBaseName}_isolated.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              logDownload(activeId, 'png', 'hd');
                            } else if (exportFormat === 'webp') {
                              // Render as webp on temporary canvas
                              const img = new Image();
                              img.src = processedUrl;
                              img.crossOrigin = 'anonymous';
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                  canvas.width = img.naturalWidth || img.width;
                                  canvas.height = img.naturalHeight || img.height;
                                  ctx.drawImage(img, 0, 0);
                                  const link = document.createElement('a');
                                  link.href = canvas.toDataURL('image/webp', 0.85);
                                  link.download = `${fileBaseName}_studio.webp`;
                                  link.click();
                                  logDownload(activeId, 'webp', 'standard');
                                }
                              };
                            } else if (exportFormat === 'mask') {
                              // Real-time B&W Mask download
                              downloadAlphaMask(processedUrl, `${fileBaseName}_mask.png`);
                              logDownload(activeId, 'png', 'standard');
                            } else if (exportFormat === 'zip') {
                              // Simulate zip downloading containing layered files
                              const link = document.createElement('a');
                              link.href = processedUrl; // fallback or composite download
                              link.download = `${fileBaseName}_layered_bundle.zip`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              logDownload(activeId, 'png', 'hd');
                            }

                            setIsExporting(false);
                            setExportSuccessToast(true);
                            setTimeout(() => setExportSuccessToast(false), 3000);
                          }}
                          disabled={isExporting}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow flex items-center gap-2 cursor-pointer"
                        >
                          {isExporting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Compiling Asset...</span>
                            </>
                          ) : (
                            <>
                              <FileDown className="w-4 h-4 text-indigo-200" />
                              <span>Compile & Export HD Master</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    );
  };

  // Batch component panel wrapper
  const BatchTab = () => {
    return (
      <BatchProcessor 
        batchJobs={batchJobs}
        submitBatchJob={async (batchId, jobsToSubmit) => {
          if (!currentUser) return;
          
          // Validate role batch limit
          if (currentUser.role !== 'Developer' && (!currentUser.subscription || currentUser.subscription === 'Free')) {
            alert("Free accounts are restricted from parallel batch processing. Please upgrade to Pro in Settings.");
            return;
          }

          // Check if credit is sufficient for all batch children
          const totalCost = jobsToSubmit.length;
          if (currentUser.role !== 'Developer' && currentUser.credits < totalCost) {
            alert(`Insufficient credits for batch run. This batch requires ${totalCost} tokens, but you only have ${currentUser.credits} left.`);
            return;
          }

          // Enforce subscription-based size limits on each item
          const maxSizes = {
            Free: 5 * 1024 * 1024,
            Pro: 20 * 1024 * 1024,
            Business: 50 * 1024 * 1024
          };
          const maxAllowed = currentUser.role === 'Developer' 
            ? 100 * 1024 * 1024 
            : (maxSizes[currentUser.subscription || 'Free'] || 5 * 1024 * 1024);
            
          const oversized = jobsToSubmit.some(j => j.fileSize > maxAllowed);
          if (oversized) {
            alert(`One or more files exceed the ${maxAllowed / (1024 * 1024)}MB limit for your current ${(currentUser.subscription || 'Free').toUpperCase()} Plan.`);
            return;
          }

          // Deduct credits
          if (currentUser.role !== 'Developer') {
            setCurrentUser(prev => prev ? { ...prev, credits: Math.max(0, prev.credits - totalCost) } : null);
          }

          // Submit batch
          await submitBatchJob(batchId, jobsToSubmit);
        }}
        logDownload={logDownload}
        serverStatus={serverStatus}
      />
    );
  };

  return (
    <>
    <Routes>
      {/* 1. Public Landing Page with User Mode Google Auth */}
      <Route path="/" element={
        currentUser ? (
          currentUser.role === 'Developer' ? <Navigate to="/dashboard" replace /> : <Navigate to="/workspace" replace />
        ) : (
          <div className={darkMode ? 'dark' : ''}>
            <AuthPortal mode="user" onLogin={(user) => {
              setCurrentUser(user);
              navigate('/workspace');
            }} />
          </div>
        )
      } />

      {/* 2. Google Authentication Redirection Fallback / Callback Screen */}
      <Route path="/auth" element={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-mono p-6">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white animate-spin mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm">Completing security checks...</p>
          <p className="text-[10px] text-slate-500 mt-2">Redirecting to User Workspace shortly.</p>
          {useEffect(() => {
            const timer = setTimeout(() => {
              if (currentUser) {
                navigate(currentUser.role === 'Developer' ? '/dashboard' : '/workspace');
              } else {
                navigate('/');
              }
            }, 1000);
            return () => clearTimeout(timer);
          }, [currentUser])}
        </div>
      } />

      {/* 3. Developer Login */}
      <Route path="/dashboard/login" element={
        currentUser ? (
          currentUser.role === 'Developer' ? <Navigate to="/dashboard" replace /> : <Navigate to="/workspace" replace />
        ) : (
          <div className={darkMode ? 'dark' : ''}>
            <AuthPortal mode="developer" onLogin={(user) => {
              setCurrentUser(user);
              navigate('/dashboard');
            }} />
          </div>
        )
      } />

      {/* 4. Developer Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="Developer">
          <DeveloperDashboard currentUser={currentUser} onLogout={handleLogout} />
        </ProtectedRoute>
      } />

      {/* 5. User Workspace & Main SaaS Routes */}
      <Route path="/workspace" element={
        <ProtectedRoute allowedRole="User">
          <UserWorkspaceLayout activeTab="workbench">
            <WorkbenchTab />
          </UserWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/workspace/batch" element={
        <ProtectedRoute allowedRole="User">
          <UserWorkspaceLayout activeTab="batch">
            <BatchTab />
          </UserWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/history" element={
        <ProtectedRoute allowedRole="User">
          <UserWorkspaceLayout activeTab="history">
            <HistoryPanel 
              history={history}
              toggleFavorite={toggleFavorite}
              deleteHistoryItem={deleteHistoryItem}
              logDownload={logDownload}
              clearAllHistory={clearAllHistory}
            />
          </UserWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/downloads" element={
        <ProtectedRoute allowedRole="User">
          <UserWorkspaceLayout activeTab="downloads">
            <DownloadCenter 
              downloads={downloads}
              history={history}
              logDownload={logDownload}
            />
          </UserWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute allowedRole="User">
          <UserWorkspaceLayout activeTab="settings">
            <SettingsCenter 
              currentUser={currentUser!}
              setCurrentUser={setCurrentUser}
              historyCount={history.length}
              onClearHistory={clearAllHistory}
            />
          </UserWorkspaceLayout>
        </ProtectedRoute>
      } />

      {/* Fallback Catchall */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    {/* Elegant Global Clipboard Paste Success Toast Notification */}
    {pasteToast && (
      <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3.5 max-w-sm text-xs font-semibold">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm shrink-0">
          ✓
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-bold text-slate-100 tracking-tight text-xs">Image pasted from clipboard!</p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{pastedFileName || 'Synthesizing layout...'}</p>
        </div>
      </div>
    )}
    </>
  );
}
