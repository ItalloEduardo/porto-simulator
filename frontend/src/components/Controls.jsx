// src/components/Controls.jsx

export default function Controls({
  params,
  setParams,
  velocidade,
  setVelocidade,
  simulando,
  iniciarSimulacao
}) {
  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prevParams => ({
      ...prevParams,
      [name]: Number(value)
    }));
  };

  return (
    <div className="bg-slate-800 shadow-lg rounded-2xl p-5 flex flex-col gap-4 border border-slate-700">
      <label className="font-semibold text-slate-300">Tempo Total de Simulação (horas)</label>
      <input
        type="number"
        name="tempo_total_simulacao"
        value={params.tempo_total_simulacao}
        onChange={handleParamChange}
        className="p-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <label className="font-semibold text-slate-300">Nº de Berços</label>
      <input
        type="number"
        name="qtdBercos"
        min="1"
        max="10"
        value={params.qtdBercos}
        onChange={handleParamChange}
        className="p-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <label className="font-semibold text-slate-300">Tempo Médio de Chegada (horas)</label>
      <input
        type="number"
        name="tempo_medio_chegada"
        value={params.tempo_medio_chegada}
        onChange={handleParamChange}
        className="p-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <label className="font-semibold text-slate-300">Tempo Médio de Atendimento (horas)</label>
      <input
        type="number"
        name="tempo_medio_atendimento"
        value={params.tempo_medio_atendimento}
        onChange={handleParamChange}
        className="p-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <label className="font-semibold text-slate-300">Velocidade da Reprodução</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={velocidade}
          onChange={(e) => setVelocidade(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="font-mono text-cyan-400 w-10 text-center">{velocidade}x</span>
      </div>

      <button
        onClick={iniciarSimulacao}
        disabled={simulando}
        className={`mt-2 font-bold text-white p-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
          simulando ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {simulando ? "Simulando..." : "Iniciar Simulação"}
      </button>
    </div>
  );
}