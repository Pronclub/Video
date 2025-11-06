"use strict";

// Ad links
const adLinks = [
                    "https://eminencehillsidenutrition.com/s5v92wjc11?key=b1d1b7fc017831ec983c6d1aae5b5628",
                    "https://eminencehillsidenutrition.com/h8junpek?key=26fe0739e1e80a8ffa5ecfab44189a38",
                    "https://eminencehillsidenutrition.com/dw7tr9ztu1?key=0a50f02fa82b9007f3f30efcc3464991",
                    "https://eminencehillsidenutrition.com/wydvnkk8?key=f309dfb4ebd925293f0da3da6dbccfe9",
                    "https://eminencehillsidenutrition.com/dv4carz8?key=ace1ef81105d316bb3ea53f6c9904802"
];

// Direct link for first click
const directLink = "https://otieu.com/4/9835089"; //... Share Account Ads Link ...//

// Popunder links (used by triggerPopunder)
const popunderLinks = [
  directLink
];

// State variables
let clickCount = 0;
let requiredClicks = Math.floor(Math.random() * 3) + 4; // 1 or 1
let adsCompleted = false;
let hasTriggeredPopunder = false;

// DOM Elements (will be initialized when DOM is ready)
let adBlockerOverlay;
let adCounterText;
let adCounterDisplay;
let adClickBtn;
let videoContainer;
let videoWrapper;
let episodesSection;
let videoFrame;

// Initialize DOM elements
function initializeDOMElements() {
  adBlockerOverlay = document.getElementById('adBlockerOverlay');
  adCounterText = document.getElementById('adCounterText');
  adCounterDisplay = document.getElementById('adCounterDisplay');
  adClickBtn = document.getElementById('adClickBtn');
  videoContainer = document.getElementById('videoContainer');
  videoWrapper = document.getElementById('videoWrapper');
  episodesSection = document.getElementById('episodesSection');
  videoFrame = document.getElementById('videoFrame');
}

function getRandomAd() {
  const randomIndex = Math.floor(Math.random() * adLinks.length);
  return adLinks[randomIndex];
}

function getRandomPopunder() {
  const randomIndex = Math.floor(Math.random() * popunderLinks.length);
  return popunderLinks[randomIndex];
}

function triggerPopunder() {
  if (hasTriggeredPopunder) return;

  const popunderUrl = getRandomPopunder();
  const popunder = window.open(popunderUrl, '_blank', 'width=1,height=1,left=10000,top=10000');

  if (popunder) {
    try {
      popunder.blur();
      window.focus();
      setTimeout(() => {
        try { popunder.close(); } catch(e) {}
      }, 100);
    } catch(e) {}
  }

  hasTriggeredPopunder = true;
}

function updateAdCounter() {
  if (!adCounterText || !adCounterDisplay) return;
  
  const remaining = requiredClicks - clickCount;
  adCounterText.textContent = `${clickCount} / ${requiredClicks} ads ක්ලික් කර ඇත`;
  adCounterDisplay.textContent = `${clickCount} / ${requiredClicks}`;
  
  if (clickCount >= requiredClicks) {
    adCounterText.textContent = `සියලු ads ක්ලික් කර ඇත! 🎉`;
    adCounterDisplay.textContent = `පූර්ණයි!`;
  }
}

function openAd() {
  if (clickCount >= requiredClicks) return;

  clickCount++;
  const randomAd = clickCount === 1 ? directLink : getRandomAd();
  const adWindow = window.open(randomAd, '_blank');

  // Try to focus back on main window
  setTimeout(() => {
    try {
      if (adWindow) {
        adWindow.blur();
      }
      window.focus();
    } catch(e) {}
  }, 100);

  updateAdCounter();

  if (clickCount >= requiredClicks) {
    adsCompleted = true;
    unlockContent();
    updateVideoAccess();
    triggerPopunder();
    
    // Remove page click listener after ads completed
    document.removeEventListener('click', handlePageClick, true);
  }
}

function unlockContent() {
  // Hide overlay completely
  if (adBlockerOverlay) {
    adBlockerOverlay.classList.add('hidden');
    adBlockerOverlay.style.pointerEvents = 'none';
    adBlockerOverlay.style.display = 'none';
  }
  
  // Remove blocking flags (though no visual effect)
  if (videoContainer) {
    videoContainer.classList.remove('blocked');
  }
  if (episodesSection) {
    episodesSection.classList.remove('blocked');
  }

  // Enable video access immediately
  updateVideoAccess();
  
  // Force enable video interaction after a small delay to ensure everything is ready
  setTimeout(() => {
    if (videoFrame) {
      videoFrame.style.pointerEvents = 'auto';
      videoFrame.style.cursor = 'pointer';
    }
    if (videoWrapper) {
      videoWrapper.style.pointerEvents = 'auto';
      videoWrapper.style.cursor = 'pointer';
    }
    if (videoContainer) {
      videoContainer.style.pointerEvents = 'auto';
    }
  }, 100);

  // Load video after ads completed
  if (window.loadVideoAfterAds) {
    window.loadVideoAfterAds();
  }
}

