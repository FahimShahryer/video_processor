// Video Trimmer Pro - Frontend Application

let player = null;
let currentVideo = null;
let segments = [];
let outputUrl = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
    checkHealth();
});

// Health check
async function checkHealth() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        if (!data.ffmpeg_available) {
            alert('Warning: FFmpeg is not available. Video processing will not work.');
        }
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

// Initialize upload functionality
function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const videoInput = document.getElementById('videoInput');

    // Click to upload
    uploadArea.addEventListener('click', () => {
        videoInput.click();
    });

    // File input change
    videoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadVideo(e.target.files[0]);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragging');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragging');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragging');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadVideo(files[0]);
        }
    });
}

// Upload video to server
async function uploadVideo(file) {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/x-matroska', 'video/avi', 'video/quicktime', 'video/webm', 'video/x-flv'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|mkv|avi|mov|webm|flv)$/i)) {
        alert('Invalid file type. Please upload a valid video file.');
        return;
    }

    // Show progress
    document.querySelector('.upload-section').style.display = 'block';
    document.getElementById('uploadProgress').style.display = 'block';
    document.getElementById('uploadArea').style.display = 'none';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Upload failed');
        }

        const data = await response.json();
        currentVideo = data;

        // Hide upload, show workspace
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('workspace').style.display = 'grid';

        // Load video in player
        loadVideo(data);

    } catch (error) {
        alert('Upload failed: ' + error.message);
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('uploadArea').style.display = 'block';
    }
}

// Load video in Video.js player
function loadVideo(videoData) {
    // Destroy existing player if any
    if (player) {
        player.dispose();
    }

    // Initialize Video.js player with optimized settings for smooth seeking
    player = videojs('videoPlayer', {
        controls: true,
        autoplay: false,
        preload: 'metadata',
        playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
        controlBar: {
            volumePanel: {
                inline: false
            }
        }
    });

    // Set video source with proper type
    player.src({
        src: videoData.url,
        type: getVideoType(videoData.filename)
    });

    // Wait for metadata to load before enabling features
    player.one('loadedmetadata', function() {
        console.log('Video metadata loaded. Duration:', player.duration());

        // Enable seeking
        const videoElement = player.tech({ IWillNotUseThisInPlugins: true }).el();
        if (videoElement) {
            videoElement.preload = 'auto';
            console.log('Video element configured for seeking');
        }
    });

    // Handle loading errors
    player.on('error', function(e) {
        console.error('Video player error:', player.error());
        alert('Error loading video: ' + (player.error()?.message || 'Unknown error'));
    });

    // Update video info
    document.getElementById('videoFilename').textContent = videoData.filename;
    document.getElementById('videoDuration').textContent = formatTime(videoData.duration);
    document.getElementById('endTime').max = videoData.duration;
    document.getElementById('startTime').max = videoData.duration;

    // Update current time display
    player.on('timeupdate', function() {
        const currentTime = player.currentTime();
        document.getElementById('currentTime').textContent = formatTime(currentTime);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Get video MIME type
function getVideoType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
        'mp4': 'video/mp4',
        'mkv': 'video/x-matroska',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'webm': 'video/webm',
        'flv': 'video/x-flv'
    };
    return types[ext] || 'video/mp4';
}

// Handle keyboard shortcuts - Professional YouTube-like controls
function handleKeyboardShortcuts(e) {
    if (!player) return;

    // Don't intercept shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' && e.code !== 'Enter') return;

    // Check if video is ready
    const duration = player.duration();
    if (!duration || isNaN(duration)) {
        console.log('Video not ready yet');
        return;
    }

    // Space or K - play/pause
    if ((e.code === 'Space' || e.code === 'KeyK') && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (player.paused()) {
            player.play().catch(err => console.error('Play error:', err));
        } else {
            player.pause();
        }
    }

    // Left arrow - seek backward 10 seconds (YouTube-like)
    if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const currentTime = player.currentTime();
        const newTime = Math.max(0, currentTime - 10);
        console.log('Seeking backward from', currentTime, 'to', newTime);
        player.currentTime(newTime);
        showSeekFeedback(-10);
    }

    // Right arrow - seek forward 10 seconds (YouTube-like)
    if (e.code === 'ArrowRight') {
        e.preventDefault();
        const currentTime = player.currentTime();
        const newTime = Math.min(duration, currentTime + 10);
        console.log('Seeking forward from', currentTime, 'to', newTime);
        player.currentTime(newTime);
        showSeekFeedback(+10);
    }

    // J key - seek backward 10 seconds
    if (e.code === 'KeyJ') {
        e.preventDefault();
        const newTime = Math.max(0, player.currentTime() - 10);
        player.currentTime(newTime);
        showSeekFeedback(-10);
    }

    // L key - seek forward 10 seconds
    if (e.code === 'KeyL') {
        e.preventDefault();
        const newTime = Math.min(player.duration(), player.currentTime() + 10);
        player.currentTime(newTime);
        showSeekFeedback(+10);
    }

    // , (comma) - previous frame (0.1s backward)
    if (e.code === 'Comma') {
        e.preventDefault();
        player.pause();
        player.currentTime(Math.max(0, player.currentTime() - 0.1));
    }

    // . (period) - next frame (0.1s forward)
    if (e.code === 'Period') {
        e.preventDefault();
        player.pause();
        player.currentTime(Math.min(player.duration(), player.currentTime() + 0.1));
    }

    // I key - set start time (In point)
    if (e.code === 'KeyI') {
        e.preventDefault();
        setStartToCurrent();
    }

    // O key - set end time (Out point)
    if (e.code === 'KeyO') {
        e.preventDefault();
        setEndToCurrent();
    }

    // Enter - add segment
    if (e.code === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        addSegment();
    }

    // M key - mute/unmute
    if (e.code === 'KeyM') {
        e.preventDefault();
        player.muted(!player.muted());
    }

    // F key - fullscreen
    if (e.code === 'KeyF') {
        e.preventDefault();
        if (player.isFullscreen()) {
            player.exitFullscreen();
        } else {
            player.requestFullscreen();
        }
    }

    // Number keys 0-9 - jump to percentage
    if (e.code.startsWith('Digit') && !e.shiftKey) {
        const num = parseInt(e.code.replace('Digit', ''));
        e.preventDefault();
        const percentage = num / 10;
        player.currentTime(player.duration() * percentage);
    }
}

