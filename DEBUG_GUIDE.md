# Video Player Debugging Guide

## Issues Fixed

### 1. **Seek Bar Not Visible** ✅
- Simplified Video.js configuration
- Added explicit CSS for control bar visibility
- Removed complex HTML5 overrides that were causing issues

### 2. **Seeking Restarts Video from Beginning** ✅
- Added duration check before seeking
- Added console logging to debug seeking
- Fixed `currentTime()` getter/setter usage
- Improved error handling

### 3. **HTTP Range Request Support** ✅
- Fixed headers for both full and partial requests
- Changed Cache-Control to 'no-cache' for better seeking
- Proper Content-Range header only on range requests

## How to Test

### Step 1: Restart Server
**IMPORTANT**: You must restart the FastAPI server for changes to take effect!

```bash
# Stop the current server (Ctrl+C)
cd video_trimmer_ui
python main.py
```

### Step 2: Hard Refresh Browser
Clear cache and reload:
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
- Or: `Ctrl + F5`

### Step 3: Open Browser Developer Tools
Press `F12` to open DevTools

### Step 4: Upload Video and Check Console

After uploading, you should see in the Console:
```
Video metadata loaded. Duration: 123.456
Video element configured for seeking
```

### Step 5: Test Seeking

#### Using Seek Bar (Mouse):
1. Click anywhere on the video progress bar
2. Video should jump to that position instantly
3. Check Console for any errors

#### Using Keyboard:
1. Press `→` (Right Arrow)
2. Console should show: `Seeking forward from X to Y`
3. Video should jump 10 seconds forward
4. Press `←` (Left Arrow)
5. Console should show: `Seeking backward from X to Y`
6. Video should jump 10 seconds backward

### Step 6: Check Network Tab

1. Go to Network tab in DevTools
2. Filter by "media" or the video filename
3. Click on the video request
4. Check **Response Headers**:

**You should see:**
```
Accept-Ranges: bytes
Content-Type: video/mp4
Content-Length: [size]
```

**For range requests (when seeking), you should see:**
```
HTTP Status: 206 Partial Content
Accept-Ranges: bytes
Content-Range: bytes 1234-5678/total
Content-Type: video/mp4
```

## Common Issues and Solutions

### Issue: "Video not ready yet" in Console
**Solution**: Wait for video metadata to load. The console should show "Video metadata loaded" first.

### Issue: Video plays but seek bar is missing
**Solution**:
1. Clear browser cache completely
2. Hard refresh (Ctrl+Shift+R)
3. Check if Video.js CSS is loading (Network tab)

### Issue: Seeking works with mouse but not keyboard
**Solution**:
1. Make sure keyboard focus is on the page (click somewhere on the page)
2. Check Console for "Video not ready yet" message
3. Wait for video to fully load metadata

### Issue: Video restarts from beginning when seeking
**Solution**:
1. Check Network tab - you should see 206 status codes
2. If you see 200 status codes instead, the server isn't handling range requests
3. Make sure you restarted the FastAPI server
4. Check Console for errors

### Issue: "Play error" in Console
**Solution**:
1. Browser might have autoplay restrictions
2. Click play button manually first
3. Some browsers require user interaction before playing

### Issue: No audio
**Solution**:
1. Check if video file actually has audio track
2. Test with a different video file
3. Check browser volume/mute settings
4. Look for errors in Console

## Video.js Configuration Explained

```javascript
player = videojs('videoPlayer', {
    controls: true,              // Show control bar
    autoplay: false,             // Don't autoplay (browser restriction)
    preload: 'metadata',         // Load metadata only first
    playbackRates: [0.25, ...],  // Speed control options
});
```

### Why `preload: 'metadata'`?
- Loads video duration and metadata quickly
- Allows seeking immediately
- Full video loads on-demand when needed

## Backend Range Request Logic

```python
# Browser sends: Range: bytes=1000-2000
# Server responds:
#   Status: 206 Partial Content
#   Content-Range: bytes 1000-2000/total_size
#   Content-Length: 1001
#   [video data bytes 1000-2000]
```

This allows:
- Seeking to any position instantly
- Loading only the needed part
- Smooth YouTube-like experience

## Testing with Different Videos

Test with:
1. **Small MP4** (~10MB) - Should work perfectly
2. **Large MKV** (~500MB) - Tests streaming performance
3. **High bitrate video** - Tests buffering
4. **Video with multiple audio tracks** - Tests audio handling

## Performance Optimization

### Current Settings:
- **Chunk size**: 128KB (8192 * 16 bytes)
- **Preload**: metadata only
- **Cache**: no-cache (for better seeking)

### To improve performance:
- Increase chunk size for larger videos
- Enable cache for repeated views
- Use CDN for production

## Quick Checklist

Before reporting an issue:
- [ ] Server restarted after code changes
- [ ] Browser cache cleared (hard refresh)
- [ ] Developer Console open (check for errors)
- [ ] Network tab shows 206 status codes
- [ ] Console shows "Video metadata loaded"
- [ ] Video file is valid and not corrupted
- [ ] Browser is modern (Chrome/Firefox/Edge)

## Still Not Working?

### Check These:
1. **Browser Console** - Any red errors?
2. **Network Tab** - Status codes 206 or 200?
3. **Server Console** - Any Python errors?
4. **Video File** - Does it play in VLC?

### Get More Debug Info:
Add to JavaScript console:
```javascript
// Check if player exists
console.log('Player:', player);

// Check video duration
console.log('Duration:', player.duration());

// Check current time
console.log('Current Time:', player.currentTime());

// Try seeking manually
player.currentTime(30); // Jump to 30 seconds
```

### Server Debug:
Check FastAPI logs for:
- Range request headers received
- File paths being accessed
- Any Python exceptions

---

**If everything fails**, try uploading a different video file. Some videos have encoding issues that prevent proper seeking.
