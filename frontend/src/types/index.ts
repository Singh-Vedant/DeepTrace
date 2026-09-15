/**
 * DEEPTRACE - Deepfake Forensics Core Types
 * Follows the exact data contract for future Python / FastAPI DeepfakeBench backend.
 */

export type PredictionType = 'real' | 'fake';

export type AnalysisStatus = 'idle' | 'file_selected' | 'uploading' | 'processing' | 'completed' | 'error';

export interface ForensicIndicator {
  id: string;
  name: string;
  status: 'normal' | 'suspicious' | 'high_risk';
  score: number; // 0 to 100
  explanation: string;
  isSimulated: boolean; // Explicitly label "Model-derived / simulated indicator" for academic integrity
}

export interface FaceBoundingBox {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage 0-100
  height: number; // Percentage 0-100
  confidence: number;
  label: string;
  isManipulated: boolean;
}

export interface FrameAnalysisDetail {
  frameNumber: number;
  timestamp: string;
  fakeScore: number;
  status: 'clean' | 'suspicious' | 'anomalous';
}

/**
 * Expected backend API contract response from:
 * POST /api/analyze
 */
export interface AnalysisResponse {
  id: string;
  status: 'completed' | 'processing' | 'failed';
  prediction: PredictionType;
  fake_probability: number; // 0.0 to 1.0 (e.g. 0.8742)
  real_probability: number; // 0.0 to 1.0 (e.g. 0.1258)
  confidence: number;       // 0.0 to 1.0 (e.g. 0.8742)
  model: string;            // 'Xception'
  engine: string;           // 'DeepfakeBench'
  device: string;           // 'CPU / MPS'
  weights_file?: string;    // 'xception_best.pth'
  config_file?: string;     // 'training/config/detector/xception.yaml'
  frames_analyzed: number;  // e.g. 32
  processing_time: number;  // seconds (e.g. 4.82)
  timestamp: string;        // ISO string or formatted time
  
  // Media details
  filename: string;
  media_type: 'image' | 'video';
  file_size_formatted: string;
  resolution?: string;
  media_preview_url?: string;

  // Forensic Breakdown
  forensic_indicators: ForensicIndicator[];
  face_bounding_boxes?: FaceBoundingBox[];
  frames_preview?: FrameAnalysisDetail[];
  
  // Model note
  raw_inference_score?: number;
  inference_details?: {
    backbone: string;
    input_resolution: string;
    detection_threshold: number;
    notes?: string;
  };
}

export interface SystemStatus {
  frontend: 'online' | 'degraded' | 'offline';
  api: 'online' | 'offline' | 'mock_mode';
  api_endpoint: string;
  model: 'loaded' | 'unloaded';
  model_name: string;
  weights: string;
  config: string;
  engine: string;
  device: string;
  threat: 'monitoring' | 'active' | 'elevated';
  database: 'ready' | 'offline';
  version: string;
  last_ping?: string;
}

export interface ProcessingStageInfo {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  log: string;
}