// Show visual feedback when seeking
function showSeekFeedback(seconds) {
    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) {
        currentTimeEl.style.transform = 'scale(1.2)';
        currentTimeEl.style.color = 'var(--primary-color)';
        setTimeout(() => {
            currentTimeEl.style.transform = 'scale(1)';
            currentTimeEl.style.color = '';
        }, 300);
    }
}

// Set start time to current playback time
function setStartToCurrent() {
    if (!player) return;
    const currentTime = player.currentTime();
    document.getElementById('startTime').value = currentTime.toFixed(1);
}

// Set end time to current playback time
function setEndToCurrent() {
    if (!player) return;
    const currentTime = player.currentTime();
    document.getElementById('endTime').value = currentTime.toFixed(1);
}

// Add a new segment
function addSegment() {
    const startInput = document.getElementById('startTime');
    const endInput = document.getElementById('endTime');

    const start = parseFloat(startInput.value);
    const end = parseFloat(endInput.value);

    // Validation
    if (isNaN(start) || isNaN(end)) {
        alert('Please enter valid start and end times');
        return;
    }

    if (start >= end) {
        alert('Start time must be less than end time');
        return;
    }

    if (start < 0 || end > currentVideo.duration) {
        alert('Times must be within video duration');
        return;
    }

    // Add segment
    segments.push({ start, end });

    // Update UI
    renderSegments();

    // Clear inputs
    startInput.value = '';
    endInput.value = '';

    // Show success feedback
    flashElement(document.getElementById('segmentCount'));
}

// Render segments list
function renderSegments() {
    const container = document.getElementById('segmentsContainer');
    const countElement = document.getElementById('segmentCount');

    countElement.textContent = segments.length;

    if (segments.length === 0) {
        container.innerHTML = '<p class="empty-state-compact">No segments yet</p>';
        return;
    }

    // Sort segments by start time
    segments.sort((a, b) => a.start - b.start);

    container.innerHTML = segments.map((segment, index) => `
        <div class="segment-item">
            <div class="segment-info">
                <span class="segment-number">Segment ${index + 1}</span>
                <span class="segment-time">${formatTime(segment.start)} → ${formatTime(segment.end)}</span>
                <span class="segment-duration">${formatTime(segment.end - segment.start)}</span>
            </div>
            <div>
                <button class="btn-danger" onclick="removeSegment(${index})">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 14px; height: 14px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// Remove a segment
function removeSegment(index) {
    segments.splice(index, 1);
    renderSegments();
}

// Clear all segments
function clearSegments() {
    if (segments.length === 0) return;

    if (confirm('Are you sure you want to clear all segments?')) {
        segments = [];
        renderSegments();
    }
}

// Process video with segments
async function processVideo() {
    if (segments.length === 0) {
        alert('Please add at least one segment');
        return;
    }

    // Show processing status
    document.getElementById('processingStatus').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('processBtn').disabled = true;

    try {
        const response = await fetch('/api/trim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                video_filename: currentVideo.filename,
                segments: segments
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Processing failed');
        }

        const result = await response.json();

        // Hide processing, show result
        document.getElementById('processingStatus').style.display = 'none';
        document.getElementById('resultSection').style.display = 'block';

        // Update result info
        document.getElementById('outputFilename').textContent = result.output_filename;
        document.getElementById('outputSize').textContent = formatBytes(result.output_size);

        // Store output URL
        outputUrl = result.output_url;

        console.log('Video processed successfully:', result);

    } catch (error) {
        alert('Processing failed: ' + error.message);
        document.getElementById('processingStatus').style.display = 'none';
    } finally {
        document.getElementById('processBtn').disabled = false;
    }
}

// Download output video
function downloadOutput() {
    if (!outputUrl) return;

    const filename = document.getElementById('outputFilename').textContent;

    // Use the download API endpoint instead of streaming endpoint
    const downloadUrl = outputUrl.replace('/api/stream/output/', '/api/output/');

    console.log('Downloading:', filename, 'from', downloadUrl);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show feedback
    alert('Download started! Check your downloads folder.');
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Format bytes to human-readable size
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Flash element animation
function flashElement(element) {
    element.style.transform = 'scale(1.2)';
    element.style.color = 'var(--success-color)';

    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
    }, 300);
}
