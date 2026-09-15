import React from 'react';
import { Cpu, Clock, Layers, Shield, Sparkles } from 'lucide-react';
import { AnalysisResponse } from '../../types';
import { CyberProgress } from '../cyber/CyberProgress';

interface MetricsGridProps {
  result: AnalysisResponse;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ result }) => {
  const isFake = result.prediction === 'fake';
  const realPct = (result.real_probability * 100).toFixed(2);
  const fakePct = (result.fake_probability * 100).toFixed(2);

  return (
    <div className="space-y-4 font-mono">
      {/* Probability Bars Comparison */}
      <div className="p-4 sm:p-5 bg-[#12121a] border border-[#2a2a3a] space-y-4">
        <div className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider flex items-center justify-between">
          <span>CLASSIFICATION PROBABILITY DISTRIBUTION</span>
          <span className="text-[10px] text-[#6b7280]">DECISION BOUNDARY: 50.0%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-[#0a0a0f] border border-[#ff3366]/30">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#ff3366] font-bold">FAKE PROBABILITY</span>
              <span className="text-[#ff3366] font-extrabold">{fakePct}%</span>
            </div>
            <CyberProgress
              value={result.fake_probability * 100}
              height="sm"
              variant="red"
              showBlocks={false}
            />
          </div>

          <div className="p-3 bg-[#0a0a0f] border border-[#00ff88]/30">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#00ff88] font-bold">REAL PROBABILITY</span>
              <span className="text-[#00ff88] font-extrabold">{realPct}%</span>
            </div>
            <CyberProgress
              value={result.real_probability * 100}
              height="sm"
              variant="green"
              showBlocks={false}
            />
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-[#12121a] border border-[#2a2a3a] flex flex-col justify-between">
          <div className="text-[11px] text-[#6b7280] uppercase flex items-center gap-1.5 mb-1">
            <Cpu className="w-3.5 h-3.5 text-[#00d4ff]" /> MODEL
          </div>
          <div className="text-base font-bold text-[#e0e0e0] font-display">
            {result.model.toUpperCase()}
          </div>
          <div className="text-[10px] text-[#6b7280] mt-1 truncate">
            {result.weights_file || 'xception_best.pth'}
          </div>
        </div>

        <div className="p-3.5 bg-[#12121a] border border-[#2a2a3a] flex flex-col justify-between">
          <div className="text-[11px] text-[#6b7280] uppercase flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-[#00ff88]" /> ENGINE
          </div>
          <div className="text-base font-bold text-[#00ff88] font-display">
            {result.engine.toUpperCase()}
          </div>
          <div className="text-[10px] text-[#6b7280] mt-1">
            FRAMEWORK: PYTORCH
          </div>
        </div>

        <div className="p-3.5 bg-[#12121a] border border-[#2a2a3a] flex flex-col justify-between">
          <div className="text-[11px] text-[#6b7280] uppercase flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#ff00ff]" /> FRAMES ANALYZED
          </div>
          <div className="text-base font-bold text-[#ff00ff] font-display">
            {result.frames_analyzed}
          </div>
          <div className="text-[10px] text-[#6b7280] mt-1 uppercase">
            {result.media_type === 'video' ? 'TEMPORAL SAMPLES' : 'SPATIAL CROP'}
          </div>
        </div>

        <div className="p-3.5 bg-[#12121a] border border-[#2a2a3a] flex flex-col justify-between">
          <div className="text-[11px] text-[#6b7280] uppercase flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#ffcc00]" /> PROCESSING TIME
          </div>
          <div className="text-base font-bold text-[#ffcc00] font-display">
            {result.processing_time} SEC
          </div>
          <div className="text-[10px] text-[#6b7280] mt-1">
            DEVICE: {result.device || 'CPU / MPS'}
          </div>
        </div>
      </div>
    </div>
  );
};
