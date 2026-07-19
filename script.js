document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const director = (urlParams.get('director') || 'CARLOS').toUpperCase().substring(0, 12);
    
    let carreraPausada = true; 
    let autos = [];

    // Inicializar pilotos
    for (let i = 0; i < 22; i++) {
        autos.push({ id: `p${i}`, piloto: (i===0 ? director : `PILOTO ${i+1}`), tipoGoma: 'blando', desgaste: 100, progreso: Math.random() * 0.02, esJugador: (i===0), color: '#FF5733', vel: 0.0014 });
    }

    // Dibujar Albert Park
    document.getElementById('pista').setAttribute('d', "M 40,120 L 40,80 C 40,50 60,30 80,30 L 120,30 C 140,30 150,40 150,60 L 150,80 C 150,100 130,110 110,110 L 80,110 C 60,110 50,130 50,150 L 50,170 L 160,170 L 160,140 C 160,120 180,110 180,90 L 180,60 C 180,40 160,30 140,30 L 110,30 L 110,50 L 130,50 L 130,70 L 100,70 L 100,50 L 80,50 L 80,80 L 110,80 L 110,100 L 70,100 L 70,120 Z");
    document.getElementById('contenedor-autos').innerHTML = autos.map(a => `<circle id="${a.id}" r="4" fill="${a.color}" />`).join('');

    function anunciar(texto) { if ('speechSynthesis' in window) { const msg = new SpeechSynthesisUtterance(texto); msg.lang = 'es-ES'; window.speechSynthesis.speak(msg); } }

    window.iniciarLargada = () => {
        anunciar("Cinco luces rojas se encienden");
        let luces = document.querySelectorAll('.luz');
        let i = 0;
        let int = setInterval(() => {
            if (i < 5) { luces[i].style.background = '#ff0000'; i++; }
            else {
                clearInterval(int);
                anunciar("¡Bandera verde!");
                setTimeout(() => {
                    document.getElementById('pantalla-largada').style.display = 'none';
                    carreraPausada = false;
                    simular();
                }, 500);
            }
        }, 1000);
    };

    function simular() {
        if (carreraPausada) return;
        autos.forEach(a => {
            a.progreso += a.vel * (a.desgaste/100);
            if (a.progreso > 1) a.progreso = 0;
            const p = document.getElementById('pista').getPointAtLength(a.progreso * 500);
            const el = document.getElementById(a.id);
            if(el) { el.setAttribute('cx', p.x); el.setAttribute('cy', p.y); }
        });
        renderizarTabla();
        requestAnimationFrame(simular);
    }

    function renderizarTabla() {
        const list = document.getElementById('lista-timing');
        let orden = [...autos].sort((a,b) => b.progreso - a.progreso);
        list.innerHTML = orden.map((a,i) => `<div style="${a.esJugador?'background:#444;':''} padding:8px; border-bottom:1px solid #333;">${i+1}º ${a.piloto} | ${Math.floor(a.desgaste)}%</div>`).join('');
    }

    window.cambiarRitmo = (r) => { autos[0].vel = r === 'ataque' ? 0.0025 : 0.0014; };
    window.abrirModalBoxes = () => { document.getElementById('modal-boxes').style.display = 'block'; };
    window.cambiarGomas = (t) => { anunciar("Cambiando a " + t); document.getElementById('modal-boxes').style.display = 'none'; };

    // Disparo automático
    if (urlParams.get('iniciar') === 'true') setTimeout(iniciarLargada, 1000);
});
