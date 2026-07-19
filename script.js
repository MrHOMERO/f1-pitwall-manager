document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const director = (urlParams.get('director') || 'CARLOS').toUpperCase().substring(0, 12);
    
    let carreraPausada = true; 
    let frameCount = 0;
    let autos = [];

    // Inicializar pilotos
    for (let i = 0; i < 22; i++) {
        autos.push({ 
            id: `p${i}`, 
            piloto: (i===0 ? director : `PILOTO ${i+1}`), 
            tipoGoma: 'blando', 
            desgaste: 100, 
            progreso: Math.random() * 0.02, 
            esJugador: (i===0), 
            color: i===0 ? '#e10600' : '#4a5568', 
            vel: 0.0014,
            ritmo: 'normal'
        });
    }

    document.getElementById('pista').setAttribute('d', "M 40,80 L 70,30 L 130,30 L 160,80 L 130,130 L 90,100 L 60,100 L 40,140 L 80,170 L 170,170 L 180,120 L 150,120 Z");
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
        frameCount++;

        autos.forEach(a => {
            // Desgaste lógico: 1% cada 2s(ataque), 5s(normal), 7s(cuidar)
            let divisor = a.ritmo === 'ataque' ? 2 : (a.ritmo === 'cuidar' ? 7 : 5);
            if (frameCount % (divisor * 60) === 0) {
                a.desgaste = Math.max(0, a.desgaste - 1);
            }

            a.progreso += a.vel * (a.desgaste / 100);
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
        list.innerHTML = orden.map((a,i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; border-bottom:1px solid #333; font-size: 13px; ${a.esJugador ? 'background:#2d3748;' : ''}">
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:10px; height:10px; border-radius:50%; background:${a.color}"></div>
                    <span style="font-weight:bold;">${a.piloto}</span>
                </div>
                <div style="color:#a0aec0; gap:10px; display:flex;">
                    <span>${a.tipoGoma.toUpperCase()}</span>
                    <span style="min-width:35px; text-align:right;">${Math.floor(a.desgaste)}%</span>
                </div>
            </div>
        `).join('');
    }

    window.cambiarRitmo = (r) => { 
        autos[0].ritmo = r; 
        autos[0].vel = r === 'ataque' ? 0.0025 : (r === 'cuidar' ? 0.001 : 0.0014); 
    };

    window.abrirModalBoxes = () => { document.getElementById('modal-boxes').style.display = 'block'; };
    
    window.cambiarGomas = (t) => { 
        anunciar("Cambiando a neumáticos " + t); 
        autos[0].tipoGoma = t; 
        autos[0].desgaste = 100; 
        document.getElementById('modal-boxes').style.display = 'none'; 
    };

    if (urlParams.get('iniciar') === 'true') setTimeout(iniciarLargada, 1000);
});
