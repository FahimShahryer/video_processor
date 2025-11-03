# 🎬 Video Processor - Professional Video Trimming & Merging Tool

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen?style=for-the-badge&logo=render)](https://video-processor-4ty4.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **🌐 Live Demo:** **[https://video-processor-4ty4.onrender.com](https://video-processor-4ty4.onrender.com)**

Professional browser-based video trimming and merging tool with a modern, intuitive interface. Built with FastAPI, Video.js, and powered by FFmpeg.

---

## ✨ Features

- 🎬 **Professional Video Player** - Smooth seeking, YouTube-like controls
- ✂️ **Precise Trimming** - Select multiple segments with frame-accurate precision
- 🔗 **Smart Merging** - Combine segments seamlessly without re-encoding
- ⌨️ **Keyboard Shortcuts** - Arrow keys (10s seek), I/O (mark points), Space (play/pause)
- 🎨 **Modern UI** - Clean, minimal, professional design
- ⚡ **Fast Processing** - Uses FFmpeg stream copy (no quality loss)
- 🔊 **Audio Support** - Full audio playback and processing
- 📱 **Responsive** - Works perfectly on desktop and tablet
- 🌐 **No Installation** - Use directly in your browser

---

## 🚀 Live Demo

### **Try it now:** [https://video-processor-4ty4.onrender.com](https://video-processor-4ty4.onrender.com)

**Note:** First load may take 15-30 seconds (free hosting wakes from sleep).

---

## 📸 Screenshots

### Main Interface
![Video Processor Interface](https://via.placeholder.com/800x450/2563eb/ffffff?text=Video+Processor+Interface)

### Video Player with Timeline
![Video Player](https://via.placeholder.com/800x450/10b981/ffffff?text=Smooth+Video+Preview)

---

## 🎯 How It Works

### 1️⃣ **Upload Video**
- Drag & drop or click to browse
- Supports: MP4, MKV, AVI, MOV, WebM, FLV

### 2️⃣ **Select Segments**
- Play through your video
- Press `I` to mark start, `O` to mark end
- Add multiple segments

### 3️⃣ **Process & Download**
- Click "Process Video"
- Wait for FFmpeg to trim and merge
- Download your result!

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` or `K` | Play / Pause |
| `←` Left Arrow | Seek backward 10 seconds |
| `→` Right Arrow | Seek forward 10 seconds |
| `J` | Seek backward 10 seconds |
| `L` | Seek forward 10 seconds |
| `,` Comma | Previous frame (0.1s) |
| `.` Period | Next frame (0.1s) |
| `I` | Mark start time (In point) |
| `O` | Mark end time (Out point) |
| `M` | Mute / Unmute |
| `F` | Fullscreen toggle |
| `0-9` | Jump to 0%-90% of video |

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **FFmpeg** - Industry-standard video processing
- **Uvicorn** - Lightning-fast ASGI server

### Frontend
- **Video.js** - HTML5 video player
- **Vanilla JavaScript** - No heavy frameworks
- **Modern CSS** - Responsive design with CSS Grid/Flexbox

### Infrastructure
- **Render.com** - Free cloud hosting
- **GitHub** - Version control & CI/CD

---

## 📦 Local Installation

Want to run it locally? Follow these steps:

### Prerequisites
- Python 3.11+
- FFmpeg installed

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FahimShahryer/video_processor.git
   cd video_processor
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download FFmpeg** (Windows only):
   - Download from [FFmpeg Builds](https://github.com/BtbN/FFmpeg-Builds/releases)
   - Extract `ffmpeg.exe` and `ffprobe.exe` to project folder
   - On Linux/Mac: `sudo apt install ffmpeg` (or equivalent)

5. **Run the server:**
   ```bash
   python main.py
   ```

6. **Open browser:**
   ```
   http://localhost:8000
   ```

---

## 🌐 Deployment

This project is configured for easy deployment to Render.com (free tier).

### Deploy to Render

1. Fork this repository
2. Sign up at [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Use these settings:
   - **Build Command:** `bash render-build.sh`
   - **Start Command:** `python main.py`
   - **Plan:** Free

Your app will be live in 5-10 minutes! 🎉

---

## 📖 API Documentation

### Upload Video
```http
POST /api/upload
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "filename": "video.mp4",
  "size": 12345678,
  "duration": 120.5,
  "url": "/api/stream/uploads/video.mp4"
}
```

### Process Video
```http
POST /api/trim
Content-Type: application/json
```

**Body:**
```json
{
  "video_filename": "video.mp4",
  "segments": [
    {"start": 10.5, "end": 20.3},
    {"start": 30.0, "end": 45.7}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "output_filename": "video_trimmed.mp4",
  "output_url": "/api/stream/output/video_trimmed.mp4",
  "output_size": 5432100,
  "segments_count": 2
}
```

### List Videos
```http
GET /api/videos
```

### Download Output
```http
GET /api/output/{filename}
```

---

## 🎨 Features in Detail

### Professional Video Player
- Smooth seeking with HTTP range requests
- YouTube-like keyboard shortcuts
- Playback speed control (0.25x - 2x)
- Volume control and mute
- Fullscreen support

### Segment Management
- Add unlimited segments
- Visual timeline markers
- Segment duration display
- Easy remove/clear operations

### Processing
- FFmpeg stream copy (no re-encoding)
- Fast processing
- Progress indicators
- Success feedback with download

---

## 🔧 Configuration

### Change Port
Edit `main.py`:
```python
port = int(os.environ.get("PORT", 8001))  # Change 8000 to your port
```

### Upload Limits
Edit `main.py`:
```python
MAX_UPLOAD_SIZE = 500 * 1024 * 1024  # 500MB default
```

---

## 🐛 Troubleshooting

### Video Won't Play
- Check browser console for errors
- Try MP4 format (best compatibility)
- Ensure video isn't corrupted

### Seeking Issues
- Hard refresh browser (Ctrl+Shift+R)
- Check Network tab for 206 status codes
- Verify video metadata is loadable

### Processing Fails
- Check segment times are valid
- Ensure disk space available
- Verify FFmpeg is working: `ffmpeg -version`

### App Sleeps (Render Free Tier)
- First load after 15 min = slow (30s wake time)
- Subsequent loads = fast
- Upgrade to paid tier for always-on

---

## 📊 Performance

- **Upload:** Depends on internet speed
- **Processing:** ~1-2 seconds per segment (stream copy)
- **Download:** Depends on internet speed
- **Memory:** ~512 MB (Render free tier)

**Optimizations:**
- No re-encoding = instant processing
- HTTP range requests = smooth seeking
- Lazy loading = faster page load

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Fahim Shahryer**

- GitHub: [@FahimShahryer](https://github.com/FahimShahryer)
- Project: [video_processor](https://github.com/FahimShahryer/video_processor)
- Live Demo: [https://video-processor-4ty4.onrender.com](https://video-processor-4ty4.onrender.com)

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Video.js](https://videojs.com/) - HTML5 video player
- [FFmpeg](https://ffmpeg.org/) - Video processing
- [Render.com](https://render.com/) - Free hosting

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 📞 Support

If you have any questions or run into issues:

1. Check the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Read [FFMPEG_EXPLANATION.md](FFMPEG_EXPLANATION.md)
3. Open an issue on GitHub
4. Try the [Live Demo](https://video-processor-4ty4.onrender.com)

---

<div align="center">

### 🎬 **[Try Live Demo](https://video-processor-4ty4.onrender.com)** 🎬

**Made with ❤️ by Fahim Shahryer**

[![GitHub](https://img.shields.io/badge/GitHub-FahimShahryer-181717?style=for-the-badge&logo=github)](https://github.com/FahimShahryer)
[![Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=render)](https://video-processor-4ty4.onrender.com)

</div>
