// Injected script that runs in page context to bypass tracking
(function() {
    'use strict';

    let config = {};

    // Listen for configuration from content script
    window.addEventListener('message', function(event) {
        if (event.source !== window) return;
        
        if (event.data.type === 'BYPASS_CONFIG') {
            config = event.data.config;
            initializePageBypass();
        }
    });

    function initializePageBypass() {
        console.log('[Tracking Bypass] Initializing page-level bypass');

        // Override event listeners first (most important)
        overrideEventListeners();

        // Override fraud detection mechanisms
        if (config.fraudDetection) {
            overrideFraudDetection();
        }

        // Override camera/video tracking
        if (config.cameraTracking) {
            overrideCameraTracking();
        }

        // Override time tracking
        if (config.timeTracking) {
            overrideTimeTracking();
        }

        // Override mouse tracking
        if (config.mouseTracking) {
            overrideMouseTracking();
        }

        // Override keyboard tracking
        if (config.keyboardTracking) {
            overrideKeyboardTracking();
        }

        // Override window/tab switching detection
        if (config.windowFocusTracking) {
            overrideWindowTracking();
        }

        // Override fullscreen tracking
        if (config.fullscreenTracking) {
            overrideFullscreenTracking();
        }
    }

    function overrideEventListeners() {
        // Override addEventListener to intercept visibility change events
        const originalAddEventListener = EventTarget.prototype.addEventListener;

        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'visibilitychange' && config.visibilityTracking) {
                console.log('[Tracking Bypass] Blocked visibilitychange event listener');
                return; // Don't add the listener
            }

            if (type === 'beforeunload' && config.visibilityTracking) {
                console.log('[Tracking Bypass] Blocked beforeunload event listener');
                return; // Don't add the listener
            }

            if (type === 'unload' && config.visibilityTracking) {
                console.log('[Tracking Bypass] Blocked unload event listener');
                return; // Don't add the listener
            }

            if (type === 'blur' && config.windowFocusTracking) {
                console.log('[Tracking Bypass] Blocked blur event listener');
                return; // Don't add the listener
            }

            if (type === 'focus' && config.windowFocusTracking) {
                console.log('[Tracking Bypass] Blocked focus event listener');
                return; // Don't add the listener
            }

            if ((type === 'mouseout' || type === 'mouseleave') && config.mouseTracking) {
                console.log(`[Tracking Bypass] Blocked ${type} event listener`);
                return; // Don't add the listener
            }

            // Call original for non-blocked events
            return originalAddEventListener.call(this, type, listener, options);
        };

        console.log('[Tracking Bypass] Event listener interception active');
    }

    function overrideFraudDetection() {
        // Override fraud-related variables and functions
        if (window.fraudDetected) {
            window.fraudDetected = [];
        }
        
        if (window.fraudCheckingQuestions) {
            window.fraudCheckingQuestions = [];
        }

        // Override any fraud detection functions
        window.detectFraud = function() { return false; };
        window.checkFraud = function() { return false; };
        window.fraudCheck = function() { return false; };
    }

    function overrideCameraTracking() {
        // Override getUserMedia to prevent camera access detection
        const originalGetUserMedia = navigator.mediaDevices?.getUserMedia;
        
        if (originalGetUserMedia) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
                console.log('[Tracking Bypass] Camera access bypassed');
                // Return a fake stream or reject gracefully
                return Promise.resolve({
                    getTracks: () => [],
                    getVideoTracks: () => [],
                    getAudioTracks: () => [],
                    active: true
                });
            };
        }

        // Override video element properties
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            Object.defineProperty(video, 'videoWidth', { value: 640, writable: false });
            Object.defineProperty(video, 'videoHeight', { value: 480, writable: false });
        });
    }

    function overrideTimeTracking() {
        // Override time-related tracking
        let fakeStartTime = Date.now();
        
        // Override performance.now() to return consistent values
        const originalPerformanceNow = performance.now;
        performance.now = function() {
            return Date.now() - fakeStartTime;
        };

        // Override Date.now() for time tracking bypass
        const originalDateNow = Date.now;
        Date.now = function() {
            return originalDateNow();
        };
    }

    function overrideMouseTracking() {
        // Override mouse event properties
        const mouseEvents = ['mousedown', 'mouseup', 'mousemove', 'mouseout', 'mouseover'];
        
        mouseEvents.forEach(eventType => {
            document.addEventListener(eventType, function(e) {
                // Stop propagation of tracking-related mouse events
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && 
                    e.target.tagName !== 'SELECT' && e.target.tagName !== 'TEXTAREA') {
                    e.stopImmediatePropagation();
                }
            }, true);
        });

        // Override onMouseOut function specifically mentioned in the script
        window.onMouseOut = function() {
            console.log('[Tracking Bypass] onMouseOut bypassed');
            return false;
        };
    }

    function overrideKeyboardTracking() {
        // Override keyboard events
        const keyboardEvents = ['keydown', 'keyup', 'keypress'];
        
        keyboardEvents.forEach(eventType => {
            document.addEventListener(eventType, function(e) {
                // Allow normal typing but prevent tracking
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return; // Allow normal input
                }
                e.stopImmediatePropagation();
            }, true);
        });
    }

    function overrideWindowTracking() {
        // Override window focus/blur events
        try {
            Object.defineProperty(window, 'focused', {
                get: () => true,
                set: () => {},
                configurable: true
            });
        } catch (e) {
            console.log('[Tracking Bypass] Could not override window.focused:', e.message);
        }

        // Override beforeunload and unload events
        window.onbeforeunload = null;
        window.onunload = null;

        // Override page visibility API using prototype manipulation
        overrideVisibilityAPI();
    }

    function overrideVisibilityAPI() {
        // Store original descriptors
        const originalHiddenDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden') ||
                                       Object.getOwnPropertyDescriptor(document, 'hidden');
        const originalVisibilityStateDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState') ||
                                                 Object.getOwnPropertyDescriptor(document, 'visibilityState');

        // Override on Document prototype if possible
        try {
            if (Document.prototype) {
                Object.defineProperty(Document.prototype, 'hidden', {
                    get: function() {
                        console.log('[Tracking Bypass] document.hidden accessed - returning false');
                        return false;
                    },
                    configurable: true
                });

                Object.defineProperty(Document.prototype, 'visibilityState', {
                    get: function() {
                        console.log('[Tracking Bypass] document.visibilityState accessed - returning visible');
                        return 'visible';
                    },
                    configurable: true
                });

                console.log('[Tracking Bypass] Successfully overrode visibility API on prototype');
            }
        } catch (e) {
            console.log('[Tracking Bypass] Could not override on prototype, trying direct override');

            // Fallback: Try to delete and redefine
            try {
                delete document.hidden;
                delete document.visibilityState;

                Object.defineProperty(document, 'hidden', {
                    get: () => false,
                    configurable: true
                });

                Object.defineProperty(document, 'visibilityState', {
                    get: () => 'visible',
                    configurable: true
                });

                console.log('[Tracking Bypass] Successfully overrode visibility API directly');
            } catch (e2) {
                console.log('[Tracking Bypass] Could not override visibility API:', e2.message);

                // Last resort: Intercept property access via getter/setter on window
                interceptVisibilityAccess();
            }
        }
    }

    function interceptVisibilityAccess() {
        // Intercept common ways to access these properties
        const originalGetAttribute = document.getAttribute;
        document.getAttribute = function(name) {
            if (name === 'hidden') {
                console.log('[Tracking Bypass] getAttribute("hidden") intercepted');
                return 'false';
            }
            if (name === 'visibilityState') {
                console.log('[Tracking Bypass] getAttribute("visibilityState") intercepted');
                return 'visible';
            }
            return originalGetAttribute.call(this, name);
        };

        console.log('[Tracking Bypass] Set up visibility access interception');
    }

    function overrideFullscreenTracking() {
        // Override fullscreen detection
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

        // Override fullscreen change events
        document.addEventListener('fullscreenchange', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // Override the fullScreenChange function mentioned in the script
        if (window.fullScreenChange) {
            window.fullScreenChange = function() {
                console.log('[Tracking Bypass] fullScreenChange bypassed');
                return false;
            };
        }
    }

    // Override specific functions found in the tracking script
    function overrideSpecificFunctions() {
        // Override terminateTest function
        if (window.terminateTest) {
            window.terminateTest = function() {
                console.log('[Tracking Bypass] terminateTest bypassed');
                return false;
            };
        }

        // Override offscreen tracking
        if (window.offscreenTime !== undefined) {
            window.offscreenTime = 0;
        }

        // Override capture count
        if (window.captureCount !== undefined) {
            window.captureCount = 0;
        }

        // Override any warning systems
        window.showWarning = function() { return false; };
        window.displayWarning = function() { return false; };
    }

    // Initialize specific function overrides
    overrideSpecificFunctions();

    console.log('[Tracking Bypass] Injected script loaded');
})();
