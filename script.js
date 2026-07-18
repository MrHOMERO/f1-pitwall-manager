document.addEventListener('DOMContentLoaded', () => {
    const pista = document.getElementById('pista');
    const auto = document.getElementById('auto');
    const txtGoma = document.getElementById('vida-goma');
    const txtVuelta = document.getElementById('num-vuelta');
    const listaTiming = document.getElementById('lista-timing');

    // Base de datos de los 11 equipos oficiales actuales
    const equiposF1 = [
        { nombre: "Ferrari", color: "#E10600", piloto: "Charles Leclerc" },
        { nombre: "Red Bull", color: "#0C1E42", piloto: "Max Verstappen" },
        { nombre: "Mercedes", color: "#27F4D2", piloto: "Lewis Hamilton" },
        { nombre: "McLaren", color: "#FF8000", piloto: "Lando Norris" },
        { nombre: "Aston Martin", color: "#229971", piloto: "Fernando Alonso" },
        { nombre: "Alpine", color: "#0093CC", piloto: "Pierre Gasly" },
        { nombre: "Williams", color: "#00A0DE", piloto: "Alex Albon" },
        { nombre: "RB Visa", color: "#6692FF", piloto: "Yuki Tsunoda" },
        { nombre: "Sauber", color: "#52E252", piloto: "Nico Hulkenberg" },
        { nombre: "Haas", color: "#B6BABD", piloto: "Oliver Bearman" },
        { nombre: "Cadillac", color: "#FFFFFF", piloto: "Esteban Ocon" } // El nuevo integrante de la parrilla
    ];

    // Sorteo automático del equipo para el jugador
    const miEquipo = equiposF1[Math.floor(Math.random() * equiposF1.length)];

    // Configuración del nombre del Director
    const nombreUsuario = prompt("Introduce tu nombre de Director de Equipo:", "MART");
    const directorFormateado = nombreUsuario ? nombreUsuario.toUpperCase().substring(0, 4) : "MART";
    
    // Cambiar color del punto del auto según el equipo sorteado
    if (auto) auto.setAttribute('fill', miEquipo.color);

    let progreso = 0;
    let velocidad = 0.0016; 
    let desgasteGoma = 100;
    let numeroVuelta = 1;

    // Generar la tabla de posiciones en pantalla (Live Timing)
    function actualizarLiveTiming() {
        if (!listaTiming) return;
        
        // Ordenamos los equipos (aquí simularemos que vas primero, luego agregaremos IA)
        let htmlContenido = `
            <div class="fila-piloto tu-auto" style="border-left-color: ${miEquipo.color}">
                <span class="info-izquierda">1º <b>${directorFormateado}</b> (${miEquipo.nombre})</span>
                <span class="goma">🔴 <span id="vida-goma">${Math.floor(desgasteGoma)}</span>%</span>
            </div>
        `;

        equiposF1.forEach((eq, index) => {
            if (eq.nombre !== miEquipo.nombre) {
                htmlContenido += `
                    <div class="fila-piloto" style="border-left-color: ${eq.color}">
                        <span class="info-izquierda">${index + 2}º ${eq.piloto.split(' ')[1].toUpperCase()} (${eq.nombre})</span>
                        <span class="goma-ia">🟡 85%</span>
                    </div>
                `;
            }
        });
        listaTiming.innerHTML = htmlContenido;
    }

    function simularCarrera() {
        let factorGoma = desgasteGoma / 100;
        progreso += velocidad * (0.5 + factorGoma * 0.5);

        if (progreso > 1) {
            progreso = 0;
            numeroVuelta++;
            if (txtVuelta) txtVuelta.innerText = numeroVuelta;
        }

        if (desgasteGoma > 0) {
            let tasaDesgaste = velocidad * 6; 
            desgasteGoma -= tasaDesgaste;
            if (desgasteGoma < 0) desgasteGoma = 0;
            
            // Actualizar el porcentaje en vivo en la pantalla
            const miGomaPantalla = document.getElementById('vida-goma');
            if (miGomaPantalla) miGomaPantalla.innerText = Math.floor(desgasteGoma);
        }

        if (pista && auto) {
            const longitudPista = pista.getTotalLength();
            const puntoEnPista = pista.getPointAtLength(progreso * longitudPista);
            auto.setAttribute('cx', puntoEnPista.x);
            auto.setAttribute('cy', puntoEnPista.y);
        }

        requestAnimationFrame(simularCarrera);
    }

    window.cambiarRitmo = function(ritmo) {
        document.querySelectorAll('.btn-ritmo').forEach(b => b.classList.remove('activo'));
        if (ritmo === 'conservar') {
            velocidad = 0.0008;
            document.getElementById('btn-conservar').classList.add('activo');
        } else if (ritmo === 'normal') {
            velocidad = 0.0016;
            document.getElementById('btn-normal').classList.add('activo');
        } else if (ritmo === 'ataque') {
            velocidad = 0.0032;
            document.getElementById('btn-ataque').classList.add('activo');
        }
    };

    window.entrarABoxes = function() {
        desgasteGoma = 100;
        actualizarLiveTiming();
        alert(`🏎️ Parada en Boxes de ${miEquipo.nombre} completada. ¡Gomas nuevas!`);
    };

    // Inicializar
    actualizarLiveTiming();
    simularCarrera();
});
