document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const director = (urlParams.get('director') || 'CARLOS').toUpperCase().substring(0, 12);
    
    let carreraPausada = true; 
    let frameCount = 0;
    let autos = [];

    // 1. Inicialización de pilotos
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

    // 2. Circuito (Diseño de líneas rectas verdes)
    document.getElementById('pista').setAttribute('d', 
        "M 40,110 L 60,60 L 110,70 L 140,50 L 180,90 L 170,140 L 150,130 L 150,170 L 60,170 L 40,140 L 50,120 Z"
    );
    
    document.getElementById('contenedor-autos').innerHTML = autos.map(a => `<circle id="${a.id}" r="4" fill="${a.color}" />`).join('');

    function anunciar(texto) { if ('speechSynthesis' in window) { const msg = new SpeechSynthesisUtterance(texto); msg.lang = 'es-ES'; window.speechSynthesis.speak(msg); } }

    // 3. Sistema de Largada
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

    // 4. Motor de simulación y Desgaste
    function simular() {
        if (carreraPausada) return;
        frameCount++;

        autos.forEach(a => {
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

    // 5. Tabla dividida (Telemetría y Estado)
    function renderizarTabla() {
        const list = document.getElementById('lista-timing');
        let orden = [...autos].sort((a,b) => b.progreso - a.progreso);
        
        list.innerHTML = orden.map((a,i) => {
            let tiempoVuelta = a.ritmo === 'ataque' ? "1:22.4" : (a.ritmo === 'cuidar' ? "1:25.8" : "1:23.9");
            return `
                <div style="display:flex; padding:8px; border-bottom:1px solid #333; font-size: 11px; ${a.esJugador ? 'background:#2d3748;' : ''}">
                    <div style="flex:1; border-right:1px solid #444; padding-right:5px;">
                        <div style="font-weight:bold; color:#00ff00;">${tiempoVuelta}</div>
                        <div style="color:#718096; text-transform:uppercase;">${a.ritmo}</div>
                    </div>
                    <div style="flex:1; padding-left:10px; display:flex; align-items:center; justify-content:space-between;">
                        <div style="display:flex; align-items:center; gap:5px;">
                            <div style="width:8px; height:8px; border:2px solid ${a.color}; border-radius:50%;"></div>
                            <span style="font-weight:bold;">${a.piloto.substring(0,8)}</span>
                        </div>
                        <div style="text-align:right;">
                            <div>🛞 ${a.tipoGoma.substring(0,3).toUpperCase()}</div>
                            <div style="color:${a.desgaste < 20 ? '#e10600' : '#a0aec0'};">${Math.floor(a.desgaste)}%</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
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
