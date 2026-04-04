// ── Password check ──
const CORRECT = 'mjheartkriss';

function checkPassword() {
    const input = document.getElementById('password-input').value.trim();
    const err = document.getElementById('error-msg');
    if (input === CORRECT) {
        document.getElementById('password-screen').classList.add('hide');
        setTimeout(() => {
            document.getElementById('password-screen').style.display = 'none';
            document.getElementById('album').classList.add('visible');
            spawnBerries();
            observeCards();
            document.getElementById('music-player').classList.add('visible');
            startMusic();
        }, 800);
    } else {
        err.classList.add('show');
        document.getElementById('password-input').value = '';
        document.getElementById('password-input').focus();
        setTimeout(() => err.classList.remove('show'), 2500);
    }
}

document.getElementById('password-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPassword();
});

// ── Scroll reveal ──
function observeCards() {
    const cards = document.querySelectorAll('.photo-card');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    cards.forEach(c => io.observe(c));
}

// ── Floating strawberries ──
function spawnBerries() {
    const emojis = ['🍓', '🌸', '💕', '✨'];
    setInterval(() => {
        const el = document.createElement('div');
        el.classList.add('floating-berry');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (8 + Math.random() * 10) + 's';
        el.style.animationDelay = '0s';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 20000);
    }, 2200);
}

// ── Music Player ──
const songs = [
    { src: 'songs2/Soft Spot - Keshi.mp3', title: 'Soft Spot', artist: 'keshi' },
    { src: 'songs2/UNDERSTAND - Keshi.mp3', title: 'UNDERSTAND', artist: 'keshi' }
];

let currentIndex = 0;
let isPlaying = false;
const audio = new Audio();

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startMusic() {
    shuffle(songs);
    loadSong(0);
    audio.play().then(() => {
        isPlaying = true;
        updatePlayBtn();
    }).catch(() => {});
}

function loadSong(index) {
    currentIndex = index;
    audio.src = songs[currentIndex].src;
    updateSongInfo();
    updateProgress();
}

function updateSongInfo() {
    document.getElementById('song-title').textContent = songs[currentIndex].title;
    document.getElementById('song-artist').textContent = songs[currentIndex].artist;
}

function updatePlayBtn() {
    const btn = document.getElementById('play-btn');
    btn.textContent = isPlaying ? '⏸' : '▶';
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
    updatePlayBtn();
}

function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) audio.play();
}

function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) audio.play();
}

audio.addEventListener('ended', nextSong);
audio.addEventListener('timeupdate', updateProgress);

function updateProgress() {
    const bar = document.getElementById('progress-bar');
    const current = document.getElementById('current-time');
    const duration = document.getElementById('duration');
    if (audio.duration) {
        bar.value = (audio.currentTime / audio.duration) * 100;
        current.textContent = formatTime(audio.currentTime);
        duration.textContent = formatTime(audio.duration);
    }
}

function seek(val) {
    if (audio.duration) {
        audio.currentTime = (val / 100) * audio.duration;
    }
}

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ── Draggable player ──
const player = document.getElementById('music-player');
let dragging = false;
let startX, startY, origX, origY;

player.addEventListener('mousedown', e => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    origX = player.offsetLeft;
    origY = player.offsetTop;
    player.style.right = 'auto';
    player.style.bottom = 'auto';
});

document.addEventListener('mousemove', e => {
    if (!dragging) return;
    player.style.left = (origX + e.clientX - startX) + 'px';
    player.style.top = (origY + e.clientY - startY) + 'px';
});

document.addEventListener('mouseup', () => { dragging = false; });

player.addEventListener('touchstart', e => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    const t = e.touches[0];
    dragging = true;
    startX = t.clientX;
    startY = t.clientY;
    origX = player.offsetLeft;
    origY = player.offsetTop;
    player.style.right = 'auto';
    player.style.bottom = 'auto';
}, { passive: true });

document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const t = e.touches[0];
    player.style.left = (origX + t.clientX - startX) + 'px';
    player.style.top = (origY + t.clientY - startY) + 'px';
}, { passive: true });

document.addEventListener('touchend', () => { dragging = false; });
