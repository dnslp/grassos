const win95Sound = document.getElementById('win95-sound');
const nt4Sound = document.getElementById('nt4-sound');

// Speed control elements
let currentPlaybackSpeed = 1.0;
const speedControlTrigger = document.getElementById('speed-control-trigger');
const speedMenu = document.getElementById('speed-menu');
const startButton = document.getElementById('start-button'); // Get start button

// State variables for repeating icon animations
let activeIconIntervalId = null;
let currentlyAnimatingIconElement = null;
let currentAnimationClass = ''; // To easily remove the correct class

// Micro-Paint Application Variables
let artistIcon = null;
let paintModal = null;
let paintModalCloseBtn = null;
let paintCanvas = null;
let paintToolbar = null;
let clearCanvasBtn = null;

let paintCtx = null;
let isPainting = false;
let currentPaintColor = 'black';
let currentBrushSize = 5;
let lastPaintX = 0;
let lastPaintY = 0;

function playStartupSounds() {
  // Ensure audio elements are reset and playbackRate is set
  win95Sound.currentTime = 0;
  win95Sound.playbackRate = currentPlaybackSpeed;
  win95Sound.play();

  nt4Sound.currentTime = 0; // Reset just in case
  nt4Sound.playbackRate = currentPlaybackSpeed;

  // Original logic for sequential play:
  win95Sound.removeEventListener('ended', playNt4SoundAfterWin95); // Remove previous listener if any
  win95Sound.addEventListener('ended', playNt4SoundAfterWin95, { once: true });
}

// Helper function to avoid issues with anonymous functions in event listeners
function playNt4SoundAfterWin95() {
  nt4Sound.currentTime = 0; // Already set, but good practice
  nt4Sound.playbackRate = currentPlaybackSpeed; // Ensure rate is set again if needed
  nt4Sound.play();
}

const loginScreen = document.getElementById('login-screen');
const desktopScreen = document.getElementById('desktop-screen');
const loginForm = document.getElementById('login-form');
// let selectedAvatar = null; // Removed avatar logic
// document.querySelectorAll('.avatar-btn').forEach(btn => { // Removed avatar logic
//   btn.addEventListener('click', () => { // Removed avatar logic
//     document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected')); // Removed avatar logic
//     btn.classList.add('selected'); selectedAvatar = btn.dataset.avatar; // Removed avatar logic
//   }); // Removed avatar logic
// }); // Removed avatar logic
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  // if (!selectedAvatar) { alert('Please select an avatar!'); return; } // Removed avatar check
  loginScreen.style.transition = 'opacity 0.8s';
  loginScreen.style.opacity = '0';
  setTimeout(() => {
    loginScreen.style.display = 'none';
    desktopScreen.style.display = 'block';
    playStartupSounds();
    startClock();
    showWelcomePopup();

    const usernameValue = document.getElementById('username').value;
    const usernameDisplayElement = document.getElementById('desktop-username-display');
    if (usernameDisplayElement && usernameValue) {
      usernameDisplayElement.textContent = `User: ${usernameValue}`;
    }
    initializePaintApp(); // Initialize Paint App once desktop is ready
  }, 800);
});


/* CLOCK */
function startClock() {
  const clockEl = document.getElementById('clock');
  function updateClock() {
    const now = new Date();
    let hrs = now.getHours(), mins = now.getMinutes(), secs = now.getSeconds();
    hrs = hrs < 10 ? '0' + hrs : hrs; mins = mins < 10 ? '0' + mins : mins; secs = secs < 10 ? '0' + secs : secs;
    clockEl.textContent = `${hrs}:${mins}:${secs}`;
  }
  updateClock(); setInterval(updateClock, 1000);
}

