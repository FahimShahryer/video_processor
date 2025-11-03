#!/usr/bin/env bash
# Render build script

set -o errexit  # Exit on error

# Install Python dependencies
pip install -r requirements.txt

# Install FFmpeg (Render uses Ubuntu)
apt-get update
apt-get install -y ffmpeg

echo "✅ Build completed successfully!"
