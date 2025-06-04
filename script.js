const win95Sound = document.getElementById('win95-sound');
const nt4Sound = document.getElementById('nt4-sound');

// Modal Elements
const codeModal = document.getElementById('code-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalDescription = document.getElementById('modal-description');
const modalCssCode = document.getElementById('modal-css-code');
let modalFadeOutTimer = null;

// Speed control elements
let currentPlaybackSpeed = 1.0;
const speedControlTrigger = document.getElementById('speed-control-trigger');
const speedMenu = document.getElementById('speed-menu');
const startButton = document.getElementById('start-button'); // Get start button

if (codeModal) {
  codeModal.classList.add('modal-hidden'); // Ensure class is there
  codeModal.style.pointerEvents = 'none'; // Explicitly set pointer events to none
}

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
  "icon-glitch": { cls: 'glitch-anim', dur: 700 }
};

const animationIcons = document.querySelectorAll('.animate-icon');
animationIcons.forEach(icon => {
  icon.addEventListener('click', e => {
    const id = icon.id;
    const anim = animationMap[id];
    if (anim) {
      icon.classList.add(anim.cls);
      setTimeout(() => icon.classList.remove(anim.cls), anim.dur);
    }
    const desc = icon.dataset.desc || '';
    const css = icon.dataset.css || '';
    showDesktopMessage(desc, css); // This is the small dialog, appears immediately

    // Clear any existing fade-out timer if another icon was clicked quickly
    if (modalFadeOutTimer) {
      clearTimeout(modalFadeOutTimer);
      modalFadeOutTimer = null;
    }
    // If modal is already visible (e.g. from a previous quick click), hide it first without animation
    if (codeModal && !codeModal.classList.contains('modal-hidden')) {
      codeModal.classList.add('modal-hidden');
      codeModal.style.pointerEvents = 'none';
      codeModal.classList.remove('modal-fading-out'); // Remove any lingering fade class
      codeModal.style.opacity = '1'; // Reset opacity
    }

    // Delayed appearance for the main code modal
    setTimeout(() => {
      if (codeModal) {
        modalDescription.textContent = desc;
        modalCssCode.textContent = css;
        codeModal.classList.remove('modal-hidden');
        codeModal.classList.remove('modal-fading-out'); // Ensure not fading if re-opened quickly
        codeModal.style.opacity = '1'; // Reset opacity if it was faded
        codeModal.style.pointerEvents = 'auto';

        // Start auto-fade-out timer
        modalFadeOutTimer = setTimeout(() => {
          if (codeModal && !codeModal.classList.contains('modal-hidden')) { // Check if still visible
            codeModal.classList.add('modal-fading-out');
            // After fade animation, properly hide it
            setTimeout(() => {
              codeModal.classList.add('modal-hidden');
              codeModal.style.pointerEvents = 'none';
              // No need to remove modal-fading-out here, it's removed when modal is shown again
            }, 500); // Must match CSS transition duration
          }
          modalFadeOutTimer = null;
        }, 5000); // 5 seconds to start fading
      }
    }, 1000); // 1 second delay to show modal
  });
});

// Modal Close Logic
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => {
    if (modalFadeOutTimer) {
      clearTimeout(modalFadeOutTimer);
      modalFadeOutTimer = null;
    }
    if (codeModal) {
      codeModal.classList.add('modal-hidden');
      codeModal.style.pointerEvents = 'none';
      codeModal.classList.remove('modal-fading-out'); // Reset fade class
      codeModal.style.opacity = '1'; // Reset opacity for next show
    }
  });
}

if (codeModal) {
  codeModal.addEventListener('click', (event) => {
    if (event.target === codeModal) { // Clicked on the modal backdrop
      if (modalFadeOutTimer) {
        clearTimeout(modalFadeOutTimer);
        modalFadeOutTimer = null;
      }
      codeModal.classList.add('modal-hidden');
      codeModal.style.pointerEvents = 'none';
      codeModal.classList.remove('modal-fading-out'); // Reset fade class
      codeModal.style.opacity = '1'; // Reset opacity for next show
    }
  });
}

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
