#!/usr/bin/env bash
# Render build script

set -o errexit  # Exit on error

# Install Python dependencies
pip install -r requirements.txt

# Note: FFmpeg should be pre-installed on Render
# If not, we need to use a Docker deployment or different hosting

echo "✅ Build completed successfully!"
