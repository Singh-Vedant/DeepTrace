"""
DeepfakeBench Xception Inference Engine
=========================================
Loads the pretrained Xception detector from DeepfakeBench and runs inference
on a list of frame images (numpy arrays in BGR or RGB, H×W×C uint8).

This module intentionally avoids importing DeepfakeBench's dataset/dataloader
pipelines since we are doing single-video inference, not benchmark evaluation.
"""

import os
import sys
import logging
import time
import math
from pathlib import Path
from typing import List, Optional, Tuple
import numpy as np

import torch
import torch.nn as nn
import torch.nn.functional as F
import yaml

# ─────────────────────────────────────────────────────────────────────────────
# Path setup: add DeepfakeBench training/ to sys.path so we can import its
# detectors, networks and metrics modules directly.
# ─────────────────────────────────────────────────────────────────────────────
DEEPFAKEBENCH_ROOT = Path(__file__).parent.parent / "DeepfakeBench"
TRAINING_DIR = DEEPFAKEBENCH_ROOT / "training"

# Insert at front so DeepfakeBench modules shadow any installed packages with
# the same name (e.g. 'networks').
if str(TRAINING_DIR) not in sys.path:
    sys.path.insert(0, str(TRAINING_DIR))

logger = logging.getLogger("inference")

# ─────────────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────────────
XCEPTION_CONFIG = TRAINING_DIR / "config" / "detector" / "xception.yaml"
XCEPTION_WEIGHTS = TRAINING_DIR / "weights" / "xception_best.pth"
XCEPTION_PRETRAINED = TRAINING_DIR / "pretrained" / "xception-b5690688.pth"

INPUT_SIZE = 256   # xception.yaml resolution
MEAN = [0.5, 0.5, 0.5]
STD  = [0.5, 0.5, 0.5]
FAKE_CLASS_IDX = 1   # index 1 = fake in binary classification


