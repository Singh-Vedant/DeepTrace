import React, { useState } from 'react';
import { Shield, Zap, AlertCircle, RefreshCw, ArrowLeft, Settings, Info } from 'lucide-react';
import { AnalysisResponse, AnalysisStatus } from '../types';
import { analyzeMedia, STAGES } from '../services/api';
import { FileDropzone } from '../components/upload/FileDropzone';
import { MediaPreview } from '../components/upload/MediaPreview';
import { AnalysisProgressView } from '../components/analysis/AnalysisProgressView';
import { CyberButton } from '../components/cyber/CyberButton';
import { CyberBadge } from '../components/cyber/CyberBadge';

interface AnalyzeViewProps {
  onAnalysisCompleted: (result: AnalysisResponse) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  onSetFile: (file: File | null, url: string | null) => void;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  onAnalysisCompleted,
  selectedFile,
  previewUrl,
  onSetFile,
}) => {
  const [status, setStatus] = useState<AnalysisStatus>(selectedFile ? 'file_selected' : 'idle');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Presentation override option ('auto' | 'fake' | 'real')
  const [demoOverride, setDemoOverride] = useState<'auto' | 'fake' | 'real'>('auto');
  const [showDemoSettings, setShowDemoSettings] = useState(false);

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    onSetFile(file, url);
    setStatus('file_selected');
    setErrorMessage(null);
  };

  const handleResetFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    onSetFile(null, null);
    setStatus('idle');
    setProgress(0);
    setCurrentStageIndex(0);
    setTerminalLogs([]);
    setErrorMessage(null);
  };

  const handleQuickSample = (type: 'fake' | 'real') => {
    // Generate a sample synthetic file in-memory using canvas/blob
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, type === 'fake' ? '#240813' : '#071d15');
      grad.addColorStop(1, '#0e0e17');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Cyber facial landmark geometry
      ctx.strokeStyle = type === 'fake' ? '#ff3366' : '#00ff88';
      ctx.lineWidth = 3;
      ctx.strokeRect(120, 100, 272, 320);

      // Facial oval
      ctx.beginPath();
      ctx.ellipse(256, 250, 110, 140, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = type === 'fake' ? 'rgba(255, 51, 102, 0.7)' : 'rgba(0, 255, 136, 0.7)';
      ctx.stroke();

      // Eyes
      ctx.fillStyle = type === 'fake' ? '#ff3366' : '#00ff88';
      ctx.fillRect(200, 220, 30, 15);
      ctx.fillRect(282, 220, 30, 15);

      // Mouth
      ctx.fillRect(220, 320, 72, 10);

      // Watermark text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(type === 'fake' ? 'SAMPLE_DEEPFAKE_FACE.PNG' : 'SAMPLE_AUTHENTIC_FACE.PNG', 70, 60);

      ctx.fillStyle = type === 'fake' ? '#ff3366' : '#00ff88';
      ctx.font = '14px monospace';
      ctx.fillText(
        type === 'fake'
          ? 'ANOMALOUS_POISSON_SEAM_INJECTED'
          : 'NATURAL_SENSOR_NOISE_PRESERVED',
        80,
        460
      );
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleName = type === 'fake' ? 'sample_manipulated_face.png' : 'sample_authentic_portrait.png';
        const file = new File([blob], sampleName, { type: 'image/png' });
        setDemoOverride(type);
        handleFileSelect(file);
      }
    }, 'image/png');
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile || !previewUrl) return;

    setStatus('processing');
    setProgress(5);
    setCurrentStageIndex(0);
    setErrorMessage(null);

    const initialLog = `[${new Date().toLocaleTimeString()}] DISPATCHING ${selectedFile.name} TO XCEPTION ENGINE...`;
    setTerminalLogs([initialLog]);

    try {
      const result = await analyzeMedia(selectedFile, previewUrl, {
        forceResult: demoOverride,
        onStageUpdate: (stageIndex, stageName, percent, logMessage) => {
          setCurrentStageIndex(stageIndex);
          setProgress(percent);
          const time = new Date().toLocaleTimeString();
          setTerminalLogs((prev) => [...prev, `[${time}] ${logMessage}`]);
        },
      });

      setStatus('completed');
      onAnalysisCompleted(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setStatus('error');
      setErrorMessage(
        err?.message || 'Forensic analysis pipeline failed. Unable to extract spatial tensors.'
      );
      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [!] ERROR: Pipeline execution halted.`,
      ]);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header bar with Presentation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a2a3a]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#e0e0e0] uppercase tracking-wider font-display">
              ANALYZE MEDIA FOR DEEPFAKE ARTIFACTS
            </h1>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            DeepfakeBench Xception detector pipeline (299x299 RGB Tensor decomposition)
          </p>
        </div>

        {/* Demo Mode Selector (Crucial for live College Presentation) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowDemoSettings(!showDemoSettings)}
            className="px-2.5 py-1.5 bg-[#12121a] hover:bg-[#1c1c2e] border border-[#2a2a3a] hover:border-[#00d4ff] text-[#9ca3af] hover:text-[#00d4ff] text-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
            title="Presentation simulation settings"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>DEMO TARGET: [{demoOverride.toUpperCase()}]</span>
          </button>
        </div>
      </div>

      {/* Demo Target Options Dropdown Banner */}
      {showDemoSettings && (
        <div className="p-3.5 bg-[#0e0e17] border border-[#00d4ff]/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-[fade-in_0.2s]">
          <div className="flex items-center gap-2 text-[#00d4ff]">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong>COLLEGE DEMO CONTROL:</strong> Force model prediction to showcase both Fake &amp; Authentic outcomes.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDemoOverride('auto')}
              className={`px-2.5 py-1 text-xs border ${
                demoOverride === 'auto'
                  ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-white font-bold'
                  : 'border-[#2a2a3a] text-[#6b7280]'
              }`}
            >
              AUTO (FILE DETECT)
            </button>
            <button
              onClick={() => setDemoOverride('fake')}
              className={`px-2.5 py-1 text-xs border ${
                demoOverride === 'fake'
                  ? 'bg-[#ff3366]/20 border-[#ff3366] text-[#ff3366] font-bold'
                  : 'border-[#2a2a3a] text-[#6b7280]'
              }`}
            >
              FORCE DEEPFAKE
            </button>
            <button
              onClick={() => setDemoOverride('real')}
              className={`px-2.5 py-1 text-xs border ${
                demoOverride === 'real'
                  ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-bold'
                  : 'border-[#2a2a3a] text-[#6b7280]'
              }`}
            >
              FORCE AUTHENTIC
            </button>
          </div>
        </div>
      )}

      {/* Dynamic View rendering based on state */}
      {status === 'processing' && (
        <AnalysisProgressView
          currentStageIndex={currentStageIndex}
          stages={STAGES}
          progress={progress}
          terminalLogs={terminalLogs}
          filename={selectedFile?.name || 'media_payload'}
        />
      )}

      {status === 'error' && (
        <div className="p-6 sm:p-8 bg-[#1a0a0f] border-2 border-[#ff3366] text-[#ff3366] space-y-4 glow-red">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wider">
              [!] FORENSIC ENGINE OFFLINE / ANALYSIS FAILED
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#e0e0e0] leading-relaxed">
            {errorMessage || 'Unable to connect to the analysis server or parse the media tensor payload.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <CyberButton
              variant="danger"
              size="md"
              onClick={handleStartAnalysis}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              [ RETRY ANALYSIS ]
            </CyberButton>

            <button
              onClick={handleResetFile}
              className="px-4 py-2 bg-[#12121a] hover:bg-[#1c1c2e] border border-[#2a2a3a] text-[#9ca3af] hover:text-white text-xs font-mono min-h-[44px]"
            >
              [ BACK TO UPLOAD ]
            </button>
          </div>
        </div>
      )}

      {status === 'file_selected' && selectedFile && previewUrl && (
        <MediaPreview
          file={selectedFile}
          previewUrl={previewUrl}
          onReset={handleResetFile}
          onStartAnalysis={handleStartAnalysis}
        />
      )}

      {status === 'idle' && (
        <FileDropzone
          onFileSelected={handleFileSelect}
          onSelectSample={handleQuickSample}
        />
      )}
    </div>
  );
};
