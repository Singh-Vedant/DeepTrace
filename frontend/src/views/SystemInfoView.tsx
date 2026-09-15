import React, { useState } from 'react';
import { Cpu, Layers, HardDrive, FileCode, Check, Copy, ArrowDown, Activity, Terminal, Shield } from 'lucide-react';
import { CyberBadge } from '../components/cyber/CyberBadge';
import { CyberButton } from '../components/cyber/CyberButton';

export const SystemInfoView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const pipelineSteps = [
    {
      title: 'MEDIA INPUT',
      desc: 'Raw image (JPG/PNG) or temporal video stream (MP4/MOV/AVI)',
      tag: 'INPUT TENSOR',
      color: 'border-[#00d4ff] text-[#00d4ff]',
    },
    {
      title: 'FRAME EXTRACTION',
      desc: 'Container decoding & keyframe sampling (32 temporal slices)',
      tag: 'DECOMPOSITION',
      color: 'border-[#00ff88] text-[#00ff88]',
    },
    {
      title: 'FACE / REGION PROCESSING',
      desc: 'Landmark detection, facial bounding box crop, aligned 299x299 norm',
      tag: 'RETINAFACE / MTCNN',
      color: 'border-[#ff00ff] text-[#ff00ff]',
    },
    {
      title: 'XCEPTION INFERENCE',
      desc: 'Depthwise separable convolutions across entry, middle, and exit flow blocks',
      tag: 'BACKBONE MODEL',
      color: 'border-[#ffcc00] text-[#ffcc00]',
    },
    {
      title: 'CLASSIFICATION HEAD',
      desc: 'Global average pooling + dense projection to binary logits [REAL, FAKE]',
      tag: 'LOGITS',
      color: 'border-[#ff3366] text-[#ff3366]',
    },
    {
      title: 'CONFIDENCE & FORENSIC RESULT',
      desc: 'Softmax normalization, threshold arbitration & anomaly risk mapping',
      tag: 'VERDICT',
      color: 'border-[#00ff88] text-[#00ff88]',
    },
  ];

  const pythonFastApiCode = `# app.py - DeepfakeBench Python FastAPI Inference Backend
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
from PIL import Image
import io
import time

app = FastAPI(title="DeepTrace - DeepfakeBench API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Device Selection (CPU / MPS / CUDA)
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

# 2. Load DeepfakeBench Xception Detector
# Config: training/config/detector/xception.yaml
# Weights: training/weights/xception_best.pth
print(f"[+] Loading Xception detector on {device}...")
# model = load_detector_model("training/config/detector/xception.yaml", "training/weights/xception_best.pth")
# model.to(device)
# model.eval()

@app.get("/api/health")
def health_check():
    return {"status": "online", "model": "Xception", "device": str(device)}

@app.post("/api/analyze")
async def analyze_media(file: UploadFile = File(...)):
    start_time = time.time()
    contents = await file.read()
    
    # Preprocess 299x299 tensor for Xception
    # image = Image.open(io.BytesIO(contents)).convert('RGB')
    # tensor = transform(image).unsqueeze(0).to(device)
    
    # Inference
    # with torch.no_grad():
    #     output = model(tensor)
    #     fake_prob = float(torch.softmax(output, dim=1)[0][1])
    
    fake_prob = 0.8742 # Replace with real model output
    real_prob = 1.0 - fake_prob
    prediction = "fake" if fake_prob > 0.50 else "real"
    elapsed = round(time.time() - start_time, 2)
    
    return {
        "id": f"scan_{int(time.time())}",
        "status": "completed",
        "prediction": prediction,
        "fake_probability": fake_prob,
        "real_probability": real_prob,
        "confidence": fake_prob if prediction == "fake" else real_prob,
        "model": "Xception",
        "engine": "DeepfakeBench",
        "device": str(device).upper(),
        "frames_analyzed": 1,
        "processing_time": elapsed
    }
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonFastApiCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="pb-4 border-b border-[#2a2a3a]">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#00ff88]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#e0e0e0] uppercase tracking-wider font-display">
            TECHNICAL MODEL &amp; SYSTEM ARCHITECTURE
          </h1>
        </div>
        <p className="text-xs text-[#6b7280] mt-0.5">
          DeepfakeBench benchmarking framework and Xception neural detector specifications
        </p>
      </div>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-[#12121a] border border-[#2a2a3a]">
          <div className="text-[11px] text-[#6b7280] uppercase">TARGET DETECTOR MODEL</div>
          <div className="text-lg font-bold text-[#e0e0e0] font-display mt-0.5">XCEPTION</div>
          <div className="text-xs text-[#9ca3af] mt-1">
            Depthwise separable convolution architecture with residual shortcut connections.
          </div>
        </div>

        <div className="p-4 bg-[#12121a] border border-[#2a2a3a]">
          <div className="text-[11px] text-[#6b7280] uppercase">BENCHMARK FRAMEWORK</div>
          <div className="text-lg font-bold text-[#00ff88] font-display mt-0.5">DEEPFAKEBENCH</div>
          <div className="text-xs text-[#9ca3af] mt-1">
            Standardized comprehensive deepfake benchmark suite and unified evaluation protocol.
          </div>
        </div>

        <div className="p-4 bg-[#12121a] border border-[#2a2a3a]">
          <div className="text-[11px] text-[#6b7280] uppercase">CORE ML FRAMEWORK</div>
          <div className="text-lg font-bold text-[#00d4ff] font-display mt-0.5">PYTORCH</div>
          <div className="text-xs text-[#9ca3af] mt-1">
            Torchvision model backbone loaded via state dictionary weights.
          </div>
        </div>

        <div className="p-4 bg-[#12121a] border border-[#2a2a3a]">
          <div className="text-[11px] text-[#6b7280] uppercase">INFERENCE RUNTIME DEVICE</div>
          <div className="text-lg font-bold text-[#ff00ff] font-display mt-0.5">CPU / MPS</div>
          <div className="text-xs text-[#9ca3af] mt-1">
            Apple Metal Performance Shaders / Portable CPU fallback mode (No CUDA required).
          </div>
        </div>

        <div className="p-4 bg-[#12121a] border border-[#2a2a3a]">
          <div className="text-[11px] text-[#6b7280] uppercase">TRAINED WEIGHTS TARGET</div>
          <div className="text-sm font-bold text-[#ffcc00] font-mono mt-1 break-all">
            training/weights/xception_best.pth
          </div>
          <div className="text-xs text-[#9ca3af] mt-1">
            Pretrained checkpoints optimized for face manipulation boundary discovery.
          </div>
        </div>

        <div className="p-4 bg-[#12121a] border border-[#2a2a3a]">
          <div className="text-[11px] text-[#6b7280] uppercase">DETECTOR CONFIG PATH</div>
          <div className="text-sm font-bold text-[#00d4ff] font-mono mt-1 break-all">
            training/config/detector/xception.yaml
          </div>
          <div className="text-xs text-[#9ca3af] mt-1">
            Hyperparameters, input crop dimensions (299x299), and normalization coefficients.
          </div>
        </div>
      </div>

      {/* Architecture Visual Pipeline */}
      <div className="bg-[#12121a] border border-[#2a2a3a] p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2a3a]">
          <span className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
            END-TO-END INFERENCE PIPELINE
          </span>
          <CyberBadge variant="green">6 STAGES</CyberBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 bg-[#0a0a0f] border ${step.color} relative space-y-2`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold">STEP 0{idx + 1}</span>
                <span className="px-1.5 py-0.5 bg-[#12121a] text-[9px] font-bold uppercase tracking-wider">
                  {step.tag}
                </span>
              </div>
              <div className="text-sm font-bold uppercase tracking-wide text-[#e0e0e0]">
                {step.title}
              </div>
              <p className="text-xs text-[#9ca3af] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Python FastAPI Integration Spec */}
      <div className="bg-[#12121a] border border-[#2a2a3a] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2a2a3a]">
          <div>
            <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#00d4ff]" /> PYTHON FASTAPI BACKEND INTEGRATION CODE
            </h3>
            <p className="text-[11px] text-[#6b7280]">
              Drop-in API server for connecting the real Xception PyTorch weights to DEEPTRACE
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-[#1c1c2e] hover:bg-[#252538] border border-[#2a2a3a] text-[#00ff88] text-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'COPIED TO CLIPBOARD' : 'COPY FASTAPI SNIPPET'}</span>
          </button>
        </div>

        <div className="bg-[#08080c] border border-[#2a2a3a] p-4 text-xs text-[#9ca3af] overflow-x-auto">
          <pre className="font-mono leading-relaxed">{pythonFastApiCode}</pre>
        </div>
      </div>
    </div>
  );
};
