# Installation Guide

## Quick Setup

1. **Download the Extension**
   - Save all files in the `tracking-bypass-extension` folder

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `tracking-bypass-extension` folder
   - Extension will appear in your toolbar

## Usage

1. **Open Control Panel**
   - Click the extension icon in Chrome toolbar
   - Professional popup interface will open

2. **Configure Protection**
   - Toggle individual tracking protections on/off
   - Each category works independently
   - Settings are saved automatically

3. **Monitor Status**
   - Badge shows number of active protections
   - Green badge = protections active
   - No badge = all protections disabled

### Core Tracking Features:
- ✅ Mouse movement and click tracking
- ✅ Keyboard input monitoring  
- ✅ Window/tab switching detection
- ✅ Page visibility tracking
- ✅ Fullscreen exit monitoring
- ✅ Camera/video access detection
- ✅ Copy/paste restrictions
- ✅ Fraud detection systems
- ✅ Time-based monitoring
- ✅ Alert/warning suppression

### Specific Functions Bypassed:
- `onMouseOut()` - Mouse exit detection
- `fraudDetected[]` - Fraud tracking array
- `fraudCheckingQuestions[]` - Fraud question tracking
- `exitFullScreen[]` - Fullscreen exit tracking
- `offscreen` - Off-screen time tracking
- `visibilitychange` events
- `beforeunload`/`unload` events
- Camera `getUserMedia` detection
- Alert/warning dialogs

## Testing

1. **Load a test page** with tracking
2. **Open browser console** (F12)
3. **Look for bypass messages**: `[Tracking Bypass] ...`
4. **Test functionality**:
   - Switch tabs/windows
   - Copy/paste text
   - Exit fullscreen
   - Move mouse outside window
   - Press various keys

## Troubleshooting

**Extension not working?**
- Check that Developer mode is enabled
- Reload the extension in `chrome://extensions/`
- Check browser console for errors

**Tracking still detected?**
- Ensure relevant protections are enabled in popup
- Some tracking may use different methods
- Check console for bypass confirmation messages

**Website not functioning?**
- Try disabling specific protections
- Extension focuses on bypass, not blocking
- Report issues with specific websites

## File Structure

```
tracking-bypass-extension/
├── manifest.json          # Extension configuration
├── content.js            # Content script (runs in page)
├── injected.js           # Page context script
├── popup.html            # Control panel interface
├── popup.js              # Control panel logic
├── background.js         # Background service worker
├── icons/                # Extension icons
├── README.md             # Documentation
└── INSTALL.md            # This file
```

## Security Notes
- Extension runs locally only
- No data transmitted externally
- All settings stored in Chrome sync storage
- Open source - all code visible
- Minimal permissions requested