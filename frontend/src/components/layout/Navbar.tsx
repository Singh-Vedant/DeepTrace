import React, { useState } from 'react';
import { Shield, Menu, X, History, Sliders, Layers, Terminal, AlertCircle } from 'lucide-react';
import { CyberBadge } from '../cyber/CyberBadge';

export type PageView = 'dashboard' | 'analyze' | 'results' | 'system' | 'about';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  hasResult: boolean;
  onOpenHistory: () => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  hasResult,
  onOpenHistory,
  scanlinesEnabled,
  onToggleScanlines,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PageView; label: string; disabled?: boolean }[] = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'analyze', label: 'ANALYZE' },
    { id: 'results', label: 'RESULTS' },
    { id: 'system', label: 'SYSTEM' },
    { id: 'about', label: 'ABOUT' },
  ];

  const handleNav = (id: PageView) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[#2a2a3a] font-mono select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-[#00ff88]/15 border border-[#00ff88] flex items-center justify-center text-[#00ff88] group-hover:shadow-[0_0_12px_rgba(0,255,136,0.5)] transition-all">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-widest text-[#e0e0e0] font-display">
                DEEPTRACE
              </span>
              <span className="text-[10px] px-1 py-0.2 bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40 font-bold hidden sm:inline-block">
                v1.0
              </span>
            </div>
            <div className="text-[9px] tracking-wider text-[#6b7280] uppercase -mt-0.5 hidden sm:block">
              AI-POWERED DEEPFAKE FORENSICS
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                disabled={link.disabled}
                className={`
                  px-3.5 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-150 border
                  ${
                    isActive
                      ? 'bg-[#00ff88]/15 border-[#00ff88] text-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                      : 'bg-transparent border-transparent text-[#9ca3af] hover:text-white hover:border-[#2a2a3a]'
                  }
                  ${link.disabled ? 'opacity-30 cursor-not-allowed hover:text-[#9ca3af] hover:border-transparent' : 'cursor-pointer'}
                `}
              >
                [ {link.label} ]
              </button>
            );
          })}
        </nav>

        {/* Status Indicator & Utility Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 pl-2">
            <CyberBadge variant="green" pulse size="sm">
              SYSTEM ONLINE
            </CyberBadge>
          </div>

          <button
            onClick={onOpenHistory}
            title="Scan history"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#2a2a3a] hover:border-[#00d4ff] bg-[#12121a] text-[#9ca3af] hover:text-[#00d4ff] transition-colors"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleScanlines}
            title="Toggle cyber scanline overlay"
            className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border transition-colors ${
              scanlinesEnabled
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                : 'border-[#2a2a3a] text-[#6b7280] bg-[#12121a]'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#2a2a3a] bg-[#12121a] text-[#e0e0e0]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2a2a3a] bg-[#0d0d14] px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              disabled={link.disabled}
              className={`
                w-full text-left px-4 py-3 text-xs uppercase font-bold border min-h-[44px] flex items-center justify-between
                ${
                  currentPage === link.id
                    ? 'bg-[#00ff88]/15 border-[#00ff88] text-[#00ff88]'
                    : 'bg-[#12121a] border-[#2a2a3a] text-[#9ca3af]'
                }
                ${link.disabled ? 'opacity-30' : ''}
              `}
            >
              <span>[ {link.label} ]</span>
              {currentPage === link.id && <span className="text-[#00ff88]">ACTIVE</span>}
            </button>
          ))}
          <div className="pt-2 border-t border-[#2a2a3a] flex items-center justify-between text-xs text-[#6b7280]">
            <span>ENGINE: DEEPFAKEBENCH</span>
            <span className="text-[#00ff88]">● SYSTEM ONLINE</span>
          </div>
        </div>
      )}
    </header>
  );
};
