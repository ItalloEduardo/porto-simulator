import { useRef, useEffect, useState } from "react";
import seaBg from '../assets/topografia-mar.avif';

function desenharCenario(ctx, bgPattern, areaPortoX, larguraCanvas, alturaCanvas, params) {
  ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);
  ctx.fillStyle = bgPattern; 
  ctx.fillRect(0, 0, areaPortoX, alturaCanvas);
  
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(areaPortoX, 0, larguraCanvas - areaPortoX, alturaCanvas);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 18px Arial";
  ctx.fillText("ÁREA DO PORTO", areaPortoX + 30, 30);
}

function desenharBercos(ctx, berthsStatus, posBercoX, params) {
  for (let i = 0; i < params.qtdBercos; i++) {
    const yPos = 60 + i * 50;
    const isOccupied = berthsStatus[i] !== null;

    ctx.fillStyle = isOccupied ? "#eab308" : "#10b981"; 
    ctx.fillRect(posBercoX, yPos, 80, 30);
    
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(`Berço ${i + 1}`, posBercoX + 15, yPos - 5);
    
    if (isOccupied) {
      ctx.fillStyle = "black";
      ctx.font = "bold 14px Arial";
      ctx.fillText(`N${berthsStatus[i]}`, posBercoX + 30, yPos + 20);
    }
  }
}

function desenharNavios(ctx, estadoNavios, berthsStatus, posBercoX, posFilaX, tempoPlayback, larguraCanvas) {
  for (const navio of estadoNavios.values()) {
    let x = navio.x;
    let y = navio.y;
    let cor = "#38bdf8";

    if (navio.status === 'chegou') {
      const progresso = Math.min((tempoPlayback - navio.tempoUltimoEvento) / 5, 1);
      x = progresso * posFilaX;
      cor = "#f59e0b";
    } else if (navio.status === 'atracou') {
      const berthIndex = berthsStatus.indexOf(navio.id);
      if (berthIndex !== -1) {
        y = 60 + berthIndex * 50 + 5;
      }
      x = posBercoX + 15;
      cor = "#ef4444";
    } else if (navio.status === 'saiu') {
      const progresso = Math.min((tempoPlayback - navio.tempoUltimoEvento) / 5, 1);
      x = posBercoX + progresso * 200; 
    }

    navio.x = x;
    navio.y = y;
    
    if (navio.status !== 'saiu' || x < larguraCanvas) {
      ctx.fillStyle = cor;
      ctx.fillRect(x, y, 50, 20);
      ctx.fillStyle = "white";
      ctx.font = "bold 12px Arial";
      ctx.fillText(`${navio.id}`, x + 20, y + 14);
    }
  }
}

function desenharUI(ctx, tempoPlayback) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, 10, 250, 30);
  ctx.fillStyle = "white";
  ctx.font = "20px Monospace";
  ctx.fillText(`Tempo: ${tempoPlayback.toFixed(1)} horas`, 20, 32);
}

export default function Game({ logDeEventos, velocidade, simulando, setSimulando, params, cancelarSimulacao }) {
  const canvasRef = useRef(null);
  const bgPatternRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const [isBgLoaded, setIsBgLoaded] = useState(false);

  const larguraCanvas = 900;
  const alturaCanvas = 500;
  const areaPortoX = larguraCanvas - 200;
  const posBercoX = areaPortoX + 50;
  const posFilaX = areaPortoX - 100;

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
      desenharCenario(ctx, bgPatternRef.current, areaPortoX, larguraCanvas, alturaCanvas, params);
      const berthsStatus = Array(params.qtdBercos).fill(null);
      desenharBercos(ctx, berthsStatus, posBercoX, params);
      return;
    }

    if (logDeEventos.length > 0) {
      const startTime = performance.now();
      const estadoNavios = new Map();

      const animate = (currentTime) => {
        const tempoDecorrido = (currentTime - startTime) / 1000;
        const tempoPlayback = tempoDecorrido * velocidade;

        const berthsStatus = Array(params.qtdBercos).fill(null); 
        const naviosAtracados = [];
        for (const evento of logDeEventos) {
          if (evento.tempo > tempoPlayback) break;
          if (!estadoNavios.has(evento.navio_id)) {
            estadoNavios.set(evento.navio_id, { id: evento.navio_id, y: 50 + (evento.navio_id % 10) * 40 });
          }
          const navio = estadoNavios.get(evento.navio_id);
          navio.status = evento.evento;
          navio.tempoUltimoEvento = evento.tempo;
        }
        estadoNavios.forEach(navio => {
          if (navio.status === 'atracou') naviosAtracados.push(navio.id);
        });
        for(let i = 0; i < naviosAtracados.length; i++) {
          if (i < berthsStatus.length) berthsStatus[i] = naviosAtracados[i];
        }

        desenharCenario(ctx, bgPatternRef.current, areaPortoX, larguraCanvas, alturaCanvas, params);
        desenharBercos(ctx, berthsStatus, posBercoX, params);
        desenharNavios(ctx, estadoNavios, berthsStatus, posBercoX, posFilaX, tempoPlayback, larguraCanvas);
        desenharUI(ctx, tempoPlayback);

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
  }, [simulando, logDeEventos, isBgLoaded]);

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