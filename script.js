document.addEventListener('DOMContentLoaded', () => {
    const pista = document.getElementById('pista');
    const contenedorAutos = document.getElementById('contenedor-autos');
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

    // Elegir un circuito al azar al iniciar la partida
    const circuitoActual = nombresCircuitos[Math.floor(Math.random() * nombresCircuitos.length)];
    const infoVueltaElement = document.querySelector('.info-vuelta');
    if (infoVueltaElement) {
        infoVueltaElement.innerHTML = `📍 ${circuitoActual} | VUELTA <span id="num-vuelta">1</span>/70 | CLIMA: 🌤️ 12% Lluvia`;
    }

    // Configuración del nombre del Director (Jugador)
    const nombreUsuario = prompt("Introduce tu nombre de Director de Equipo:", "MART");
    const directorFormateado = nombreUsuario ? nombreUsuario.toUpperCase().substring(0, 4) : "MART";

    // Sorteo aleatorio del equipo que manejará el jugador
    const indiceSorteado = Math.floor(Math.random() * poolEquipos.length);
    const miEquipo = poolEquipos[indiceSorteado];

    // Construir la parrilla lógica de los 11 competidores
    let competidores = poolEquipos.map((eq, id) => {
        const esJugador = eq.nombre === miEquipo.nombre;
        return {
            id: `auto-${id}`,
            nombreDisplay: esJugador ? directorFormateado : eq.piloto.toUpperCase(),
            equipo: eq.nombre,
            color: eq.color,
            esJugador: esJugador,
            progreso: 0,
            velocidadBase: esJugador ? 0.0016 : 0.0012 + (Math.random() * 0.0006), // Pequeña ventaja para el jugador al inicio
            desgasteGoma: 100,
            vueltaActual: 1
        };
    });

    // 2. Crear los 11 puntos de colores en el circuito dinámicamente
    function inicializarAutosEnMapa() {
        if (!contenedorAutos) return;
        let htmlAutos = "";
        competidores.forEach(comp => {
            // El auto del jugador es un milímetro más grande (radio 7) para distinguirse en pista
            const radio = comp.esJugador ? "7" : "5";
            htmlAutos += `<circle id="${comp.id}" r="${radio}" fill="${comp.color}" stroke="#111" stroke-width="1" />`;
        });
        contenedorAutos.innerHTML = htmlAutos;
    }

    // 3. Renderizado de la tabla de posiciones (Live Timing) con emoji de rueda 🛞
    function renderizarTabla() {
        if (!listaTiming) return;

        // Ordenamos la tabla según las vueltas y el progreso en pista de cada uno
        let ordenados = [...competidores].sort((a, b) => {
            if (b.vueltaActual !== a.vueltaActual) {
                return b.vueltaActual - a.vueltaActual;
            }
            return b.progreso - a.progreso;
        });

        let htmlContenido = "";
        ordenados.forEach((comp, index) => {
            const claseTuAuto = comp.esJugador ? "tu-auto" : "";
            
            htmlContenido += `
                <div class="fila-piloto ${claseTuAuto}" style="border-left-color: ${comp.color}; margin-bottom: 6px;">
                    <span>${index + 1}º <b>${comp.nombreDisplay}</b> (${comp.equipo})</span>
                    <span class="goma">🛞 ${Math.floor(comp.desgasteGoma)}%</span>
                </div>
            `;
        });
        listaTiming.innerHTML = htmlContenido;
    }

    // 4. Motor principal de simulación y actualización de coordenadas en tiempo real
    function simularCarrera() {
        competidores.forEach(comp => {
            // Afectamos el rendimiento del auto basado en la vida del neumático
            let factorGoma = comp.desgasteGoma / 100;
            let velocidadActual = comp.velocidadBase * (0.6 + factorGoma * 0.4);

            comp.progreso += velocidadActual;

            // Control de meta y cambio de vueltas
            if (comp.progreso > 1) {
                comp.progreso = 0;
                comp.vueltaActual++;
                
                if (comp.esJugador) {
                    const txtVueltaDinamico = document.getElementById('num-vuelta');
                    if (txtVueltaDinamico) txtVueltaDinamico.innerText = comp.vueltaActual;
                }
            }

            // Desgaste de neumáticos progresivo
            if (comp.desgasteGoma > 0) {
                let tasaDesgaste = velocidadActual * (comp.esJugador ? 6 : 4);
                comp.desgasteGoma -= tasaDesgaste;
                if (comp.desgasteGoma < 0) comp.desgasteGoma = 0;
            } else if (!comp.esJugador && comp.desgasteGoma === 0) {
                // Parada en boxes automatizada e instantánea para la Inteligencia Artificial
                comp.desgasteGoma = 100;
            }

            // Mover físicamente el círculo en el mapa SVG usando trigonometría de trazado
            const puntoGrafico = document.getElementById(comp.id);
            if (pista && puntoGrafico) {
                const longitudPista = pista.getTotalLength();
                const puntoEnPista = pista.getPointAtLength(comp.progreso * longitudPista);
                puntoGrafico.setAttribute('cx', puntoEnPista.x);
                puntoGrafico.setAttribute('cy', puntoEnPista.y);
            }
        });

        // Refrescar el Live Timing central
        renderizarTabla();
        
        // Mantener el bucle fluido de animación
        requestAnimationFrame(simularCarrera);
    }

    // Funciones de control de estrategia (vinculadas a los botones del panel)
    window.cambiarRitmo = function(ritmo) {
        const jugador = competidores.find(c => c.esJugador);
        if (!jugador) return;

        document.querySelectorAll('.btn-ritmo').forEach(b => b.classList.remove('activo'));
        
        if (ritmo === 'conservar') {
            jugador.velocidadBase = 0.0009; // Ritmo lento, cuida el neumático
            document.getElementById('btn-conservar').classList.add('activo');
        } else if (ritmo === 'normal') {
            jugador.velocidadBase = 0.0016; // Ritmo estándar
            document.getElementById('btn-normal').classList.add('activo');
        } else if (ritmo === 'ataque') {
            jugador.velocidadBase = 0.0030; // Ritmo agresivo de adelantamiento
            document.getElementById('btn-ataque').classList.add('activo');
        }
    };

    window.entrarABoxes = function() {
        const jugador = competidores.find(c => c.esJugador);
        if (jugador) {
            jugador.desgasteGoma = 100;
            alert(`🏎️ Parada en boxes realizada para ${jugador.equipo}. ¡Neumáticos renovados!`);
        }
    };

    // Lanzar todo el entorno seguro del juego
    inicializarAutosEnMapa();
    simularCarrera();
});
