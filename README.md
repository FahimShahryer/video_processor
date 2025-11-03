# Video Trimmer Pro - Web Interface

Professional browser-based video trimming and merging tool built with FastAPI and Video.js.

## Features

- 🎬 **Professional Video Player** - Video.js-powered player with full controls
- ✂️ **Precise Trimming** - Frame-accurate segment selection
- 🔗 **Smart Merging** - Combine multiple segments seamlessly
- ⌨️ **Keyboard Shortcuts** - Efficient workflow with hotkeys
- 🎨 **Modern UI** - Minimal, professional design
- ⚡ **Fast Processing** - Uses FFmpeg stream copy (no re-encoding)
- 📱 **Responsive** - Works on desktop and tablet

## Quick Start

### 1. Install Dependencies

From the project root directory:

```bash
# Activate virtual environment
venv\Scripts\activate

# Install requirements
pip install -r video_trimmer_ui\requirements.txt
```

### 2. Start the Server

**Windows:**
```bash
cd video_trimmer_ui
start.bat
```

**Or manually:**
```bash
cd video_trimmer_ui
python main.py
```

### 3. Open Browser

Navigate to: **http://localhost:8000**

## Usage Guide

### 1. Upload Video
- Drag and drop a video file or click to browse
- Supports: MP4, MKV, AVI, MOV, WebM, FLV

### 2. Add Segments
- Play/seek through your video to find the sections you want
- Use "Use Current" buttons to mark start and end times
- Click "Add Segment" to add to the list
- Repeat for multiple segments

### 3. Process Video
- Review your segments list
- Click "Process Video" to trim and merge
- Download the result when complete

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Seek backward 5 seconds |
| `→` | Seek forward 5 seconds |
| `I` | Set start time to current position |
| `O` | Set end time to current position |

## API Endpoints

### Upload Video
```
POST /api/upload
Content-Type: multipart/form-data
```

### Process Video
```
POST /api/trim
Content-Type: application/json

{
  "video_filename": "video.mp4",
  "segments": [
    {"start": 10.5, "end": 20.3},
    {"start": 30.0, "end": 45.7}
  ]
}
```

### List Videos
```
GET /api/videos
```

### Download Output
```
GET /api/output/{filename}
```

## Directory Structure

```
video_trimmer_ui/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── start.bat           # Windows startup script
├── ffmpeg.exe          # FFmpeg binary
├── ffprobe.exe         # FFprobe binary
├── templates/
│   └── index.html      # Main HTML page
├── static/
│   ├── css/
│   │   └── style.css   # Styling
│   └── js/
│       └── app.js      # Frontend logic
├── uploads/            # Uploaded videos (created on first run)
├── output/             # Processed videos (created on first run)
└── temp_segments/      # Temporary files (created on first run)
```

## Technical Details

- **Backend**: FastAPI (Python)
- **Frontend**: Video.js + Vanilla JavaScript
- **Video Processing**: FFmpeg (stream copy mode)
- **Styling**: Custom CSS with CSS variables
- **Architecture**: REST API + Server-side rendering

## Troubleshooting

### FFmpeg Not Found
- Ensure `ffmpeg.exe` and `ffprobe.exe` are in the `video_trimmer_ui` directory
- Check that files are not corrupted (should be ~180MB each)

### Video Won't Play
- Make sure your browser supports the video format
- Try converting to MP4 first
- Check browser console for errors

### Processing Fails
- Ensure segments don't overlap
- Verify segment times are within video duration
- Check that there's enough disk space

### Port Already in Use
Edit `main.py` and change the port:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Change 8000 to 8001
```

## Performance Tips

- Use MP4 format for best browser compatibility
- Stream copy mode is used (no re-encoding = fast!)
- Processing time depends on number of segments and video size
- Large videos (>1GB) may take a few minutes to upload

## License

MIT License - Feel free to use and modify!
