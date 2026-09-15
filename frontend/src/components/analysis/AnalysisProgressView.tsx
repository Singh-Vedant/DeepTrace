import React from 'react';
import { Cpu, Activity, Check, ArrowRight, Loader2, Layers } from 'lucide-react';
import { CyberProgress } from '../cyber/CyberProgress';
import { CyberBadge } from '../cyber/CyberBadge';
import { TerminalPanel } from '../terminal/TerminalPanel';

interface StageState {
  name: string;
  log: string;
}

interface AnalysisProgressViewProps {
  currentStageIndex: number;
  stages: StageState[];
  progress: number;
  terminalLogs: string[];
  filename: string;
}

export const AnalysisProgressView: React.FC<AnalysisProgressViewProps> = ({
  currentStageIndex,
  stages,
  progress,
  terminalLogs,
  filename,
}) => {
  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner Status */}
      <div className="bg-[#12121a] border border-[#00ff88]/40 p-4 sm:p-5 relative glow-green">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a2a3a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00ff88]/15 border border-[#00ff88] flex items-center justify-center text-[#00ff88]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#e0e0e0] uppercase tracking-wider font-display">
                FORENSIC ENGINE ACTIVE: ANALYZING MEDIA
              </h2>
              <p className="text-xs text-[#6b7280]">
                TARGET: <span className="text-[#00d4ff]">{filename}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CyberBadge variant="green" pulse>
              PROCESSING: ACTIVE
            </CyberBadge>
            <CyberBadge variant="cyan">
              MODEL: XCEPTION
            </CyberBadge>
            <CyberBadge variant="magenta">
              ENGINE: DEEPFAKEBENCH
            </CyberBadge>
          </div>
        </div>

        {/* Big Cyber Progress Bar */}
        <div className="pt-4">
          <CyberProgress
            value={progress}
            height="md"
            variant="green"
            label="INFERENCE PIPELINE PROGRESS"
            totalBlocks={30}
          />
        </div>
      </div>

      {/* Grid of Stage Checklist & Live Terminal Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Stages Checklist (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e0e17] border border-[#2a2a3a] p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2a2a3a]">
            <span className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00ff88]" /> PIPELINE STAGES
            </span>
            <span className="text-[11px] text-[#6b7280]">
              STAGE {Math.min(stages.length, currentStageIndex + 1)} OF {stages.length}
            </span>
          </div>

          <div className="space-y-2">
            {stages.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isPending = idx > currentStageIndex;

              return (
                <div
                  key={idx}
                  className={`
                    p-2.5 text-xs flex items-center justify-between border transition-colors
                    ${
                      isCompleted
                        ? 'bg-[#00ff88]/5 border-[#00ff88]/30 text-[#00ff88]'
                        : isCurrent
                        ? 'bg-[#00d4ff]/10 border-[#00d4ff] text-[#e0e0e0] shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                        : 'bg-[#12121a]/50 border-[#1f1f2e] text-[#6b7280]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isCompleted && (
                      <span className="w-4 h-4 flex items-center justify-center bg-[#00ff88] text-[#0a0a0f] font-bold text-[10px] shrink-0">
                        ✓
                      </span>
                    )}
                    {isCurrent && (
                      <span className="w-4 h-4 flex items-center justify-center bg-[#00d4ff] text-[#0a0a0f] font-bold text-[10px] shrink-0 animate-pulse">
                        →
                      </span>
                    )}
                    {isPending && (
                      <span className="w-4 h-4 flex items-center justify-center border border-[#2a2a3a] text-[#4b5563] text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                    )}
                    <span className="font-semibold uppercase truncate">
                      {stage.name}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase font-mono shrink-0">
                    {isCompleted && 'DONE'}
                    {isCurrent && <span className="text-[#00d4ff] animate-pulse">RUNNING...</span>}
                    {isPending && <span className="text-[#4b5563]">QUEUED</span>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Model Hardware Info Footer */}
          <div className="mt-4 pt-3 border-t border-[#2a2a3a] text-[10px] text-[#6b7280] space-y-1">
            <div>WEIGHTS: xception_best.pth (DeepfakeBench)</div>
            <div>CONFIG: training/config/detector/xception.yaml</div>
            <div>EXECUTION: CPU / MPS (Apple Silicon / Portable Mode)</div>
          </div>
        </div>

        {/* Live Terminal Log (7 cols) */}
        <div className="lg:col-span-7">
          <TerminalPanel
            lines={terminalLogs}
            title="DEEPFAKEBENCH_STDOUT_STREAM"
            isProcessing={true}
            maxHeight="max-h-[380px]"
          />
        </div>
      </div>
    </div>
  );
};
