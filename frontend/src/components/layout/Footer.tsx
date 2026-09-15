import React from 'react';
import { Shield, Terminal, Cpu, HardDrive } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#2a2a3a] bg-[#07070b] py-8 text-xs font-mono text-[#6b7280]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#e0e0e0] font-bold tracking-wider uppercase font-display">
              <Shield className="w-4 h-4 text-[#00ff88]" />
              <span>DEEPTRACE // FORENSIC VERIFICATION SUITE</span>
            </div>
            <p className="text-[11px] text-[#4b5563] max-w-xl">
              Academic demonstration frontend built for DeepfakeBench Xception benchmark detector.
              Target model weights: <code className="text-[#00d4ff]">training/weights/xception_best.pth</code> |
              Config: <code className="text-[#00d4ff]">training/config/detector/xception.yaml</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px]">
            <div className="px-2.5 py-1 bg-[#12121a] border border-[#2a2a3a] text-[#9ca3af]">
              ENV: <span className="text-[#00ff88]">CPU / MPS COMPLIANT</span>
            </div>
            <div className="px-2.5 py-1 bg-[#12121a] border border-[#2a2a3a] text-[#9ca3af]">
              API: <span className="text-[#00d4ff]">FASTAPI / REST CONTRACT READY</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1a1a26] flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#4b5563] gap-2">
          <div>
            © {new Date().getFullYear()} DEEPTRACE LABS • RESEARCH &amp; DEMONSTRATION PROTOTYPE
          </div>
          <div>
            NO DATA RESIDUALS PERSISTED TO CLOUD SERVERS • LOCAL FORENSIC PIPELINE
          </div>
        </div>
      </div>
    </footer>
  );
};
