const win95Sound = document.getElementById('win95-sound');
const nt4Sound = document.getElementById('nt4-sound');

// Modal Elements
const codeModal = document.getElementById('code-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalDescription = document.getElementById('modal-description');
const modalCssCode = document.getElementById('modal-css-code');

function playStartupSounds() {
  win95Sound.playbackRate = 0.6; nt4Sound.playbackRate = 0.6;
  win95Sound.currentTime = 0; win95Sound.play();
  win95Sound.addEventListener('ended', () => { nt4Sound.currentTime = 0; nt4Sound.play(); }, { once: true });
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
    showDesktopMessage(desc, css);

    // Populate and show the code modal
    if (codeModal) {
      modalDescription.textContent = desc;
      modalCssCode.textContent = css;
      codeModal.classList.remove('modal-hidden');
    }
  });
});

// Modal Close Logic
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => {
    if (codeModal) codeModal.classList.add('modal-hidden');
  });
}

if (codeModal) {
  codeModal.addEventListener('click', (event) => {
    if (event.target === codeModal) { // Clicked on the modal backdrop
      codeModal.classList.add('modal-hidden');
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
