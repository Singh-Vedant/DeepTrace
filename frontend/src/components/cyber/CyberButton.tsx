import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cyan' | 'magenta' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  chamfer?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  chamfer = true,
  glow = true,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  // Base sizing ensures >= 44px touch targets on mobile/desktop
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs min-h-[44px]',
    md: 'px-6 py-3 text-sm min-h-[48px]',
    lg: 'px-8 py-4 text-base min-h-[54px] tracking-wider font-bold',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#00ff88]/15 border border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/25 active:bg-[#00ff88]/35 ' +
      (glow ? 'hover:shadow-[0_0_15px_rgba(0,255,136,0.4)]' : ''),
    secondary:
      'bg-[#1c1c2e] border border-[#2a2a3a] text-[#e0e0e0] hover:border-[#00ff88]/60 hover:text-white hover:bg-[#252538] active:bg-[#1a1a2b]',
    cyan:
      'bg-[#00d4ff]/15 border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/25 active:bg-[#00d4ff]/35 ' +
      (glow ? 'hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]' : ''),
    magenta:
      'bg-[#ff00ff]/15 border border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff]/25 active:bg-[#ff00ff]/35 ' +
      (glow ? 'hover:shadow-[0_0_15px_rgba(255,0,255,0.4)]' : ''),
    danger:
      'bg-[#ff3366]/15 border border-[#ff3366] text-[#ff3366] hover:bg-[#ff3366]/25 active:bg-[#ff3366]/35 ' +
      (glow ? 'hover:shadow-[0_0_15px_rgba(255,51,102,0.4)]' : ''),
    ghost:
      'bg-transparent border border-transparent text-[#6b7280] hover:text-[#00ff88] hover:border-[#2a2a3a] hover:bg-[#12121a]',
  }[variant];

  const chamferClass = chamfer ? (size === 'lg' ? 'chamfer-corner' : 'chamfer-corner-sm') : '';

  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2.5 font-mono uppercase transition-all duration-200
        select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${sizeStyles}
        ${variantStyles}
        ${chamferClass}
        ${className}
      `}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
