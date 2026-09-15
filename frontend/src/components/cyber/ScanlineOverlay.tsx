import React from 'react';

interface ScanlineOverlayProps {
  enabled?: boolean;
}

export const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden scanline-effect opacity-80"
    >
      {/* Subtle vignette border */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.85)]" />

      {/* Subtle top horizontal sweep line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent opacity-60 animate-[pulse_4s_infinite]" />
    </div>
  );
};
