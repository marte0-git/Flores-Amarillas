/* ============================================================
   1) POLEN COMPARTIDO
   ============================================================ */
iniciarPolen();
iniciarMusica();   // reanuda desde donde iba
/* ============================================================
   2) MARIPOSAS (mismo código que en cartas.js)
   ============================================================ */
const mariposasCont = document.getElementById('mariposas');
const coloresMariposa = [
    { a: '#F7B7C4', b: '#E48FB0' },
    { a: '#C9B6E4', b: '#A48ED0' },
    { a: '#F5D76E', b: '#E6B93F' },
    { a: '#A8DDB5', b: '#7BC48F' },
    { a: '#A6D8F0', b: '#7BB8DC' }
];

function svgMariposa(c) {
    return `
        <svg viewBox="0 0 100 100">
            <g class="ala ala-izq" style="transform-origin: 50% 50%">
                <ellipse cx="35" cy="42" rx="22" ry="26" fill="${c.a}" opacity="0.95"/>
                <ellipse cx="35" cy="65" rx="15" ry="18" fill="${c.b}" opacity="0.85"/>
            </g>
            <g class="ala ala-der" style="transform-origin: 50% 50%">
                <ellipse cx="65" cy="42" rx="22" ry="26" fill="${c.a}" opacity="0.95"/>
                <ellipse cx="65" cy="65" rx="15" ry="18" fill="${c.b}" opacity="0.85"/>
            </g>
            <ellipse cx="50" cy="52" rx="2.6" ry="18" fill="#5b4636"/>
            <path d="M50 36 Q46 26 42 24" stroke="#5b4636" stroke-width="1.4" fill="none" stroke-linecap="round"/>
            <path d="M50 36 Q54 26 58 24" stroke="#5b4636" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        </svg>
    `;
}

function crearMariposas(cantidad = 5) {
    for (let i = 0; i < cantidad; i++) {
        const div = document.createElement('div');
        div.className = 'mariposa';
        const color = coloresMariposa[i % coloresMariposa.length];
        div.innerHTML = svgMariposa(color);
        mariposasCont.appendChild(div);
        animarMariposa(div, i);
    }
}

function animarMariposa(el, seed) {
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const ampX = 120 + Math.random() * 160;
    const ampY = 60 + Math.random() * 110;
    const speedX = 0.0006 + Math.random() * 0.0009;
    const speedY = 0.0009 + Math.random() * 0.0013;
    const phase = Math.random() * Math.PI * 2;

    const baseX = () => W() * (0.25 + Math.random() * 0.5);
    const baseY = () => H() * (0.25 + Math.random() * 0.5);

    let bx = baseX(), by = baseY(), tUltimoCambio = 0;

    function frame(t) {
        if (t - tUltimoCambio > 6000) {
            bx = baseX(); by = baseY(); tUltimoCambio = t;
        }
        const x = bx + Math.sin(t * speedX + phase) * ampX + Math.sin(t * speedX * 2.3) * 30;
        const y = by + Math.cos(t * speedY + phase) * ampY + Math.sin(t * speedY * 1.7) * 20;
        const rot = Math.sin(t * speedX + phase) * 18;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

crearMariposas(5);

/* ============================================================
   3) PÉTALOS (mismo código que en cartas.js)
   ============================================================ */
const petalosCont = document.getElementById('petalos');
const coloresPetalo = ['#F7B7C4', '#F5D76E', '#C9B6E4', '#A8DDB5', '#FFD9A0'];

function crearPetalo() {
    const p = document.createElement('span');
    p.className = 'petalo';
    p.style.background = coloresPetalo[Math.floor(Math.random() * coloresPetalo.length)];
    p.style.left = Math.random() * 100 + '%';
    const tamaño = 6 + Math.random() * 8;
    p.style.width = tamaño + 'px';
    p.style.height = tamaño + 'px';
    p.style.opacity = 0.5 + Math.random() * 0.4;

    const duracion = 6 + Math.random() * 6;
    const deriva = (Math.random() - 0.5) * 80;
    const giro = (Math.random() - 0.5) * 720;
    p.style.setProperty('--deriva', deriva + 'px');
    p.style.setProperty('--giro', giro + 'deg');
    p.style.animation = `caerPetalo ${duracion}s linear forwards`;
    petalosCont.appendChild(p);

    setTimeout(() => p.remove(), duracion * 1000 + 200);
}

(function inyectarKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes caerPetalo {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.85; }
            100% {
                transform: translateY(560px) translateX(var(--deriva)) rotate(var(--giro));
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();

setInterval(() => {
    if (petalosCont.childElementCount < 14) crearPetalo();
}, 900);

for (let i = 0; i < 6; i++) setTimeout(() => crearPetalo(), i * 250);

/* ============================================================
   4) BOTÓN → CUENTA REGRESIVA
   ============================================================ */
document.getElementById('btnRegresiva').addEventListener('click', () => {
    document.body.style.transition = 'opacity 0.9s ease';
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = 'cuenta-regresiva.html';
    }, 900);
});

document.getElementById('btnRamo').addEventListener('click', () => {
    // Aplicamos transición a TODA la carta (no solo al body)
    const carta = document.querySelector('.carta');
    if (carta) {
        carta.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(.4,0,.2,1)';
        carta.style.opacity = '0';
        carta.style.transform = 'scale(0.92) translateY(-10px)';
    }
    // Y al body por si acaso
    document.body.style.transition = 'opacity 1.2s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = 'ramo.html';
    }, 1200);
});