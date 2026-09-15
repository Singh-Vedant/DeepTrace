import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  variant?: 'hero' | 'subtle' | 'static';
  glow?: boolean;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  as: Component = 'h1',
  variant = 'hero',
  glow = true,
  className = '',
}) => {
  const isHero = variant === 'hero';

  return (
    <Component
      data-text={text}
      className={`
        relative inline-block font-display uppercase tracking-tight
        ${isHero ? 'animate-cyber-glitch' : ''}
        ${glow ? 'text-glow-green' : ''}
        text-[#e0e0e0] select-none
        ${className}
      `}
      style={{ letterSpacing: '0.04em' }}
    >
      {/* Primary foreground text */}
      <span className="relative z-10">{text}</span>

      {/* Cyan chromatic aberration pseudo layer */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 -z-10 text-[#00d4ff] opacity-80 pointer-events-none translate-x-[-1.5px] translate-y-[0.5px] blur-[0.4px]"
      >
        {text}
      </span>

      {/* Magenta chromatic aberration pseudo layer */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 -z-10 text-[#ff00ff] opacity-80 pointer-events-none translate-x-[1.5px] translate-y-[-0.5px] blur-[0.4px]"
      >
        {text}
      </span>
    </Component>
  );
};
