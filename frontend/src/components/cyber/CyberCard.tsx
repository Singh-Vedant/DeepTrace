import React from 'react';

interface CyberCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  variant?: 'default' | 'glow-green' | 'glow-red' | 'glow-cyan' | 'dim';
  chamfer?: boolean;
  className?: string;
  headerAction?: React.ReactNode;
  id?: string;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  title,
  subtitle,
  badge,
  variant = 'default',
  chamfer = false,
  className = '',
  headerAction,
  id,
}) => {
  const variantBorder = {
    default: 'border-[#2a2a3a] hover:border-[#3d3d52]',
    'glow-green': 'border-[#00ff88]/60 glow-green',
    'glow-red': 'border-[#ff3366]/60 glow-red',
    'glow-cyan': 'border-[#00d4ff]/60 glow-cyan',
    dim: 'border-[#1f1f2e]',
  }[variant];

  return (
    <div
      id={id}
      className={`
        relative bg-[#12121a] border ${variantBorder} transition-all duration-200
        ${chamfer ? 'chamfer-corner' : ''}
        ${className}
      `}
    >
      {/* Corner crosshair decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff88]/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff88]/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff88]/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff88]/40 pointer-events-none" />

      {(title || badge || headerAction) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2a3a]/80 bg-[#0d0d14]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 bg-[#00ff88] shrink-0" />
            {title && (
              <div className="min-w-0">
                <h3 className="text-xs font-mono font-bold tracking-wider text-[#e0e0e0] uppercase truncate">
                  [ {title} ]
                </h3>
                {subtitle && (
                  <p className="text-[10px] text-[#6b7280] font-mono truncate">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {headerAction}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};
