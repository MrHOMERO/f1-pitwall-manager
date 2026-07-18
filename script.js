/**
 * GESTOR DE CARRERAS: F1 PIT WALL MANAGER
 */

const calendario = [
    { nombre: "GP de Australia", d: "M 40,70 C 70,50 110,50 130,65 C 160,85 170,120 150,140 Z" },
    { nombre: "GP de China", d: "M 45,60 C 90,40 140,45 165,70 C 140,95 100,70 95,95 Z" },
    { nombre: "GP de Japón", d: "M 35,140 C 45,100 70,95 90,115 C 110,135 130,115 160,110 Z" },
    { nombre: "GP de Baréin", d: "M 50,50 L 140,50 L 150,80 L 120,95 Z" },
    { nombre: "GP de Arabia Saudita", d: "M 35,50 C 80,45 130,40 170,45 Z" },
    { nombre: "GP de Miami", d: "M 35,80 C 70,70 120,65 165,75 Z" },
    { nombre: "GP de Canadá", d: "M 40,65 L 160,55 L 150,115 L 125,105 Z" },
    { nombre: "GP de Mónaco", d: "M 60,60 C 95,50 135,55 150,75 Z" },
    { nombre: "GP de España", d: "M 40,85 C 75,70 125,70 165,80 Z" },
    { nombre: "GP de Austria", d: "M 50,90 L 130,60 L 155,90 Z" },
    { nombre: "GP de Gran Bretaña", d: "M 50,65 L 115,55 L 145,85 Z" },
    { nombre: "GP de Bélgica", d: "M 45,80 C 85,60 135,55 160,85 Z" },
    { nombre: "GP de Hungría", d: "M 55,60 L 135,60 L 145,95 Z" },
    { nombre: "GP de Países Bajos", d: "M 45,75 C 80,65 125,65 155,80 Z" },
    { nombre: "GP de Italia", d: "M 40,130 L 160,130 C 175,110 Z" },
    { nombre: "GP de España (Madrid)", d: "M 45,85 L 125,75 L 155,105 Z" },
    { nombre: "GP de Azerbaiyán", d: "M 40,75 L 155,75 L 165,125 Z" },
    { nombre: "GP de Singapur", d: "M 45,70 L 135,65 L 150,95 Z" },
    { nombre: "GP de Estados Unidos", d: "M 40,95 L 125,65 L 160,95 Z" },
    { nombre: "GP de México", d: "M 45,75 L 150,75 L 140,115 Z" },
    { nombre: "GP de Brasil", d: "M 55,70 C 95,60 145,65 155,95 Z" },
    { nombre: "GP de Las Vegas", d: "M 40,80 L 160,80 L 155,135 Z" },
    { nombre: "GP de Catar", d: "M 50,75 L 135,65 L 155,100 Z" },
    { nombre: "GP de Abu Dabi", d: "M 45,90 L 130,65 L 165,100 Z" }
];

let indiceCircuito = 0;
let carreraActiva = false;

document.addEventListener('DOMContentLoaded', () => {
    cargarCircuito(indiceCircuito);
});

function cargarCircuito(index) {
    const circuito = calendario[index];
    document.getElementById('pista').setAttribute('d', circuito.d);
    document.getElementById('header-carrera').innerHTML = 
        `📍 ${circuito.nombre.toUpperCase()} <button onclick="irABoxes()">BOXES</button>`;
    
    carreraActiva = true;
    simularCarrera();
}

function irABoxes() {
    carreraActiva = false;
    alert("Entrando a Boxes...");
    
    indiceCircuito++;
    if (indiceCircuito < calendario.length) {
        cargarCircuito(indiceCircuito);
    } else {
        alert("¡Campeón del Mundo!");
        indiceCircuito = 0;
        cargarCircuito(indiceCircuito);
    }
}

function simularCarrera() {
    if (!carreraActiva) return;
    requestAnimationFrame(simularCarrera);
}

function cambiarRitmo(ritmo) {
    console.log("Cambiando ritmo a:", ritmo);
}
