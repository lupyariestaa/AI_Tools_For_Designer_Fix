import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Fingerprint, 
  Palette,
  Chrome,
  Sliders,
  ChevronDown,
  Layers,
  Zap,
  Activity,
  Maximize2,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  Check,
  X,
  Shield,
  HelpCircle
} from 'lucide-react';
import { AppUser } from '../types/index.ts';

interface AuthPortalProps {
  mode: 'user' | 'developer';
  onLogin: (user: AppUser) => void;
}

export default function AuthPortal({ mode: initialMode, onLogin }: AuthPortalProps) {
  const [authMode, setAuthMode] = useState<'user' | 'developer'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Background style selection state
  const [activeBg, setActiveBg] = useState<'aurora' | 'cyber' | 'sunset'>('aurora');

  // Modal State for Authentication popup
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Interactive Mockup State
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 to 100)
  const [isSliding, setIsSliding] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Custom threshold & color options inside interactive mock card
  const [featherThreshold, setFeatherThreshold] = useState(12); // glow size
  const [glowColor, setGlowColor] = useState('#3b82f6'); // default indigo/blue glow

  const handleDeveloperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please provide valid email and password credentials.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: email.split('@')[0] || 'Developer',
        email,
        role: 'Developer',
        credits: 99999,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`
      });
      setLoading(false);
      setIsAuthModalOpen(false);
    }, 800);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    
    // Simulate interactive Google Sign-In pop-up
    setTimeout(() => {
      onLogin({
        name: 'Jane Doe',
        email: 'useforfun03@gmail.com',
        role: 'User',
        subscription: 'Free',
        credits: 50,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
      });
      setLoading(false);
      setIsAuthModalOpen(false);
    }, 1200);
  };

  // Drag handler for interactive before/after split slider
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSliding(true);
    setHasInteracted(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSliding(true);
    setHasInteracted(true);
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  // Auto-sweep simulation that plays a subtle back-and-forth scan on load
  useEffect(() => {
    if (hasInteracted) return;

    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      // Beautiful smooth sine sweep between 20% and 80%
      const sweep = 50 + Math.sin(elapsed * 1.6) * 30;
      setSliderPos(sweep);
    }, 16);

    return () => clearInterval(interval);
  }, [hasInteracted]);

  // Handle global sliding listeners
  useEffect(() => {
    if (!isSliding) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsSliding(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isSliding]);

  // Map theme colors to glow color selections
  useEffect(() => {
    if (activeBg === 'aurora') setGlowColor('#3b82f6');
    else if (activeBg === 'cyber') setGlowColor('#06b6d4');
    else setGlowColor('#ec4899');
  }, [activeBg]);

  // Scroll target helpers
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden text-slate-800 font-sans relative flex flex-col transition-all duration-700 select-none scroll-smooth ${
      activeBg === 'aurora' 
        ? 'bg-gradient-to-tr from-[#f1f5f9] via-[#f8fafc]/90 to-[#eff6ff]' 
        : activeBg === 'cyber'
        ? 'bg-gradient-to-tr from-[#fafafa] via-[#f4f4f5]/90 to-[#f0f9ff]'
        : 'bg-gradient-to-tr from-[#fbf8f6] via-[#faf5f5]/90 to-[#fef2f2]'
    }`}>
      
      {/* Ambient floating backgrounds with gentle drifting motions */}
      {activeBg === 'aurora' && (
        <>
          <motion.div 
            animate={{ x: [0, 40, -20, 0], y: [0, -40, 20, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none transition-all duration-700" 
          />
          <motion.div 
            animate={{ x: [0, -30, 40, 0], y: [0, 30, -40, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-300/15 rounded-full blur-[120px] pointer-events-none transition-all duration-700" 
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-white rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        </>
      )}

      {activeBg === 'cyber' && (
        <>
          <motion.div 
            animate={{ x: [0, -25, 25, 0], y: [0, 25, -25, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-cyan-200/15 rounded-full blur-[130px] pointer-events-none transition-all duration-700" 
          />
          <motion.div 
            animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] bg-violet-200/15 rounded-full blur-[130px] pointer-events-none transition-all duration-700" 
          />
          <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0" />
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        </>
      )}

      {activeBg === 'sunset' && (
        <>
          <motion.div 
            animate={{ x: [0, 35, -35, 0], y: [0, -35, 35, 0] }}
            transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
            className="absolute top-[-15%] left-[20%] w-[55%] h-[55%] bg-amber-200/20 rounded-full blur-[120px] pointer-events-none transition-all duration-700" 
          />
          <motion.div 
            animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[15%] w-[55%] h-[55%] bg-rose-200/20 rounded-full blur-[120px] pointer-events-none transition-all duration-700" 
          />
          <div className="absolute top-[40%] left-[-10%] w-[45%] h-[45%] bg-purple-200/15 rounded-full blur-[100px] pointer-events-none transition-all duration-700" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(244,63,94,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,63,94,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        </>
      )}

      {/* HEADER NAVBAR */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="w-full h-16 sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-slate-200/40 flex items-center justify-between px-6 sm:px-12 lg:px-16"
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 font-sans">
            Vision<span className="text-blue-600 font-semibold">Studio</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-500">
          <button onClick={() => scrollToSection(featuresRef)} className="hover:text-slate-900 transition-colors cursor-pointer">Capabilities</button>
          <button onClick={() => scrollToSection(pricingRef)} className="hover:text-slate-900 transition-colors cursor-pointer">Pricing Tiers</button>
          <div className="h-4 w-px bg-slate-200" />
          <button 
            onClick={() => { setAuthMode('developer'); setIsAuthModalOpen(true); }}
            className="hover:text-slate-900 transition-colors cursor-pointer font-mono text-[10px]"
          >
            System Portal
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme customizer label trigger */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/60 border border-slate-200/40 mr-2">
            {[
              { id: 'aurora' as const, dot: 'bg-blue-400' },
              { id: 'cyber' as const, dot: 'bg-cyan-400' },
              { id: 'sunset' as const, dot: 'bg-rose-400' }
            ].map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => setActiveBg(bg.id)}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  activeBg === bg.id ? 'bg-white shadow-xs scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${bg.dot}`} />
              </button>
            ))}
          </div>

          <button
            onClick={() => { setAuthMode('user'); setIsAuthModalOpen(true); }}
            className="px-4.5 h-9.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.header>

      {/* SECTION 1: HERO CONTAINER (SPLIT VIEW) */}
      <div className="w-full flex flex-col lg:flex-row relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 lg:py-24 gap-12 items-center">
        
        {/* LEFT COLUMN: BRANDING & CALL-TO-ACTION */}
        <div className="w-full lg:w-1/2 space-y-8 text-left">
          
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/5 text-blue-600 border border-blue-500/10 font-mono text-[10px] font-bold tracking-wider uppercase shadow-xs backdrop-blur-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Next-Gen Neural Layer Extraction</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
              className="text-4xl sm:text-5.5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] font-sans"
            >
              Separate Subjects <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Instantly</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
              className="text-sm sm:text-[15px] text-slate-500 max-w-lg leading-relaxed"
            >
              Upload high-resolution files up to 50MB and watch our AI isolate subjects, feather edges, and generate transparent layers with flawless border alignment.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => { setAuthMode('user'); setIsAuthModalOpen(true); }}
              className="px-6 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/10 flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span>Isolate Your First Image</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => scrollToSection(pricingRef)}
              className="px-6 h-12 rounded-xl bg-white/70 hover:bg-white/90 border border-slate-200/80 text-slate-700 font-bold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span>Explore Subscriptions</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/50 max-w-md">
            {[
              { num: '50MB', label: 'Max File Size' },
              { num: '60/min', label: 'Pro Rate Limit' },
              { num: '100%', label: 'Edge Fidelity' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block font-sans">{stat.num}</span>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL SLIDER (REPLACES RIGID AUTH CARD) */}
        <div className="w-full lg:w-1/2 flex justify-center relative overflow-visible">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 85, damping: 15, delay: 0.2 }}
            className="relative w-full max-w-md bg-white/50 backdrop-blur-md rounded-3xl p-5 border border-slate-200/40 shadow-xl"
          >
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="relative w-full aspect-[4/3] rounded-2xl border border-slate-200/80 bg-slate-150 overflow-hidden cursor-ew-resize group select-none shadow-sm"
            >
              {/* BEFORE LAYER (LEFT) */}
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                {/* Busy background layer representing original input */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 via-rose-100 to-amber-100 opacity-95 flex items-center justify-center">
                  <span className="absolute top-3 left-4 text-[9px] font-bold font-mono tracking-wider text-slate-500 uppercase bg-white/70 border border-slate-200/40 px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    Original Input
                  </span>
                  
                  {/* Camera icon graphic without alpha mask */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100">
                    <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md">
                      <rect x="25" y="55" width="150" height="100" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="3" />
                      <rect x="45" y="43" width="30" height="12" rx="4" fill="#64748b" />
                      <circle cx="140" cy="46" r="10" fill="#f43f5e" />
                      <rect x="115" y="47" width="14" height="8" rx="2" fill="#475569" />
                      <circle cx="100" cy="105" r="42" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
                      <circle cx="100" cy="105" r="32" fill="#0f172a" />
                      <circle cx="90" cy="100" r="4" fill="white" opacity="0.8" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* AFTER LAYER (RIGHT) */}
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                {/* Transparency grid with smooth alpha halo edge */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: 'repeating-conic-gradient(#f8fafc 0% 25%, #e2e8f0 0% 50%) 50% / 16px 16px'
                  }}
                >
                  <span className="absolute top-3 right-4 text-[9px] font-bold font-mono tracking-wider text-slate-600 bg-white/85 px-2.5 py-1 rounded-full border border-slate-200 shadow-xs flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    Isolated Subject
                  </span>

                  {/* Camera graphic with dynamic shadow glow matching threshold slider */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100">
                    <svg 
                      viewBox="0 0 200 200" 
                      className="w-48 h-48"
                      style={{
                        filter: `drop-shadow(0 0 ${featherThreshold}px ${glowColor})`
                      }}
                    >
                      <rect x="25" y="55" width="150" height="100" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="3" />
                      <rect x="45" y="43" width="30" height="12" rx="4" fill="#64748b" />
                      <circle cx="140" cy="46" r="10" fill="#f43f5e" />
                      <rect x="115" y="47" width="14" height="8" rx="2" fill="#475569" />
                      <circle cx="100" cy="105" r="42" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
                      <circle cx="100" cy="105" r="32" fill="#0f172a" />
                      <circle cx="90" cy="100" r="4" fill="white" opacity="0.8" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* THE SLIDING DIVIDER HANDLE */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-white shadow-lg pointer-events-none z-30"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-md border border-slate-200/50 flex items-center justify-center pointer-events-none">
                  <Sliders className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>

              {/* Sweeping scan light bar */}
              {!hasInteracted && (
                <motion.div 
                  animate={{ left: ["0%", "100%", "0%"] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20"
                />
              )}
            </div>

            {/* LIVE ADJUSTMENT GAGE FOR DYNAMIC PREVIEWS */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Feather Smooth Threshold</span>
                  <span className="text-blue-600">{featherThreshold}px</span>
                </div>
                <input 
                  type="range"
                  min="3"
                  max="30"
                  value={featherThreshold}
                  onChange={(e) => {
                    setFeatherThreshold(parseInt(e.target.value));
                    if (!hasInteracted) setHasInteracted(true);
                  }}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              
              <div className="flex gap-1 shrink-0 pt-3">
                {['#3b82f6', '#06b6d4', '#ec4899'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setGlowColor(c);
                      if (!hasInteracted) setHasInteracted(true);
                    }}
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-xs transition-all hover:scale-125 cursor-pointer"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* SECTION 2: MARKETING & SUBSCRIPTION PLANS SECTION */}
      <div 
        ref={pricingRef}
        className="w-full py-20 px-6 sm:px-12 lg:px-16 border-t border-slate-200/40 relative overflow-visible bg-white/40"
      >
        <div className="max-w-7xl mx-auto space-y-14">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="text-center space-y-3.5 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/5 border border-indigo-500/10 text-indigo-600 text-[10px] font-bold tracking-wider uppercase font-mono">
              <Zap className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>SaaS Subscriptions</span>
            </div>
            <h2 className="text-2.5xl sm:text-3.5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Flexible Plans to Match Your Creative Workloads
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Unlock higher file size constraints, dedicated GPU queues, and parallel batch processors instantly.
            </p>
          </motion.div>

          {/* Staggered Pricing Cards Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                tier: "Free Developer",
                price: "$0",
                desc: "Get started building and testing image isolate processes.",
                features: [
                  "50 complimentary credits",
                  "Max 5MB upload size constraint",
                  "Standard Gemini Model queue",
                  "Single-file workspace processing",
                  "Developer API access"
                ],
                tag: "GUEST SANDBOX",
                isPopular: false,
                buttonLabel: "Get Started Free"
              },
              {
                tier: "Pro Studio",
                price: "$19.00",
                period: "/ month",
                desc: "High volume capabilities for professional creatives.",
                features: [
                  "1,000 premium monthly credits",
                  "Max 20MB file size limit",
                  "Dedicated Priority GPU queue",
                  "Parallel Batch processing workspace",
                  "Edge-Adaptive Alpha models",
                  "Premium integrations & Webhooks"
                ],
                tag: "POPULAR TIER",
                isPopular: true,
                buttonLabel: "Upgrade to Pro"
              },
              {
                tier: "Enterprise / Business",
                price: "$49.00",
                period: "/ month",
                desc: "Power high-throughput team and app pipeline segments.",
                features: [
                  "5,000 high-speed monthly credits",
                  "Max 50MB image file size limit",
                  "Infinite parallel batch queuing",
                  "Dedicated segment processing nodes",
                  "Advanced SLA rate limiters (60+/min)",
                  "24/7 dedicated support"
                ],
                tag: "ENTERPRISE READY",
                isPopular: false,
                buttonLabel: "Contact Business Sales"
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ type: "spring", stiffness: 90, damping: 15, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`relative rounded-[28px] border p-6.5 sm:p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-md ${
                  plan.isPopular
                    ? 'border-indigo-500/80 bg-white ring-4 ring-indigo-500/5 shadow-xl'
                    : 'border-slate-200/60 bg-white/80 hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Highly Recommended</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase tracking-widest block">{plan.tag}</span>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{plan.tier}</h3>
                    <p className="text-xs text-slate-500 leading-normal">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 py-1 border-y border-slate-100">
                    <span className="text-3.5xl font-extrabold text-slate-900 font-sans tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-xs text-slate-400 font-medium">{plan.period}</span>}
                  </div>

                  <ul className="space-y-3.5 text-xs">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex gap-2.5 items-start text-slate-600">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ${plan.isPopular ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-normal">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-8">
                  <button
                    onClick={() => { setAuthMode('user'); setIsAuthModalOpen(true); }}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      plan.isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {plan.buttonLabel}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* SECTION 3: CORE CAPABILITIES DECK */}
      <div 
        ref={featuresRef}
        className="w-full py-20 px-6 sm:px-12 lg:px-16 border-t border-slate-200/40 relative overflow-visible"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="text-center space-y-3.5 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/5 border border-blue-500/10 text-blue-600 text-[10px] font-bold tracking-wider uppercase font-mono">
              <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Full-Stack Neural Pipeline</span>
            </div>
            <h2 className="text-2.5xl sm:text-3.5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              A Studio Engineered for Pure Performance.
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Discover why hundreds of creators use our Gemini-powered architecture to isolate layers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {[
              {
                title: "Ultra-Precise Alpha Mattes",
                desc: "Sub-pixel edge detection ensures feathered hair strands, smooth vector borders, and glass layer transparencies are calculated cleanly.",
                icon: Layers,
                gradient: "from-blue-500/10 to-indigo-500/10",
                textColor: "text-blue-600",
                delay: 0.1
              },
              {
                title: "Zero-Latency Parallel Queues",
                desc: "Enterprise batch workflows process parallel requests asynchronously, updating your workspace history center with real-time push events.",
                icon: Zap,
                gradient: "from-cyan-500/10 to-blue-500/10",
                textColor: "text-cyan-600",
                delay: 0.2
              },
              {
                title: "Multi-Format Studio Exports",
                desc: "Download lossless files ready for design suites. Export standard PNGs, light WebPs, and clean alpha-channel vectors instantly.",
                icon: Maximize2,
                gradient: "from-rose-500/10 to-amber-500/10",
                textColor: "text-rose-600",
                delay: 0.3
              }
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ type: "spring", stiffness: 90, damping: 15, delay: feat.delay }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group relative rounded-3xl border border-slate-200/50 bg-white/70 shadow-sm hover:shadow-xl hover:border-slate-300 p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-xs"
              >
                <div className="space-y-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center shrink-0`}>
                    <feat.icon className={`w-5 h-5 ${feat.textColor}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">{feat.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold font-mono tracking-wide text-slate-400 group-hover:text-slate-600 transition-colors">
                  <span>CAPABILITY NODE {idx + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200/40 py-12 bg-white mt-auto text-[11px] font-mono text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026 AI Studio Vision Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400/80">
            <span>SaaS Workspace</span>
            <span>&bull;</span>
            <span>Gemini AI Integration</span>
          </div>
        </div>
      </footer>

      {/* POPUP AUTHENTICATION DIALOG MODAL (AnimatePresence powered) */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop Blur layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />

            {/* Login Card dialog popup container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative w-full max-w-md bg-white border border-slate-200/80 shadow-2xl rounded-[28px] overflow-hidden z-10 p-6 sm:p-9"
            >
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 border border-slate-200/40 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-7">
                {/* Modal Title */}
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {authMode === 'developer' ? 'Developer Login' : 'Authenticate Session'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {authMode === 'developer' ? 'Access systems control portal.' : 'Unlock your image segmentation studio.'}
                    </p>
                  </div>
                </div>

                {/* Switcher inside Modal for quick swap */}
                <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/30 text-xs font-semibold">
                  <button
                    onClick={() => { setAuthMode('user'); setError(''); }}
                    className={`flex-1 py-1.5 rounded-lg text-center ${
                      authMode === 'user' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => { setAuthMode('developer'); setError(''); }}
                    className={`flex-1 py-1.5 rounded-lg text-center ${
                      authMode === 'developer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Developer Node
                  </button>
                </div>

                {/* Error Box */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200/50 text-xs text-rose-700 font-medium flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Google user flow */}
                {authMode === 'user' ? (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                        Securely connect via Google Single Sign-on. Enjoy 50 free credits instantly on registering.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full h-12.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50/80 text-slate-800 font-bold text-xs shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-55"
                    >
                      <Chrome className="w-5 h-5 text-blue-600 animate-pulse" />
                      <span>{loading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
                    </button>

                    <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                      By proceeding, you unlock the primary vision gateway under the default Free Developer Tier limits.
                    </div>
                  </div>
                ) : (
                  /* Developer Form Flow */
                  <form onSubmit={handleDeveloperSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">Developer Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="admin@vision.ai"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-xs bg-slate-50 border border-slate-200/60 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-300 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">Access Secret Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-xs bg-slate-50 border border-slate-200/60 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-slate-300 transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-400 font-mono">RBAC Security Gate</span>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        <span>{loading ? 'Authorizing Cluster...' : 'Verify Node'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
