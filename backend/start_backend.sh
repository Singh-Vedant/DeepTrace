#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT="$( dirname "$DIR" )"

export PYTHONPATH="${PROJECT_ROOT}/DeepfakeBench/training:${DIR}:${PROJECT_ROOT}/DeepfakeBench/.venv/lib/python3.10/site-packages:${PYTHONPATH}"

exec /opt/homebrew/opt/python@3.10/bin/python3.10 -m uvicorn main:app --host 0.0.0.0 --port 8000
