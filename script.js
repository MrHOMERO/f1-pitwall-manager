document.addEventListener('DOMContentLoaded', () => {
    const pista = document.getElementById('pista');
    const auto = document.getElementById('auto');
    const txtVuelta = document.getElementById('num-vuelta');
    const listaTiming = document.getElementById('lista-timing');

    // 1. Base de datos con nombres ficticios/temporales para pruebas
    const nombresCircuitos = [
        "Gran Premio del Norte", "Circuito del Valle", "Autódromo de la Costa", 
        "Street Circuit Capital", "Speedway Industrial", "GP del Desierto"
    ];

    const poolEquipos = [
        { nombre: "Alpha Racing", color: "#FF5733", piloto: "J. Doe" },
        { nombre: "Beta Motors", color: "#33FF57", piloto: "A. Smith" },
        { nombre: "Gamma Team", color: "#3357FF", piloto: "P. Müller" },
        { nombre: "Delta Sport", color: "#F3FF33", piloto: "Y. Sato" },
        { nombre: "Epsilon F1", color: "#FF33F3", piloto: "M. Bianchi" },
        { nombre: "Zeta Scuderia", color: "#33FFF0", piloto: "L. Rossi" },
        { nombre: "Eta Engineering", color: "#FFAF33", piloto: "E. Jones" },
        { nombre: "Theta Racing", color: "#AF33FF", piloto: "K. Alwan" },
        { nombre: "Iota Performance", color: "#33FFAF", piloto: "N. Nielsen" },
        { nombre: "Kappa GP", color: "#FF3333", piloto: "C. Dupont" },
        { nombre: "Omega Motorsport", color: "#FFFFFF", piloto: "S. Vettel" }
    ];

    // Elegir circuito al azar para esta sesión
    const circuitoActual = nombresCircuitos[Math.floor(Math.random() * nombresCircuitos.length)];
    const infoVueltaElement = document.querySelector('.info-vuelta');
    if (infoVueltaElement) {
        infoVueltaElement.innerHTML = `📍 ${circuitoActual} | VUELTA <span id="num-vuelta">1</span>/70 | CLIMA: 🌤️ 12% Lluvia`;
    }

    // Configuración del Director de Equipo (Jugador)
    const nombreUsuario = prompt("Introduce tu nombre de Director de Equipo:", "MART");
    const directorFormateado = nombreUsuario ? nombreUsuario.toUpperCase().substring(0, 4) : "MART";

    // Asignar equipo aleatorio al jugador
    const indiceSorteado = Math.floor(Math.random() * poolEquipos.length);
    const miEquipo = poolEquipos[indiceSorteado];

    // Construir la parrilla total de 11 competidores en base a los datos
    let competidores = poolEquipos.map(eq => {
        const esJugador = eq.nombre === miEquipo.nombre;
        return {
            nombreDisplay: esJugador ? directorFormateado : eq.piloto.toUpperCase(),
            equipo: eq.nombre,
            color: eq.color,
            esJugador: esJugador,
            progreso: 0,
            velocidadBase: esJugador ? 0.0016 : 0.0013 + (Math.random() * 0.0006), // Pequeña variación de velocidad para la IA
            desgasteGoma: 100,
            vueltaActual: 1
        };
    });

    // Cambiar color del punto del auto en el mapa según el equipo que te tocó
    if (auto) auto.setAttribute('fill', miEquipo.color);

    // 2. Renderizado de la tabla de posiciones en pantalla (Live Timing)
    function renderizarTabla() {
        if (!listaTiming) return;

        // Ordenar competidores según quién va ganando la carrera (mayor vuelta y mayor progreso)
        competidores.sort((a, b) => {
            if (b.vueltaActual !== a.vueltaActual) {
                return b.vueltaActual - a.vueltaActual;
            }
            return b.progreso - a.progreso;
        });

        let htmlContenido = "";
        competidores.forEach((comp, index) => {
            const claseTuAuto = comp.esJugador ? "tu-auto" : "";
            const iconoGoma = comp.desgasteGoma > 40 ? "🔴" : comp.desgasteGoma > 15 ? "🟡" : "⚪";
            
            htmlContenido += `
                <div class="fila-piloto ${claseTuAuto}" style="border-left-color: ${comp.color}; margin-bottom: 6px;">
                    <span>${index + 1}º <b>${comp.nombreDisplay}</b> (${comp.equipo})</span>
                    <span class="goma">${iconoGoma} ${Math.floor(comp.desgasteGoma)}%</span>
                </div>
            `;
        });
        listaTiming.innerHTML = htmlContenido;
    }

    // 3. Motor de física y simulación del tiempo real
    function simularCarrera() {
        competidores.forEach(comp => {
            // Factor de rendimiento según desgaste de neumáticos
            let factorGoma = comp.desgasteGoma / 100;
            let velocidadActual = comp.velocidadBase * (0.6 + factorGoma * 0.4);

            // Mover auto
            comp.progreso += velocidadActual;

            // Control de paso por meta
            if (comp.progreso > 1) {
                comp.progreso = 0;
                comp.vueltaActual++;
                
                // Si el jugador pasa por meta, actualizamos el contador global superior
                if (comp.esJugador) {
                    const txtVueltaDinamico = document.getElementById('num-vuelta');
                    if (txtVueltaDinamico) txtVueltaDinamico.innerText = comp.vueltaActual;
                }
            }

            // Desgaste de neumáticos simétrico
            if (comp.desgasteGoma > 0) {
                let tasaDesgaste = velocidadActual * (comp.esJugador ? 6 : 4);
                comp.desgasteGoma -= tasaDesgaste;
                if (comp.desgasteGoma < 0) comp.desgasteGoma = 0;
            } else if (!comp.esJugador && comp.desgasteGoma === 0) {
                // La IA entra a boxes automáticamente si se queda sin goma
                comp.desgasteGoma = 100;
            }
        });

        // Mover físicamente el punto del jugador en el mapa SVG
        const jugador = competidores.find(c => c.esJugador);
        if (pista && auto && jugador) {
            const longitudPista = pista.getTotalLength();
            const puntoEnPista = pista.getPointAtLength(jugador.progreso * longitudPista);
            auto.setAttribute('cx', puntoEnPista.x);
            auto.setAttribute('cy', puntoEnPista.y);
        }

        // Renderizar cambios visuales
        renderizarTabla();

        // Siguiente cuadro de animación
        requestAnimationFrame(simularCarrera);
    }

    // 4. Interacciones del panel de control
    window.cambiarRitmo = function(ritmo) {
        const jugador = competidores.find(c => c.esJugador);
        if (!jugador) return;

        document.querySelectorAll('.btn-ritmo').forEach(b => b.classList.remove('activo'));
        
        if (ritmo === 'conservar') {
            jugador.velocidadBase = 0.0010;
            document.getElementById('btn-conservar').classList.add('activo');
        } else if (ritmo === 'normal') {
            jugador.velocidadBase = 0.0017;
            document.getElementById('btn-normal').classList.add('activo');
        } else if (ritmo === 'ataque') {
            jugador.velocidadBase = 0.0030;
            document.getElementById('btn-ataque').classList.add('activo');
        }
    };

    window.entrarABoxes = function() {
        const jugador = competidores.find(c => c.esJugador);
        if (jugador) {
            jugador.desgasteGoma = 100;
            alert(`🏎️ Parada en boxes realizada para ${jugador.equipo}. Neumáticos nuevos.`);
        }
    };

    // Lanzar juego
    simularCarrera();
});
