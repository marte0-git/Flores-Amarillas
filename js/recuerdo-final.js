/* ============================================================
   1) POLEN Y MÚSICA
   ============================================================ */
if (typeof iniciarPolen === 'function') iniciarPolen();
if (typeof iniciarMusica === 'function') iniciarMusica();

/* ============================================================
   2) ELEMENTOS
   ============================================================ */
const formCarta   = document.getElementById('formCarta');
const ticketWrap  = document.getElementById('ticketWrapper');
const inputNombre = document.getElementById('inputNombre');
const btnGenerar  = document.getElementById('btnGenerar');
const btnGuardar  = document.getElementById('btnGuardar');
const ticket      = document.getElementById('ticket');
const ticketDueno = document.getElementById('ticketDueno');
const ticketFecha = document.getElementById('ticketFecha');
const toast       = document.getElementById('toast');
const btnCerrar   = document.getElementById('btnCerrar');
const despedida   = document.getElementById('despedida');
const btnVolver   = document.getElementById('btnVolver');

/* ============================================================
   3) FECHA FORMATEADA
   ============================================================ */
function formatearFecha(d = new Date()) {
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return `${d.getDate()} de ${meses[d.getMonth()]}`;
}
if (ticketFecha) ticketFecha.textContent = formatearFecha();

/* ============================================================
   4) SERPENTINAS
   ============================================================ */
const serpentinasCont = document.getElementById('serpentinas');
const COLORES_SERP = ['#F7B7C4','#F5D76E','#C9B6E4','#A8DDB5','#F0A017','#FFD9A0'];

function crearSerpentina() {
    if (!serpentinasCont) return;
    const s = document.createElement('span');
    s.className = 'serpentina';
    s.style.left = Math.random() * 100 + '%';
    s.style.background = COLORES_SERP[Math.floor(Math.random() * COLORES_SERP.length)];

    const ancho = 6 + Math.random() * 8;
    const alto  = 12 + Math.random() * 14;
    s.style.width  = ancho + 'px';
    s.style.height = alto + 'px';

    if (Math.random() > 0.6) s.style.borderRadius = '50%';
    if (Math.random() > 0.7) s.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';

    const duracion = 3.5 + Math.random() * 3.5;
    const deriva   = (Math.random() - 0.5) * 300;
    const giro     = 400 + Math.random() * 900;

    s.style.setProperty('--deriva', deriva + 'px');
    s.style.setProperty('--giro', giro + 'deg');
    s.style.animationDuration = duracion + 's';
    s.style.animationDelay = Math.random() * 0.4 + 's';

    serpentinasCont.appendChild(s);
    setTimeout(() => s.remove(), duracion * 1000 + 800);
}

function lanzarSerpentinas(cantidad = 90) {
    for (let i = 0; i < cantidad; i++) {
        setTimeout(crearSerpentina, i * 25);
    }
}

/* ============================================================
   5) GENERAR TICKET
   ============================================================ */
function generarTicket() {
    const nombre = inputNombre.value.trim();

    if (nombre === '') {
        inputNombre.focus();
        inputNombre.placeholder = 'Por favor escribe tu nombre 🌸';
        inputNombre.classList.add('error');
        btnGenerar.classList.add('error');
        setTimeout(() => {
            inputNombre.classList.remove('error');
            btnGenerar.classList.remove('error');
        }, 500);
        return;
    }

    ticketDueno.textContent = nombre;
    formCarta.classList.add('saliendo');

    setTimeout(() => {
        formCarta.style.display = 'none';
        ticketWrap.classList.add('visible');
        setTimeout(() => lanzarSerpentinas(120), 250);
    }, 500);
}

if (btnGenerar) btnGenerar.addEventListener('click', generarTicket);

if (inputNombre) {
    inputNombre.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') generarTicket();
    });
}

/* ============================================================
   6) GUARDAR COMO PNG (con soporte iOS)
   ------------------------------------------------------------
   ⚠️ IMPORTANTE: NO usar target="_blank" en el <a>.
   Como esta vista vive dentro de un iframe, un target="_blank"
   rompe el iframe y recarga la página padre (por eso se
   "reiniciaba" y volvía al inicio).

   🍎 iOS no permite descargas automáticas desde iframe.
   Por eso detectamos iOS y mostramos un modal con la imagen
   para que la guarden con "pulsación larga → Guardar en Fotos".

   🤖 Android / 💻 Escritorio → descarga directa del PNG.
   ============================================================ */
if (btnGuardar) {
    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Evitar doble clic
        btnGuardar.disabled = true;
        btnGuardar.style.opacity = '0.7';
        btnGuardar.style.pointerEvents = 'none';

        const florImg = document.getElementById('ticketFlor');
        if (florImg) florImg.style.animation = 'none';

        // Pequeña espera para que se estabilice el render
        setTimeout(() => {
            html2canvas(ticket, {
                backgroundColor: '#FFFEFA',
                scale: Math.min(window.devicePixelRatio * 2, 3),
                useCORS: true,
                logging: false,
                allowTaint: false
            }).then(canvas => {

                const dataURL = canvas.toDataURL('image/png');

                // 🔍 Detectar iOS
                const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

                // 🔑 Función interna para descargar (Android / Escritorio)
                function descargar() {
                    const link = document.createElement('a');
                    link.href = dataURL;
                    link.download = `ticket-eterno-${Date.now()}.png`;
                    link.rel = 'noopener';
                    link.style.display = 'none';
                    // ❌ NO añadir: link.setAttribute('target', '_blank');
                    // ❌ NO añadir: link.target = '_blank';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                // 🍎 Si es iOS → mostrar modal con la imagen
                // 🤖 / 💻 Si no → descarga directa
                if (esIOS) {
                    mostrarModalIOS(dataURL);
                } else {
                    descargar();
                }

                // Restaurar la animación de la flor
                if (florImg) florImg.style.animation = '';

                // Mostrar toast
                if (toast) {
                    toast.classList.add('visible');
                    setTimeout(() => toast.classList.remove('visible'), 2400);
                }

                // 🎯 Mostrar botón "Cerrar el jardín" tras un delay
                setTimeout(() => {
                    if (btnCerrar) btnCerrar.classList.add('visible');
                }, 900);

                // Restaurar el botón de guardar
                setTimeout(() => {
                    btnGuardar.disabled = false;
                    btnGuardar.style.opacity = '';
                    btnGuardar.style.pointerEvents = '';
                }, 1200);

            }).catch(err => {
                console.error('❌ Error al generar la imagen:', err);
                if (florImg) florImg.style.animation = '';
                alert('No se pudo generar la imagen, inténtalo de nuevo.');

                btnGuardar.disabled = false;
                btnGuardar.style.opacity = '';
                btnGuardar.style.pointerEvents = '';
            });
        }, 150);
    });
}

