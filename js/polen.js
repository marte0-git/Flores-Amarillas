/* ============================================================
   POLEN FLOTANTE — Módulo compartido
   Uso: <script src="ruta/polen.js"></script> y luego iniciarPolen()
   ============================================================ */
window.iniciarPolen = (function () {
    let yaIniciado = false;

    return function iniciarPolen(idCanvas = 'polenCanvas') {
        if (yaIniciado) return;
        yaIniciado = true;

        const canvas = document.getElementById(idCanvas);
        if (!canvas) {
            console.warn('⚠️ No se encontró el canvas del polen:', idCanvas);
            return;
        }
        const ctx = canvas.getContext('2d');

        let W, H;
        let particulas = [];
        let t = 0;

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
            const cantidad = Math.min(90, Math.floor((W * H) / 22000));
            crearParticulas(cantidad);
        }

        function crearParticulas(n) {
            particulas = [];
            for (let i = 0; i < n; i++) particulas.push(nuevaParticula(true));
        }

        function nuevaParticula(inicial = false) {
            return {
                x: Math.random() * W,
                y: inicial ? Math.random() * H : H + 10,
                r: 1 + Math.random() * 2.8,
                color: COLORES[Math.floor(Math.random() * COLORES.length)],
                vy: -(0.15 + Math.random() * 0.45),
                vx: (Math.random() - 0.5) * 0.35,
                swingAmp: 0.3 + Math.random() * 1.2,
                swingFreq: 0.002 + Math.random() * 0.004,
                swingPhase: Math.random() * Math.PI * 2,
                alpha: 0.5 + Math.random() * 0.5,
                alphaSpeed: 0.005 + Math.random() * 0.015,
                alphaPhase: Math.random() * Math.PI * 2
            };
        }

        function dibujar() {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < particulas.length; i++) {
                const p = particulas[i];
                p.y += p.vy;
                p.x += p.vx + Math.sin(t * p.swingFreq + p.swingPhase) * p.swingAmp;

                const a = p.alpha * (0.7 + 0.3 * Math.sin(t * p.alphaSpeed + p.alphaPhase));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = a;
                ctx.shadowColor = 'rgba(255, 200, 90, 0.9)';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;

                if (p.y < -20 || p.x < -30 || p.x > W + 30) {
                    particulas[i] = nuevaParticula(false);
                }
            }
            t += 1;
            requestAnimationFrame(dibujar);
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 120);
        });

        resize();
        dibujar();
    };
})();