import React, { useState } from 'react';
import { RefreshCw, Download, ArrowLeft, Cpu, ShieldAlert, ShieldCheck, History, Trash2, FileText, ExternalLink, Plus } from 'lucide-react';
import { AnalysisResponse } from '../types';
import { ResultHeader } from '../components/results/ResultHeader';
import { MetricsGrid } from '../components/results/MetricsGrid';
import { ForensicViewer } from '../components/results/ForensicViewer';
import { ForensicIndicatorsList } from '../components/results/ForensicIndicatorsList';
import { ExportReportModal } from '../components/results/ExportReportModal';
import { CyberButton } from '../components/cyber/CyberButton';
import { CyberBadge } from '../components/cyber/CyberBadge';
import { clearHistory } from '../services/api';

interface ResultsViewProps {
  result: AnalysisResponse | null;
  history: AnalysisResponse[];
  onSelectHistoryResult: (result: AnalysisResponse) => void;
  onRefreshHistory: () => void;
  onReset: () => void;
  onNavigateToAnalyze: () => void;
  onNavigateToSystem: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  history,
  onSelectHistoryResult,
  onRefreshHistory,
  onReset,
  onNavigateToAnalyze,
  onNavigateToSystem,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showHistoryList, setShowHistoryList] = useState(!result);

  const handleClearAll = () => {
    if (confirm('Permanently purge local forensic scan records?')) {
      clearHistory();
      onRefreshHistory();
    }
  };

  // If no result is selected and history is empty or user is toggled to history list:
  if (showHistoryList || !result) {
    return (
      <div className="space-y-6 font-mono">
        {/* Results Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a2a3a]">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#00ff88]" />
              <h1 className="text-xl sm:text-2xl font-black text-[#e0e0e0] uppercase tracking-wider font-display">
                FORENSIC SCAN AUDIT RECORDS
              </h1>
            </div>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Completed deepfake detections logged during this session ({history.length} records in local storage)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {result && (
              <button
                onClick={() => setShowHistoryList(false)}
                className="px-3 py-1.5 bg-[#12121a] hover:bg-[#1c1c2e] border border-[#00d4ff] text-[#00d4ff] text-xs font-bold transition-colors min-h-[44px]"
              >
                [ VIEW ACTIVE DOSSIER ]
              </button>
            )}

            <CyberButton
              variant="primary"
              size="sm"
              onClick={onNavigateToAnalyze}
              icon={<Plus className="w-4 h-4" />}
            >
              [ ANALYZE MEDIA ]
            </CyberButton>

            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 bg-[#1a0a0f] hover:bg-[#250d15] border border-[#ff3366]/40 hover:border-[#ff3366] text-[#ff3366] text-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
                title="Clear all stored scan records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CLEAR RECORDS</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State matching exact prompt specification */}
        {history.length === 0 ? (
          <div className="p-8 sm:p-12 bg-[#0d0d14] border border-[#2a2a3a] text-center space-y-4 chamfer-card">
            <div className="w-12 h-12 mx-auto bg-[#1c1c2e] border border-[#2a2a3a] flex items-center justify-center text-[#6b7280]">
              <FileText className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#e0e0e0] uppercase tracking-wider font-display">
                NO ANALYSIS RECORDS
              </h3>
              <p className="text-xs text-[#00ff88] font-mono">
                &gt; upload media to begin forensic analysis...
              </p>
            </div>

            <p className="text-xs text-[#6b7280] max-w-md mx-auto leading-relaxed">
              No previous analyses have been fabricated. Real execution records will appear here as you submit media tensors to the Xception pipeline.
            </p>

            <div className="pt-2">
              <CyberButton
                variant="primary"
                size="md"
                onClick={onNavigateToAnalyze}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                [ UPLOAD MEDIA NOW ]
              </CyberButton>
            </div>
          </div>
        ) : (
          /* Actual completed scan records table / card list */
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {history.map((item) => {
                const isFake = item.prediction === 'fake';
                const confidencePct = (item.confidence * 100).toFixed(2);

                return (
                  <div
                    key={item.id}
                    className={`
                      p-4 sm:p-5 bg-[#12121a] border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 chamfer-card
                      ${isFake ? 'border-[#ff3366]/40 hover:border-[#ff3366]' : 'border-[#00ff88]/40 hover:border-[#00ff88]'}
                    `}
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <CyberBadge variant={isFake ? 'red' : 'green'} size="sm">
                          {isFake ? 'FAKE' : 'REAL'}
                        </CyberBadge>
                        <span className="text-xs text-[#e0e0e0] font-bold truncate max-w-xs sm:max-w-md">
                          {item.filename}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#1c1c2e] text-[#6b7280] uppercase">
                          {item.media_type}
                        </span>
                      </div>

                      {/* Technical Breakdown line */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 text-[#9ca3af]">
                        <div>
                          <span className="text-[#6b7280]">RESULT:</span>{' '}
                          <span className={`font-bold ${isFake ? 'text-[#ff3366]' : 'text-[#00ff88]'}`}>
                            {isFake ? 'FAKE' : 'REAL'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6b7280]">CONFIDENCE:</span>{' '}
                          <span className="font-bold text-[#e0e0e0]">{confidencePct}%</span>
                        </div>
                        <div>
                          <span className="text-[#6b7280]">MODEL:</span>{' '}
                          <span className="text-[#00d4ff] font-semibold">{item.model.toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="text-[#6b7280]">DEVICE:</span>{' '}
                          <span className="text-[#ff00ff] font-semibold">{item.device || 'CPU / MPS'}</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#6b7280]">
                        TIMESTAMP: {item.timestamp} | PROCESSING TIME: {item.processing_time}s | FRAMES: {item.frames_analyzed}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <CyberButton
                        variant={isFake ? 'danger' : 'primary'}
                        size="sm"
                        onClick={() => {
                          onSelectHistoryResult(item);
                          setShowHistoryList(false);
                        }}
                        icon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        [ VIEW DOSSIER ]
                      </CyberButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Forensic Result Dossier View
  return (
    <div className="space-y-6 font-mono">
      {/* Top Action Nav Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2a2a3a]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryList(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#12121a] hover:bg-[#1c1c2e] border border-[#2a2a3a] text-[#00d4ff] hover:text-white text-xs transition-colors min-h-[44px]"
          >
            <History className="w-4 h-4 text-[#00d4ff]" />
            <span>[ VIEW ALL AUDIT RECORDS ({history.length}) ]</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#12121a] hover:bg-[#1c1c2e] border border-[#2a2a3a] text-[#9ca3af] hover:text-white text-xs transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>[ ANALYZE ANOTHER FILE ]</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <CyberButton
            variant="cyan"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            [ EXPORT REPORT ]
          </CyberButton>

          <CyberButton
            variant="secondary"
            size="sm"
            onClick={onNavigateToSystem}
            icon={<Cpu className="w-3.5 h-3.5" />}
          >
            [ MODEL ARCHITECTURE ]
          </CyberButton>
        </div>
      </div>

      {/* 1. Large Result Classification & Probability Banner */}
      <ResultHeader result={result} />

      {/* 2. Numeric Probabilities & Statistics Grid */}
      <MetricsGrid result={result} />

      {/* 3. Forensic Spatial & Temporal Viewer Canvas */}
      <ForensicViewer result={result} />

      {/* 4. Forensic Anomaly Indicators Breakdown */}
      <ForensicIndicatorsList indicators={result.forensic_indicators} />

      {/* Bottom Repeat CTA */}
      <div className="p-6 bg-[#0e0e17] border border-[#2a2a3a] flex flex-col sm:flex-row items-center justify-between gap-4 chamfer-card">
        <div>
          <h4 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
            ANALYSIS SESSION COMPLETE
          </h4>
          <p className="text-[11px] text-[#6b7280]">
            Audit payload cached in browser session memory. Ready for subsequent frame tensor inference.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistoryList(true)}
            className="px-4 py-2.5 bg-[#12121a] hover:bg-[#1c1c2e] border border-[#2a2a3a] text-[#9ca3af] hover:text-white text-xs font-mono min-h-[44px]"
          >
            [ VIEW AUDIT LOGS ]
          </button>

          <CyberButton
            variant="primary"
            size="md"
            onClick={onReset}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            [ ANALYZE NEW FILE ]
          </CyberButton>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        result={result}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
