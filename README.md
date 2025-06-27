# Tracking Bypass Extension

A minimal Chrome extension designed to bypass tracking mechanisms while maintaining website functionality.

## Features

This extension bypasses:

### 🖱️ Mouse & Interaction Tracking
- **Mouse Tracking**: Prevents mouse movement, click, and position monitoring
- **Copy/Paste Detection**: Bypasses clipboard monitoring and restrictions

### ⌨️ Keyboard & Input Tracking  
- **Keyboard Tracking**: Prevents keystroke monitoring and key event tracking

### 👁️ Visibility & Focus Tracking
- **Visibility Tracking**: Bypasses page visibility API and tab switching detection
- **Window Focus Tracking**: Prevents window focus/blur and tab switching detection
- **Fullscreen Tracking**: Bypasses fullscreen exit detection and monitoring

### 📹 Media & Monitoring
- **Camera Tracking**: Prevents camera access detection and video monitoring

### 🚨 Security & Alerts
- **Fraud Detection**: Bypasses fraud detection mechanisms and warning systems
- **Alert Suppression**: Suppresses tracking-related alerts and warnings

### ⏱️ Time & Performance
- **Time Tracking**: Prevents time-based monitoring and performance tracking

## Installation

1. Download or clone this extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your toolbar

## Usage

1. Click the extension icon to open the control panel
2. Toggle individual protection features on/off
3. Each category can be controlled independently
4. The extension badge shows the number of active protections

## Key Features

- **Granular Control**: Individual toggles for each tracking mechanism
- **Professional UI**: Clean, modern interface with professional styling
- **Independent Operation**: Each protection works independently without requiring master protection
- **Undetectable**: Designed to be undetectable by websites
- **Non-Blocking**: Focuses on bypassing rather than blocking to maintain functionality

## Tracking Mechanisms Bypassed

Based on analysis of the target script, this extension specifically addresses:

1. **Mouse Event Tracking**: `onMouseOut`, mouse position monitoring
2. **Keyboard Event Monitoring**: Key press detection and input tracking
3. **Window/Tab Switching**: `visibilitychange`, `beforeunload`, `unload` events
4. **Fullscreen Detection**: Exit fullscreen monitoring and warnings
5. **Camera/Video Monitoring**: `getUserMedia` and video stream detection
6. **Fraud Detection Systems**: `fraudDetected`, `fraudCheckingQuestions` arrays
7. **Time-based Tracking**: Performance timing and duration monitoring
8. **Alert Systems**: Warning dialogs and termination alerts
9. **Focus/Blur Detection**: Window focus state monitoring
10. **Copy/Paste Restrictions**: Clipboard event monitoring

## Technical Details

- **Manifest V3**: Uses the latest Chrome extension manifest
- **Content Script Injection**: Runs at `document_start` for early intervention
- **Page Context Access**: Uses injected scripts for deep integration
- **Storage Sync**: Settings persist across browser sessions
- **Event Override**: Intercepts and neutralizes tracking events

## Privacy & Security

- **No Data Collection**: Extension does not collect or transmit any data
- **Local Storage Only**: All settings stored locally in Chrome sync storage
- **Open Source**: All code is visible and auditable
- **Minimal Permissions**: Only requests necessary permissions

## Compatibility

- Chrome 88+
- Manifest V3 compatible
- Works on all websites
- No external dependencies

## Disclaimer
This extension is for educational and legitimate use cases only. Users are responsible for complying with applicable terms of service and regulations.
