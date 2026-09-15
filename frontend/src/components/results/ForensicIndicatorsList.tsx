import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { ForensicIndicator } from '../../types';
import { CyberBadge } from '../cyber/CyberBadge';

interface ForensicIndicatorsListProps {
  indicators: ForensicIndicator[];
}

export const ForensicIndicatorsList: React.FC<ForensicIndicatorsListProps> = ({ indicators }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-[#12121a] border border-[#2a2a3a] p-4 sm:p-5 font-mono space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2a2a3a]">
        <div>
          <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
            FORENSIC INDICATORS &amp; ANOMALY BREAKDOWN
          </h3>
          <p className="text-[11px] text-[#6b7280]">
            Multi-spectral spatial frequency and boundary artifact decomposition
          </p>
        </div>

        {/* Mandatory Academic Integrity Notice */}
        <div className="px-2 py-1 bg-[#1c1c2e] border border-[#00d4ff]/30 text-[#00d4ff] text-[10px] flex items-center gap-1.5 self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Note: Model-derived / simulated indicators</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {indicators.map((ind) => {
          const isExpanded = expandedId === ind.id;
          const isHighRisk = ind.status === 'high_risk';
          const isSuspicious = ind.status === 'suspicious';
          const isNormal = ind.status === 'normal';

          const badgeVariant = isHighRisk ? 'red' : isSuspicious ? 'yellow' : 'green';
          const statusLabel = isHighRisk ? 'HIGH RISK' : isSuspicious ? 'SUSPICIOUS' : 'NORMAL';

          const statusColor = isHighRisk
            ? 'text-[#ff3366]'
            : isSuspicious
            ? 'text-[#ffcc00]'
            : 'text-[#00ff88]';

          const borderStyle = isHighRisk
            ? 'border-[#ff3366]/40 hover:border-[#ff3366]'
            : isSuspicious
            ? 'border-[#ffcc00]/40 hover:border-[#ffcc00]'
            : 'border-[#2a2a3a] hover:border-[#00ff88]/40';

          return (
            <div
              key={ind.id}
              className={`bg-[#0d0d14] border ${borderStyle} transition-all duration-150 overflow-hidden`}
            >
              {/* Card Header clickable */}
              <button
                type="button"
                onClick={() => toggleExpand(ind.id)}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer select-none"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="text-xs font-bold text-[#e0e0e0] uppercase truncate">
                    {ind.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-[#6b7280]">STATUS:</span>
                    <span className={`font-extrabold ${statusColor}`}>{statusLabel}</span>
                    <span className="text-[#6b7280]">|</span>
                    <span className="text-[#6b7280]">SCORE:</span>
                    <span className={`font-bold ${statusColor}`}>{ind.score}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <CyberBadge variant={badgeVariant} size="sm">
                    {statusLabel}
                  </CyberBadge>
                  <span className="text-[#6b7280]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>
              </button>

              {/* Expandable Explanation Body */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 text-xs text-[#9ca3af] border-t border-[#1c1c2e] bg-[#09090f] space-y-2">
                  <p className="leading-relaxed">{ind.explanation}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#6b7280] pt-1">
                    <span>EVALUATION SOURCE: XCEPTION TENSOR GRADIENT</span>
                    <span className="text-[#00d4ff]">SIMULATED HEURISTIC</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
