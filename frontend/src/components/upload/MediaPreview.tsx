import React, { useState, useEffect } from 'react';
import { Trash2, Play, Pause, Zap, CheckCircle2, FileText, Maximize2, ShieldAlert } from 'lucide-react';
import { CyberButton } from '../cyber/CyberButton';
import { CyberBadge } from '../cyber/CyberBadge';
import { formatBytes } from '../../services/api';

interface MediaPreviewProps {
  file: File;
  previewUrl: string;
  onReset: () => void;
  onStartAnalysis: () => void;
  disabled?: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  file,
  previewUrl,
  onReset,
  onStartAnalysis,
  disabled = false,
}) => {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|avi|webm)$/i.test(file.name);
  const [resolution, setResolution] = useState<string>('Computing...');
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomScan, setZoomScan] = useState(false);

  useEffect(() => {
    if (!isVideo) {
      const img = new Image();
      img.onload = () => {
        setResolution(`${img.naturalWidth} x ${img.naturalHeight} px`);
      };
      img.onerror = () => setResolution('Unknown resolution');
      img.src = previewUrl;
    }
  }, [file, previewUrl, isVideo]);

  const handleVideoLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setResolution(`${video.videoWidth} x ${video.videoHeight} px (${video.duration.toFixed(1)}s)`);
  };

  return (
    <div className="space-y-5 font-mono">
      {/* Media Inspection Canvas Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Preview (8 cols on lg) */}
        <div className="lg:col-span-7 bg-[#0b0b12] border border-[#2a2a3a] relative overflow-hidden flex items-center justify-center min-h-[320px] max-h-[460px]">
          {/* Cyber reticles */}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#0a0a0f]/80 border border-[#00ff88]/40 text-[#00ff88] text-[10px] z-20">
            SENSOR_FEED: LIVE
          </div>
          <div className="absolute top-2 right-2 z-20 flex gap-1">
            <button
              onClick={() => setZoomScan(!zoomScan)}
              className="px-2 py-0.5 bg-[#0a0a0f]/80 border border-[#2a2a3a] hover:border-[#00ff88] text-[#9ca3af] hover:text-[#00ff88] text-[10px] transition-colors"
            >
              {zoomScan ? 'FIT' : 'SCAN_GRID'}
            </button>
          </div>

          {/* Crosshair markers */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="w-full h-full border border-[#00ff88]/10 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#00ff88]/15" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#00ff88]/15" />
              {/* Center target circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-[#00ff88]/25 rounded-full" />
            </div>
          </div>

          {isVideo ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-2 relative z-0">
              <video
                src={previewUrl}
                controls
                onLoadedMetadata={handleVideoLoaded}
                className="max-h-[420px] max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-2 z-0">
              <img
                src={previewUrl}
                alt="Upload preview"
                className={`max-h-[420px] max-w-full object-contain transition-transform duration-300 ${zoomScan ? 'scale-105' : ''}`}
              />
            </div>
          )}
        </div>

        {/* Metadata Telemetry (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[#12121a] border border-[#2a2a3a] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2a2a3a]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00d4ff]" />
                <h4 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
                  MEDIA METADATA
                </h4>
              </div>
              <CyberBadge variant="green">STAGED</CyberBadge>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[11px] text-[#6b7280] uppercase mb-0.5">FILE NAME</div>
                <div className="font-bold text-[#e0e0e0] break-all bg-[#0a0a0f] p-2 border border-[#2a2a3a]">
                  {file.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-[#6b7280] uppercase mb-0.5">FILE TYPE</div>
                  <div className="text-[#00d4ff] font-semibold bg-[#0a0a0f] p-2 border border-[#2a2a3a] uppercase">
                    {file.type || file.name.split('.').pop() || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6b7280] uppercase mb-0.5">FILE SIZE</div>
                  <div className="text-[#00ff88] font-semibold bg-[#0a0a0f] p-2 border border-[#2a2a3a]">
                    {formatBytes(file.size)}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#6b7280] uppercase mb-0.5">RESOLUTION</div>
                <div className="text-[#e0e0e0] font-semibold bg-[#0a0a0f] p-2 border border-[#2a2a3a]">
                  {resolution}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#6b7280] uppercase mb-0.5">STATUS</div>
                <div className="flex items-center gap-2 text-[#00ff88] font-semibold bg-[#0a0a0f] p-2 border border-[#2a2a3a]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span>READY FOR XCEPTION PIPELINE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-2.5">
            <CyberButton
              type="button"
              variant="primary"
              size="lg"
              onClick={onStartAnalysis}
              disabled={disabled}
              className="w-full justify-center"
              icon={<Zap className="w-5 h-5" />}
            >
              [ INITIALIZE AI ANALYSIS ]
            </CyberButton>

            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 bg-transparent hover:bg-[#1c1c2e] text-[#9ca3af] hover:text-[#ff3366] border border-[#2a2a3a] hover:border-[#ff3366]/40 transition-colors text-xs font-mono uppercase"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>[ REMOVE / SELECT DIFFERENT FILE ]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
