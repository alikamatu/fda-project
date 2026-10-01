'use client';

import { motion } from 'framer-motion';

export function AuthBackground() {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" 
      aria-hidden="true"
    >
      {/* Background Subtle Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/25 to-slate-100/60" />

      {/* Animated SVG Ambient Glows */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/10 blur-[90px]"
      />

      <motion.div
        animate={{
          x: [0, -40, 25, 0],
          y: [0, 35, -25, 0],
          scale: [1, 1.12, 0.92, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <motion.div
        animate={{
          scale: [0.9, 1.05, 0.9],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-cyan-300/10 blur-[120px]"
      />

      {/* SVG Vector Background: Security Grid Pattern */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.035]" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="auth-grid-pattern" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="#0f172a" 
              strokeWidth="0.8" 
            />
            <circle cx="40" cy="0" r="1.2" fill="#0f172a" />
            <circle cx="0" cy="40" r="1.2" fill="#0f172a" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid-pattern)" />
      </svg>

      {/* Floating Animated Geometric SVG Decorative Accents */}
      {/* Top Right Floating Concentric Rings */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-16 -right-16 w-80 h-80 opacity-[0.06] text-blue-900"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      </motion.svg>

      {/* Bottom Left Subtle Verification Shield & Orbit */}
      <motion.svg
        animate={{
          y: [0, -12, 0],
          rotate: [0, 4, -4, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-10 -left-10 w-72 h-72 opacity-[0.05] text-indigo-900"
        viewBox="0 0 240 240"
        fill="none"
      >
        <path
          d="M120 20 L200 60 V120 C200 170 160 210 120 225 C80 210 40 170 40 120 V60 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        <circle cx="120" cy="120" r="40" stroke="currentColor" strokeWidth="1" />
      </motion.svg>

      {/* Subtle Corner Crosshairs */}
      <div className="absolute top-6 left-6 text-slate-300 opacity-40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4v16m-8-8h16" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute top-6 right-6 text-slate-300 opacity-40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4v16m-8-8h16" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-6 left-6 text-slate-300 opacity-40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4v16m-8-8h16" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 text-slate-300 opacity-40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4v16m-8-8h16" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
