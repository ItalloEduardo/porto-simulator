export default function Stats({ navios }) {
  const totalNavios = navios.length;
  const emFila = navios.filter((n) => n.status === "fila").length;
  const atracando = navios.filter((n) => n.status === "atracando").length;
  const saiu = navios.filter((n) => n.status === "saiu").length;

  return (
    <div className="bg-slate-800 shadow-lg rounded-2xl p-5 flex flex-col gap-3 border border-slate-700">
      <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-2">📊 Estatísticas</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-300">
        <span>Total de Navios:</span><span className="font-mono text-cyan-400">{totalNavios}</span>
        <span>Na Fila:</span><span className="font-mono text-cyan-400">{emFila}</span>
        <span>Atracando:</span><span className="font-mono text-cyan-400">{atracando}</span>
        <span>Já Saíram:</span><span className="font-mono text-cyan-400">{saiu}</span>
      </div>
    </div>
  );
}