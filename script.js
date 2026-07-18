document.addEventListener('DOMContentLoaded', () => {
    // 1. CAPTURA DE PARÁMETROS DE LA CLASIFICACIÓN (Procedentes de trivia.html)
    const urlParams = new URLSearchParams(window.location.search);
    const directorFormateado = (urlParams.get('director') || 'MART').toUpperCase().substring(0, 4);
    const respuestasCorrectas = parseInt(urlParams.get('correctas') || '0', 10);
    const tiempoTrivia = parseFloat(urlParams.get('tiempo') || '0');

    // Referencias del DOM de la carrera
    const pista = document.getElementById('pista');
    const contenedorAutos = document.getElementById('contenedor-autos');
    const txtVuelta = document.getElementById('num-vuelta');
    const listaTiming = document.getElementById('lista-timing');

    // Base de datos fija del campeonato
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

    let miEquipo = null;
    let competidores = [];

    // 2. SISTEMA DE SCORE Y CÁLCULO DE GRILLA DE SALIDA
    // A más aciertos y menos tiempo, mayor puntuación de clasificación.
    let scoreClasificacion = (respuestasCorrectas * 1000) - (tiempoTrivia * 10);

    // Inicializar el campeonato
    configurarGranPremio(scoreClasificacion);

    function configurarGranPremio(score) {
        // Al arrancar de forma modular, el sistema te asigna una escudería del pool de forma justa
        // En base a tu score, el algoritmo te posicionará con mayor o menor ventaja
        const indiceSorteado = Math.floor(Math.random() * poolEquipos.length);
        miEquipo = poolEquipos[indiceSorteado];

        // Cambiar dinámicamente el encabezado con info contextualizada
        const infoVueltaElement = document.querySelector('.info-vuelta');
        if (infoVueltaElement) {
            infoVueltaElement.innerHTML = `📍 GP DEL MURO | VUELTA <span id="num-vuelta">1</span>/70 | CLIMA: 🌤️ ESTABLE`;
        }

        // Mapear la grilla con las ventajas iniciales del simulador de carrera
        competidores = poolEquipos.map((eq, id) => {
            const esJugador = eq.nombre === miEquipo.nombre;
            
            // Ventaja de salida en metros de progreso (el mapa corre de 0 a 1)
            let ventajaSalida = 0;
            if (esJugador) {
                // Si respondiste todo bien y rápido, sumás hasta un 6% de pista adelantada en la largada
                ventajaSalida = Math.max(0, score / 4000) * 0.06; 
            } else {
                // La IA larga con un factor aleatorio normal de clasificación
                ventajaSalida = Math.random() * 0.03;
            }

            return {
                id: `auto-${id}`,
                nombreDisplay: esJugador ? directorFormateado : eq.piloto.toUpperCase(),
                equipo: eq.nombre,
                color: eq.color,
                esJugador: esJugador,
                progreso: ventajaSalida,
                // Si sos el jugador, tu velocidad inicial depende de tu ritmo; para la IA es variable
                velocidadBase: esJugador ? 0.0016 : 0.0012 + (Math.random() * 0.0006),
                desgasteGoma: 100,
                vueltaActual: 1
            };
        });

        // Dibujar círculos en el circuito SVG
        inicializarAutosEnMapa();
        
        // Cartel informativo industrial detallando el rendimiento de la trivia
        alert(`🏁 INFORME DE TELEMETRÍA - CLASIFICACIÓN\n\n` +
              `• Director: ${directorFormateado}\n` +
              `• Aciertos: ${respuestasCorrectas} / 3\n` +
              `• Tiempo: ${tiempoTrivia} segundos\n` +
              `• Escudería Asignada: ${miEquipo.nombre}\n\n` +
              `¡Ajustando posiciones en la grilla de salida. Luces fuera!`);
        
        // Iniciar el bucle de renderizado en vivo
        simularCarrera();
    }

    function inicializarAutosEnMapa() {
        if (!contenedorAutos) return;
        let htmlAutos = "";
        competidores.forEach(comp => {
            const radio = comp.esJugador ? "7" : "5";
            htmlAutos += `<circle id="${comp.id}" r="${radio}" fill="${comp.color}" stroke="#111" stroke-width="1" />`;
        });
        contenedorAutos.innerHTML = htmlAutos;
    }

    function renderizarTabla() {
        if (!listaTiming) return;

        // Ordenar la lista en tiempo real por vuelta y luego por progreso dentro de la vuelta
        let ordenados = [...competidores].sort((a, b) => {
            if (b.vueltaActual !== a.vueltaActual) return b.vueltaActual - a.vueltaActual;
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

    function simularCarrera() {
        competidores.forEach(comp => {
            let factorGoma = comp.desgasteGoma / 100;
            let velocidadActual = comp.velocidadBase * (0.6 + factorGoma * 0.4);

            comp.progreso += velocidadActual;

            // Cruzar la línea de meta e iniciar nueva vuelta
            if (comp.progreso > 1) {
                comp.progreso = 0;
                comp.vueltaActual++;
                if (comp.esJugador) {
                    const txtVueltaDinamico = document.getElementById('num-vuelta');
                    if (txtVueltaDinamico) txtVueltaDinamico.innerText = comp.vueltaActual;
                }
            }

            // Desgaste progresivo según la velocidad y el ritmo del coche
            if (comp.desgasteGoma > 0) {
                let tasaDesgaste = velocidadActual * (comp.esJugador ? 6 : 4);
                comp.desgasteGoma -= tasaDesgaste;
                if (comp.desgasteGoma < 0) comp.desgasteGoma = 0;
            } else if (!comp.esJugador && comp.desgasteGoma === 0) {
                // Mecánica básica para que la IA resetee gomas al llegar a cero
                comp.desgasteGoma = 100;
            }

            // Mover los nodos de los círculos sobre el trazado SVG de la pista
            const puntoGrafico = document.getElementById(comp.id);
            if (pista && puntoGrafico) {
                const longitudPista = pista.getTotalLength();
                const puntoEnPista = pista.getPointAtLength(comp.progreso * longitudPista);
                puntoGrafico.setAttribute('cx', puntoEnPista.x);
                puntoGrafico.setAttribute('cy', puntoEnPista.y);
            }
        });

        renderizarTabla();
        requestAnimationFrame(simularCarrera);
    }

    // PANEL DE MANDOS: Controladores vinculados a los botones de la interfaz
    window.cambiarRitmo = function(ritmo) {
        if (competidores.length === 0) return;
        const jugador = competidores.find(c => c.esJugador);
        if (!jugador) return;

        document.querySelectorAll('.btn-ritmo').forEach(b => b.classList.remove('activo'));
        if (ritmo === 'conservar') {
            jugador.velocidadBase = 0.0009;
            document.getElementById('btn-conservar').classList.add('activo');
        } else if (ritmo === 'normal') {
            jugador.velocidadBase = 0.0016;
            document.getElementById('btn-normal').classList.add('activo');
        } else if (ritmo === 'ataque') {
            jugador.velocidadBase = 0.0030;
            document.getElementById('btn-ataque').classList.add('activo');
        }
    };

    window.entrarABoxes = function() {
        if (competidores.length === 0) return;
        const jugador = competidores.find(c => c.esJugador);
        if (jugador) {
            jugador.desgasteGoma = 100;
            alert(`🏎️ ESTRATEGIA: Parada de neumáticos completada con éxito. ¡A recuperar terreno!`);
        }
    };
});