/* Toast popup */
function showWelcomePopup() {
  const popup = document.createElement('div');
  popup.textContent = `Hello, ${document.getElementById('username').value}!`;
  popup.className = 'welcome-popup retro-popup'; // Added a class
  popup.style.position = 'fixed'; popup.style.bottom = '20px'; popup.style.right = '20px';
  // popup.style.background = '#33691e'; // Remove this
  // popup.style.color = '#fff'; // Remove this
  popup.style.padding = '0.5rem 1rem';
  popup.style.borderRadius = '4px'; popup.style.boxShadow = '0 5px 10px rgba(0,0,0,0.3)';
  popup.style.opacity = '0'; popup.style.transition = 'opacity 0.5s';
  document.body.appendChild(popup);
  setTimeout(() => { popup.style.opacity = '1'; }, 50);
  setTimeout(() => { popup.style.opacity = '0'; }, 2500);
  setTimeout(() => { if (popup.parentElement) popup.parentElement.removeChild(popup); }, 3000);
}

/* Animation icon logic */
const animationMap = {
  "icon-wiggle": { cls: 'wiggle-anim', dur: 600 },
  "icon-scale": { cls: 'pulse-anim', dur: 800 },
  "icon-hue": { cls: 'hue-anim', dur: 2000 },
  "icon-rotate": { cls: 'rotate-anim', dur: 900 },
  "icon-skew": { cls: 'skew-anim', dur: 700 },
  "icon-shadow": { cls: 'shadow-anim', dur: 1100 },
  "icon-border": { cls: 'border-anim', dur: 1000 },
  "icon-sparkle": { cls: 'sparkle-anim', dur: 1000 },
  "icon-fade": { cls: 'fade-anim', dur: 800 },
  "icon-jelly": { cls: 'jelly-anim', dur: 1000 },
  "icon-glitch": { cls: 'glitch-anim', dur: 700 },
  "icon-tada": { cls: 'tada-anim', dur: 1000 },
  "icon-swing": { cls: 'swing-anim', dur: 1000 },
  "icon-rubberBand": { cls: 'rubberBand-anim', dur: 1000 },
  "icon-heartBeat": { cls: 'heartBeat-anim', dur: 1300 },
  "icon-customZoom": { cls: 'customZoomEffect-anim', dur: 1000 }
};

const animationIcons = document.querySelectorAll('.animate-icon');
animationIcons.forEach(icon => {
  icon.addEventListener('click', e => {
    const clickedIconEl = e.currentTarget;

    if (clickedIconEl.id === 'icon-artist') {
      // The 'icon-artist' click is handled separately by initializePaintApp to open the modal
      // It should not use the repeating animation logic
      return;
    }

    const iconId = clickedIconEl.id;
    const animData = animationMap[iconId];

    if (!animData && clickedIconEl.id !== 'icon-artist') return; // Check animData only if not artist icon

    const newAnimationClass = animData.cls;
    const animDuration = animData.dur;

    // Stop any currently playing animation
    if (activeIconIntervalId) {
      clearInterval(activeIconIntervalId);
      if (currentlyAnimatingIconElement && currentAnimationClass) {
        currentlyAnimatingIconElement.classList.remove(currentAnimationClass);
      }
    }

    // If the clicked icon was the one already animating, toggle it off and stop
    if (currentlyAnimatingIconElement === clickedIconEl) {
      activeIconIntervalId = null;
      currentlyAnimatingIconElement = null;
      currentAnimationClass = '';
      // Display system message even when toggling off (optional, but consistent)
      const descOff = clickedIconEl.dataset.desc || '';
      const cssOff = clickedIconEl.dataset.css || '';
      showDesktopMessage(`Stopped: ${descOff}`, cssOff);
      return;
    }

    // Start new animation for the clicked icon
    currentlyAnimatingIconElement = clickedIconEl;
    currentAnimationClass = newAnimationClass;

    const triggerAnimationCycle = () => {
      // Remove class to allow re-triggering animation
      clickedIconEl.classList.remove(newAnimationClass);
      // Short timeout to ensure class removal is processed for reflow
      setTimeout(() => {
        clickedIconEl.classList.add(newAnimationClass);
      }, 20); // Small delay like 20ms
    };

    triggerAnimationCycle(); // Initial animation trigger
    activeIconIntervalId = setInterval(triggerAnimationCycle, animDuration + 500);

    // Display system message
    const descOn = clickedIconEl.dataset.desc || '';
    const cssOn = clickedIconEl.dataset.css || '';
    showDesktopMessage(descOn, cssOn);
  });
});

