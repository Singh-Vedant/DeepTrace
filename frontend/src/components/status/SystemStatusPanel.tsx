import React, { useState, useEffect } from 'react';
import { Cpu, Server, Activity, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { SystemStatus } from '../../types';
import { getSystemStatus } from '../../services/api';
import { CyberBadge } from '../cyber/CyberBadge';

interface SystemStatusPanelProps {
  compact?: boolean;
  className?: string;
  onNavigateToSystem?: () => void;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
  compact = false,
  className = '',
  onNavigateToSystem,
}) => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await getSystemStatus();
      setStatus(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return (
      <div className="p-4 bg-[#12121a] border border-[#2a2a3a] text-xs font-mono text-[#6b7280] animate-pulse">
        QUERYING FORENSIC ENGINE HARDWARE...
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`p-3 bg-[#0d0d14] border border-[#2a2a3a] font-mono text-xs ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#00ff88] font-bold text-[11px] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> SYSTEM TELEMETRY
          </span>
          <CyberBadge variant="green" pulse>ONLINE</CyberBadge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-[#6b7280]">MODEL:</span>{' '}
            <span className="text-[#e0e0e0] font-semibold">{status.model_name}</span>
          </div>
          <div>
            <span className="text-[#6b7280]">ENGINE:</span>{' '}
            <span className="text-[#00d4ff] font-semibold">{status.engine}</span>
          </div>
          <div>
            <span className="text-[#6b7280]">DEVICE:</span>{' '}
            <span className="text-[#ff00ff] font-semibold">{status.device}</span>
          </div>
          <div>
            <span className="text-[#6b7280]">THREAT:</span>{' '}
            <span className="text-[#00ff88] font-semibold">{status.threat.toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-[#12121a] border border-[#2a2a3a] p-4 sm:p-5 relative font-mono
        hover:border-[#00ff88]/40 transition-colors
        ${className}
      `}
    >
      {/* Corner crosshairs */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#00ff88]" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#00ff88]" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#00ff88]" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#00ff88]" />

      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2a2a3a]">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#00ff88]" />
          <h4 className="text-xs font-bold tracking-widest text-[#e0e0e0] uppercase">
            SYSTEM STATUS &amp; TELEMETRY
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStatus}
            title="Refresh telemetry"
            className="text-[#6b7280] hover:text-[#00ff88] transition-colors p-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <CyberBadge variant="green" pulse>ONLINE</CyberBadge>
        </div>
      </div>

      <div className="space-y-2 text-xs divide-y divide-[#1c1c2e]">
        <div className="flex items-center justify-between pt-1">
          <span className="text-[#6b7280] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#00d4ff]" /> MODEL
          </span>
          <span className="font-bold text-[#e0e0e0] tracking-wider">{status.model_name}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[#6b7280] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00ff88]" /> ENGINE
          </span>
          <span className="font-bold text-[#00ff88] tracking-wider">{status.engine}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[#6b7280] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00d4ff]" /> STATUS
          </span>
          <span className="text-[#00ff88] font-bold tracking-wider">ONLINE</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[#6b7280] flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-[#ff00ff]" /> DEVICE
          </span>
          <span className="font-bold text-[#ff00ff] tracking-wider">{status.device}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[#6b7280] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" /> THREAT
          </span>
          <span className="text-[#00d4ff] font-bold tracking-wider">
            {status.threat.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[#6b7280]">DATABASE</span>
          <span className="text-[#00ff88] font-bold tracking-wider">{status.database.toUpperCase()}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[#6b7280]">VERSION</span>
          <span className="text-[#9ca3af]">{status.version}</span>
        </div>
      </div>

      {onNavigateToSystem && (
        <button
          onClick={onNavigateToSystem}
          className="mt-4 w-full py-2 bg-[#1c1c2e] hover:bg-[#252538] text-[11px] text-[#00ff88] border border-[#2a2a3a] hover:border-[#00ff88]/40 transition-colors uppercase font-mono tracking-wider"
        >
          [ VIEW ARCHITECTURE SPEC ]
        </button>
      )}
    </div>
  );
};
