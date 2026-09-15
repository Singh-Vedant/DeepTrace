import React from 'react';

interface CyberBadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'cyan' | 'magenta' | 'yellow' | 'muted';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const CyberBadge: React.FC<CyberBadgeProps> = ({
  children,
  variant = 'green',
  size = 'sm',
  pulse = false,
  className = '',
}) => {
  const styles = {
    green: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/40',
    red: 'bg-[#ff3366]/10 text-[#ff3366] border-[#ff3366]/40',
    cyan: 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/40',
    magenta: 'bg-[#ff00ff]/10 text-[#ff00ff] border-[#ff00ff]/40',
    yellow: 'bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/40',
    muted: 'bg-[#1c1c2e] text-[#9ca3af] border-[#2a2a3a]',
  }[variant];

  const dotColor = {
    green: 'bg-[#00ff88]',
    red: 'bg-[#ff3366]',
    cyan: 'bg-[#00d4ff]',
    magenta: 'bg-[#ff00ff]',
    yellow: 'bg-[#ffcc00]',
    muted: 'bg-[#6b7280]',
  }[variant];

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold border
        whitespace-nowrap select-none
        ${sizeClass}
        ${styles}
        ${className}
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-none ${dotColor} ${pulse ? 'animate-pulse' : ''}`}
      />
      <span>{children}</span>
    </span>
  );
};
