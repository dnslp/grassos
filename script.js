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
    const clickedIconEl = e.currentTarget; // Use currentTarget for the element listener is attached to
    const iconId = clickedIconEl.id;
    const animData = animationMap[iconId];

    if (!animData) return; // Should not happen if map is correct

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
