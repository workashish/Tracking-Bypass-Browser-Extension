// Content script for tracking bypass
(function() {
    'use strict';

    // Configuration object to store bypass settings
    let bypassConfig = {
        mouseTracking: true,
        keyboardTracking: true,
        visibilityTracking: true,
        fullscreenTracking: true,
        cameraTracking: true,
        fraudDetection: true,
        timeTracking: true,
        alertSuppression: true,
        windowFocusTracking: true,
        copyPasteTracking: true
    };

    // Load settings from storage
    chrome.storage.sync.get(bypassConfig, (result) => {
        bypassConfig = result;
        initializeBypass();
    });

    // Listen for settings changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
            for (let key in changes) {
                if (bypassConfig.hasOwnProperty(key)) {
                    bypassConfig[key] = changes[key].newValue;
                }
            }
        }
    });

    function initializeBypass() {
        // Inject early bypass script first
        const earlyScript = document.createElement('script');
        earlyScript.src = chrome.runtime.getURL('early-inject.js');
        earlyScript.onload = function() {
            this.remove();
            console.log('[Tracking Bypass] Early injection completed');
        };
        (document.head || document.documentElement).appendChild(earlyScript);

        // Then inject the main bypass script
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('injected.js');
        script.onload = function() {
            this.remove();
            // Send configuration to injected script
            window.postMessage({
                type: 'BYPASS_CONFIG',
                config: bypassConfig
            }, '*');
        };
        (document.head || document.documentElement).appendChild(script);

        // Override event listeners before page loads
        overrideEventListeners();

        // Override specific tracking functions
        overrideTrackingFunctions();
    }

    function overrideEventListeners() {
        // Store original addEventListener
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // List of events to potentially bypass
            const trackingEvents = [
                'visibilitychange', 'beforeunload', 'unload', 'blur', 'focus',
                'mouseout', 'mouseover', 'mousemove', 'mousedown', 'mouseup',
                'keydown', 'keyup', 'keypress', 'copy', 'paste', 'cut',
                'resize', 'scroll', 'click', 'contextmenu'
            ];

            if (trackingEvents.includes(type)) {
                // Check if this event should be bypassed
                if (shouldBypassEvent(type)) {
                    console.log(`[Tracking Bypass] Blocked event listener: ${type}`);
                    return; // Don't add the listener
                }
            }

            // Call original addEventListener for non-tracking events
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    function shouldBypassEvent(eventType) {
        const eventMap = {
            'visibilitychange': 'visibilityTracking',
            'beforeunload': 'visibilityTracking',
            'unload': 'visibilityTracking',
            'blur': 'windowFocusTracking',
            'focus': 'windowFocusTracking',
            'mouseout': 'mouseTracking',
            'mouseover': 'mouseTracking',
            'mousemove': 'mouseTracking',
            'mousedown': 'mouseTracking',
            'mouseup': 'mouseTracking',
            'keydown': 'keyboardTracking',
            'keyup': 'keyboardTracking',
            'keypress': 'keyboardTracking',
            'copy': 'copyPasteTracking',
            'paste': 'copyPasteTracking',
            'cut': 'copyPasteTracking',
            'resize': 'windowFocusTracking',
            'scroll': 'mouseTracking',
            'click': 'mouseTracking',
            'contextmenu': 'mouseTracking'
        };

        const configKey = eventMap[eventType];
        return configKey && bypassConfig[configKey];
    }

    function overrideTrackingFunctions() {
        // Override document.hidden and visibilityState
        if (bypassConfig.visibilityTracking) {
            // The main visibility override will be handled in the injected script
            // This is just a backup for early access
            console.log('[Tracking Bypass] Visibility tracking bypass enabled');
        }

        // Override fullscreen API
        if (bypassConfig.fullscreenTracking) {
            try {
                Object.defineProperty(document, 'fullscreenElement', {
                    get: () => document.documentElement,
                    configurable: true
                });
            } catch (e) {
                console.log('[Tracking Bypass] Could not override fullscreenElement:', e.message);
            }

            try {
                Object.defineProperty(document, 'fullscreen', {
                    get: () => true,
                    configurable: true
                });
            } catch (e) {
                console.log('[Tracking Bypass] Could not override fullscreen:', e.message);
            }
        }

        // Override alert, confirm, prompt if alert suppression is enabled
        if (bypassConfig.alertSuppression) {
            window.alert = function(message) {
                console.log(`[Tracking Bypass] Suppressed alert: ${message}`);
                return true;
            };

            window.confirm = function(message) {
                console.log(`[Tracking Bypass] Auto-confirmed: ${message}`);
                return true;
            };

            window.prompt = function(message, defaultText) {
                console.log(`[Tracking Bypass] Auto-prompted: ${message}`);
                return defaultText || '';
            };
        }
    }

    // Override window focus/blur detection
    if (bypassConfig.windowFocusTracking) {
        Object.defineProperty(document, 'hasFocus', {
            value: () => true,
            writable: false,
            configurable: true
        });
    }

    // Prevent copy/paste detection
    if (bypassConfig.copyPasteTracking) {
        ['copy', 'cut', 'paste'].forEach(eventType => {
            document.addEventListener(eventType, function(e) {
                e.stopImmediatePropagation();
            }, true);
        });
    }

    console.log('[Tracking Bypass] Content script loaded');
})();
