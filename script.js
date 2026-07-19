const calendario = [{ 
    nombre: "GP de Australia", 
    d: "M 120,130 L 120,110 C 120,80 150,70 170,80 L 180,100 L 160,110 L 160,130 L 120,130 M 120,130 C 100,130 80,130 70,120 C 50,100 40,80 50,60 C 60,40 80,30 100,30 C 130,30 150,50 150,70 L 140,70 C 140,55 120,45 100,45 C 80,45 70,60 70,80 C 70,100 90,115 110,115 L 120,115" 
}];

// Definimos los autos: jugador + rivales
let autos = [
    { id: 'jugador', piloto: 'Tú', tipoGoma: 'blando', desgaste: 100, progreso: 0, color: '#fff' },
    { id: 'rival-1', piloto: 'Russell', tipoGoma: 'blando', desgaste: 95, progreso: 0, color: '#00D2BE' },
    { id: 'rival-2', piloto: 'Leclerc', tipoGoma: 'medio', desgaste: 100, progreso: 0, color: '#DC0000' }
];

let lastTimestamp = 0;
const TIEMPO_VUELTA_IDEAL = 60; 

function simularCarrera(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    const pista = document.getElementById('pista');
    const longitud = pista.getTotalLength();

    autos.forEach(auto => {
        // Lógica de desgaste independiente
        const desgasteTasa = { blando: 0.8, medio: 0.4, duro: 0.2 };
        auto.desgaste -= desgasteTasa[auto.tipoGoma] * deltaTime;
        
        // Si el desgaste es muy bajo, fuerzan parada (IA simple)
        if (auto.desgaste < 10 && auto.id !== 'jugador') auto.desgaste = 100;

        // Cálculo de velocidad según compuesto y desgaste
        let velocidadReal = (1 / TIEMPO_VUELTA_IDEAL) * deltaTime * (auto.desgaste / 100);
        auto.progreso += velocidadReal;
        if (auto.progreso > 1) auto.progreso = 0;

        // Renderizado
        const punto = pista.getPointAtLength(auto.progreso * longitud);
        const el = document.getElementById(auto.id);
        if (el) { el.setAttribute('cx', punto.x); el.setAttribute('cy', punto.y); }
    });

    actualizarInterfaz();
    requestAnimationFrame(simularCarrera);
}

function actualizarInterfaz() {
    const jugador = autos[0];
    const info = document.getElementById('estado-neumatico');
    info.innerText = `Gomas: ${jugador.tipoGoma.toUpperCase()} | Desgaste: ${Math.floor(jugador.desgaste)}%`;
}

function cambiarGomas(tipo) {
    autos[0].tipoGoma = tipo;
    autos[0].desgaste = 100;
    document.getElementById('modal-boxes').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('pista').setAttribute('d', calendario[0].d);
    document.getElementById('contenedor-autos').innerHTML = autos.map(a => 
        `<circle id="${a.id}" r="4" fill="${a.color}" />`).join('');
    requestAnimationFrame(simularCarrera);
});
