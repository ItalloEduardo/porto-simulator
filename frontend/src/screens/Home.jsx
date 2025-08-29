
import { useState } from "react";
import Game from "../components/Game";
import Controls from "../components/Controls";
import Stats from "../components/Stats";
import Header from "../components/Header";

export default function Home() {
  const [navios, setNavios] = useState([]);
  const [qtdNavios, setQtdNavios] = useState(10);
  const [qtdBercos, setQtdBercos] = useState(2);
  const [velocidade, setVelocidade] = useState(1);
  const [simulando, setSimulando] = useState(false);

  const iniciarSimulacao = () => {
    if (!simulando) {
      const novosNavios = Array.from({ length: qtdNavios }).map((_, i) => ({
        id: i,
        x: Math.random() * 200,
        y: 50 + i * 30,
        status: "chegando",
        destino: 700,
        velocidade: 1 + Math.random() * 1.5,
      }));
      setNavios(novosNavios);
    }
    setSimulando(!simulando);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-1 gap-6 p-6">
        {/* simulador */}
        <div className="flex-1 bg-slate-800 shadow-lg rounded-2xl p-4 flex justify-center items-center border border-slate-700">
          <Game
            navios={navios}
            setNavios={setNavios}
            qtdBercos={qtdBercos}
            velocidade={velocidade}
            simulando={simulando}
          />
        </div>

        {/* controles e estatísticas */}
        <div className="w-1/3 flex flex-col gap-6">
          <Controls
            qtdNavios={qtdNavios}
            setQtdNavios={setQtdNavios}
            qtdBercos={qtdBercos}
            setQtdBercos={setQtdBercos}
            velocidade={velocidade}
            setVelocidade={setVelocidade}
            simulando={simulando}
            setSimulando={setSimulando}
            iniciarSimulacao={iniciarSimulacao}
          />
          <Stats navios={navios} />
        </div>
      </main>
    </div>
  );
}