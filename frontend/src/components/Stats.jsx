export default function Stats({ estatisticas }) {
  if (!estatisticas) {
    return (
      <div className="bg-slate-800 shadow-lg rounded-2xl p-5 flex flex-col gap-3 border border-slate-700">
        <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-2">📊 Estatísticas Finais</h2>
        <p className="text-slate-400">Execute uma simulação para ver os resultados.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 shadow-lg rounded-2xl p-5 flex flex-col gap-3 border border-slate-700">
      <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-2">📊 Estatísticas Finais</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-300">
        <span>Navios Atendidos:</span>
        <span className="font-mono text-cyan-400">{estatisticas.total_navios_atendidos}</span>

        <span>Tempo Médio de Espera:</span>
        <span className="font-mono text-cyan-400">{estatisticas.tempo_medio_de_espera_na_fila} h</span>
        
        <span>Total de Eventos:</span>
        <span className="font-mono text-cyan-400">{estatisticas.total_eventos_registrados}</span>
      </div>
    </div>
  );
}