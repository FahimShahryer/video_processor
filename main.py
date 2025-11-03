"""
FastAPI Video Trimmer - Professional Web Interface
"""
import os
import json
import subprocess
import shutil
from pathlib import Path
from typing import List, Dict, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Request, Header
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import uvicorn
import re

app = FastAPI(title="Video Trimmer Pro")

# Directories
BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "output"
TEMP_DIR = BASE_DIR / "temp_segments"
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"

# Create directories
for dir_path in [UPLOAD_DIR, OUTPUT_DIR, TEMP_DIR]:
    dir_path.mkdir(exist_ok=True)

# Mount static files (only static assets, not videos)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# FFmpeg path - Works on both Windows (local) and Linux (Render)
import platform
import shutil

def get_ffmpeg_path():
    """Get FFmpeg path based on OS"""
    # Check if running on Windows with local ffmpeg.exe
    if platform.system() == "Windows":
        local_ffmpeg = BASE_DIR / "ffmpeg.exe"
        if local_ffmpeg.exists():
            return str(local_ffmpeg)

    # Check if ffmpeg is in system PATH (Linux/Mac)
    system_ffmpeg = shutil.which("ffmpeg")
    if system_ffmpeg:
        return system_ffmpeg

    # Fallback to local path
    return str(BASE_DIR / "ffmpeg.exe")

def get_ffprobe_path():
    """Get FFprobe path based on OS"""
    # Check if running on Windows with local ffprobe.exe
    if platform.system() == "Windows":
        local_ffprobe = BASE_DIR / "ffprobe.exe"
        if local_ffprobe.exists():
            return str(local_ffprobe)

    # Check if ffprobe is in system PATH (Linux/Mac)
    system_ffprobe = shutil.which("ffprobe")
    if system_ffprobe:
        return system_ffprobe

    # Fallback to local path
    return str(BASE_DIR / "ffprobe.exe")

FFMPEG_PATH = get_ffmpeg_path()
FFPROBE_PATH = get_ffprobe_path()


class Segment(BaseModel):
    start: float  # in seconds
    end: float    # in seconds


class TrimRequest(BaseModel):
    video_filename: str
    segments: List[Segment]


def check_ffmpeg():
    """Check if FFmpeg is available"""
    return os.path.exists(FFMPEG_PATH)


def get_video_duration(video_path: str) -> float:
    """Get video duration using ffprobe"""
    try:
        cmd = [
            FFPROBE_PATH,
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            video_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return float(result.stdout.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get video duration: {str(e)}")


def format_time(seconds: float) -> str:
    """Convert seconds to HH:MM:SS.mmm format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:06.3f}"


def extract_segment(video_path: str, start: float, end: float, output_path: str):
    """Extract a segment from video using ffmpeg"""
    duration = end - start
    cmd = [
        FFMPEG_PATH,
        "-ss", format_time(start),
        "-i", video_path,
        "-t", format_time(duration),
        "-c", "copy",
        "-y",
        output_path
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"FFmpeg error: {result.stderr}")


def merge_segments(segment_files: List[str], output_path: str):
    """Merge multiple video segments into one file"""
    # Create concat file
    concat_file = TEMP_DIR / "concat_list.txt"
    with open(concat_file, "w") as f:
        for seg_file in segment_files:
            f.write(f"file '{os.path.abspath(seg_file)}'\n")

    cmd = [
        FFMPEG_PATH,
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_file),
        "-c", "copy",
        "-y",
        output_path
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"FFmpeg merge error: {result.stderr}")


def range_requests_response(
    file_path: Path,
    range_header: Optional[str] = None,
    content_type: str = "video/mp4"
):
    """
    Create a streaming response with support for HTTP Range requests.
    This enables video seeking and progressive loading (YouTube-like experience).
    """
    file_size = file_path.stat().st_size

    start = 0
    end = file_size - 1

    if range_header:
        # Parse range header (e.g., "bytes=0-1023")
        range_match = re.search(r'bytes=(\d+)-(\d*)', range_header)
        if range_match:
            start = int(range_match.group(1))
            if range_match.group(2):
                end = int(range_match.group(2))
            else:
                end = file_size - 1

    # Calculate content length
    content_length = end - start + 1

    # Open file and seek to start position
    def iterfile():
        with open(file_path, 'rb') as f:
            f.seek(start)
            remaining = content_length
            chunk_size = 8192 * 16  # 128KB chunks for smooth streaming

            while remaining > 0:
                chunk_to_read = min(chunk_size, remaining)
                data = f.read(chunk_to_read)
                if not data:
                    break
                remaining -= len(data)
                yield data

    # Prepare headers
    headers = {
        'Accept-Ranges': 'bytes',
        'Content-Length': str(content_length),
        'Content-Type': content_type,
        'Cache-Control': 'no-cache',
    }

    # Add Content-Range only for range requests
    if range_header:
        headers['Content-Range'] = f'bytes {start}-{end}/{file_size}'

    # Return 206 Partial Content if range request, otherwise 200
    status_code = 206 if range_header else 200

    return StreamingResponse(
        iterfile(),
        status_code=status_code,
        headers=headers,
        media_type=content_type
    )


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """Serve the main page"""
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "ffmpeg_available": check_ffmpeg()
    }


@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file"""
    if not check_ffmpeg():
        raise HTTPException(status_code=500, detail="FFmpeg not found")

    # Validate file type
    allowed_extensions = [".mp4", ".mkv", ".avi", ".mov", ".webm", ".flv"]
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}")

    # Save uploaded file
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Get video duration
    try:
        duration = get_video_duration(str(file_path))
    except Exception as e:
        file_path.unlink()  # Delete the uploaded file
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "filename": file.filename,
        "size": file_path.stat().st_size,
        "duration": duration,
        "url": f"/api/stream/uploads/{file.filename}"
    }


