/* ============================================================
   1) SALUDO DINÁMICO SEGÚN LA HORA
   ============================================================ */
(function actualizarSaludo() {
    const el = document.getElementById('saludo');
    const hora = new Date().getHours();

    let texto;
    if (hora >= 5 && hora < 12) {
        texto = 'Buenos días ✨';
    } else if (hora >= 12 && hora < 19) {
        texto = 'Buenas tardes ☀️';
    } else {
        texto = 'Buenas noches 🌙';
    }
    el.textContent = texto;
})();

/* ============================================================
   2) POLEN FLOTANTE (canvas 2D)
   ============================================================ */
(function polen() {
    const canvas = document.getElementById('polenCanvas');
    const ctx = canvas.getContext('2d');

    let W, H;
    let particulas = [];

    // Colores cálidos: amarillos, naranjas, dorados
    const COLORES = [
        'rgba(247, 200, 90, 0.85)',
        'rgba(240, 168, 40, 0.80)',
        'rgba(255, 220, 130, 0.80)',
        'rgba(245, 185, 70, 0.75)',
        'rgba(255, 200, 100, 0.90)'
    ];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        // Ajustamos el número de partículas al tamaño de pantalla
        const cantidad = Math.min(90, Math.floor((W * H) / 22000));
        crearParticulas(cantidad);
    }

    function crearParticulas(n) {
        particulas = [];
        for (let i = 0; i < n; i++) {
            particulas.push(nuevaParticula(true));
        }
    }

    function nuevaParticula(inicial = false) {
        const radio = 1 + Math.random() * 2.8;
        return {
            x: Math.random() * W,
            // Si es inicial, distribuir por toda la pantalla
            y: inicial ? Math.random() * H : H + 10,
            r: radio,
            color: COLORES[Math.floor(Math.random() * COLORES.length)],
            // Velocidades suaves: suben flotando y se mecen
            vy: -(0.15 + Math.random() * 0.45),          // hacia arriba
            vx: (Math.random() - 0.5) * 0.35,             // vaivén horizontal
            // Amplitud del vaivén (movimiento senoidal)
            swingAmp: 0.3 + Math.random() * 1.2,
            swingFreq: 0.002 + Math.random() * 0.004,
            swingPhase: Math.random() * Math.PI * 2,
            // Parpadeo
            alpha: 0.5 + Math.random() * 0.5,
            alphaSpeed: 0.005 + Math.random() * 0.015,
            alphaPhase: Math.random() * Math.PI * 2,
            // Tiempo de vida para reiniciar por arriba
            life: 0
        };
    }

    let t = 0;

    function dibujar() {
        // Si el recorrido ya empezo, la portada esta oculta:
        // no gastamos CPU dibujando.
        if (document.body.classList.contains('modo-vista')) {
            requestAnimationFrame(dibujar);
            return;
        }
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];

            // Actualizar posición
            p.y += p.vy;
            p.x += p.vx + Math.sin(t * p.swingFreq + p.swingPhase) * p.swingAmp;
            p.life += 1;

            // Parpadeo de opacidad
            const a = p.alpha * (0.7 + 0.3 * Math.sin(t * p.alphaSpeed + p.alphaPhase));

            // Glow del polen
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = a;
            ctx.shadowColor = 'rgba(255, 200, 90, 0.9)';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;

            // Si sale por arriba o por los lados, reaparece abajo
            if (p.y < -20 || p.x < -30 || p.x > W + 30) {
                particulas[i] = nuevaParticula(false);
            }
        }
        t += 1;
        requestAnimationFrame(dibujar);
    }

    // Debounce para el resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 120);
    });

    // Iniciar
    resize();
    dibujar();
})();

/* ============================================================
   3) CASCARON: BOTON "COMENZAR", VISOR DE VISTAS Y MUSICA
   ------------------------------------------------------------
   Esta pagina NUNCA se recarga. Las vistas se cargan dentro
   del <iframe id="visor">, por eso la musica no se corta.
   ============================================================ */
(function cascaron() {

    const visor       = document.getElementById('visor');
    const btnComenzar = document.getElementById('btnComenzar');
    const contenido   = document.querySelector('.contenido');

    const PRIMERA_VISTA = 'vistas/cartas.html';

    /* ---------- Empezar el recorrido ---------- */
    btnComenzar.addEventListener('click', () => {
        // La musica arranca AQUI, dentro del clic del usuario:
        // asi el navegador nunca bloquea la reproduccion.
        iniciarMusica({ reiniciar: true });

        contenido.style.opacity = '0';

        setTimeout(() => {
            visor.src = PRIMERA_VISTA;
            document.body.classList.add('modo-vista');
        }, 1200);
    });

    /* ---------- Volver a la portada ---------- */
    function volverAlInicio() {
        document.body.classList.remove('modo-vista');
        visor.src = 'about:blank';
        contenido.style.opacity = '1';
    }

    /* ---------- Mensajes que mandan las vistas ---------- */
    window.addEventListener('message', (e) => {
        const d = e.data;
        if (d && d.__musica === 'inicio') volverAlInicio();
    });

})();
