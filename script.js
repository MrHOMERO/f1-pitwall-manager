document.addEventListener('DOMContentLoaded', () => {
    // 1. CAPTURA DE PARÁMETROS DE GESTIÓN
    const urlParams = new URLSearchParams(window.location.search);
    const directorFormateado = (urlParams.get('director') || 'CARLOS').toUpperCase().substring(0, 12);
    const escuderiaElegida = urlParams.get('escuderia') || 'Alpha Racing';
    const respuestasCorrectas = parseInt(urlParams.get('correctas') || '0', 10);
    const tiempoTrivia = parseFloat(urlParams.get('tiempo') || '0');

    // Referencias DOM
    const pista = document.getElementById('pista');
    const contenedorAutos = document.getElementById('contenedor-autos');
    const listaTiming = document.getElementById('lista-timing');

    const poolEquipos = [
        { nombre: "Alpha Racing", color: "#FF5733", piloto: "J. Doe" },
        { nombre: "Beta Motors", color: "#33FF57", piloto: "A. Smith" },
        { nombre: "Gamma Team", color: "#3357FF", piloto: "P. Müller" },
        { nombre: "Delta Sport", color: "#F3FF33", piloto: "Y. Sato" },
        { nombre: "Omega Motorsport", color: "#FFFFFF", piloto: "S. Vettel" }
    ];

    let competidores = [];
    let miEquipo = poolEquipos.find(e => e.nombre === escuderiaElegida) || poolEquipos[0];
    let score = (respuestasCorrectas * 1000) - (tiempoTrivia * 10);

    // 2. CONFIGURACIÓN INICIAL
    competidores = poolEquipos.map((eq, id) => {
        const esJugador = eq.nombre === miEquipo.nombre;
        return {
            id: `auto-${id}`,
            nombreDisplay: esJugador ? directorFormateado : eq.piloto.toUpperCase(),
            equipo: eq.nombre,
            color: eq.color,
            esJugador: esJugador,
            progreso: esJugador ? Math.max(0, score / 4000) * 0.06 : Math.random() * 0.03,
            velocidadBase: esJugador ? 0.0016 : 0.0012 + (Math.random() * 0.0006),
            desgasteGoma: 100,
            vueltaActual: 1
        };
    });

    // Inyectar círculos en SVG
    contenedorAutos.innerHTML = competidores.map(c => 
        `<circle id="${c.id}" r="${c.esJugador ? "7" : "5"}" fill="${c.color}" stroke="#111" />`).join('');

    // 3. BUCLE DE CARRERA
    function simularCarrera() {
        competidores.forEach(comp => {
            let factorGoma = comp.desgasteGoma / 100;
            let velocidadActual = comp.velocidadBase * (0.6 + factorGoma * 0.4);

            comp.progreso += velocidadActual;
            if (comp.progreso > 1) { comp.progreso = 0; comp.vueltaActual++; }

            // Desgaste
            if (comp.desgasteGoma > 0) comp.desgasteGoma -= (velocidadActual * 8);
            else if (!comp.esJugador) comp.desgasteGoma = 100; // IA auto-stop

            const punto = pista.getPointAtLength(comp.progreso * pista.getTotalLength());
            const el = document.getElementById(comp.id);
            if (el) { el.setAttribute('cx', punto.x); el.setAttribute('cy', punto.y); }
        });

        renderizarTabla();
        requestAnimationFrame(simularCarrera);
    }

    function renderizarTabla() {
        let ordenados = [...competidores].sort((a, b) => b.progreso - a.progreso);
        listaTiming.innerHTML = ordenados.map((c, i) => `
            <div class="fila-piloto" style="border-left: 5px solid ${c.color}; padding: 5px; background: #222; margin: 2px;">
                ${i + 1}º ${c.nombreDisplay} 🛞 ${Math.floor(c.desgasteGoma)}%
            </div>
        `).join('');
    }

    // 4. CONTROLES EXTERNOS (Asignados al tercio inferior)
    window.cambiarRitmo = (ritmo) => {
        const jugador = competidores.find(c => c.esJugador);
        if (ritmo === 'conservar') jugador.velocidadBase = 0.0009;
        if (ritmo === 'normal') jugador.velocidadBase = 0.0016;
        if (ritmo === 'ataque') jugador.velocidadBase = 0.0030;
    };

    window.entrarABoxes = () => {
        const jugador = competidores.find(c => c.esJugador);
        jugador.desgasteGoma = 100;
        alert("Estrategia ejecutada: Parada en boxes realizada.");
    };

    simularCarrera();
});
