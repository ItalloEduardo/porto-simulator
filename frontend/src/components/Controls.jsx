export default function Controls({
  qtdNavios,
  setQtdNavios,
  qtdBercos,
  setQtdBercos,
  velocidade,
  setVelocidade,
  simulando,
  iniciarSimulacao
}) {
  return (
    <div className="bg-slate-800 shadow-lg rounded-2xl p-5 flex flex-col gap-4 border border-slate-700">
      <label className="font-semibold text-slate-300">Quantidade de Navios</label>
      <input
        type="number"
        min="1"
        max="50"
        value={qtdNavios}
        onChange={(e) => setQtdNavios(Number(e.target.value))}
        className="p-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <label className="font-semibold text-slate-300">Quantidade de Berços</label>
      <input
        type="number"
        min="1"
        max="5"
        value={qtdBercos}
        onChange={(e) => setQtdBercos(Number(e.target.value))}
        className="p-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <label className="font-semibold text-slate-300">Velocidade</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={velocidade}
          onChange={(e) => setVelocidade(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="font-mono text-cyan-400 w-10 text-center">{velocidade.toFixed(1)}x</span>
      </div>

      <button
        onClick={iniciarSimulacao}
        className={`mt-2 font-bold text-white p-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
          simulando ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {simulando ? "Parar Simulação" : "Iniciar Simulação"}
      </button>
    </div>
  );
}