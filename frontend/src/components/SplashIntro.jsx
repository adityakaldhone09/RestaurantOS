import React, { useState, useEffect } from 'react';
import { RestaurantOSLogoReveal } from './ui/liquid-glass-logo-reveal';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * SplashIntro
 * Fullscreen liquid glass logo reveal overlay that plays when opening the app/login.
 * Smoothly dissolves to reveal the application.
 */
const SplashIntro = ({ onFinish, duration = 3000 }) => {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress ticker
    const interval = 50;
    const step = 100 / (duration / interval);
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    // Auto-dismiss after duration
    const dismissTimer = setTimeout(() => {
      handleExit();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleExit = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 700); // match transition duration
  };

  return (
    <div
      onClick={handleExit}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#400849] select-none cursor-pointer overflow-hidden transition-all duration-700 ease-out ${
        exiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Luxury Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF5A0A]/20 blur-3xl pointer-events-none animate-pulse duration-1000" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E7B0DE]/20 blur-3xl pointer-events-none animate-pulse duration-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(20,4,24,0.7)_100%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#E7B0DE] mb-7 shadow-lg">
          <Sparkles size={14} className="text-[#FF5A0A]" />
          <span>Next-Gen Hospitality Operations</span>
        </div>

        {/* Liquid Glass Logo Tile */}
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/20 bg-[#28052F]/80 backdrop-blur-xl relative group">
          <RestaurantOSLogoReveal
            tileSize={240}
            loop={false}
            speed={1.05}
            themeVariant="brand"
            className="w-full h-full"
          />
        </div>

        {/* Brand Headline */}
        <div className="mt-8 space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            Restaurant<span className="text-[#FF5A0A]">OS</span>
          </h1>
          <p className="text-xs uppercase font-bold tracking-[0.22em] text-[#E7B0DE]/80">
            Intelligent Dining Suite
          </p>
        </div>

        {/* Elegant Animated Progress Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full mt-7 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF5A0A] to-[#E7B0DE] rounded-full transition-all duration-75 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Subtle Tap Hint */}
        <p className="text-[11px] text-[#E7B0DE]/50 mt-4 tracking-wide font-medium">
          Click anywhere to skip
        </p>
      </div>

      {/* Skip Button Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleExit();
        }}
        className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-all flex items-center gap-1.5 backdrop-blur"
      >
        <span>Skip</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
};

export default SplashIntro;
