// Enhanced popup script for tracking bypass extension
document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    const statusElement = document.getElementById('status');
    const activeCountElement = document.getElementById('activeCount');
    const totalCountElement = document.getElementById('totalCount');
    const statusIndicatorElement = document.getElementById('statusIndicator');
    const enableAllBtn = document.getElementById('enableAll');
    const disableAllBtn = document.getElementById('disableAll');
    const resetDefaultsBtn = document.getElementById('resetDefaults');

    // Default configuration
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

    // Initialize UI with animations
    function initializeUI() {
        // Add staggered animation to categories
        const categories = document.querySelectorAll('.category');
        categories.forEach((category, index) => {
            category.style.animationDelay = `${index * 0.1}s`;
            category.classList.add('fade-in');
        });
    }

    // Load current settings
    chrome.storage.sync.get(defaultConfig, function(result) {
        updateUI(result);
        updateStatus(result);
        updateStats(result);
        initializeUI();
    });

    // Add click listeners to toggle switches with enhanced feedback
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const setting = this.dataset.setting;
            const isActive = this.classList.contains('active');

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Toggle the setting
            const newValue = !isActive;

            // Update UI immediately with smooth transition
            this.classList.toggle('active', newValue);

            // Save to storage
            const updateObj = {};
            updateObj[setting] = newValue;

            chrome.storage.sync.set(updateObj, function() {
                console.log(`Setting ${setting} updated to ${newValue}`);

                // Update status and stats
                chrome.storage.sync.get(defaultConfig, function(result) {
                    updateStatus(result);
                    updateStats(result);
                });
            });
        });

        // Add hover effects
        toggle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        toggle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    function updateUI(config) {
        toggleSwitches.forEach(toggle => {
            const setting = toggle.dataset.setting;
            const isActive = config[setting];
            toggle.classList.toggle('active', isActive);
        });
    }

    function updateStats(config) {
        const activeCount = Object.values(config).filter(value => value).length;
        const totalCount = Object.keys(config).length;

        // Update stats with animation
        animateNumber(activeCountElement, parseInt(activeCountElement.textContent) || 0, activeCount);
        totalCountElement.textContent = totalCount;

        // Update status indicator
        if (activeCount === 0) {
            statusIndicatorElement.textContent = '●';
            statusIndicatorElement.style.color = '#ef4444';
        } else if (activeCount === totalCount) {
            statusIndicatorElement.textContent = '●';
            statusIndicatorElement.style.color = '#4ade80';
        } else {
            statusIndicatorElement.textContent = '●';
            statusIndicatorElement.style.color = '#f59e0b';
        }
    }

    function updateStatus(config) {
        const activeCount = Object.values(config).filter(value => value).length;
        const totalCount = Object.keys(config).length;

        let statusText, statusIcon, statusClass;

        if (activeCount === 0) {
            statusText = 'All Protections Disabled';
            statusIcon = 'fas fa-shield-alt';
            statusClass = 'status';
        } else if (activeCount === totalCount) {
            statusText = 'Full Protection Active';
            statusIcon = 'fas fa-shield-check';
            statusClass = 'status active';
        } else {
            statusText = `${activeCount}/${totalCount} Protections Active`;
            statusIcon = 'fas fa-shield-halved';
            statusClass = 'status active';
        }

        statusElement.innerHTML = `<i class="${statusIcon} status-icon"></i>${statusText}`;
        statusElement.className = statusClass + ' fade-in';
    }

    function animateNumber(element, from, to) {
        const duration = 500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.round(from + (to - from) * easeOutCubic(progress));
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Quick action buttons
    enableAllBtn.addEventListener('click', function() {
        const updateObj = {};
        Object.keys(defaultConfig).forEach(key => {
            updateObj[key] = true;
        });

        chrome.storage.sync.set(updateObj, function() {
            chrome.storage.sync.get(defaultConfig, function(result) {
                updateUI(result);
                updateStatus(result);
                updateStats(result);
            });
        });

        // Visual feedback
        this.style.background = 'rgba(74, 222, 128, 0.2)';
        setTimeout(() => {
            this.style.background = '';
        }, 200);
    });

    disableAllBtn.addEventListener('click', function() {
        const updateObj = {};
        Object.keys(defaultConfig).forEach(key => {
            updateObj[key] = false;
        });

        chrome.storage.sync.set(updateObj, function() {
            chrome.storage.sync.get(defaultConfig, function(result) {
                updateUI(result);
                updateStatus(result);
                updateStats(result);
            });
        });

        // Visual feedback
        this.style.background = 'rgba(239, 68, 68, 0.2)';
        setTimeout(() => {
            this.style.background = '';
        }, 200);
    });

    resetDefaultsBtn.addEventListener('click', function() {
        chrome.storage.sync.set(defaultConfig, function() {
            updateUI(defaultConfig);
            updateStatus(defaultConfig);
            updateStats(defaultConfig);
        });

        // Visual feedback
        this.style.background = 'rgba(59, 130, 246, 0.2)';
        setTimeout(() => {
            this.style.background = '';
        }, 200);
    });

    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+D to toggle all protections
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleAllProtections();
        }

        // Ctrl+Shift+R to reset to defaults
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            resetDefaultsBtn.click();
        }

        // Escape to close popup
        if (e.key === 'Escape') {
            window.close();
        }
    });

    function toggleAllProtections() {
        chrome.storage.sync.get(defaultConfig, function(result) {
            const allActive = Object.values(result).every(value => value);
            const newState = !allActive;

            const updateObj = {};
            Object.keys(defaultConfig).forEach(key => {
                updateObj[key] = newState;
            });

            chrome.storage.sync.set(updateObj, function() {
                updateUI(updateObj);
                updateStatus(updateObj);
                updateStats(updateObj);
            });
        });
    }

    // Enhanced visual feedback for all interactive elements
    const allButtons = document.querySelectorAll('.quick-btn, .toggle-switch, .stat-item');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('toggle-switch')) {
                this.style.transform = 'translateY(-2px)';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('toggle-switch')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Add ripple CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Apply ripple effect to buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    // Monitor tab changes to update status (if API is available)
    if (chrome.tabs && chrome.tabs.onActivated) {
        chrome.tabs.onActivated.addListener(function(activeInfo) {
            // Refresh status when tab changes
            chrome.storage.sync.get(defaultConfig, function(result) {
                updateStatus(result);
                updateStats(result);
            });
        });
    }

    // Add smooth scroll behavior for long content
    document.documentElement.style.scrollBehavior = 'smooth';

    // Performance monitoring
    const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure') {
                console.log(`[Performance] ${entry.name}: ${entry.duration}ms`);
            }
        }
    });

    if (typeof PerformanceObserver !== 'undefined') {
        performanceObserver.observe({ entryTypes: ['measure'] });
    }

    console.log('[Tracking Bypass Pro] Enhanced popup loaded with modern UI');
});
