document.addEventListener('DOMContentLoaded', () => {
    // 1. CONFIGURACIÓN INICIAL
    const urlParams = new URLSearchParams(window.location.search);
    const director = (urlParams.get('director') || 'CARLOS').toUpperCase().substring(0, 12);
    const escuderiaElegida = urlParams.get('escuderia') || 'Alpha Racing';

    const poolEquipos = [
        { nombre: "Alpha Racing", color: "#FF5733", p1: "J. DOE", p2: "A. X" },
        { nombre: "Beta Motors", color: "#33FF57", p1: "A. SMITH", p2: "B. Y" },
        { nombre: "Gamma Team", color: "#3357FF", p1: "P. MÜLLER", p2: "C. Z" },
        { nombre: "Delta Sport", color: "#F3FF33", p1: "Y. SATO", p2: "D. W" },
        { nombre: "Epsilon F1", color: "#FF33F3", p1: "M. BIANCHI", p2: "E. V" },
        { nombre: "Zeta Scuderia", color: "#33FFF0", p1: "L. ROSSI", p2: "F. U" },
        { nombre: "Eta Engineering", color: "#FFAF33", p1: "E. JONES", p2: "G. T" },
        { nombre: "Theta Racing", color: "#AF33FF", p1: "K. ALWAN", p2: "H. S" },
        { nombre: "Iota Performance", color: "#33FFAF", p1: "N. NIELSEN", p2: "I. R" },
        { nombre: "Kappa GP", color: "#FF3333", p1: "C. DUPONT", p2: "J. Q" },
        { nombre: "Omega Motorsport", color: "#FFFFFF", p1: "S. VETTEL", p2: "K. P" }
    ];

    let autos = [];
    poolEquipos.forEach((eq, idx) => {
        autos.push({ id: `p${idx*2}`, piloto: (eq.nombre === escuderiaElegida ? director : eq.p1), equipo: eq.nombre, tipoGoma: 'blando', desgasteGoma: 100, progreso: Math.random() * 0.05, esJugador: (eq.nombre === escuderiaElegida && idx === 0), color: eq.color, velBase: 0.0014 });
        autos.push({ id: `p${idx*2+1}`, piloto: eq.p2, equipo: eq.nombre, tipoGoma: 'blando', desgasteGoma: 100, progreso: Math.random() * 0.05, esJugador: false, color: eq.color, velBase: 0.0013 });
    });

    let clima = 'seco';
    let carreraIniciada = false;

    // 2. LÓGICA DE LARGADA (SEMÁFORO)
    window.iniciarLargada = () => {
        document.getElementById('pantalla-largada').style.display = 'flex';
        let luces = document.querySelectorAll('.luz');
        let i = 0;
        let interval = setInterval(() => {
            if (i < luces.length) {
                luces[i].style.background = '#ff0000';
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    luces.forEach(l => l.style.background = '#333');
                    document.getElementById('pantalla-largada').style.display = 'none';
                    document.getElementById('pantalla-carrera').style.display = 'flex';
                    carreraIniciada = true;
                    requestAnimationFrame(simular);
                }, 1000);
            }
        }, 3000);
    };

    // 3. MOTOR DE SIMULACIÓN
    function simular() {
        if (!carreraIniciada) return;
        if (Math.random() < 0.0005) clima = 'lluvia';

        autos.forEach(a => {
            let factorLluvia = (clima === 'lluvia' && a.tipoGoma !== 'lluvia') ? 0.4 : 1;
            a.progreso += (a.velBase * (a.desgasteGoma / 100) * factorLluvia);
            if (a.progreso > 1) a.progreso = 0;
            a.desgasteGoma = Math.max(0, a.desgasteGoma - 0.02);

            const p = document.getElementById('pista').getPointAtLength(a.progreso * 500);
            const el = document.getElementById(a.id);
            if (el) { el.setAttribute('cx', p.x); el.setAttribute('cy', p.y); }
        });

        renderizarTabla();
        requestAnimationFrame(simular);
    }

    function renderizarTabla() {
        const lista = document.getElementById('lista-timing');
        let ordenados = [...autos].sort((a, b) => b.progreso - a.progreso);
        let jIdx = ordenados.findIndex(c => c.esJugador);
        
        lista.innerHTML = ordenados.map((a, i) => `
            <div style="${a.esJugador ? 'background:#444' : ''}; padding:10px; border-bottom:1px solid #333;">
                ${i + 1}º ${a.piloto} | ${a.tipoGoma.toUpperCase()} | ${Math.floor(a.desgasteGoma)}%
            </div>
        `).join('');
    }

    // 4. CONTROLES MÓVILES
    window.cambiarRitmo = (r) => { autos[0].velBase = (r === 'ataque') ? 0.0025 : (r === 'conservar' ? 0.001 : 0.0016); };
    window.abrirModalBoxes = () => { document.getElementById('modal-boxes').style.display = 'block'; };
    window.cambiarGomas = (t) => { 
        autos[0].tipoGoma = t; 
        autos[0].desgasteGoma = 100; 
        document.getElementById('modal-boxes').style.display = 'none'; 
    };

    // Inicialización visual
    document.getElementById('pista').setAttribute('d', "M 120,130 L 120,110 C 120,80 150,70 170,80 L 180,100 L 160,110 L 160,130 L 120,130 M 120,130 C 100,130 80,130 70,120 C 50,100 40,80 50,60 C 60,40 80,30 100,30 C 130,30 150,50 150,70 L 140,70 C 140,55 120,45 100,45 C 80,45 70,60 70,80 C 70,100 90,115 110,115 L 120,115");
    document.getElementById('contenedor-autos').innerHTML = autos.map(a => `<circle id="${a.id}" r="4" fill="${a.color}" />`).join('');
});
