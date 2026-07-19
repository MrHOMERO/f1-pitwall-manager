document.addEventListener('DOMContentLoaded', () => {
    let carreraPausada = true;
    let vueltasMaximas = 58; // Vueltas reales de Albert Park
    let longitudPistaReal = 5.303; // km
    let autos = [];
    
    // Inicialización con distanciaTotal para evitar errores de ranking
    for (let i = 0; i < 22; i++) {
        autos.push({ 
            id: `p${i}`, piloto: (i===0 ? 'CARLOS' : `PILOTO ${i+1}`), 
            tipoGoma: 'BLA', desgaste: 100, distanciaTotal: 0, 
            color: `hsl(${i * 16}, 70%, 50%)`, 
            baseVel: 0.07 + (Math.random() * 0.02), ritmo: 'NORMAL'
        });
    }

    document.getElementById('pista').setAttribute('d', "M 40,110 L 60,60 L 110,70 L 140,50 L 180,90 L 170,140 L 150,130 L 150,170 L 60,170 L 40,140 L 50,120 Z");
    
    function simular() {
        if (carreraPausada) return;
        autos.forEach(a => {
            // Velocidad basada en escala real: 0.07 km/s es aprox 250km/h
            let v = (a.baseVel * (a.desgaste/100)) * (a.ritmo === 'ATAQUE' ? 1.2 : 1);
            a.distanciaTotal += v;
            
            let progresoSVG = (a.distanciaTotal % longitudPistaReal) / longitudPistaReal;
            const p = document.getElementById('pista').getPointAtLength(progresoSVG * document.getElementById('pista').getTotalLength());
            const el = document.getElementById(a.id);
            if(el) { el.setAttribute('cx', p.x); el.setAttribute('cy', p.y); }
        });
        
        autos.sort((a,b) => b.distanciaTotal - a.distanciaTotal);
        renderizarTabla();
        requestAnimationFrame(simular);
    }

    function renderizarTabla() {
        let líderVueltas = Math.floor(autos[0].distanciaTotal / longitudPistaReal) + 1;
        document.getElementById('lista-timing').innerHTML = `
            <div style="background:#000; padding:10px; color:#fff; text-align:center;">
                VUELTA ${Math.min(líderVueltas, vueltasMaximas)}/${vueltasMaximas}
            </div>` + autos.map(a => `
            <div style="display:flex; padding:5px; border-bottom:1px solid #333; font-size:11px;">
                <div style="flex:1;">${a.piloto}</div>
                <div style="flex:1; text-align:right;">🛞 ${a.tipoGoma} ${Math.floor(a.desgaste)}%</div>
            </div>`).join('');
    }

    window.iniciarLargada = () => { carreraPausada = false; simular(); };
    window.cambiarRitmo = (r) => { autos[0].ritmo = r; };
    window.cambiarGomas = (t) => { autos[0].tipoGoma = t; autos[0].desgaste = 100; document.getElementById('modal-boxes').style.display = 'none'; };
    // Iniciar con botón o timer
    setTimeout(iniciarLargada, 2000);
});