function blockContent() {
  // Hide overlay initially (transparent, no visual blocking)
  if (adBlockerOverlay) {
    adBlockerOverlay.classList.add('hidden');
  }
  
  // Mark as blocked but no visual effect - video appears normal
  if (videoContainer) {
    videoContainer.classList.add('blocked');
  }
  if (episodesSection) {
    episodesSection.classList.add('blocked');
  }

  // Load video but prevent autoplay - user can see it but can't play until ads done
}

// Reset ads system - called when new episode is loaded
function resetAdsSystem() {
  clickCount = 0;
  requiredClicks = Math.floor(Math.random() * 2) + 1; // 1 or 2
  adsCompleted = false;
  hasTriggeredPopunder = false;
  
  // Re-initialize DOM elements in case they changed
  initializeDOMElements();
  
  // Block content again
  blockContent();
  updateAdCounter();
  
  // Block video access again
  if (videoFrame) {
    videoFrame.style.pointerEvents = 'none';
  }
  if (videoWrapper) {
    videoWrapper.style.pointerEvents = 'none';
  }
  if (videoContainer) {
    videoContainer.style.pointerEvents = 'none';
  }
  
  // Re-add event listeners
  setupAdClickListeners();
}

// Setup ad click listeners for whole page
function setupAdClickListeners() {
  // Remove existing listeners first (if any)
  try {
    document.removeEventListener('click', handlePageClick, true);
  } catch(e) {}
  
  // Add new listener only if ads not completed
  if (!adsCompleted) {
    document.addEventListener('click', handlePageClick, true);
  }
}

// Handle clicks anywhere on the page
function handlePageClick(event) {
  if (adsCompleted) return;
  
  // Allow header clicks
  if (event.target.closest('.header')) {
    return;
  }
  
  // Allow share/whatsapp buttons
  if (event.target.closest('.btn') && 
      (event.target.closest('#share-btn') || 
       event.target.closest('.telegram-icon') ||
       event.target.closest('.btn-icon'))) {
    return;
  }
  
  // Allow video area clicks if ads are completed (shouldn't reach here, but safety check)
  if (adsCompleted && (
      event.target.closest('#videoWrapper') ||
      event.target.closest('#videoFrame') ||
      event.target.closest('.video-player-wrapper')
  )) {
    return;
  }
  
  // Allow episode card clicks - they will load and reset ads system
  const episodeCard = event.target.closest('.episode-card');
  if (episodeCard) {
    // Episode click will be handled by VideoPlayerManager
    // which will call resetAdsSystem after loading
    return;
  }
  
  // Open ad for any other click on the page
  event.preventDefault();
  event.stopPropagation();
  openAd();
  return false;
}

// Update iframe pointer events when ads completed
function updateVideoAccess() {
  if (videoFrame) {
    videoFrame.style.pointerEvents = adsCompleted ? 'auto' : 'none';
    // Ensure video wrapper also allows clicks
    if (videoWrapper) {
      videoWrapper.style.pointerEvents = adsCompleted ? 'auto' : 'none';
    }
    // Ensure video container allows clicks
    if (videoContainer) {
      videoContainer.style.pointerEvents = adsCompleted ? 'auto' : 'none';
    }
  }
}

// Initialize ads system
function initializeAdsSystem() {
  // Initialize DOM elements
  initializeDOMElements();
  
  // Update counter
  updateAdCounter();
  
  // Block content
  blockContent();
  
  // Setup click listeners
  setupAdClickListeners();
  
  // Set initial video access (blocked)
  setTimeout(() => {
    if (videoFrame) {
      videoFrame.style.pointerEvents = 'none';
    }
    if (videoWrapper) {
      videoWrapper.style.pointerEvents = 'none';
    }
    if (videoContainer) {
      videoContainer.style.pointerEvents = 'none';
    }
  }, 1000);

  // Block video iframe pointer events until ads completed
  if (videoFrame) {
    // Intercept iframe clicks through wrapper
    videoFrame.style.pointerEvents = adsCompleted ? 'auto' : 'none';
    if (videoWrapper) {
      videoWrapper.style.pointerEvents = adsCompleted ? 'auto' : 'none';
    }
    if (videoContainer) {
      videoContainer.style.pointerEvents = adsCompleted ? 'auto' : 'none';
    }
  }

  // Initial popup after 30 seconds
  setTimeout(() => {
    if (!adsCompleted) {
      const randomAd = getRandomAd();
      const adWindow = window.open(randomAd, '_blank');

      setTimeout(() => {
        try {
          if (adWindow) {
            adWindow.blur();
          }
          window.focus();
        } catch(e) {}
      }, 100);
    }
  }, 30000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAdsSystem);
} else {
  // DOM already loaded
  initializeAdsSystem();
}

// Expose resetAdsSystem globally so it can be called from other scripts
window.resetAdsSystem = resetAdsSystem;

