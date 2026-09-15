import React, { useRef, useState } from 'react';
import { Upload, FileVideo, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { CyberButton } from '../cyber/CyberButton';
import { CyberBadge } from '../cyber/CyberBadge';

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  onSelectSample: (type: 'fake' | 'real') => void;
  disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelected,
  onSelectSample,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
  const maxSizeBytes = 100 * 1024 * 1024; // 100 MB limit

  const handleValidateAndSelect = (file: File) => {
    setErrorMsg(null);

    // Format validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'avi'];
    const isValidType = supportedFormats.includes(file.type) || (ext && validExtensions.includes(ext));

    if (!isValidType) {
      setErrorMsg(`Unsupported file format (.${ext}). Supported: JPG, PNG, WEBP, MP4, MOV, AVI.`);
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMsg(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is 100MB.`);
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFilePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleValidateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Primary Cyber Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload image or video for deepfake analysis"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`
          relative p-8 sm:p-12 border-2 border-dashed transition-all duration-200 cursor-pointer
          flex flex-col items-center justify-center text-center
          ${
            isDragOver
              ? 'border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_25px_rgba(0,255,136,0.3)]'
              : 'border-[#2a2a3a] bg-[#0e0e17] hover:border-[#00ff88]/60 hover:bg-[#12121e]'
          }
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.avi,image/*,video/*"
          onChange={handleFilePickerChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00ff88]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00ff88]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00ff88]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00ff88]" />

        <div className="w-16 h-16 mb-4 flex items-center justify-center border border-[#00ff88]/40 bg-[#00ff88]/10 text-[#00ff88]">
          <Upload className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#e0e0e0] mb-2 font-display">
          DROP MEDIA FOR ANALYSIS
        </h3>

        <p className="text-xs text-[#6b7280] mb-5 max-w-md">
          Drag and drop digital media or click to browse local storage. System will segment spatial tensors for Xception feature extraction.
        </p>

        <CyberButton
          type="button"
          size="md"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={disabled}
        >
          [ SELECT FILE ]
        </CyberButton>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#9ca3af]">
          <span className="text-[#6b7280]">SUPPORTED:</span>
          <span className="px-1.5 py-0.5 bg-[#1c1c2e] border border-[#2a2a3a] text-[#00d4ff]">JPG</span>
          <span className="px-1.5 py-0.5 bg-[#1c1c2e] border border-[#2a2a3a] text-[#00d4ff]">PNG</span>
          <span className="px-1.5 py-0.5 bg-[#1c1c2e] border border-[#2a2a3a] text-[#00d4ff]">MP4</span>
          <span className="px-1.5 py-0.5 bg-[#1c1c2e] border border-[#2a2a3a] text-[#00d4ff]">MOV</span>
          <span className="px-1.5 py-0.5 bg-[#1c1c2e] border border-[#2a2a3a] text-[#00d4ff]">AVI</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#ff3366]/15 border border-[#ff3366] text-[#ff3366] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* College Presentation Quick Presets */}
      <div className="p-3.5 bg-[#12121a] border border-[#2a2a3a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#9ca3af]">
          <Sparkles className="w-4 h-4 text-[#00ff88]" />
          <span className="text-[#e0e0e0] font-semibold text-[11px] tracking-wider uppercase">
            QUICK DEMO SAMPLES (FOR COLLEGE PRESENTATION):
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectSample('fake')}
            className="flex-1 sm:flex-none px-3 py-2 bg-[#ff3366]/15 hover:bg-[#ff3366]/25 border border-[#ff3366]/50 text-[#ff3366] text-xs font-mono font-bold tracking-wider transition-colors min-h-[44px]"
          >
            [ LOAD SYNTHETIC/DEEPFAKE ]
          </button>
          <button
            type="button"
            onClick={() => onSelectSample('real')}
            className="flex-1 sm:flex-none px-3 py-2 bg-[#00ff88]/15 hover:bg-[#00ff88]/25 border border-[#00ff88]/50 text-[#00ff88] text-xs font-mono font-bold tracking-wider transition-colors min-h-[44px]"
          >
            [ LOAD AUTHENTIC MEDIA ]
          </button>
        </div>
      </div>
    </div>
  );
};
