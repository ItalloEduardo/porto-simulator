import { useRef, useEffect, useState, useMemo } from "react";
import seaBg from '../assets/topografia-mar.avif';

function desenharCenario(ctx, bgPattern, larguraPorto, larguraCanvas, alturaCanvas) {
  const larguraMar = larguraCanvas - larguraPorto;
  ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);

  ctx.fillStyle = bgPattern;
  ctx.fillRect(0, 0, larguraMar, alturaCanvas);

  ctx.fillStyle = "#475569"; // slate-600
  ctx.fillRect(larguraMar, 0, larguraPorto, alturaCanvas);
}

function desenharBercos(ctx, berthsStatus, posBercoX, alturaCanvas, params) {
  const paddingVerticalPorto = 20;
  const areaUtilVertical = alturaCanvas - (paddingVerticalPorto * 2);
  const espacamentoVertical = areaUtilVertical / params.qtdBercos;

  for (let i = 0; i < params.qtdBercos; i++) {
    const yPos = paddingVerticalPorto + (espacamentoVertical * i) + (espacamentoVertical / 2);
    const isOccupied = berthsStatus[i] !== null;

    ctx.fillStyle = "#334155"; // slate-700 (berço)
    ctx.fillRect(posBercoX, yPos - 15, 80, 30);

    ctx.fillStyle = isOccupied ? "#f59e0b" : "#22c55e";
    ctx.fillRect(posBercoX - 10, yPos - 5, 5, 10);

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Berço ${i + 1}`, posBercoX + 40, yPos - 20);
  }
}

function desenharUI(ctx, tempoPlayback) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, 10, 250, 30);
  ctx.fillStyle = "white";
  ctx.font = "20px Monospace";
  ctx.fillText(`Tempo: ${tempoPlayback.toFixed(2)} horas`, 135, 32);
}

function desenharNavio(ctx, x, y, id, cor = "#38bdf8") {
  ctx.fillStyle = cor;
  ctx.fillRect(x, y - 10, 50, 20);
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${id}`, x + 25, y + 4);
}

function preprocessarEventos(logDeEventos, layout, params) {
  const {
    larguraCanvas, alturaCanvas, larguraPorto, posBercoX
  } = layout;

  const LARGURA_NAVIO = 50;
  const TEMPO_ENTRADA = 7.0;
  const LARGURA_MAR = larguraCanvas - larguraPorto;
  const PONTO_ESPERA_X = LARGURA_MAR * 0.9; 

  const berthInset = 15;
  const dockInDuration = 0.08;
  const departDuration = 0.5;

  const porTempo = [...logDeEventos].sort((a, b) => a.tempo - b.tempo);

  const eventosPorNavio = new Map();
  for (const e of porTempo) {
    if (!eventosPorNavio.has(e.navio_id)) {
      eventosPorNavio.set(e.navio_id, { id: e.navio_id });
    }
    const navio = eventosPorNavio.get(e.navio_id);
    if (e.evento === 'chegou') navio.tChegou = e.tempo;
    if (e.evento === 'atracou') navio.tAtracouOriginal = e.tempo;
    if (e.evento === 'saiu') navio.tSaiuOriginal = e.tempo;
  }
  
  const naviosOrdenadosPorChegada = Array.from(eventosPorNavio.values())
    .filter(n => n.tChegou != null)
    .sort((a, b) => a.tChegou - b.tChegou);

  const proximoTempoLivreBerco = Array(params.qtdBercos).fill(0);
  const eventosSimulados = new Map();

  for (const navio of naviosOrdenadosPorChegada) {
    let melhorBercoIdx = 0;
    for (let i = 1; i < params.qtdBercos; i++) {
      if (proximoTempoLivreBerco[i] < proximoTempoLivreBerco[melhorBercoIdx]) {
        melhorBercoIdx = i;
      }
    }
    const tempoLivreDoMelhorBerco = proximoTempoLivreBerco[melhorBercoIdx];
    
    const tAtracouReal = Math.max(navio.tChegou, tempoLivreDoMelhorBerco);

    let tSaiuReal;
    if (navio.tAtracouOriginal != null && navio.tSaiuOriginal != null) {
      const duracaoNoBerco = navio.tSaiuOriginal - navio.tAtracouOriginal;
      tSaiuReal = tAtracouReal + duracaoNoBerco;
    } else {
      tSaiuReal = Number.POSITIVE_INFINITY;
    }

    proximoTempoLivreBerco[melhorBercoIdx] = tSaiuReal;
    
    eventosSimulados.set(navio.id, {
      ...navio,
      tAtracou: tAtracouReal,
      tSaiu: tSaiuReal,
      bercoDesignado: melhorBercoIdx
    });
  }
  
  const segmentosPorNavio = new Map();
  const paddingVertical = 20;
  const areaUtilVertical = alturaCanvas - paddingVertical * 2;
  const berthGap = areaUtilVertical / params.qtdBercos;

  const berthCenterY = (idx) => paddingVertical + (berthGap * idx) + (berthGap / 2);
  const laneYForShip = (id) => {
    const laneIdx = (id % params.qtdBercos);
    return paddingVertical + (berthGap * laneIdx) + (berthGap / 2);
  };
  
  for (const [id, sim] of eventosSimulados.entries()) {
    const { tChegou, tAtracou, tSaiu, bercoDesignado } = sim;
    const segs = [];
    const approachY = laneYForShip(id);
    const berthY = berthCenterY(bercoDesignado);
    const dockX = posBercoX + berthInset;

    // 1. Segmento: Entrada (Da borda da tela até a fila)
    segs.push({
      type: 'entry',
      inicio: Math.max(0, tChegou - TEMPO_ENTRADA),
      fim: tChegou,
      startX: -LARGURA_NAVIO, // Começa fora da tela
      startY: approachY,
      endX: PONTO_ESPERA_X,
      endY: approachY,
      color: "#38bdf8" // Azul
    });

    if (tAtracou > tChegou) {
      // 2. Segmento: Espera (Parado na fila)
      segs.push({
        type: 'waiting',
        inicio: tChegou,
        fim: tAtracou,
        startX: PONTO_ESPERA_X,
        startY: approachY,
        endX: PONTO_ESPERA_X,
        endY: approachY,
        color: "#f59e0b" // Laranja
      });
    }

    // 3. Segmento: Atracação (Da fila para o berço)
    segs.push({
      type: 'dock-in',
      inicio: tAtracou,
      fim: tAtracou + dockInDuration,
      startX: PONTO_ESPERA_X,
      startY: approachY,
      endX: dockX,
      endY: berthY,
      color: "#22c55e" // Verde
    });

    // 4. Segmento: Permanência (Parado no berço)
    segs.push({
      type: 'dwell',
      inicio: tAtracou + dockInDuration,
      fim: tSaiu,
      startX: dockX,
      startY: berthY,
      endX: dockX,
      endY: berthY,
      color: "#22c55e" // Verde
    });
    
    if (tSaiu !== Number.POSITIVE_INFINITY) {
        // 5. Segmento: Saída (Do berço para fora da tela)
        segs.push({
          type: 'depart',
          inicio: tSaiu,
          fim: tSaiu + departDuration,
          startX: dockX,
          startY: berthY,
          endX: posBercoX + 250,
          endY: berthY,
          color: "#3b82f6" // Azul mais escuro
        });
    }
    
    segmentosPorNavio.set(id, segs);
  }

  const agendaBercos = [];
  for (const sim of eventosSimulados.values()) {
    agendaBercos.push({
      berthIdx: sim.bercoDesignado,
      id: sim.id,
      inicio: sim.tAtracou,
      fim: sim.tSaiu
    });
  }

  return { segmentosPorNavio, agendaBercos };
}

