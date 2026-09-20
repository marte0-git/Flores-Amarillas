/* ============================================================
   RAMO — Botón "Finalizar" → aviso final
   ============================================================ */
function finalizarRamo() {
    // Fade suave antes de redirigir
    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = 'aviso-final.html';
    }, 800);
}