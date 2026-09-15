import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCheck } from 'lucide-react';
import { AnalysisResponse } from '../../types';
import { CyberButton } from '../cyber/CyberButton';

interface ExportReportModalProps {
  result: AnalysisResponse;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isFake = result.prediction === 'fake';

  const reportContent = `===============================================================
DEEPTRACE AI FORENSIC ANALYSIS REPORT
===============================================================
SCAN ID:           ${result.id}
TIMESTAMP:         ${result.timestamp}
TARGET FILE:       ${result.filename}
FILE TYPE:         ${result.media_type.toUpperCase()}
FILE SIZE:         ${result.file_size_formatted}
---------------------------------------------------------------
CLASSIFICATION:    ${isFake ? 'DEEPFAKE DETECTED [SYNTHETIC]' : 'AUTHENTIC MEDIA [INTEGRITY VERIFIED]'}
CONFIDENCE:        ${(result.confidence * 100).toFixed(2)}%
FAKE PROBABILITY:  ${(result.fake_probability * 100).toFixed(2)}%
REAL PROBABILITY:  ${(result.real_probability * 100).toFixed(2)}%
---------------------------------------------------------------
DETECTION ARCHITECTURE:
MODEL:             ${result.model} (DeepfakeBench Benchmark)
BACKBONE:          Depthwise Separable Convolutions (XceptionNet)
WEIGHTS FILE:      ${result.weights_file || 'xception_best.pth'}
CONFIG FILE:       ${result.config_file || 'training/config/detector/xception.yaml'}
INFERENCE DEVICE:  ${result.device}
FRAMES ANALYZED:   ${result.frames_analyzed}
PROCESSING TIME:   ${result.processing_time} SEC
---------------------------------------------------------------
FORENSIC INDICATORS (Model-derived / simulated indicators):
${result.forensic_indicators
  .map(
    (i) => `• ${i.name.padEnd(26)} [${i.status.toUpperCase()}]: ${i.score}%\n  Explanation: ${i.explanation}`
  )
  .join('\n')}
===============================================================
AUDIT VERDICT:
${
  isFake
    ? 'High confidence anomalies detected in spatial texture boundaries and facial landmarks consistent with generative deepfake manipulation.'
    : 'No statistically significant generative manipulation signatures detected; biometric landmarks and high-frequency pixel noise exhibit natural coherence.'
}
===============================================================
Produced by DEEPTRACE v1.0.0 - Academic Demonstration System
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deeptrace_forensic_${result.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-2xl bg-[#0e0e17] border-2 border-[#00ff88] p-5 sm:p-6 glow-green max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2a3a]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#00ff88]" />
            <h3 className="text-sm font-bold uppercase text-[#e0e0e0] tracking-wider">
              EXPORT FORENSIC AUDIT DOSSIER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6b7280] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="my-4 flex-1 overflow-y-auto bg-[#08080c] border border-[#2a2a3a] p-4 text-xs text-[#a0a0b8] select-all whitespace-pre font-mono leading-relaxed">
          {reportContent}
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#2a2a3a]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs border border-[#2a2a3a] text-[#6b7280] hover:text-white transition-colors min-h-[44px]"
          >
            CLOSE
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 text-xs border border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/20 flex items-center gap-2 min-h-[44px]"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY DOSSIER TEXT'}</span>
          </button>

          <CyberButton
            variant="primary"
            size="sm"
            onClick={handleDownload}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            DOWNLOAD .TXT REPORT
          </CyberButton>
        </div>
      </div>
    </div>
  );
};
