import { useState } from "react";
import Game from "../components/Game";
import Controls from "../components/Controls";
import Stats from "../components/Stats";
import Header from "../components/Header";

export default function Home() {
  const [params, setParams] = useState({
    tempo_total_simulacao: 168,
    qtdBercos: 2,
    tempo_medio_chegada: 5,
    tempo_medio_atendimento: 8,
  });

  const [velocidade, setVelocidade] = useState(10);
  const [simulando, setSimulando] = useState(false);
  
  const [logDeEventos, setLogDeEventos] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [erro, setErro] = useState(null);

  const iniciarSimulacao = async () => {
    setSimulando(true);
    setErro(null);
    setLogDeEventos([]);
    setEstatisticas(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/simular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com a API.');
      }

      const resultados = await response.json();
      setLogDeEventos(resultados.log_eventos);
      setEstatisticas(resultados.estatisticas_finais);

    } catch (error) {
      console.error("Falha ao executar a simulação:", error);
      setErro(error.message);
    } 
  };

  const cancelarSimulacao = () => {
    setSimulando(false);
    setLogDeEventos([]);
    setEstatisticas(null);
    setErro(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 gap-6 p-6">
        <div className="flex-1 bg-slate-800 shadow-lg rounded-2xl p-4 flex justify-center items-center border border-slate-700 relative"> {/* Adicionado: position: relative */}
          <Game
            logDeEventos={logDeEventos}
            velocidade={velocidade}
            simulando={simulando}
            setSimulando={setSimulando}
            cancelarSimulacao={cancelarSimulacao}
            params={params}
          />
        </div>
        <div className="w-1/3 flex flex-col gap-6">
          <Controls
            params={params}
            setParams={setParams}
            velocidade={velocidade}
            setVelocidade={setVelocidade}
            simulando={simulando}
            iniciarSimulacao={iniciarSimulacao}
          />
          {erro && <div className="bg-red-800 text-white p-3 rounded-lg">{erro}</div>}
          <Stats estatisticas={estatisticas} />
        </div>
      </main>
    </div>
  );
}