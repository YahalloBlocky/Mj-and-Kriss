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