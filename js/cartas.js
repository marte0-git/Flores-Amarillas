/* ============================================================
   1) POLEN COMPARTIDO
   ============================================================ */
iniciarPolen();
iniciarMusica();   // reanuda desde donde iba
/* ============================================================
   2) MENSAJES DE LAS 10 CARTAS
   👉 Aquí editas los mensajes cuando quieras
   ============================================================ */
/* ============================================================
   CARTAS — cada una tiene su propio mensaje e imagen
   👉 Aquí editas los mensajes y las rutas de las imágenes
   ============================================================ */
const CARTAS = [
    {
        mensaje: "Eres y serás siempre esa mitad exacta que le da sentido a mi vida; el seis perfecto de mi siete.",
        imagen: "../imagenes/imagen17.png"
    },
    {
        mensaje: "Lucharía y movería cielo y tierra la vida entera solo por sacarte una sonrisa, mi enojona hermosa.",
        imagen: "../imagenes/imagen18.png"
    },
    {
        mensaje: "En la calma y en la tormenta, mi mano siempre sostendrá la tuya, mi chiquitita.",
        imagen: "../imagenes/imagen21.png"
    },
    {
        mensaje: "Eres el arte que inspira cada uno de mis días y el amor más bonito de mi existencia.",
        imagen: "../imagenes/imagen19.png"
    },
    {
        mensaje: "Caminaremos juntos paso a paso, porque en nuestro destino, soltarnos jamás será una opción.",
        imagen: "../imagenes/imagen20.png"
    },
    {
        mensaje: "Esto es solo el comienzo…",
        imagen: "../imagenes/imagen23.png"
    }
];

/* ============================================================
   FADE DE ENTRADA
   ============================================================ */
window.addEventListener('load', () => {
    setTimeout(() => {
        const fade = document.getElementById('fadeEntrada');
        if (fade) fade.classList.add('oculto');
    }, 100);
});

const TOTAL = CARTAS.length;

let indiceActual = 0;

/* ============================================================
   3) ELEMENTOS DEL DOM
   ============================================================ */
const carta          = document.getElementById('carta');
const cartaMensaje   = document.getElementById('cartaMensaje');
const btnContinuar   = document.getElementById('btnContinuar');
const btnAtras       = document.getElementById('btnAtras');
const contador       = document.getElementById('contador');

/* ============================================================
   4) MARIPOSAS (SVG + vuelo animado)
   ============================================================ */
const mariposasCont = document.getElementById('mariposas');
const coloresMariposa = [
    { a: '#F7B7C4', b: '#E48FB0' },   // rosa
    { a: '#C9B6E4', b: '#A48ED0' },   // lavanda
    { a: '#F5D76E', b: '#E6B93F' },   // amarillo
    { a: '#A8DDB5', b: '#7BC48F' },   // verde menta
    { a: '#A6D8F0', b: '#7BB8DC' }    // azul suave
];

