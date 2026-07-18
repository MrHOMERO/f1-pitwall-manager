/**
 * F1 PIT WALL MANAGER: GP DE AUSTRALIA 2026
 */

const calendario = [
    { 
        nombre: "GP de Australia", 
        d: "M 120,130 L 120,110 C 120,80 150,70 170,80 L 180,100 L 160,110 L 160,130 L 120,130 M 120,130 C 100,130 80,130 70,120 C 50,100 40,80 50,60 C 60,40 80,30 100,30 C 130,30 150,50 150,70 L 140,70 C 140,55 120,45 100,45 C 80,45 70,60 70,80 C 70,100 90,115 110,115 L 120,115" 
    }
];

// Parrilla basada en resultados reales 2026
const parrilla = [
    { piloto: "G. Russell", equipo: "Mercedes", color: "#00D2BE", vel: 0.0022 },
    { piloto: "K. Antonelli", equipo: "Mercedes", color: "#00D2BE", vel: 0.0021 },
    { piloto: "C. Leclerc", equipo: "Ferrari", color: "#DC0000", vel: 0.0020 },
    { piloto: "L. Hamilton", equipo: "Ferrari", color: "#DC0000", vel: 0.0019 },
    { piloto: "L. Norris", equipo: "McLaren", color: "#FF8700", vel: 0.0018 },
    { piloto: "M. Verstappen", equipo: "Red Bull", color: "#0600EF", vel: 0.0025 }, // Velocidad de remontada
    { piloto: "F. Colapinto", equipo: "Alpine", color: "#0058A8", vel: 0.0015 }
];

let indiceCircuito = 0;
let carreraActiva = false;
let competidores = [];

document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrera();
});

function inicializarCarrera() {
    const circuito = calendario[indiceCircuito];
    document.getElementById('pista').setAttribute('d', circuito.d);
    document.getElementById('header-carrera').innerHTML = 
        `📍 ${circuito.nombre.toUpperCase()} <button onclick="irABoxes()">BOXES</button>`;
    
    competidores = parrilla.map((p, i) => ({
        id: `auto-${i}`,
        color: p.color,
        progreso: 0,
        velocidadBase: p.vel + (Math.random() * 0.0002) // Ligera variabilidad
    }));

    renderizarAutos();
    carreraActiva = true;
    simularCarrera();
}

function renderizarAutos() {
    const contenedor = document.getElementById('contenedor-autos');
    contenedor.innerHTML = competidores.map(c => 
        `<circle id="${c.id}" r="4" fill="${c.color}" stroke="#fff" />`
    ).join('');
}

function simularCarrera() {
    if (!carreraActiva) return;
    const pista = document.getElementById('pista');
    const longitud = pista.getTotalLength();

    competidores.forEach(comp => {
        comp.progreso += comp.velocidadBase;
        if (comp.progreso > 1) comp.progreso = 0;
        const punto = pista.getPointAtLength(comp.progreso * longitud);
        const auto = document.getElementById(comp.id);
        if (auto) {
            auto.setAttribute('cx', punto.x);
            auto.setAttribute('cy', punto.y);
        }
    });
    requestAnimationFrame(simularCarrera);
}

function cambiarRitmo(ritmo) {
    const factor = ritmo === 'ataque' ? 1.5 : (ritmo === 'conservar' ? 0.7 : 1);
    competidores.forEach(c => c.velocidadBase *= factor);
}

function irABoxes() {
    carreraActiva = false;
    alert("Entrando a Boxes...");
    indiceCircuito = (indiceCircuito + 1) % calendario.length;
    inicializarCarrera();
        }
