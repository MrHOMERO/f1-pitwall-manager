document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const director = (urlParams.get('director') || 'CARLOS').toUpperCase().substring(0, 12);
    const escuderiaElegida = urlParams.get('escuderia') || 'Alpha Racing';

    const poolEquipos = [
        { nombre: "Alpha Racing", color: "#FF5733", piloto1: "J. DOE", piloto2: "A. X" },
        { nombre: "Beta Motors", color: "#33FF57", piloto1: "A. SMITH", piloto2: "B. Y" },
        { nombre: "Gamma Team", color: "#3357FF", piloto1: "P. MÜLLER", piloto2: "C. Z" },
        { nombre: "Delta Sport", color: "#F3FF33", piloto1: "Y. SATO", piloto2: "D. W" },
        { nombre: "Epsilon F1", color: "#FF33F3", piloto1: "M. BIANCHI", piloto2: "E. V" },
        { nombre: "Zeta Scuderia", color: "#33FFF0", piloto1: "L. ROSSI", piloto2: "F. U" },
        { nombre: "Eta Engineering", color: "#FFAF33", piloto1: "E. JONES", piloto2: "G. T" },
        { nombre: "Theta Racing", color: "#AF33FF", piloto1: "K. ALWAN", piloto2: "H. S" },
        { nombre: "Iota Performance", color: "#33FFAF", piloto1: "N. NIELSEN", piloto2: "I. R" },
        { nombre: "Kappa GP", color: "#FF3333", piloto1: "C. DUPONT", piloto2: "J. Q" },
        { nombre: "Omega Motorsport", color: "#FFFFFF", piloto1: "S. VETTEL", piloto2: "K. P" }
    ];

    // Generar 22 pilotos basados en los 11 equipos
    let autos = [];
    poolEquipos.forEach((eq, index) => {
        // Piloto 1
        autos.push({ id: `p${index*2}`, piloto: (eq.nombre === escuderiaElegida ? director : eq.piloto1), equipo: eq.nombre, tipoGoma: 'blando', desgasteGoma: 100, progreso: Math.random() * 0.05, esJugador: (eq.nombre === escuderiaElegida && index === 0), color: eq.color, velBase: 0.0014 });
        // Piloto 2
        autos.push({ id: `p${index*2+1}`, piloto: eq.piloto2, equipo: eq.nombre, tipoGoma: 'blando', desgasteGoma: 100, progreso: Math.random() * 0.05, esJugador: false, color: eq.color, velBase: 0.0013 });
    });

    // Dibujar todos los autos en el SVG
    document.getElementById('contenedor-autos').innerHTML = autos.map(a => `<circle id="${a.id}" r="4" fill="${a.color}" stroke="#000" />`).join('');

    // ... (El resto del código del semáforo y simulación permanece igual, 
    // pero ahora el loop 'autos.forEach' manejará los 22 elementos automáticamente)
    
    function simular() {
        autos.forEach(a => {
            // Lógica de carrera para 22 autos...
            // Renderizado en SVG...
        });
        requestAnimationFrame(simular);
    }
});
