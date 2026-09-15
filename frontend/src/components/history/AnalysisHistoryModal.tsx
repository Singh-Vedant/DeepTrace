import React from 'react';
import { History, X, Trash2, ArrowUpRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { AnalysisResponse } from '../../types';
import { clearHistory } from '../../services/api';
import { CyberBadge } from '../cyber/CyberBadge';

interface AnalysisHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisResponse[];
  onSelectResult: (result: AnalysisResponse) => void;
  onRefreshHistory: () => void;
}

export const AnalysisHistoryModal: React.FC<AnalysisHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onRefreshHistory,
}) => {
  if (!isOpen) return null;

  const handleClear = () => {
    if (confirm('Clear all local forensic scan history?')) {
      clearHistory();
      onRefreshHistory();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-2xl bg-[#0e0e17] border border-[#00d4ff] p-5 sm:p-6 glow-cyan max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2a3a]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00d4ff]" />
            <h3 className="text-sm font-bold uppercase text-[#e0e0e0] tracking-wider">
              LOCAL ANALYSIS HISTORY ARCHIVE
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-[#6b7280] hover:text-[#ff3366] flex items-center gap-1 px-2 py-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> CLEAR ALL
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-[#6b7280] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="my-4 flex-1 overflow-y-auto space-y-2 pr-1">
          {history.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6b7280] border border-[#1c1c2e] bg-[#09090f]">
              NO RECORDED SCANS YET. RUN MEDIA THROUGH THE ANALYZER TO LOG FORENSIC AUDITS.
            </div>
          ) : (
            history.map((item) => {
              const isFake = item.prediction === 'fake';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className={`
                    p-3.5 border transition-all cursor-pointer flex items-center justify-between gap-3
                    ${
                      isFake
                        ? 'bg-[#150a0f] border-[#ff3366]/30 hover:border-[#ff3366]'
                        : 'bg-[#0a1410] border-[#00ff88]/30 hover:border-[#00ff88]'
                    }
                  `}
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div
                      className={`w-8 h-8 flex items-center justify-center border shrink-0 ${
                        isFake ? 'border-[#ff3366] text-[#ff3366]' : 'border-[#00ff88] text-[#00ff88]'
                      }`}
                    >
                      {isFake ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#e0e0e0] truncate font-mono">
                        {item.filename}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#6b7280] mt-0.5">
                        <span>{item.timestamp}</span>
                        <span>•</span>
                        <span>{item.media_type.toUpperCase()}</span>
                        <span>•</span>
                        <span>{item.file_size_formatted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <CyberBadge variant={isFake ? 'red' : 'green'} size="sm">
                        {isFake ? 'DEEPFAKE' : 'AUTHENTIC'}
                      </CyberBadge>
                      <div className="text-[11px] font-bold text-white mt-1">
                        {(item.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#6b7280]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-[#2a2a3a] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs border border-[#2a2a3a] text-[#9ca3af] hover:text-white min-h-[44px]"
          >
            [ CLOSE ARCHIVE ]
          </button>
        </div>
      </div>
    </div>
  );
};
