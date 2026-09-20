/* ============================================================
   MÚSICA DE FONDO — Módulo compartido
   ------------------------------------------------------------
   El <audio> vive SOLO en index.html (el cascarón).
   Las vistas se cargan dentro de un <iframe>, así que el
   documento que contiene el audio NUNCA se recarga y la música
   jamás se corta.

   · Dentro del iframe  -> este script es solo un puente (shim).
   · En index.html      -> este script controla el audio real.
   · Vista abierta sola -> modo de respaldo: crea su propio audio.
   ============================================================ */
(function () {

    const EN_IFRAME = window.self !== window.top;

    /* ========================================================
       MODO PUENTE (las vistas dentro del iframe)
       ======================================================== */
    if (EN_IFRAME) {
        // Las vistas siguen llamando iniciarMusica(); ya no hace falta
        // hacer nada: la música ya está sonando en el cascarón.
        window.iniciarMusica = function () { /* no-op */ };

        // Utilidades por si las quieres usar desde una vista
        window.alternarMute = function () {
            parent.postMessage({ __musica: 'mute' }, '*');
        };
        window.volverAlInicio = function () {
            parent.postMessage({ __musica: 'inicio' }, '*');
        };
        return;
    }

    /* ========================================================
       MODO CASCARÓN (index.html) / RESPALDO (vista suelta)
       ======================================================== */
    const RUTA_MUSICA = 'audio/musica.mp3';
    const KEY_MUTE    = 'musica_mute';
    const VOLUMEN     = 0.55;
    const FADE_MS     = 900;   // fundido de entrada al arrancar

    // Algunos navegadores bloquean sessionStorage al abrir con file://
    // asi que lo envolvemos para que nunca rompa la pagina.
    function leer(k)    { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
    function guardar(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

    let audio = null;
    let yaIniciado = false;

    function rutaMusicaReal() {
        // Si por algún motivo se abre una vista suelta, sube un nivel.
        const enVistas = window.location.pathname.includes('/vistas/');
        return enVistas ? '../' + RUTA_MUSICA : RUTA_MUSICA;
    }

    function crearAudio() {
        if (audio) return audio;
        audio = document.createElement('audio');
        audio.src = rutaMusicaReal();
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0;
        audio.muted = leer(KEY_MUTE) === '1';
        document.body.appendChild(audio);
        return audio;
    }

    function fadeIn() {
        const paso = VOLUMEN / (FADE_MS / 50);
        const t = setInterval(() => {
            const v = Math.min(VOLUMEN, audio.volume + paso);
            audio.volume = v;
            if (v >= VOLUMEN) clearInterval(t);
        }, 50);
    }

    /**
     * Arranca la música. Debe llamarse dentro de un clic del usuario
     * para que el navegador no bloquee la reproducción.
     * @param {Object} opciones
     * @param {boolean} opciones.reiniciar - vuelve al segundo 0.
     */
    function iniciarMusica(opciones = {}) {
        const { reiniciar = false } = opciones;
        crearAudio();

        if (reiniciar) {
            audio.currentTime = 0;
            audio.volume = 0;
        }
        if (yaIniciado && !reiniciar && !audio.paused) return;
        yaIniciado = true;

        const p = audio.play();
        if (p !== undefined) {
            p.then(fadeIn).catch(() => {
                // Autoplay bloqueado: reintentar al primer toque.
                const desbloquear = () => {
                    audio.play().then(fadeIn).catch(() => {});
                    document.removeEventListener('click', desbloquear);
                    document.removeEventListener('touchstart', desbloquear);
                };
                document.addEventListener('click', desbloquear, { once: true });
                document.addEventListener('touchstart', desbloquear, { once: true });
            });
        } else {
            fadeIn();
        }
    }

    function alternarMute() {
        if (!audio) return false;
        audio.muted = !audio.muted;
        guardar(KEY_MUTE, audio.muted ? '1' : '0');
        return audio.muted;
    }

    function estaSilenciada() {
        return audio ? audio.muted : leer(KEY_MUTE) === '1';
    }

    // Mensajes que llegan desde las vistas (iframe)
    window.addEventListener('message', (e) => {
        const d = e.data;
        if (!d || d.__musica !== 'mute') return;
        alternarMute();
        window.dispatchEvent(new CustomEvent('musica:mute'));
    });

    // API pública
    window.iniciarMusica  = iniciarMusica;
    window.alternarMute   = alternarMute;
    window.estaSilenciada = estaSilenciada;

})();
