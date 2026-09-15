import React, { useEffect, useRef } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface TerminalLine {
  text: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'stage';
  timestamp?: string;
}

interface TerminalPanelProps {
  lines: (string | TerminalLine)[];
  title?: string;
  isProcessing?: boolean;
  maxHeight?: string;
  className?: string;
  onClear?: () => void;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  lines,
  title = 'DEEPTRACE_FORENSIC_TERMINAL',
  isProcessing = false,
  maxHeight = 'max-h-64',
  className = '',
  onClear,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, isProcessing]);

  const copyLogs = () => {
    const text = lines
      .map((l) => (typeof l === 'string' ? l : `[${l.timestamp || ''}] ${l.text}`))
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`
        bg-[#09090f] border border-[#2a2a3a] font-mono text-xs overflow-hidden flex flex-col
        ${className}
      `}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0e0e17] border-b border-[#2a2a3a] select-none">
        <div className="flex items-center gap-2 text-[#9ca3af]">
          <Terminal className="w-3.5 h-3.5 text-[#00ff88]" />
          <span className="font-bold text-[#00ff88] tracking-wider text-[11px]">
            &gt; {title}
          </span>
          {isProcessing && (
            <span className="px-1.5 py-0.2 bg-[#00ff88]/20 text-[#00ff88] text-[9px] font-bold animate-pulse">
              PROCESSING
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLogs}
            title="Copy terminal logs"
            className="p-1 text-[#6b7280] hover:text-[#00ff88] hover:bg-[#1c1c2e] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00ff88]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onClear && (
            <button
              onClick={onClear}
              className="text-[10px] text-[#6b7280] hover:text-[#ff3366] px-1 transition-colors"
            >
              CLEAR
            </button>
          )}
          <div className="flex gap-1.5 ml-1">
            <span className="w-2 h-2 rounded-full bg-[#ff3366]/60 inline-block" />
            <span className="w-2 h-2 rounded-full bg-[#ffcc00]/60 inline-block" />
            <span className="w-2 h-2 rounded-full bg-[#00ff88]/60 inline-block" />
          </div>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className={`p-3.5 overflow-y-auto ${maxHeight} space-y-1 leading-relaxed text-[#c4c4d4] font-mono`}
      >
        {lines.length === 0 ? (
          <div className="text-[#4b5563] italic select-none">
            &gt; system_ready. waiting_for_media_stream...
          </div>
        ) : (
          lines.map((line, idx) => {
            const isObj = typeof line !== 'string';
            const text = isObj ? line.text : line;
            const type = isObj ? line.type || 'info' : 'info';
            const timestamp = isObj ? line.timestamp : undefined;

            let color = 'text-[#c4c4d4]';
            if (type === 'success' || text.includes('ONLINE') || text.includes('✓')) {
              color = 'text-[#00ff88] font-semibold';
            } else if (type === 'warning' || text.includes('SUSPICIOUS')) {
              color = 'text-[#ffcc00]';
            } else if (type === 'error' || text.includes('DEEPFAKE') || text.includes('HIGH RISK') || text.includes('failed')) {
              color = 'text-[#ff3366] font-bold';
            } else if (type === 'stage' || text.startsWith('→') || text.startsWith('>')) {
              color = 'text-[#00d4ff]';
            }

            return (
              <div key={idx} className="flex items-start gap-2 break-all">
                {timestamp && (
                  <span className="text-[#4b5563] text-[10px] shrink-0 select-none">
                    [{timestamp}]
                  </span>
                )}
                <span className="text-[#00ff88]/70 select-none shrink-0">&gt;</span>
                <span className={`${color}`}>{text}</span>
              </div>
            );
          })
        )}

        {/* Blinking cursor */}
        <div className="flex items-center gap-1.5 text-[#00ff88] pt-1">
          <span className="text-[#00ff88]/70 select-none">&gt;</span>
          <span className="w-2 h-3.5 bg-[#00ff88] animate-[pulse_0.8s_infinite] inline-block" />
        </div>
      </div>
    </div>
  );
};
