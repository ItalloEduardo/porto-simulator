export default function Controls({
  qtdNavios,
  setQtdNavios,
  qtdBercos,
  setQtdBercos,
  velocidade,
  setVelocidade,
  simulando,
  setSimulando,
  iniciarSimulacao
}) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col gap-4">
      <label className="font-semibold">Quantidade de Navios</label>
      <input
        type="number"
        min="1"
        max="50"
        value={qtdNavios}
        onChange={(e) => setQtdNavios(Number(e.target.value))}
        className="p-2 border rounded"
      />

      <label className="font-semibold">Quantidade de Berços</label>
      <input
        type="number"
        min="1"
        max="5"
        value={qtdBercos}
        onChange={(e) => setQtdBercos(Number(e.target.value))}
        className="p-2 border rounded"
      />

      <label className="font-semibold">Velocidade</label>
      <input
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        value={velocidade}
        onChange={(e) => setVelocidade(Number(e.target.value))}
      />
      <span>{velocidade}x</span>

      <button
        onClick={iniciarSimulacao}
        className={`${simulando ? "bg-red-500" : "bg-green-500"} text-white p-2 rounded-lg shadow`}
      >
        {simulando ? "Parar Simulação" : "Iniciar Simulação"}
      </button>
    </div>
  );
}
