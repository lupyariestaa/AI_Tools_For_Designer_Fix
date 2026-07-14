import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalUrl: string;
  processedUrl: string;
  className?: string;
}

export default function BeforeAfterSlider({ originalUrl, processedUrl, className = "" }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      id="before-after-container"
      ref={containerRef} 
      className={`relative select-none overflow-hidden rounded-2xl shadow-premium dark:shadow-premium-dark border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 transparent-checkerboard ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Before Image (Original) - Left half */}
      <img 
        id="slider-original-img"
        src={originalUrl} 
        alt="Original" 
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* After Image (Processed) - Right half clipped */}
      <div 
        id="slider-processed-clip-pane"
        className="absolute top-0 right-0 h-full overflow-hidden pointer-events-none"
        style={{ 
          left: `${sliderPosition}%`, 
          width: `${100 - sliderPosition}%` 
        }}
      >
        <img 
          id="slider-processed-img"
          src={processedUrl} 
          alt="Processed" 
          className="absolute top-0 right-0 h-full object-contain pointer-events-none"
          style={{ 
            width: containerRef.current?.getBoundingClientRect().width || '100%',
            maxWidth: 'none'
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Slider Split Line */}
      <div 
        id="slider-split-divider"
        className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-30 flex items-center justify-center shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xl cursor-ew-resize">
          <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 4 4 4m8 0l4-4-4-4" />
          </svg>
        </div>
      </div>

      {/* Badges for Visual Clarity */}
      <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-md bg-black/50 text-white text-xs font-medium tracking-wide backdrop-blur-sm">
        Original
      </div>
      <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-md bg-brand-600 text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-md backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5" />
        AI Vision
      </div>
    </div>
  );
}
