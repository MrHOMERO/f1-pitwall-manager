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
    let scoreClasificacion = (respuestasCorrectas * 1000) - (tiempoTrivia * 10);

    // Inicializar el campeonato
    configurarGranPremio(scoreClasificacion);

    function configurarGranPremio(score) {
        const indiceSorteado = Math.floor(Math.random() * poolEquipos.length);
        miEquipo = poolEquipos[indiceSorteado];

        // Cambiar dinámicamente el encabezado con info de la carrera
        const infoVueltaElement = document.querySelector('.info-vuelta');
        if (infoVueltaElement) {
            infoVueltaElement.innerHTML = `📍 GP DEL MURO | VUELTA <span id="num-vuelta">1</span>/70 | CLIMA: 🌤️ ESTABLE`;
        }

        // Mapear la grilla con las ventajas iniciales del simulador
        competidores = poolEquipos.map((eq, id) => {
            const esJugador = eq.nombre === miEquipo.nombre;
            
            let ventajaSalida = 0;
            if (esJugador) {
                // Ventaja de metros según rendimiento en la trivia
                ventajaSalida = Math.max(0, score / 4000) * 0.06; 
            } else {
                ventajaSalida = Math.random() * 0.03;
            }

            return {
                id: `auto-${id}`,
                nombreDisplay: esJugador ? directorFormateado : eq.piloto.toUpperCase(),
                equipo: eq.nombre,
                color: eq.color,
                esJugador: esJugador,
                progreso: ventajaSalida,
                velocidadBase: esJugador ? 0.0016 : 0.0012 + (Math.random() * 0.0006),
                desgasteGoma: 100,
                vueltaActual: 1
            };
        });

        // Dibujar círculos en el circuito SVG
        inicializarAutosEnMapa();
        
        // El alert que frenaba el juego fue eliminado por completo desde aquí.
        
        // Iniciar el bucle de simulación en vivo
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

            if (comp.progreso > 1) {
                comp.progreso = 0;
                comp.vueltaActual++;
                if (comp.esJugador) {
                    const txtVueltaDinamico = document.getElementById('num-vuelta');
                    if (txtVueltaDinamico) txtVueltaDinamico.innerText = comp.vueltaActual;
                }
            }

            if (comp.desgasteGoma > 0) {
                let tasaDesgaste = velocidadActual * (comp.esJugador ? 6 : 4);
                comp.desgasteGoma -= tasaDesgaste;
                if (comp.desgasteGoma < 0) comp.desgasteGoma = 0;
            } else if (!comp.esJugador && comp.desgasteGoma === 0) {
                comp.desgasteGoma = 100;
            }

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

    // PANEL DE MANDOS: Controladores de ritmo de carrera
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
