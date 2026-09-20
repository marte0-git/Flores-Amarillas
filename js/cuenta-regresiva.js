/* ============================================================
   1) POLEN COMPARTIDO
   ============================================================ */
iniciarPolen();
iniciarMusica();   // reanuda desde donde iba
/* ============================================================
   2) CONFIGURACIÓN
   ============================================================ */
const SEGUNDOS_INICIALES = 10;
const CIRCUNFERENCIA = 2 * Math.PI * 115;

const numeroEl  = document.getElementById('numero');
const anilloEl  = document.getElementById('anilloProgreso');
const btnSaltar = document.getElementById('btnSaltar');

let restantes = SEGUNDOS_INICIALES;
let intervalo = null;

/* ============================================================
   3) INICIALIZAR ANILLO
   ============================================================ */
anilloEl.style.strokeDasharray  = CIRCUNFERENCIA;
anilloEl.style.strokeDashoffset = 0;

/* ============================================================
   4) ACTUALIZAR CADA SEGUNDO
   ============================================================ */
function actualizar() {
    numeroEl.textContent = restantes;

    numeroEl.classList.add('pulso');
    setTimeout(() => numeroEl.classList.remove('pulso'), 220);

    const progreso = 1 - (restantes / SEGUNDOS_INICIALES);
    anilloEl.style.strokeDashoffset = progreso * CIRCUNFERENCIA;

    if (restantes <= 3) btnSaltar.classList.add('oculto');

    if (restantes <= 0) {
        clearInterval(intervalo);
        irAGalaxia();
        return;
    }

    restantes--;
}

/* ============================================================
   5) TRANSICIÓN ELEGANTE HACIA LA GALAXIA
   ============================================================ */
function irAGalaxia() {
    // --- Capa 1: fade blanco cálido ---
    const fade = document.createElement('div');
    fade.style.cssText = `
        position: fixed;
        inset: 0;
        background: radial-gradient(ellipse at center, #fff9ee, #fdf3d8);
        opacity: 0;
        pointer-events: none;
        z-index: 999;
        transition: opacity 0.9s ease;
    `;
    document.body.appendChild(fade);
    void fade.offsetWidth;
    fade.style.opacity = '1';

    // --- Capa 2: mensaje "Allá vamos…" mientras se hace el fade ---
    setTimeout(() => {
        const mensaje = document.createElement('div');
        mensaje.textContent = 'Allá vamos…';
        mensaje.style.cssText = `
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Dancing Script', cursive;
            font-weight: 700;
            font-size: clamp(2rem, 6vw, 3.5rem);
            color: #b98a3a;
            text-shadow: 0 4px 20px rgba(230, 180, 80, 0.45);
            opacity: 0;
            pointer-events: none;
            z-index: 1000;
            transition: opacity 0.7s ease;
        `;
        document.body.appendChild(mensaje);
        void mensaje.offsetWidth;
        mensaje.style.opacity = '1';
    }, 500);

    // --- Capa 3: fade a negro justo antes de entrar a la galaxia ---
    setTimeout(() => {
        const negro = document.createElement('div');
        negro.style.cssText = `
            position: fixed;
            inset: 0;
            background: #050510;
            opacity: 0;
            pointer-events: none;
            z-index: 1001;
            transition: opacity 0.8s ease;
        `;
        document.body.appendChild(negro);
        void negro.offsetWidth;
        negro.style.opacity = '1';
    }, 1500);

    // --- Redirigir cuando el negro ya cubre todo ---
    setTimeout(() => {
        window.location.href = 'galaxia.html';
    }, 2400);
}

/* ============================================================
   6) BOTÓN SALTAR
   ============================================================ */
btnSaltar.addEventListener('click', () => {
    clearInterval(intervalo);
    irAGalaxia();
});

/* ============================================================
   7) ARRANCAR
   ============================================================ */
numeroEl.textContent = restantes;
actualizar();
intervalo = setInterval(actualizar, 1000);