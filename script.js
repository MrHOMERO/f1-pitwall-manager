// Asegura que el juego arranque solo cuando el celular dibujó todo el HTML
document.addEventListener('DOMContentLoaded', () => {
    const pista = document.getElementById('pista');
    const auto = document.getElementById('auto');
    const txtGoma = document.getElementById('vida-goma');
    const txtVuelta = document.getElementById('num-vuelta');

    // Variables lógicas de la simulación
    let progreso = 0; // Porcentaje del circuito completado (0 a 1)
    let velocidad = 0.0015; // Velocidad base (ritmo normal)
    let desgasteGoma = 100; // Vida útil del neumático (porcentaje)
    let numeroVuelta = 1;

    // Ventana emergente al iniciar para que el Director configure su nombre
    const nombreUsuario = prompt("Introduce tu nombre de Director de Equipo:", "MART");
    const nombreFormateado = nombreUsuario ? nombreUsuario.toUpperCase().substring(0, 4) : "MART";
    document.getElementById('nombre-director').innerText = nombreFormateado;

    // Bucle principal de simulación en tiempo real (corre a ~60 cuadros por segundo)
    function simularCarrera() {
        // El auto pierde rendimiento a medida que el neumático se gasta
        let factorGoma = desgasteGoma / 100;
        progreso += velocidad * (0.5 + factorGoma * 0.5);

        // Control de cruce de meta (Vuelta cumplida)
        if (progreso > 1) {
            progreso = 0;
            numeroVuelta++;
            txtVuelta.innerText = numeroVuelta;
        }

        // Degradación constante del neumático según el ritmo actual
        if (desgasteGoma > 0) {
            // Se desgasta más rápido si la velocidad configurada es alta
            let tasaDesgaste = velocidad * 5; 
            desgasteGoma -= tasaDesgaste;
            
            // Evita que muestre valores negativos
            if (desgasteGoma < 0) desgasteGoma = 0;
            txtGoma.innerText = Math.floor(desgasteGoma);
        }

        // Renderizado del punto en el mapa SVG del circuito
        if (pista && auto) {
            const longitudPista = pista.getTotalLength();
            const puntoEnPista = pista.getPointAtLength(progreso * longitudPista);
            
            // Actualiza las coordenadas del auto en tiempo real
            auto.setAttribute('cx', puntoEnPista.x);
            auto.setAttribute('cy', puntoEnPista.y);
        }

        // Llama recursivamente a la función para mantener el movimiento fluido
        requestAnimationFrame(simularCarrera);
    }

    // Función global vinculada a los botones de ritmo de la interfaz
    window.cambiarRitmo = function(ritmo) {
        // Quita la selección visual activa de todos los botones
        document.querySelectorAll('.btn-ritmo').forEach(b => b.classList.remove('activo'));
        
        // Aplica el nuevo mapa de consumo y velocidad según la orden del Director
        if (ritmo === 'conservar') {
            velocidad = 0.0008; // Va más lento, cuida el neumático
            document.getElementById('btn-conservar').classList.add('activo');
        } else if (ritmo === 'normal') {
            velocidad = 0.0016; // Ritmo estándar de carrera
            document.getElementById('btn-normal').classList.add('activo');
        } else if (ritmo === 'ataque') {
            velocidad = 0.0032; // Máxima velocidad, destroza la goma rápido
            document.getElementById('btn-ataque').classList.add('activo');
        }
    };

    // Función global vinculada al botón de parada en pits
    window.entrarABoxes = function() {
        desgasteGoma = 100;
        txtGoma.innerText = "100";
        alert("🏎️ ¡Parada en Boxes exitosa! Neumáticos Blandos (🔴) renovados al 100%.");
    };

    // Dar luz verde e iniciar la simulación del Gran Premio
    simularCarrera();
});
