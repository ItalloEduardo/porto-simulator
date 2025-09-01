import { useRef, useEffect, useState } from "react";
import seaBg from '../assets/topografia-mar.avif';

function desenharCenario(ctx, bgPattern, larguraPorto, larguraCanvas, alturaCanvas) {
  const larguraMar = larguraCanvas - larguraPorto;
  ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);
  
  ctx.fillStyle = bgPattern; 
  ctx.fillRect(0, 0, larguraMar, alturaCanvas);
  
  ctx.fillStyle = "#475569"; // Cor: slate-600 (Porto)
  ctx.fillRect(larguraMar, 0, larguraPorto, alturaCanvas);
}

function desenharBercos(ctx, berthsStatus, posBercoX, alturaCanvas, params) {
  const paddingVerticalPorto = 20;
  const areaUtilVertical = alturaCanvas - (paddingVerticalPorto * 2);
  const espacamentoVertical = areaUtilVertical / params.qtdBercos;

  for (let i = 0; i < params.qtdBercos; i++) {
    const yPos = paddingVerticalPorto + (espacamentoVertical * i) + (espacamentoVertical / 2);
    const isOccupied = berthsStatus[i] !== null;

    ctx.fillStyle = "#334155"; // Cor: slate-700
    ctx.fillRect(posBercoX, yPos - 15, 80, 30);
    
    // Cor de status (Verde: livre, Amarelo: ocupado)
    ctx.fillStyle = isOccupied ? "#f59e0b" : "#22c55e";
    ctx.fillRect(posBercoX - 10, yPos - 5, 5, 10);

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Berço ${i + 1}`, posBercoX + 40, yPos - 20);
  }
}

function desenharNavios(ctx, estadoNavios, berthsStatus, alturaCanvas, posBercoX, posFilaX, tempoPlayback, larguraCanvas, params) {
  const paddingVertical = 20;
  const espacamentoVertical = (alturaCanvas - paddingVertical * 2) / params.qtdBercos;
  
  const filaEspera = [...estadoNavios.values()]
    .filter(n => n.status === "chegou" || n.status === "atracando")
    .sort((a, b) => a.tempoUltimoEvento - b.tempoUltimoEvento);

  for (const navio of estadoNavios.values()) {
    let { x, y, status, tempoUltimoEvento } = navio;
    let cor = "#38bdf8";

    if (status === 'chegou') {
      const progresso = Math.min((tempoPlayback - tempoUltimoEvento) * 0.2, 1);
      x = progresso * posFilaX;
      cor = "#f59e0b"; // Amarelo: Fila
    } 
    else if (status === 'atracou') {
      const berthIndex = berthsStatus.indexOf(navio.id);
      if (berthIndex !== -1) {
        y = paddingVertical + (espacamentoVertical * berthIndex) + (espacamentoVertical / 2);
      }
      x = posBercoX + 15;
      cor = "#22c55e"; // Verde: Atracado
    } 
    else if (status === 'saiu') {
      const progresso = Math.min((tempoPlayback - tempoUltimoEvento) / 5, 1);
      x = posBercoX + progresso * 250;
      cor = "#3b82f6"; // Azul: Saindo
    }

    navio.x = x;
    navio.y = y;
    
    if (status !== 'saiu' || x < larguraCanvas) {
      ctx.fillStyle = cor;
      ctx.fillRect(x, y - 10, 50, 20);
      ctx.fillStyle = "white";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${navio.id}`, x + 25, y + 4);
    }
  }
}

function desenharUI(ctx, tempoPlayback) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, 10, 250, 30);
  ctx.fillStyle = "white";
  ctx.font = "20px Monospace";
  ctx.fillText(`Tempo: ${tempoPlayback.toFixed(1)} horas`, 135, 32);
}

export default function Game({ logDeEventos, velocidade, simulando, setSimulando, params, cancelarSimulacao }) {
  const canvasRef = useRef(null);
  const bgPatternRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const [isBgLoaded, setIsBgLoaded] = useState(false);

  const larguraCanvas = 900;
  const alturaCanvas = 500;
  const larguraPorto = 180;
  const posBercoX = larguraCanvas - larguraPorto + 40;
  const posFilaX = larguraCanvas - larguraPorto - 100;

  useEffect(() => {
    const bgImage = new Image();
    bgImage.src = seaBg;
    bgImage.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      bgPatternRef.current = ctx.createPattern(bgImage, 'repeat');
      setIsBgLoaded(true); 
    };
  }, []);

  useEffect(() => {
    if (!isBgLoaded) return;
    const ctx = canvasRef.current.getContext("2d");

    if (!simulando) {
      desenharCenario(ctx, bgPatternRef.current, larguraPorto, larguraCanvas, alturaCanvas);
      const berthsStatus = Array(params.qtdBercos).fill(null);
      desenharBercos(ctx, berthsStatus, posBercoX, alturaCanvas, params);
      return;
    }

    if (logDeEventos.length > 0) {
      const startTime = performance.now();
      const estadoNavios = new Map();

      const animate = (currentTime) => {
        const tempoDecorrido = (currentTime - startTime) / 1000;
        const tempoPlayback = tempoDecorrido * velocidade;

        for (const evento of logDeEventos) {
          if (evento.tempo > tempoPlayback) break;
          if (!estadoNavios.has(evento.navio_id)) {
            estadoNavios.set(evento.navio_id, {
              id: evento.navio_id, x: 0, y: 50 + (evento.navio_id % 10) * 40 
            });
          }
          const navio = estadoNavios.get(evento.navio_id);
          navio.status = evento.evento;
          navio.tempoUltimoEvento = evento.tempo;
        }

        const berthsStatus = Array(params.qtdBercos).fill(null);
        const naviosAtracados = [...estadoNavios.values()]
            .filter(n => n.status === 'atracou')
            .sort((a,b) => a.tempoUltimoEvento - b.tempoUltimoEvento);
        
        for(let i = 0; i < naviosAtracados.length; i++) {
          if (i < berthsStatus.length) berthsStatus[i] = naviosAtracados[i].id;
        }

        desenharCenario(ctx, bgPatternRef.current, larguraPorto, larguraCanvas, alturaCanvas);
        desenharBercos(ctx, berthsStatus, posBercoX, alturaCanvas, params);
        desenharNavios(ctx, estadoNavios, berthsStatus, alturaCanvas, posBercoX, posFilaX, tempoPlayback, larguraCanvas, params);
        desenharUI(ctx, tempoPlayback);

        // 3. CONTROLAR A ANIMAÇÃO
        if (tempoPlayback < params.tempo_total_simulacao) {
          animationFrameIdRef.current = requestAnimationFrame(animate);
        } else {
          setSimulando(false);
        }
      };
      
      animate(performance.now());
    }

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [simulando, logDeEventos, isBgLoaded, params, velocidade]);


  return (
    <>
      {simulando && (
        <button
          onClick={cancelarSimulacao}
          className="absolute top-4 right-4 z-10 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-500 transition-colors"
          title="Cancelar Simulação"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      <canvas ref={canvasRef} width={larguraCanvas} height={alturaCanvas} className="rounded-lg"/>
    </>
  );
}