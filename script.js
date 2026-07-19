document.addEventListener('DOMContentLoaded', () => {
    // 1. Detección automática al cargar
    const urlParams = new URLSearchParams(window.location.search);
    
    // Si viene de Gestión con el parámetro 'iniciar', lanzamos todo
    if (urlParams.get('iniciar') === 'true') {
        setTimeout(() => {
            iniciarLargada();
        }, 800); // Pequeña espera para cargar el DOM
    }

    // 2. Función de anuncio por voz (Simulación de voces)
    function anunciar(texto) {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(texto);
            msg.lang = 'es-ES';
            msg.rate = 1;
            window.speechSynthesis.speak(msg);
        }
    }

    // 3. Secuencia de Largada mejorada
    window.iniciarLargada = () => {
        document.getElementById('pantalla-largada').style.display = 'flex';
        anunciar("Cinco luces rojas se encienden");
        
        let luces = document.querySelectorAll('.luz');
        let i = 0;
        
        let int = setInterval(() => {
            if (i < 5) {
                luces[i].style.background = '#ff0000';
                i++;
            } else {
                clearInterval(int);
                anunciar("¡Bandera verde!");
                
                setTimeout(() => {
                    document.getElementById('pantalla-largada').style.display = 'none';
                    // Activar el bucle de simulación aquí
                    carreraIniciada = true;
                    requestAnimationFrame(simular);
                }, 1000);
            }
        }, 1000); // 1 segundo por luz como pediste
    };

    // ... (El resto de tu lógica de 22 autos y simulación)
});