function svgMariposa(c) {
    return `
        <svg viewBox="0 0 100 100">
            <!-- ala izquierda -->
            <g class="ala ala-izq" style="transform-origin: 50% 50%">
                <ellipse cx="35" cy="42" rx="22" ry="26" fill="${c.a}" opacity="0.95"/>
                <ellipse cx="35" cy="65" rx="15" ry="18" fill="${c.b}" opacity="0.85"/>
            </g>
            <!-- ala derecha -->
            <g class="ala ala-der" style="transform-origin: 50% 50%">
                <ellipse cx="65" cy="42" rx="22" ry="26" fill="${c.a}" opacity="0.95"/>
                <ellipse cx="65" cy="65" rx="15" ry="18" fill="${c.b}" opacity="0.85"/>
            </g>
            <!-- cuerpo -->
            <ellipse cx="50" cy="52" rx="2.6" ry="18" fill="#5b4636"/>
            <!-- antenas -->
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

    // Parámetros de la trayectoria (Lissajous modificada)
    const ampX = 120 + Math.random() * 160;   // amplitud horizontal
    const ampY = 60 + Math.random() * 110;    // amplitud vertical
    const speedX = 0.0006 + Math.random() * 0.0009;
    const speedY = 0.0009 + Math.random() * 0.0013;
    const phase = Math.random() * Math.PI * 2;

    const baseX = () => W() * (0.25 + Math.random() * 0.5);
    const baseY = () => H() * (0.25 + Math.random() * 0.5);

    let bx = baseX();
    let by = baseY();
    let tUltimoCambio = 0;

    function frame(t) {
        // Cada ~6 seg cambia la base para que las mariposas no se queden fijas
        if (t - tUltimoCambio > 6000) {
            bx = baseX();
            by = baseY();
            tUltimoCambio = t;
        }

        const x = bx + Math.sin(t * speedX + phase) * ampX + Math.sin(t * speedX * 2.3) * 30;
        const y = by + Math.cos(t * speedY + phase) * ampY + Math.sin(t * speedY * 1.7) * 20;

        // Rotación ligera según dirección
        const rot = Math.sin(t * speedX + phase) * 18;

        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

crearMariposas(5);

/* ============================================================
   5) PÉTALOS CAYENDO DENTRO DE LA CARTA
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

    const duracion = 6 + Math.random() * 6;      // seg
    const deriva = (Math.random() - 0.5) * 80;   // px
    const giro = (Math.random() - 0.5) * 720;    // grados
    p.style.setProperty('--deriva', deriva + 'px');
    p.style.setProperty('--giro', giro + 'deg');

    p.style.animation = `caerPetalo ${duracion}s linear forwards`;
    petalosCont.appendChild(p);

    setTimeout(() => p.remove(), duracion * 1000 + 200);
}

// Inyectar keyframes dinámicamente (más limpio que un <style> aparte)
(function inyectarKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes caerPetalo {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% { opacity: 0.85; }
            100% {
                transform: translateY(560px) translateX(var(--deriva)) rotate(var(--giro));
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();

// Generar pétalos de forma continua (uno cada 900-1500ms)
setInterval(() => {
    if (petalosCont.childElementCount < 14) crearPetalo();
}, 900);

// Pre-poblar algunos al cargar
for (let i = 0; i < 6; i++) {
    setTimeout(() => crearPetalo(), i * 250);
}

/* ============================================================
   6) RENDERIZAR CARTA ACTUAL
   ============================================================ */
const cartaFlor = document.getElementById('cartaFlor');   // 👈 nueva referencia

function renderCarta() {
    const carta = CARTAS[indiceActual];

    // Actualiza mensaje
    cartaMensaje.textContent = carta.mensaje;

    // 🎯 Actualiza la imagen de la carta con un fade suave
    if (cartaFlor) {
        cartaFlor.style.transition = 'opacity 0.35s ease';
        cartaFlor.style.opacity = '0';
        setTimeout(() => {
            cartaFlor.src = carta.imagen;
            cartaFlor.style.opacity = '1';
        }, 200);
    }

    // Contador
    contador.textContent = `${indiceActual + 1} / ${TOTAL}`;

    // Botón atrás
    if (indiceActual === 0) btnAtras.classList.add('oculto');
    else btnAtras.classList.remove('oculto');

    // Texto del botón continuar
    if (indiceActual === TOTAL - 1) {
        btnContinuar.firstChild.textContent = 'Ver mi ramo ';
    } else {
        btnContinuar.firstChild.textContent = 'Continuar ';
    }
}

/* ============================================================
   7) TRANSICIÓN ENTRE CARTAS
   ============================================================ */
function irA(nuevoIndice) {
    if (nuevoIndice < 0 || nuevoIndice >= TOTAL) return;

    carta.classList.add('saliendo');

    setTimeout(() => {
        indiceActual = nuevoIndice;
        renderCarta();

        carta.classList.remove('saliendo');
        carta.classList.add('entrando');

        // Forzar reflow y luego quitar "entrando"
        void carta.offsetWidth;
        carta.classList.remove('entrando');
    }, 1000);
}

/* ============================================================
   8) EVENTOS
   ============================================================ */
btnContinuar.addEventListener('click', () => {
    if (indiceActual === TOTAL - 1) {
        // Última carta → ir al aviso (siguiente sub-paso)
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = 'ramo.html';
        }, 600);
    } else {
        irA(indiceActual + 1);
    }
});

btnAtras.addEventListener('click', () => {
    if (indiceActual > 0) irA(indiceActual - 1);
});

/* ============================================================
   9) INICIO
   ============================================================ */
renderCarta();