/* Desktop message logic */
function showDesktopMessage(text, cssCode) {
  const msgBox = document.getElementById('desktop-message');
  msgBox.querySelector('.desc').textContent = text;
  msgBox.querySelector('.css-code').textContent = cssCode;
  msgBox.style.opacity = '1';
  clearTimeout(msgBox._hideTimer);
  msgBox._hideTimer = setTimeout(() => { msgBox.style.opacity = '0'; }, 5000);
}

/* (Optional) Auto-show a fun message when you click anywhere on the grass */
document.getElementById('desktop-area').addEventListener('click', e => {
  if (e.target.classList.contains('icon') || e.target.classList.contains('icon-img')) return;
  showDesktopMessage('Click an icon to try out a CSS animation!', '');
});

// Dropdown Toggle Logic
if (speedControlTrigger && speedMenu) {
  speedControlTrigger.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from immediately closing if we add window click listener
    speedMenu.classList.toggle('speed-menu-hidden');
  });

  // Optional: Close menu if clicked outside
  window.addEventListener('click', () => {
    if (!speedMenu.classList.contains('speed-menu-hidden')) {
      speedMenu.classList.add('speed-menu-hidden');
    }
  });
}

// Speed Selection Logic
if (speedMenu) {
  const speedOptions = speedMenu.querySelectorAll('li[data-speed]');
  speedOptions.forEach(option => {
    option.addEventListener('click', () => {
      currentPlaybackSpeed = parseFloat(option.dataset.speed);
      if (speedControlTrigger) {
        const speedText = option.textContent;
        speedControlTrigger.textContent = `Speed: ${speedText} ▾`;
      }
      speedMenu.classList.add('speed-menu-hidden');
    });
  });
}

// Event Listener for Start Button
if (startButton) {
  startButton.addEventListener('click', () => {
    playStartupSounds(); // Call the existing function
  });
}

