"""
Video frame extraction utility.
Uses OpenCV (no ffmpeg dependency) to extract evenly-spaced frames from a video.
"""

import logging
import math
from pathlib import Path
from typing import List

import cv2
import numpy as np

logger = logging.getLogger("video_utils")

# ─────────────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────────────
DEFAULT_NUM_FRAMES = 32   # mirrors DeepfakeBench default frame_num for test
MAX_NUM_FRAMES = 64
MIN_FRAMES_REQUIRED = 1


def extract_frames(
    video_path: str | Path,
    num_frames: int = DEFAULT_NUM_FRAMES,
) -> List[np.ndarray]:
    """
    Extract ``num_frames`` evenly-spaced frames from *video_path*.

    Parameters
    ----------
    video_path : str | Path
        Path to the uploaded video file.
    num_frames : int
        Number of frames to sample (default 32, matching DeepfakeBench).

    Returns
    -------
    list of np.ndarray
        BGR frames, each shape (H, W, 3), dtype uint8.

    Raises
    ------
    ValueError
        If the video cannot be opened or contains no frames.
    """
    path = str(video_path)
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise ValueError(
            f"Cannot open video file: {path}\n"
            "Ensure the file is a valid mp4 / mov / avi / mkv / webm."
        )

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0

    if total_frames < MIN_FRAMES_REQUIRED:
        cap.release()
        raise ValueError(
            f"Video has only {total_frames} decodable frames — too short to analyse."
        )

    # Clamp requested frames to what's actually available
    num_frames = min(num_frames, total_frames)

    # Compute evenly-spaced frame indices
    indices = _evenly_spaced_indices(total_frames, num_frames)

    frames: List[np.ndarray] = []
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret and frame is not None:
            frames.append(frame)

    cap.release()

    if not frames:
        raise ValueError("Failed to decode any frames from the video.")

    logger.info(
        "Extracted %d/%d requested frames from '%s' (total=%d, fps=%.1f)",
        len(frames),
        num_frames,
        Path(path).name,
        total_frames,
        fps,
    )
    return frames


def _evenly_spaced_indices(total: int, n: int) -> List[int]:
    """Return n evenly-spaced integer frame indices in [0, total)."""
    if n >= total:
        return list(range(total))
    step = total / n
    return [int(math.floor(i * step)) for i in range(n)]
