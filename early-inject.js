// Early injection script that runs before any page scripts
(function() {
    'use strict';
    
    console.log('[Tracking Bypass] Early injection script running');
    
    // Store original functions before they can be overridden
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    
    // Override addEventListener to block tracking events
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const trackingEvents = [
            'visibilitychange', 'beforeunload', 'unload', 'blur', 'focus',
            'mouseout', 'mouseleave', 'pagehide', 'pageshow'
        ];
        
        if (trackingEvents.includes(type)) {
            console.log(`[Tracking Bypass] Blocked ${type} event listener on`, this);
            // Return a dummy function to prevent errors
            return function() {};
        }
        
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Override document properties using getters that always return safe values
    function createSafeProperty(obj, prop, value) {
        try {
            Object.defineProperty(obj, prop, {
                get: function() {
                    console.log(`[Tracking Bypass] ${prop} accessed - returning safe value:`, value);
                    return value;
                },
                configurable: true,
                enumerable: true
            });
        } catch (e) {
            console.log(`[Tracking Bypass] Could not override ${prop}:`, e.message);
        }
    }
    
    // Override visibility properties
    createSafeProperty(document, 'hidden', false);
    createSafeProperty(document, 'visibilityState', 'visible');
    
    // Override fullscreen properties
    createSafeProperty(document, 'fullscreenElement', document.documentElement);
    createSafeProperty(document, 'fullscreen', true);
    
    // Override window focus
    createSafeProperty(document, 'hasFocus', function() { return true; });
    
    // Block common tracking function calls
    window.onbeforeunload = null;
    window.onunload = null;
    window.onpagehide = null;
    
    // Override alert functions
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    
    window.alert = function(message) {
        console.log('[Tracking Bypass] Alert suppressed:', message);
        return true;
    };
    
    window.confirm = function(message) {
        console.log('[Tracking Bypass] Confirm auto-accepted:', message);
        return true;
    };
    
    // Override getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = function(constraints) {
            console.log('[Tracking Bypass] Camera access request bypassed');
            return Promise.resolve({
                getTracks: () => [],
                getVideoTracks: () => [],
                getAudioTracks: () => [],
                active: true,
                stop: () => {}
            });
        };
    }
    
    // Override performance timing
    const originalNow = performance.now;
    performance.now = function() {
        return originalNow.call(performance);
    };
    
    // Block fraud detection arrays
    Object.defineProperty(window, 'fraudDetected', {
        get: () => [],
        set: () => {},
        configurable: true
    });
    
    Object.defineProperty(window, 'fraudCheckingQuestions', {
        get: () => [],
        set: () => {},
        configurable: true
    });
    
    // Override mouse tracking functions
    window.onmouseout = null;
    window.onMouseOut = null;
    
    // Create a MutationObserver to catch dynamically added event listeners
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Remove any tracking attributes
                        if (node.onmouseout) node.onmouseout = null;
                        if (node.onbeforeunload) node.onbeforeunload = null;
                        if (node.onunload) node.onunload = null;
                        if (node.onblur) node.onblur = null;
                        if (node.onfocus) node.onfocus = null;
                    }
                });
            }
        });
    });
    
    // Start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });
    
    // Override common tracking methods that might be called
    const trackingMethods = [
        'terminateTest', 'checkFraud', 'detectFraud', 'fraudCheck',
        'onMouseOut', 'trackMouseOut', 'trackVisibility', 'trackFocus'
    ];
    
    trackingMethods.forEach(method => {
        Object.defineProperty(window, method, {
            value: function() {
                console.log(`[Tracking Bypass] ${method} called and bypassed`);
                return false;
            },
            writable: true,
            configurable: true
        });
    });
    
    console.log('[Tracking Bypass] Early injection complete - tracking blocked');
})();
