import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", light = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10">
        <motion.svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full drop-shadow-md"
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* 3D Geometric Icon inspired by the user provided logo */}
          <path d="M50 20L80 37.5V62.5L50 80L20 62.5V37.5L50 20Z" fill={light ? "#3b82f6" : "#1e293b"} />
          
          {/* Top Facet (Yellow/Orange) */}
          <path d="M50 20L80 37.5L50 55L20 37.5L50 20Z" fill="#f59e0b" />
          
          {/* Left Facet (Blue) */}
          <path d="M20 37.5L50 55V80L20 62.5V37.5Z" fill="#3b82f6" />
          
          {/* Right Facet (Red/Pink/Magenta) */}
          <path d="M50 55L80 37.5V62.5L50 80V55Z" fill="#ef4444" />
          <path d="M50 67.5L80 50V62.5L50 80V67.5Z" fill="#d946ef" />
          
          {/* Central Fold Highlight */}
          <path d="M50 55L65 46.25L50 37.5L35 46.25L50 55Z" fill="white" fillOpacity="0.2" />
          
          {/* Secondary Folds for 3D look */}
          <path d="M80 37.5L65 46.25V71.25L80 62.5V37.5Z" fill="#991b1b" opacity="0.1" />
          <path d="M35 46.25L50 55V80L35 71.25V46.25Z" fill="#1e3a8a" opacity="0.1" />
        </motion.svg>
      </div>
      <div className="flex flex-col">
        <motion.span 
          className={`text-xl font-black tracking-tight leading-none ${light ? 'text-white' : 'text-slate-900'}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          SIMPLY FUNDS
        </motion.span>
        <motion.span 
          className={`text-[8px] font-bold tracking-[0.2em] uppercase mt-1 ${light ? 'text-blue-100' : 'text-slate-500'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your Dreams, Our Loans!
        </motion.span>
      </div>
    </div>
  );
};

export default Logo;
