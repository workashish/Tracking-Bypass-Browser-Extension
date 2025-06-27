#!/bin/bash

echo "🛡️ Tracking Bypass Extension Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: Please run this script from the tracking-bypass-extension directory"
    exit 1
fi

echo "✅ Extension files found"

# Check if Chrome is installed
if command -v google-chrome &> /dev/null; then
    CHROME_CMD="google-chrome"
elif command -v chromium &> /dev/null; then
    CHROME_CMD="chromium"
elif command -v chrome &> /dev/null; then
    CHROME_CMD="chrome"
else
    echo "⚠️  Chrome not found in PATH, please install manually"
    CHROME_CMD=""
fi

echo ""
echo "📋 Installation Instructions:"
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this folder: $(pwd)"
echo "5. Extension will appear in your toolbar"
echo ""

if [ ! -z "$CHROME_CMD" ]; then
    echo "🚀 Would you like to open Chrome extensions page? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        $CHROME_CMD chrome://extensions/ &
        echo "✅ Chrome extensions page opened"
    fi
fi

echo ""
echo "🔧 Quick Test:"
echo "1. Load the extension"
echo "2. Open: file://$(pwd)/test.html"
echo "3. Check console for bypass messages"
echo ""
echo "📖 For detailed instructions, see INSTALL.md"
echo "🛡️ Extension ready for installation!"
