# Quick Start Guide - Video Trimmer Pro

## Step 1: Install Dependencies

Open a terminal in the project root (`d:\Projects\video_trimmer`):

```bash
# Activate virtual environment
venv\Scripts\activate

# Install FastAPI and dependencies
pip install -r video_trimmer_ui\requirements.txt
```

## Step 2: Start the Server

**Option A - Using start.bat (Easiest):**
```bash
cd video_trimmer_ui
start.bat
```

**Option B - Manual start:**
```bash
cd video_trimmer_ui
python main.py
```

## Step 3: Open Browser

Open your browser and go to:
```
http://localhost:8000
```

## That's it! 🎉

You should now see the Video Trimmer Pro interface.

## How to Use

1. **Upload a video** - Drag & drop or click to browse
2. **Play the video** - Use the player to find segments you want
3. **Mark segments**:
   - Seek to start position → Click "Use Current" for Start Time
   - Seek to end position → Click "Use Current" for End Time
   - Click "Add Segment"
4. **Repeat** for more segments
5. **Process** - Click "Process Video" button
6. **Download** - Download your trimmed video!

## Keyboard Shortcuts

- `Space` - Play/Pause
- `←` / `→` - Seek backward/forward 5 seconds
- `I` - Mark start time at current position
- `O` - Mark end time at current position

## Troubleshooting

**Port 8000 already in use?**
Edit `main.py` line 307 and change the port:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)
```

**Can't see video?**
Make sure your video format is supported. Convert to MP4 if needed.

**Processing stuck?**
Check the terminal/console for error messages.
