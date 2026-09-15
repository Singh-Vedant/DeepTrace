import React from 'react';
import { BookOpen, HelpCircle, ShieldCheck, CheckCircle2, AlertTriangle, Code, Terminal, Layers } from 'lucide-react';
import { CyberBadge } from '../components/cyber/CyberBadge';

export const AboutView: React.FC = () => {
  const techStack = [
    { name: 'DeepfakeBench', role: 'Evaluation & Benchmarking Engine', desc: 'Unified framework for deepfake research and model comparative testing.' },
    { name: 'Xception Detector', role: 'Deep CNN Backbone', desc: 'Modified Inception architecture using Depthwise Separable Convolutions.' },
    { name: 'PyTorch', role: 'Deep Learning Framework', desc: 'Executes tensor operations and backpropagation inference runs.' },
    { name: 'Python / FastAPI', role: 'Inference Microservice', desc: 'Serves asynchronous multipart HTTP endpoints for media tensor processing.' },
    { name: 'React 19 & TypeScript', role: 'Frontend Forensic Interface', desc: 'Real-time telemetry, interactive spatial inspection canvas, and cyber UI.' },
    { name: 'Tailwind CSS', role: 'Styling & Visual Design', desc: 'Hardware-inspired neon aesthetics, terminal monitors, and responsive layout.' },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="pb-4 border-b border-[#2a2a3a]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#00ff88]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#e0e0e0] uppercase tracking-wider font-display">
            ABOUT DEEPTRACE &amp; PROJECT RESEARCH
          </h1>
        </div>
        <p className="text-xs text-[#6b7280] mt-0.5">
          Student and academic guide to deepfake forensics, spatial artifacts, and neural detection
        </p>
      </div>

      {/* Section 1: What is Deepfake Detection? */}
      <div className="p-6 bg-[#12121a] border border-[#2a2a3a] space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-[#00ff88] uppercase tracking-wider flex items-center gap-2 font-display">
          <HelpCircle className="w-4 h-4" /> 1. WHAT IS DEEPFAKE DETECTION?
        </h2>
        <div className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed space-y-3">
          <p>
            A <strong>deepfake</strong> is synthetic media in which a person in an existing image or video
            is replaced with someone else's likeness using deep generative neural networks—such as
            Autoencoders, Generative Adversarial Networks (GANs), or Diffusion Models.
          </p>
          <p>
            <strong>Deepfake detection</strong> is the cyber-forensic discipline of identifying digital artifacts,
            frequency anomalies, boundary discontinuities, and biometric inconsistencies that generative algorithms
            inadvertently leave behind during the synthesis process.
          </p>
        </div>
      </div>

      {/* Section 2: How Does AI Detect Manipulated Media? */}
      <div className="p-6 bg-[#12121a] border border-[#2a2a3a] space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-[#00d4ff] uppercase tracking-wider flex items-center gap-2 font-display">
          <ShieldCheck className="w-4 h-4" /> 2. HOW DOES AI DETECT MANIPULATED MEDIA?
        </h2>
        <div className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed space-y-3">
          <p>
            Generative models often generate visual content that appears convincing to human visual perception,
            yet contains subtle mathematical anomalies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-[#0a0a0f] border border-[#2a2a3a]">
              <span className="text-[#00d4ff] font-bold block mb-1">SPATIAL FREQUENCY DOMAIN</span>
              Generators struggle to replicate natural camera sensor noise distributions (PRNU), leaving unnatural high-frequency power spectrum peaks.
            </div>
            <div className="p-3 bg-[#0a0a0f] border border-[#2a2a3a]">
              <span className="text-[#ff00ff] font-bold block mb-1">BOUNDARY BLENDING RESIDUALS</span>
              When blending a synthetic face onto a target body, subtle Poisson image editing seams or color gradient mismatches appear along the perimeter.
            </div>
            <div className="p-3 bg-[#0a0a0f] border border-[#2a2a3a]">
              <span className="text-[#ffcc00] font-bold block mb-1">TEXTURE INCONSISTENCY</span>
              Skin pores, irises, teeth, and hair strands frequently show micro-blurring or unnatural geometric symmetry.
            </div>
            <div className="p-3 bg-[#0a0a0f] border border-[#2a2a3a]">
              <span className="text-[#00ff88] font-bold block mb-1">TEMPORAL PHASE JITTER</span>
              In video frames, facial landmarks exhibit subtle inter-frame flutter and discontinuous optical flow paths.
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Technology Stack */}
      <div className="p-6 bg-[#12121a] border border-[#2a2a3a] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#2a2a3a]">
          <h2 className="text-sm sm:text-base font-bold text-[#ff00ff] uppercase tracking-wider flex items-center gap-2 font-display">
            <Code className="w-4 h-4" /> 3. TECHNOLOGY STACK
          </h2>
          <CyberBadge variant="magenta">INTEGRATED ARCHITECTURE</CyberBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {techStack.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-[#0a0a0f] border border-[#2a2a3a] space-y-1">
              <div className="text-xs font-bold text-[#e0e0e0] uppercase font-display">
                {item.name}
              </div>
              <div className="text-[11px] text-[#00ff88] font-semibold">
                {item.role}
              </div>
              <p className="text-[11px] text-[#6b7280] leading-relaxed pt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Disclaimer */}
      <div className="p-4 bg-[#0d0d14] border border-[#ffcc00]/30 text-xs text-[#ffcc00] space-y-1">
        <div className="font-bold uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> ACADEMIC PRESENTATION DISCLAIMER
        </div>
        <p className="text-[#9ca3af] text-[11px] leading-relaxed">
          Deepfake detection is an evolving adversarial domain. While DeepfakeBench benchmarks report competitive
          AUC performance across standardized datasets (FaceForensics++, Celeb-DF, DFDC), real-world generalization
          can vary depending on compression rates, resolution, and unknown generative diffusion architectures.
        </p>
      </div>
    </div>
  );
};