@app.get("/api/videos")
async def list_videos():
    """List all uploaded videos"""
    videos = []
    for video_file in UPLOAD_DIR.glob("*"):
        if video_file.is_file():
            try:
                duration = get_video_duration(str(video_file))
                videos.append({
                    "filename": video_file.name,
                    "size": video_file.stat().st_size,
                    "duration": duration,
                    "url": f"/api/stream/uploads/{video_file.name}"
                })
            except:
                pass
    return videos


@app.post("/api/trim")
async def trim_video(request: TrimRequest):
    """Trim video based on segments"""
    if not check_ffmpeg():
        raise HTTPException(status_code=500, detail="FFmpeg not found")

    video_path = UPLOAD_DIR / request.video_filename
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")

    if not request.segments:
        raise HTTPException(status_code=400, detail="No segments provided")

    try:
        # Clean temp directory
        for temp_file in TEMP_DIR.glob("*"):
            temp_file.unlink()

        # Extract segments
        segment_files = []
        for i, segment in enumerate(request.segments):
            segment_file = TEMP_DIR / f"segment_{i:03d}.mp4"
            extract_segment(str(video_path), segment.start, segment.end, str(segment_file))
            segment_files.append(str(segment_file))

        # Merge segments
        output_filename = f"{video_path.stem}_trimmed.mp4"
        output_path = OUTPUT_DIR / output_filename

        if len(segment_files) == 1:
            # Single segment, just copy
            shutil.copy(segment_files[0], output_path)
        else:
            # Multiple segments, merge
            merge_segments(segment_files, str(output_path))

        # Clean up temp files
        for temp_file in TEMP_DIR.glob("*"):
            temp_file.unlink()

        return {
            "success": True,
            "output_filename": output_filename,
            "output_url": f"/api/stream/output/{output_filename}",
            "output_size": output_path.stat().st_size,
            "segments_count": len(request.segments)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.get("/api/stream/uploads/{filename}")
async def stream_uploaded_video(filename: str, range: Optional[str] = Header(None)):
    """Stream uploaded video with range request support for smooth seeking"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")

    # Determine content type based on file extension
    ext = file_path.suffix.lower()
    content_types = {
        '.mp4': 'video/mp4',
        '.mkv': 'video/x-matroska',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.flv': 'video/x-flv'
    }
    content_type = content_types.get(ext, 'video/mp4')

    return range_requests_response(file_path, range, content_type)


@app.get("/api/stream/output/{filename}")
async def stream_output_video(filename: str, range: Optional[str] = Header(None)):
    """Stream output video with range request support"""
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")

    return range_requests_response(file_path, range, 'video/mp4')


@app.get("/api/output/{filename}")
async def download_output(filename: str):
    """Download processed video (for direct download link)"""
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="video/mp4"
    )


@app.delete("/api/videos/{filename}")
async def delete_video(filename: str):
    """Delete an uploaded video"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    file_path.unlink()
    return {"success": True, "message": f"Deleted {filename}"}


@app.delete("/api/output/{filename}")
async def delete_output(filename: str):
    """Delete an output video"""
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    file_path.unlink()
    return {"success": True, "message": f"Deleted {filename}"}


if __name__ == "__main__":
    import os

    print("=" * 60)
    print("🎬 VIDEO TRIMMER PRO - Web Interface")
    print("=" * 60)
    print(f"📁 Upload directory: {UPLOAD_DIR}")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print(f"✓ FFmpeg available: {check_ffmpeg()}")
    print("=" * 60)

    # Get port from environment variable (for cloud hosting)
    port = int(os.environ.get("PORT", 8000))

    print(f"🌐 Starting server on port: {port}")
    print("=" * 60)

    uvicorn.run(app, host="0.0.0.0", port=port)
