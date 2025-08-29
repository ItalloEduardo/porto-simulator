import { useRef, useEffect } from "react";

export default function Game({ navios, setNavios, qtdBercos, velocidade, simulando }) {
  const canvasRef = useRef(null);
  const larguraCanvas = 900;
  const alturaCanvas = 500;
  const larguraNavio = 40;
  const alturaNavio = 20;
  const posicaoFila = 700;

  useEffect(() => {
    if (!simulando) return;
    const ctx = canvasRef.current.getContext("2d");

    const desenhar = () => {
      ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);

      // Fundo (mar)
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);

      // Berços
      ctx.fillStyle = "#2E8B57";
      ctx.fillRect(larguraCanvas - 150, 0, 150, alturaCanvas);

      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.fillText("BERÇOS", larguraCanvas - 120, 20);

      setNavios((naviosAntigos) =>
        naviosAntigos.map((navio, index) => {
          let novoX = navio.x;
          let status = navio.status;

          if (navio.status === "chegando") {
            if (novoX < posavioFila - 50) {
              novoX += navio.velocidade * velocidade;
            } else {
              status = "fila";
            }
          }

          if (navio.status === "fila" && index < qtdBercos) {
            status = "atracando";
            novoX = larguraCanvas - 100;
          }

          if (navio.status === "atracando") {
            novoX = larguraCanvas - 100;
          }

          ctx.fillStyle =
            status === "atracando"
              ? "#FF6347"
              : status === "fila"
              ? "#FFD700"
              : "#1E90FF";

          ctx.fillRect(novoX, navio.y, larguraNavio, alturaNavio);

          return { ...navio, x: novoX, status };
        })
      );

      requestAnimationFrame(desenhar);
    };

    desenhar();
  }, [simulando, velocidade, qtdBercos, setNavios]);

  return (
    <canvas
      ref={canvasRef}
      width={larguraCanvas}
      height={alturaCanvas}
      className="border rounded-lg shadow-lg"
    />
  );
}
