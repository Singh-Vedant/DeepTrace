import React from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { AnalysisResponse } from '../../types';
import { CyberBadge } from '../cyber/CyberBadge';

interface ResultHeaderProps {
  result: AnalysisResponse;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({ result }) => {
  const isFake = result.prediction === 'fake';
  const confidencePercent = (result.confidence * 100).toFixed(2);
  const fakeProbPercent = (result.fake_probability * 100).toFixed(2);

  return (
    <div
      className={`
        p-6 sm:p-8 border-2 transition-all font-mono relative overflow-hidden
        ${
          isFake
            ? 'bg-[#1a0f14] border-[#ff3366] glow-red text-[#ff3366]'
            : 'bg-[#0a1612] border-[#00ff88] glow-green text-[#00ff88]'
        }
      `}
    >
      {/* Corner crosshairs */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current" />

      {/* Watermark classification background text */}
      <div
        aria-hidden="true"
        className="absolute right-4 bottom-2 text-7xl sm:text-9xl font-extrabold uppercase opacity-5 select-none pointer-events-none font-display"
      >
        {isFake ? 'SYNTHETIC' : 'AUTHENTIC'}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CyberBadge variant={isFake ? 'red' : 'green'} pulse size="md">
              {isFake ? 'THREAT DETECTED' : 'INTEGRITY VERIFIED'}
            </CyberBadge>
            <span className="text-xs text-[#9ca3af] tracking-wider uppercase">
              SCAN ID: {result.id}
            </span>
          </div>

          <h1
            className={`
              text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight font-display
              ${isFake ? 'text-[#ff3366] text-glow-red' : 'text-[#00ff88] text-glow-green'}
            `}
          >
            {isFake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC MEDIA'}
          </h1>

          <p className="text-xs sm:text-sm text-[#c4c4d4] max-w-xl">
            {isFake
              ? 'Xception neural feature extraction identified spatial artifacts and boundary synthesis anomalies exceeding the manipulation threshold.'
              : 'Xception model inference observed natural biometric distributions and smooth sensor pixel noise consistent with authentic unmanipulated media.'}
          </p>
        </div>

        {/* Large Confidence & Probability Meter */}
        <div className="bg-[#0e0e17] border border-current p-4 sm:p-5 text-center min-w-[220px] shrink-0">
          <div className="text-[11px] text-[#9ca3af] uppercase tracking-widest mb-1">
            {isFake ? 'DEEPFAKE PROBABILITY' : 'CONFIDENCE SCORE'}
          </div>
          <div
            className={`text-3xl sm:text-4xl font-black font-display tracking-tight ${
              isFake ? 'text-[#ff3366]' : 'text-[#00ff88]'
            }`}
          >
            {confidencePercent}%
          </div>
          <div className="mt-2 text-[10px] text-[#6b7280] uppercase">
            CLASSIFICATION: <span className="text-white font-bold">{isFake ? 'DEEPFAKE' : 'AUTHENTIC'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
