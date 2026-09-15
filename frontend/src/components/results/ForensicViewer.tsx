import React, { useState } from 'react';
import { Eye, EyeOff, ZoomIn, ZoomOut, Film, Scan, Layers, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AnalysisResponse, FaceBoundingBox, FrameAnalysisDetail } from '../../types';
import { CyberBadge } from '../cyber/CyberBadge';

interface ForensicViewerProps {
  result: AnalysisResponse;
}

export const ForensicViewer: React.FC<ForensicViewerProps> = ({ result }) => {
  const isVideo = result.media_type === 'video';
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showScanGrid, setShowScanGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState<FrameAnalysisDetail | null>(
    result.frames_preview && result.frames_preview.length > 0 ? result.frames_preview[0] : null
  );

  const boxes: FaceBoundingBox[] = result.face_bounding_boxes || [];

  return (
    <div className="bg-[#12121a] border border-[#2a2a3a] p-4 sm:p-5 font-mono space-y-4">
      {/* Header with Viewer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2a2a3a]">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-[#00ff88]" />
          <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
            FORENSIC SPATIAL &amp; TEMPORAL INSPECTOR
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBoundingBox(!showBoundingBox)}
            className={`px-2.5 py-1 text-[11px] border flex items-center gap-1.5 transition-colors ${
              showBoundingBox
                ? 'bg-[#00ff88]/15 border-[#00ff88] text-[#00ff88]'
                : 'bg-[#1c1c2e] border-[#2a2a3a] text-[#6b7280]'
            }`}
          >
            {showBoundingBox ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>BOUNDING BOX</span>
          </button>

          <button
            onClick={() => setShowScanGrid(!showScanGrid)}
            className={`px-2.5 py-1 text-[11px] border flex items-center gap-1.5 transition-colors ${
              showScanGrid
                ? 'bg-[#00d4ff]/15 border-[#00d4ff] text-[#00d4ff]'
                : 'bg-[#1c1c2e] border-[#2a2a3a] text-[#6b7280]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SCAN GRID</span>
          </button>

          {!isVideo && (
            <div className="flex items-center border border-[#2a2a3a] bg-[#1c1c2e]">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.25))}
                disabled={zoomLevel <= 1}
                className="p-1 text-[#9ca3af] hover:text-white disabled:opacity-30"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[10px] text-[#00ff88]">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                disabled={zoomLevel >= 2.5}
                className="p-1 text-[#9ca3af] hover:text-white disabled:opacity-30"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative bg-[#09090f] border border-[#2a2a3a] overflow-hidden flex items-center justify-center min-h-[340px] max-h-[480px]">
        {/* HUD scan overlay */}
        {showScanGrid && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Fine cyber grid */}
            <div className="w-full h-full cyber-grid-bg opacity-40" />

            {/* Corner telemetry coordinates */}
            <div className="absolute top-2 left-2 text-[10px] text-[#00ff88]/80 font-mono bg-[#0a0a0f]/80 px-2 py-0.5 border border-[#00ff88]/30">
              TENSOR_DIM: 299x299 | XCEPTION_LAYER: BLOCK14_SEPCONV
            </div>

            <div className="absolute bottom-2 right-2 text-[10px] text-[#00d4ff]/80 font-mono bg-[#0a0a0f]/80 px-2 py-0.5 border border-[#00d4ff]/30">
              NORMALIZED_COORD: [0.0, 1.0]
            </div>
          </div>
        )}

        {/* Media Canvas */}
        <div className="relative w-full h-full flex items-center justify-center p-3 overflow-hidden">
          {isVideo && result.media_preview_url ? (
            <video
              src={result.media_preview_url}
              controls
              className="max-h-[440px] max-w-full object-contain"
            />
          ) : result.media_preview_url ? (
            <div
              className="relative transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={result.media_preview_url}
                alt="Analyzed media forensic scan"
                className="max-h-[440px] max-w-full object-contain select-none"
              />

              {/* Bounding box layer */}
              {showBoundingBox &&
                boxes.map((box, idx) => (
                  <div
                    key={idx}
                    className={`absolute pointer-events-none border-2 transition-all ${
                      box.isManipulated
                        ? 'border-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.4)]'
                        : 'border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.4)]'
                    }`}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                  >
                    {/* Bounding box corner ticks */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-current" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-current" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-current" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-current" />

                    {/* Tag label */}
                    <div
                      className={`absolute -top-6 left-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                        box.isManipulated
                          ? 'bg-[#ff3366] text-black'
                          : 'bg-[#00ff88] text-black'
                      }`}
                    >
                      {box.label} ({(box.confidence * 100).toFixed(1)}%)
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-xs text-[#6b7280]">NO VISUAL STREAM CACHE AVAILABLE</div>
          )}
        </div>
      </div>

      {/* Frame-level results inspector for Video */}
      {result.frames_preview && result.frames_preview.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#e0e0e0] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-[#ff00ff]" />
              TEMPORAL FRAME SEQUENCE ({result.frames_preview.length} SAMPLE FRAMES)
            </span>
            <span className="text-[10px] text-[#6b7280]">CLICK FRAME FOR RISK ANALYSIS</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {result.frames_preview.map((frame, idx) => {
              const isSelected = selectedFrame?.frameNumber === frame.frameNumber;
              const isAnomaly = frame.status === 'anomalous';
              const isSuspicious = frame.status === 'suspicious';

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFrame(frame)}
                  className={`p-2 border text-left text-[10px] font-mono transition-colors ${
                    isSelected
                      ? 'border-[#00d4ff] bg-[#00d4ff]/15 text-white'
                      : isAnomaly
                      ? 'border-[#ff3366]/50 bg-[#ff3366]/10 text-[#ff3366]'
                      : isSuspicious
                      ? 'border-[#ffcc00]/50 bg-[#ffcc00]/10 text-[#ffcc00]'
                      : 'border-[#2a2a3a] bg-[#0a0a0f] text-[#9ca3af]'
                  }`}
                >
                  <div className="font-bold">F#{frame.frameNumber}</div>
                  <div className="text-[9px] text-[#6b7280]">{frame.timestamp}</div>
                  <div className="font-extrabold mt-1">
                    {(frame.fakeScore * 100).toFixed(0)}%
                  </div>
                </button>
              );
            })}
          </div>

          {selectedFrame && (
            <div className="mt-2.5 p-2.5 bg-[#0a0a0f] border border-[#2a2a3a] flex flex-wrap items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#00d4ff] font-bold">FRAME #{selectedFrame.frameNumber}</span>
                <span className="text-[#6b7280]">TIMESTAMP: {selectedFrame.timestamp}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#6b7280]">MANIPULATION RISK:</span>
                <span
                  className={`font-bold ${
                    selectedFrame.status === 'anomalous'
                      ? 'text-[#ff3366]'
                      : selectedFrame.status === 'suspicious'
                      ? 'text-[#ffcc00]'
                      : 'text-[#00ff88]'
                  }`}
                >
                  {(selectedFrame.fakeScore * 100).toFixed(1)}% ({selectedFrame.status.toUpperCase()})
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