function interpPos(seg, t) {
  const { inicio, fim, startX, startY, endX, endY } = seg;
  if (t <= inicio) return { x: startX, y: startY, done: false };
  if (t >= fim) return { x: endX, y: endY, done: true };
  const p = (t - inicio) / (fim - inicio);
  return {
    x: startX + (endX - startX) * p,
    y: startY + (endY - startY) * p,
    done: false
  };
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

  const precomputed = useMemo(() => {
    if (!isBgLoaded || !logDeEventos?.length) return null;
    const layout = { larguraCanvas, alturaCanvas, larguraPorto, posBercoX, posFilaX };
    return preprocessarEventos(logDeEventos, layout, params);
  }, [isBgLoaded, JSON.stringify(logDeEventos), params.qtdBercos]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !isBgLoaded) return;

    if (!simulando || !precomputed) {
      const vazio = Array(params.qtdBercos).fill(null);
      desenharCenario(ctx, bgPatternRef.current, larguraPorto, larguraCanvas, alturaCanvas);
      desenharBercos(ctx, vazio, posBercoX, alturaCanvas, params);
      return;
    }

    const { segmentosPorNavio, agendaBercos } = precomputed;
    const startTime = performance.now();

    const desenharFrame = (currentTime) => {
      const tempoDecorrido = (currentTime - startTime) / 1000;
      const tempoPlayback = tempoDecorrido * velocidade;

      const berthsStatus = Array(params.qtdBercos).fill(null);
      for (const a of agendaBercos) {
        if (tempoPlayback >= a.inicio && tempoPlayback < a.fim) {
          berthsStatus[a.berthIdx] = a.id;
        }
      }

      desenharCenario(ctx, bgPatternRef.current, larguraPorto, larguraCanvas, alturaCanvas);
      desenharBercos(ctx, berthsStatus, posBercoX, alturaCanvas, params);

      for (const [id, segs] of segmentosPorNavio.entries()) {
        let drawn = false;
        for (let i = 0; i < segs.length; i++) {
          const s = segs[i];
          if (tempoPlayback <= s.fim) {
            const { x, y } = interpPos(s, tempoPlayback);
            desenharNavio(ctx, x, y, id, s.color);
            drawn = true;
            break;
          }
        }
        if (!drawn) {
          // passou de todos os segmentos → não desenhar (já saiu do canvas)
        }
      }

      desenharUI(ctx, tempoPlayback);

      if (tempoPlayback < params.tempo_total_simulacao) {
        animationFrameIdRef.current = requestAnimationFrame(desenharFrame);
      } else {
        setSimulando(false);
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(desenharFrame);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [
    simulando,
    precomputed,
    isBgLoaded,
    params,
    velocidade,
    larguraCanvas,
    alturaCanvas,
    larguraPorto,
    posBercoX
  ]);

  return (
    <>
      {simulando && (
        <button
          onClick={cancelarSimulacao}
          className="absolute top-4 right-4 z-10 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-500 transition-colors"
          title="Cancelar Simulação"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      <canvas ref={canvasRef} width={larguraCanvas} height={alturaCanvas} className="rounded-lg"/>
    </>
  );
}
