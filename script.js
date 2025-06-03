/* ========= AUDIO SETUP ========= */
const win95Sound = document.getElementById('win95-sound');
const nt4Sound = document.getElementById('nt4-sound');

/**
 * playStartupSounds()
 * Plays Win95 and then NT4 sounds in sequence, slowed down and pitched down.
 */
function playStartupSounds() {
  // Example: slow down playbackRate to 0.5 (half-speed) => pitched down
  win95Sound.playbackRate = 0.6;   // adjust as you like (0.5 = half-speed, 0.8 = slightly slower)
  nt4Sound.playbackRate = 0.6;

  // Play Win95 sound first
  win95Sound.currentTime = 0;
  win95Sound.play();

  // When Win95 finishes, play NT4
  win95Sound.addEventListener('ended', () => {
    nt4Sound.currentTime = 0;
    nt4Sound.play();
  });
}

/* ========= LOGIN TRANSITION ========= */
const loginScreen = document.getElementById('login-screen');
const desktopScreen = document.getElementById('desktop-screen');
const loginForm = document.getElementById('login-form');
let selectedAvatar = null;

// Highlight avatar on click
document.querySelectorAll('.avatar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAvatar = btn.dataset.avatar;
  });
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  // Simple validation: must pick an avatar
  if (!selectedAvatar) {
    alert('Please select an avatar!');
    return;
  }
  // “Logging in...” animation or delay
  loginScreen.style.transition = 'opacity 0.8s';
  loginScreen.style.opacity = '0';
  setTimeout(() => {
    loginScreen.style.display = 'none';
    desktopScreen.style.display = 'block';
    playStartupSounds();
    startClock();
    // Show a quick welcome toast (optional)
    showWelcomePopup();
  }, 800);
});

/* ========= CLOCK IN TOOLBAR ========= */
function startClock() {
  const clockEl = document.getElementById('clock');
  function updateClock() {
    const now = new Date();
    let hrs = now.getHours();
    let mins = now.getMinutes();
    let secs = now.getSeconds();
    // Format as HH:MM:SS
    hrs = hrs < 10 ? '0' + hrs : hrs;
    mins = mins < 10 ? '0' + mins : mins;
    secs = secs < 10 ? '0' + secs : secs;
    clockEl.textContent = `${hrs}:${mins}:${secs}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

/* ========= WELCOME POPUP (FAKES A “TOAST”) ========= */
function showWelcomePopup() {
  const popup = document.createElement('div');
  popup.textContent = `Hello, ${document.getElementById('username').value}!`;
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.right = '20px';
  popup.style.background = '#33691e';
  popup.style.color = '#fff';
  popup.style.padding = '0.5rem 1rem';
  popup.style.borderRadius = '4px';
  popup.style.boxShadow = '0 5px 10px rgba(0,0,0,0.3)';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.5s';
  document.body.appendChild(popup);
  setTimeout(() => { popup.style.opacity = '1'; }, 50);
  setTimeout(() => { popup.style.opacity = '0'; }, 2500);
  setTimeout(() => { document.body.removeChild(popup); }, 3000);
}

/* ========= ICON CLICK ANIMATIONS ========= */
document.getElementById('icon-folder').addEventListener('click', e => {
  e.currentTarget.style.animation = 'bounce 0.5s ease';
  setTimeout(() => { e.currentTarget.style.animation = ''; }, 500);
  alert('“Files” is just a pretend folder—it’s empty for now!');
});

document.getElementById('icon-settings').addEventListener('click', e => {
  e.currentTarget.style.animation = 'bounce 0.5s ease';
  setTimeout(() => { e.currentTarget.style.animation = ''; }, 500);
  alert('Settings panel will appear here in a real OS—but not yet!');
});

/* ========= “LEARN TO CODE” MODAL ========= */
const codeIcon = document.getElementById('icon-code');
const codeModal = document.getElementById('code-modal');
const modalClose = document.getElementById('modal-close');

codeIcon.addEventListener('click', e => {
  e.currentTarget.style.animation = 'bounce 0.5s ease';
  setTimeout(() => { e.currentTarget.style.animation = ''; }, 500);
  codeModal.classList.remove('modal-hidden');
});

modalClose.addEventListener('click', () => {
  codeModal.classList.add('modal-hidden');
});

// Close modal if clicking outside content
window.addEventListener('click', e => {
  if (e.target === codeModal) {
    codeModal.classList.add('modal-hidden');
  }
});
