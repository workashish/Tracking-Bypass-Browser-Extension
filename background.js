// Background script for tracking bypass extension
chrome.runtime.onInstalled.addListener(function(details) {
    console.log('[Tracking Bypass] Extension installed');
    
    // Set default configuration on install
    const defaultConfig = {
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

    // Only set defaults if this is a fresh install
    if (details.reason === 'install') {
        chrome.storage.sync.set(defaultConfig, function() {
            console.log('[Tracking Bypass] Default configuration set');
        });
    }
});

// Listen for tab updates to inject scripts
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && tab.url) {
        // Skip chrome:// and extension pages
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
            return;
        }

        // Get current configuration and inject if needed
        chrome.storage.sync.get(null, function(config) {
            const hasActiveBypass = Object.values(config).some(value => value);
            
            if (hasActiveBypass) {
                // Update badge to show extension is active
                chrome.action.setBadgeText({
                    text: 'ON',
                    tabId: tabId
                });
                chrome.action.setBadgeBackgroundColor({
                    color: '#4CAF50',
                    tabId: tabId
                });
            } else {
                chrome.action.setBadgeText({
                    text: '',
                    tabId: tabId
                });
            }
        });
    }
});

// Listen for storage changes to update badge
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync') {
        // Update badge for all tabs
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function(tab) {
                updateTabBadge(tab.id);
            });
        });
    }
});

function updateTabBadge(tabId) {
    chrome.storage.sync.get(null, function(config) {
        const activeCount = Object.values(config).filter(value => value).length;
        
        if (activeCount === 0) {
            chrome.action.setBadgeText({
                text: '',
                tabId: tabId
            });
        } else {
            chrome.action.setBadgeText({
                text: activeCount.toString(),
                tabId: tabId
            });
            chrome.action.setBadgeBackgroundColor({
                color: '#4CAF50',
                tabId: tabId
            });
        }
    });
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'GET_CONFIG') {
        chrome.storage.sync.get(null, function(config) {
            sendResponse(config);
        });
        return true; // Keep message channel open for async response
    }
    
    if (request.type === 'LOG_BYPASS') {
        console.log(`[Tracking Bypass] ${request.message}`);
    }
    
    if (request.type === 'UPDATE_BADGE') {
        updateTabBadge(sender.tab.id);
    }
});

// Context menu for quick access (check if API is available)
if (chrome.contextMenus) {
    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        if (info.menuItemId === 'toggleBypass') {
            // Toggle all bypass features
            chrome.storage.sync.get(null, function(config) {
                const allActive = Object.values(config).every(value => value);
                const newState = !allActive;

                const updateObj = {};
                Object.keys(config).forEach(key => {
                    updateObj[key] = newState;
                });

                chrome.storage.sync.set(updateObj, function() {
                    console.log(`[Tracking Bypass] All features ${newState ? 'enabled' : 'disabled'}`);
                });
            });
        }
    });

    // Create context menu on startup
    chrome.runtime.onStartup.addListener(function() {
        createContextMenu();
    });

    chrome.runtime.onInstalled.addListener(function() {
        createContextMenu();
    });

    function createContextMenu() {
        chrome.contextMenus.removeAll(function() {
            chrome.contextMenus.create({
                id: 'toggleBypass',
                title: 'Toggle Tracking Bypass',
                contexts: ['page']
            });
        });
    }
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle-bypass') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tab = tabs[0];
            
            chrome.storage.sync.get(null, function(config) {
                const allActive = Object.values(config).every(value => value);
                const newState = !allActive;
                
                const updateObj = {};
                Object.keys(config).forEach(key => {
                    updateObj[key] = newState;
                });
                
                chrome.storage.sync.set(updateObj, function() {
                    // Show notification
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/icon48.png',
                        title: 'Tracking Bypass',
                        message: `Protection ${newState ? 'enabled' : 'disabled'}`
                    });
                });
            });
        });
    }
});

// Monitor for specific tracking patterns and log them
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        // Log potential tracking requests
        if (details.url.includes('track') || details.url.includes('analytics') || 
            details.url.includes('monitor') || details.url.includes('fraud')) {
            console.log(`[Tracking Bypass] Potential tracking request detected: ${details.url}`);
        }
    },
    {urls: ["<all_urls>"]},
    ["requestBody"]
);

// Clean up on extension disable/uninstall
chrome.runtime.onSuspend.addListener(function() {
    console.log('[Tracking Bypass] Extension suspended');
});

console.log('[Tracking Bypass] Background script loaded');
