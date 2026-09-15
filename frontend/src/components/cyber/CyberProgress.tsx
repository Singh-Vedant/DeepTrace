import React from 'react';

interface CyberProgressProps {
  value: number; // 0 to 100
  showBlocks?: boolean;
  totalBlocks?: number;
  height?: 'sm' | 'md' | 'lg';
  label?: string;
  variant?: 'green' | 'cyan' | 'magenta' | 'red';
  className?: string;
}

export const CyberProgress: React.FC<CyberProgressProps> = ({
  value,
  showBlocks = true,
  totalBlocks = 24,
  height = 'md',
  label,
  variant = 'green',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const activeBlocksCount = Math.round((clamped / 100) * totalBlocks);

  const colors = {
    green: {
      bar: 'bg-[#00ff88]',
      text: 'text-[#00ff88]',
      glow: 'shadow-[0_0_12px_rgba(0,255,136,0.5)]',
      border: 'border-[#00ff88]/40',
    },
    cyan: {
      bar: 'bg-[#00d4ff]',
      text: 'text-[#00d4ff]',
      glow: 'shadow-[0_0_12px_rgba(0,212,255,0.5)]',
      border: 'border-[#00d4ff]/40',
    },
    magenta: {
      bar: 'bg-[#ff00ff]',
      text: 'text-[#ff00ff]',
      glow: 'shadow-[0_0_12px_rgba(255,0,255,0.5)]',
      border: 'border-[#ff00ff]/40',
    },
    red: {
      bar: 'bg-[#ff3366]',
      text: 'text-[#ff3366]',
      glow: 'shadow-[0_0_12px_rgba(255,51,102,0.5)]',
      border: 'border-[#ff3366]/40',
    },
  }[variant];

  const barHeight = {
    sm: 'h-1.5',
    md: 'h-3',
    lg: 'h-5',
  }[height];

  // Character-based block representation: [████░░░░]
  const asciiFilled = '█'.repeat(activeBlocksCount);
  const asciiEmpty = '░'.repeat(Math.max(0, totalBlocks - activeBlocksCount));

  return (
    <div className={`space-y-1.5 font-mono ${className}`}>
      {(label || showBlocks) && (
        <div className="flex items-center justify-between text-xs tracking-wider text-[#9ca3af]">
          {label && <span className="uppercase text-[#e0e0e0] font-semibold">{label}</span>}
          <span className={`${colors.text} font-bold tracking-widest`}>
            {clamped.toFixed(1)}%
          </span>
        </div>
      )}

      {/* Modern cyber styled visual bar with segments */}
      <div className={`relative w-full ${barHeight} bg-[#0d0d14] border ${colors.border} p-[1px] overflow-hidden`}>
        <div
          className={`h-full ${colors.bar} ${colors.glow} transition-all duration-300 ease-out relative`}
          style={{ width: `${clamped}%` }}
        >
          {/* Subtle light sweep animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent w-full animate-[pulse_1.5s_infinite]" />
        </div>
      </div>

      {/* ASCII bracketed blocks format for technical aesthetic */}
      {showBlocks && (
        <div className="flex items-center justify-between text-[10px] tracking-tight text-[#4b5563] select-none font-mono">
          <span className="truncate">
            [{asciiFilled}
            <span className="text-[#2a2a3a]">{asciiEmpty}</span>]
          </span>
          <span className="shrink-0 pl-2 text-[10px] text-[#6b7280]">
            {activeBlocksCount}/{totalBlocks} BLOCKS
          </span>
        </div>
      )}
    </div>
  );
};
