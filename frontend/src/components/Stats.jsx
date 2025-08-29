export default function Stats({ navios }) {
  const totalNavios = navios.length;
  const emFila = navios.filter((n) => n.status === "fila").length;
  const atracando = navios.filter((n) => n.status === "atracando").length;
  const saiu = navios.filter((n) => n.status === "saiu").length;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-700">📊 Estatísticas</h2>
      <p>Total de Navios: {totalNavios}</p>
      <p>Na Fila: {emFila}</p>
      <p>Atracando: {atracando}</p>
      <p>Já Saíram: {saiu}</p>
    </div>
  );
}