/* ============================================================
   6.1) MODAL PARA iOS — Instrucciones para guardar la imagen
   ------------------------------------------------------------
   Se muestra solo en iPhone / iPad. Permite al usuario mantener
   pulsada la imagen del ticket para guardarla en su carrete.
   ============================================================ */
function mostrarModalIOS(dataURL) {
    // Overlay oscuro
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeInModal 0.4s ease;
    `;

    // Contenido del modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #FFFDF8;
        border-radius: 20px;
        padding: 24px;
        max-width: 400px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        max-height: 92vh;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <h3 style="
            font-family: 'Dancing Script', cursive;
            font-size: 1.6rem;
            color: #6b4a2b;
            margin-bottom: 12px;
            font-weight: 700;
        ">
            📱 Guardar en tu iPhone
        </h3>

        <p style="
            font-family: 'Cormorant Garamond', serif;
            font-size: 1rem;
            color: #8a7a63;
            line-height: 1.5;
            margin-bottom: 18px;
        ">
            Mantén pulsada la imagen de abajo y elige<br>
            <strong style="color:#c99240;">"Añadir a Fotos"</strong> o<br>
            <strong style="color:#c99240;">"Guardar imagen"</strong>
        </p>

        <img src="${dataURL}" alt="Ticket" style="
            width: 100%;
            max-width: 300px;
            height: auto;
            border-radius: 12px;
            border: 3px solid #FFFDF8;
            box-shadow: 0 8px 20px rgba(200, 150, 90, 0.25),
                        0 0 0 2px #E8D9A8;
            margin-bottom: 20px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            -webkit-touch-callout: default;
            -webkit-user-select: auto;
            user-select: auto;
        ">

        <p style="
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            font-size: 0.9rem;
            color: #a8977a;
            margin-bottom: 16px;
        ">
            Si el menú no aparece al mantener pulsada,<br>
            prueba con <strong>pulsación larga</strong>.
        </p>

        <button id="cerrarModalIOS" style="
            font-family: 'Cormorant Garamond', serif;
            font-weight: 700;
            font-size: 1rem;
            color: #ffffff;
            background: linear-gradient(180deg, #f7b733 0%, #f0a017 100%);
            border: none;
            border-radius: 999px;
            padding: 14px 36px;
            cursor: pointer;
            letter-spacing: 0.5px;
            box-shadow: 0 8px 20px rgba(240, 160, 23, 0.45),
                        inset 0 1px 0 rgba(255, 255, 255, 0.35);
            transition: transform 0.2s ease;
        ">
            Entendido 
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Keyframe para el fade in (solo se agrega una vez)
    if (!document.getElementById('keyframe-fade-modal')) {
        const style = document.createElement('style');
        style.id = 'keyframe-fade-modal';
        style.textContent = `
            @keyframes fadeInModal {
                from { opacity: 0; }
                to   { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Función para cerrar el modal
    function cerrarModal() {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }

    // Cerrar con el botón
    const btnCerrarModal = modal.querySelector('#cerrarModalIOS');
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', cerrarModal);
    }

    // Cerrar al pulsar fuera del modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarModal();
    });
}

/* ============================================================
   7) BOTÓN "CERRAR EL JARDÍN"
   ============================================================ */
if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
        // Intentar cerrar la pestaña
        try {
            window.close();
        } catch (e) {
            // Ignorar
        }

        // Si en 350ms no se cerró (lo más común), mostrar despedida
        setTimeout(() => {
            if (despedida) despedida.classList.add('visible');
            if (typeof musicaFadeOut === 'function') {
                musicaFadeOut(1.5);
            }
        }, 350);
    });
}

/* ============================================================
   8) BOTÓN "VOLVER A EMPEZAR"
   ------------------------------------------------------------
   Si estamos dentro de un iframe, le pedimos al padre que
   vuelva al inicio (así la música NO se reinicia).
   Si estamos sueltos, navegamos normalmente.
   ============================================================ */
if (btnVolver) {
    btnVolver.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        document.body.style.transition = 'opacity 0.7s ease';
        document.body.style.opacity = '0';

        setTimeout(() => {
            if (window.self !== window.top) {
                // Estamos dentro del iframe → pedir al padre
                if (typeof volverAlInicio === 'function') {
                    volverAlInicio();
                } else {
                    parent.postMessage({ __musica: 'inicio' }, '*');
                }
            } else {
                // Vista suelta → navegar normal
                window.location.href = '../index.html';
            }
        }, 700);
    });
}