// Micro-Paint Application Functions
function initializePaintApp() {
  // Assign to global lets so other functions can use them
  artistIcon = document.getElementById('icon-artist');
  paintModal = document.getElementById('paint-modal');
  paintModalCloseBtn = document.getElementById('paint-modal-close');
  paintCanvas = document.getElementById('paint-canvas');
  paintToolbar = document.getElementById('paint-toolbar');
  clearCanvasBtn = document.getElementById('clear-canvas-button');

  if (!paintCanvas) { // Critical check after attempting to get element
      // console.error("Paint canvas not found during init!"); // Debugging thought
      return;
  }
  paintCtx = paintCanvas.getContext('2d');

  // Set initial canvas size dynamically when modal opens (see openPaintModal)
  // For now, set default drawing style
  paintCtx.strokeStyle = currentPaintColor;
  paintCtx.lineWidth = currentBrushSize;
  paintCtx.lineCap = 'round'; // Rounded line ends
  paintCtx.lineJoin = 'round'; // Rounded line joins

  // Event Listeners for Drawing on Canvas
  paintCanvas.addEventListener('mousedown', startPainting);
  paintCanvas.addEventListener('mousemove', drawPainting);
  paintCanvas.addEventListener('mouseup', stopPainting);
  paintCanvas.addEventListener('mouseleave', stopPainting); // Stop if mouse leaves canvas

  // Event Listeners for Controls
  if (paintToolbar) { // Check if paintToolbar exists
    const colorSwatches = paintToolbar.querySelectorAll('.paint-color');
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        currentPaintColor = e.target.dataset.color;
        if (paintCtx) paintCtx.strokeStyle = currentPaintColor;
        // Update selected state
        colorSwatches.forEach(s => s.classList.remove('selected-color'));
        e.target.classList.add('selected-color');
      });
    });
    // Set initial selected color
    const initialColorSwatch = paintToolbar.querySelector(`.paint-color[data-color="${currentPaintColor}"]`);
    if (initialColorSwatch) initialColorSwatch.classList.add('selected-color');


    const brushSizeBtns = paintToolbar.querySelectorAll('.paint-brush-size');
    brushSizeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentBrushSize = parseInt(e.target.dataset.size, 10);
        if (paintCtx) paintCtx.lineWidth = currentBrushSize;
        // Update selected state
        brushSizeBtns.forEach(b => b.classList.remove('selected-brush'));
        e.target.classList.add('selected-brush');
      });
    });
    // Set initial selected brush
    const initialBrushButton = paintToolbar.querySelector(`.paint-brush-size[data-size="${currentBrushSize}"]`);
    if (initialBrushButton) initialBrushButton.classList.add('selected-brush');
  }


  if (clearCanvasBtn) {
    clearCanvasBtn.addEventListener('click', () => {
      if (paintCtx) paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    });
  }

  // Modal Open/Close
  if (artistIcon && paintModal) { // This check remains important
    artistIcon.addEventListener('click', () => {
      // Provide one-shot animation feedback
      const feedbackAnimClass = 'pulse-anim';
      const feedbackAnimData = animationMap['icon-scale']; // 'icon-scale' uses 'pulse-anim'

      if (feedbackAnimData && feedbackAnimData.cls === feedbackAnimClass) {
        artistIcon.classList.add(feedbackAnimClass);
        setTimeout(() => {
          artistIcon.classList.remove(feedbackAnimClass);
        }, feedbackAnimData.dur); // Use duration from animationMap
      } else {
        // Fallback if pulse-anim or its data is not found as expected
        artistIcon.classList.add('pulse-anim'); // Apply class directly
        setTimeout(() => {
          artistIcon.classList.remove('pulse-anim');
        }, 600); // Default duration
      }

      // Show system message for artist icon
      const desc = artistIcon.dataset.desc || '';
      // The data-css for icon-artist was a placeholder: "/* CSS for a Paint-like app would be extensive. This is a placeholder. */"
      // This is fine for display.
      const css = artistIcon.dataset.css || '';
      showDesktopMessage(desc, css);

      openPaintModal();
    });
  }
  if (paintModalCloseBtn && paintModal) {
    paintModalCloseBtn.addEventListener('click', closePaintModal);
  }
  if (paintModal) {
    paintModal.addEventListener('click', (event) => {
      if (event.target === paintModal) {
        closePaintModal();
      }
    });
  }
}

function sizePaintCanvas() {
  if (!paintCanvas || !paintCtx) return;
  const rect = paintCanvas.getBoundingClientRect();
  paintCanvas.width = rect.width;
  paintCanvas.height = rect.height;
  paintCtx.strokeStyle = currentPaintColor;
  paintCtx.lineWidth = currentBrushSize;
  paintCtx.lineCap = 'round';
  paintCtx.lineJoin = 'round';
}

function openPaintModal() {
  if (paintModal) {
    paintModal.classList.remove('paint-app-hidden');
    paintModal.style.pointerEvents = 'auto';
    setTimeout(sizePaintCanvas, 0);
  }
}

function closePaintModal() {
  if (paintModal) {
    paintModal.classList.add('paint-app-hidden');
    paintModal.style.pointerEvents = 'none';
  }
}

function startPainting(e) {
  if (!paintCtx) return;
  isPainting = true;
  [lastPaintX, lastPaintY] = [e.offsetX, e.offsetY];
  paintCtx.beginPath();
  paintCtx.moveTo(lastPaintX, lastPaintY);
}

function drawPainting(e) {
  if (!isPainting || !paintCtx) return;
  const currentX = e.offsetX;
  const currentY = e.offsetY;
  paintCtx.lineTo(currentX, currentY);
  paintCtx.stroke();
  [lastPaintX, lastPaintY] = [currentX, currentY];
}

function stopPainting() {
  if (!isPainting) return;
  isPainting = false;
}
