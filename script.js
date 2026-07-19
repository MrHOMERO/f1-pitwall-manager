document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const director = (urlParams.get('director') || 'CARLOS').toUpperCase().substring(0, 12);
    
    let carreraPausada = true; 
    let frameCount = 0;
    
    // Variables de carrera
    let vueltasTotales = 50; 
    let vueltaActual = 1;
    let tiempoCarrera = 0;
    let probabilidadLluvia = 0.3; // 30% probabilidad
    
    const colores = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A', '#808080', '#FFFFFF', '#D3D3D3', '#F08080', '#90EE90', '#ADD8E6', '#FFD700', '#E6E6FA', '#FF4500', '#20B2AA', '#778899'];
    let autos = [];

    for (let i = 0; i < 22; i++) {
        autos.push({ 
            id: `p${i}`, 
            piloto: (i===0 ? director : `PILOTO ${i+1}`), 
            tipoGoma: 'BLA', 
            desgaste: 100, 
            progreso: Math.random() * 500, 
            esJugador: (i===0), 
            color: colores[i], 
            baseVel: 0.5 + Math.random() * 0.3, 
            ritmo: 'NORMAL'
        });
    }

    document.getElementById('pista').setAttribute('d', "M 40,110 L 60,60 L 110,70 L 140,50 L 180,90 L 170,140 L 150,130 L 150,170 L 60,170 L 40,140 L 50,120 Z");
    const longitudPista = document.getElementById('pista').getTotalLength();
    document.getElementById('contenedor-autos').innerHTML = autos.map(a => `<circle id="${a.id}" r="5" fill="${a.color}" stroke="#fff" stroke-width="1"/>`).join('');

    function simular() {
        if (carreraPausada) return;
        frameCount++;
        if (frameCount % 60 === 0) tiempoCarrera++;

        autos.forEach(a => {
            let factorClima = (Math.random() < probabilidadLluvia) ? 0.6 : 1.0;
            let divisor = a.ritmo === 'ATAQUE' ? 120 : (a.ritmo === 'CUIDAR' ? 420 : 300);
            if (frameCount % divisor === 0) a.desgaste = Math.max(0, a.desgaste - 1);

            let velocidad = (a.baseVel * (a.desgaste/100)) * (a.ritmo === 'ATAQUE' ? 1.5 : 1) * factorClima;
            let progresoAnterior = a.progreso;
            a.progreso = (a.progreso + velocidad) % longitudPista;
            
            if (a.progreso < progresoAnterior && a.esJugador) vueltaActual++;
            
            const p = document.getElementById('pista').getPointAtLength(a.progreso);
            const el = document.getElementById(a.id);
            if(el) { el.setAttribute('cx', p.x); el.setAttribute('cy', p.y); }
        });

        renderizarTabla();
        requestAnimationFrame(simular);
    }

    function renderizarTabla() {
        const list = document.getElementById('lista-timing');
        let tiempoFormateado = new Date(tiempoCarrera * 1000).toISOString().substr(11, 8);
        
        const marcador = `
            <div style="background:#000; padding:8px; text-align:center; font-weight:bold; color:#fff; border-bottom:2px solid #e10600; font-size:12px;">
                ${tiempoFormateado} | VUELTA ${vueltaActual}/${vueltasTotales} | ${probabilidadLluvia > 0.5 ? '🌧️ LLUVIA' : '☀️ SECO'}
            </div>
        `;
        
        let orden = [...autos].sort((a,b) => b.progreso - a.progreso);
        
        list.innerHTML = marcador + orden.map(a => `
            <div style="display:flex; padding:8px; border-bottom:1px solid #333; font-size: 11px; ${a.esJugador ? 'background:#2d3748;' : ''}">
                <div style="flex:1; border-right:1px solid #444;">
                    <div style="color:#00ff00;">1:23.${Math.floor(Math.random()*9)}</div>
                    <div style="color:#718096;">${a.ritmo}</div>
                </div>
                <div style="flex:1; padding-left:10px; display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:5px;">
                        <div style="width:10px; height:10px; border-radius:50%; background:${a.color}"></div>
                        <span style="font-weight:bold;">${a.piloto.substring(0,8)}</span>
                    </div>
                    <div style="text-align:right;">
                        <div>🛞 ${a.tipoGoma}</div>
                        <div style="color:${a.desgaste < 20 ? '#e10600' : '#a0aec0'};">${Math.floor(a.desgaste)}%</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.cambiarRitmo = (r) => { autos[0].ritmo = r.toUpperCase(); };
    window.cambiarGomas = (t) => { autos[0].tipoGoma = t.substring(0,3).toUpperCase(); autos[0].desgaste = 100; document.getElementById('modal-boxes').style.display = 'none'; };
    window.abrirModalBoxes = () => { document.getElementById('modal-boxes').style.display = 'block'; };
    window.iniciarLargada = () => { carreraPausada = false; simular(); document.getElementById('pantalla-largada').style.display = 'none'; };

    if (urlParams.get('iniciar') === 'true') setTimeout(window.iniciarLargada, 1000);
});