class XceptionInferenceEngine:
    """
    Singleton-friendly Xception deepfake inference engine.

    Usage
    -----
    engine = XceptionInferenceEngine()
    engine.load()
    result = engine.predict_frames(frames_bgr)
    """

    def __init__(self):
        self.model: Optional[nn.Module] = None
        self.device: torch.device = self._select_device()
        self.config: dict = {}
        self._loaded = False

    # ─────────────────────────────────────────────────────────────────────
    # Device selection
    # ─────────────────────────────────────────────────────────────────────

    @staticmethod
    def _select_device() -> torch.device:
        if torch.backends.mps.is_available():
            logger.info("Using Apple MPS device")
            return torch.device("mps")
        if torch.cuda.is_available():
            logger.info("Using CUDA device")
            return torch.device("cuda")
        logger.info("Using CPU device")
        return torch.device("cpu")

    @property
    def device_str(self) -> str:
        return str(self.device)

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    # ─────────────────────────────────────────────────────────────────────
    # Model loading
    # ─────────────────────────────────────────────────────────────────────

    def load(self) -> None:
        """Load config, build model, load fine-tuned weights."""
        if self._loaded:
            return

        # Validate files
        if not XCEPTION_CONFIG.exists():
            raise FileNotFoundError(
                f"Xception config not found: {XCEPTION_CONFIG}"
            )
        if not XCEPTION_WEIGHTS.exists():
            raise FileNotFoundError(
                f"Fine-tuned weights not found: {XCEPTION_WEIGHTS}\n"
                "Download from: https://github.com/SCLBD/DeepfakeBench/releases/tag/v1.0.1"
            )
        if not XCEPTION_PRETRAINED.exists():
            raise FileNotFoundError(
                f"Backbone pretrained weights not found: {XCEPTION_PRETRAINED}"
            )

        with open(XCEPTION_CONFIG, "r") as f:
            self.config = yaml.safe_load(f)

        # Override pretrained path to absolute so it works from any cwd
        self.config["pretrained"] = str(XCEPTION_PRETRAINED)

        logger.info("Building Xception detector …")
        orig_cwd = os.getcwd()
        try:
            os.chdir(str(DEEPFAKEBENCH_ROOT))
            from detectors.xception_detector import XceptionDetector
            self.model = XceptionDetector(self.config)
        except Exception as exc:
            raise RuntimeError(
                f"Failed to import/build DeepfakeBench detector: {exc}"
            ) from exc
        finally:
            os.chdir(orig_cwd)

        logger.info("Loading fine-tuned weights from %s …", XCEPTION_WEIGHTS)
        state = torch.load(str(XCEPTION_WEIGHTS), map_location="cpu")
        self.model.load_state_dict(state, strict=True)
        logger.info("Weights loaded successfully.")

        self.model = self.model.to(self.device)
        self.model.eval()
        self._loaded = True
        logger.info("XceptionInferenceEngine ready on %s", self.device)

    # ─────────────────────────────────────────────────────────────────────
    # Preprocessing
    # ─────────────────────────────────────────────────────────────────────

    def _preprocess_frame(self, frame_bgr: np.ndarray) -> torch.Tensor:
        """
        Convert a single BGR frame (H×W×3 uint8) to a normalised float
        tensor (3×H×W) suitable for Xception.
        """
        import cv2  # noqa
        # Resize
        frame = cv2.resize(frame_bgr, (INPUT_SIZE, INPUT_SIZE))
        # BGR → RGB
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        # uint8 → float [0,1]
        frame = frame.astype(np.float32) / 255.0
        # Normalise
        for c in range(3):
            frame[:, :, c] = (frame[:, :, c] - MEAN[c]) / STD[c]
        # HWC → CHW
        frame = frame.transpose(2, 0, 1)
        return torch.from_numpy(frame)

    def _build_batch(self, frames_bgr: List[np.ndarray]) -> torch.Tensor:
        """Stack a list of BGR frames into a float batch tensor (N×3×H×W)."""
        tensors = [self._preprocess_frame(f) for f in frames_bgr]
        return torch.stack(tensors, dim=0)  # (N, 3, H, W)

    # ─────────────────────────────────────────────────────────────────────
    # Inference
    # ─────────────────────────────────────────────────────────────────────

    @torch.no_grad()
    def predict_frames(
        self,
        frames_bgr: List[np.ndarray],
        batch_size: int = 8,
    ) -> dict:
        """
        Run inference on a list of BGR frames.

        Parameters
        ----------
        frames_bgr : list of np.ndarray
            Each array shape (H, W, 3), dtype uint8, BGR colour order.
        batch_size : int
            Number of frames to process per forward pass.

        Returns
        -------
        dict with keys:
            prediction       "fake" | "real"
            fake_probability float in [0, 1]
            real_probability float in [0, 1]
            confidence       float in [0, 1]  (max of fake_prob / real_prob)
            frames_analyzed  int
            per_frame_scores list[float]
        """
        if not self._loaded:
            raise RuntimeError("Engine not loaded; call .load() first.")
        if not frames_bgr:
            raise ValueError("No frames provided.")

        t0 = time.time()
        all_probs: List[float] = []

        # Process in mini-batches to avoid OOM on MPS/CPU
        n = len(frames_bgr)
        n_batches = math.ceil(n / batch_size)
        for i in range(n_batches):
            chunk = frames_bgr[i * batch_size : (i + 1) * batch_size]
            batch = self._build_batch(chunk).to(self.device)
            data_dict = {"image": batch, "label": None, "mask": None, "landmark": None}
            pred_dict = self.model(data_dict, inference=True)
            # prob is fake probability for each frame
            probs = pred_dict["prob"].cpu().float().numpy().tolist()
            all_probs.extend(probs)

        elapsed = time.time() - t0

        # Aggregate: mean fake-prob across frames
        mean_fake_prob = float(np.mean(all_probs))
        mean_real_prob = 1.0 - mean_fake_prob

        prediction = "fake" if mean_fake_prob >= 0.5 else "real"
        confidence = mean_fake_prob if prediction == "fake" else mean_real_prob

        return {
            "prediction": prediction,
            "fake_probability": round(mean_fake_prob, 6),
            "real_probability": round(mean_real_prob, 6),
            "confidence": round(confidence, 6),
            "frames_analyzed": n,
            "per_frame_scores": [round(p, 4) for p in all_probs],
            "inference_time": round(elapsed, 3),
        }


# ─────────────────────────────────────────────────────────────────────────────
# Module-level singleton (loaded lazily when first needed)
# ─────────────────────────────────────────────────────────────────────────────
_engine: Optional[XceptionInferenceEngine] = None


def get_engine() -> XceptionInferenceEngine:
    global _engine
    if _engine is None:
        _engine = XceptionInferenceEngine()
        _engine.load()
    return _engine
