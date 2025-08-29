
export default function Header() {
  return (
    <header className="py-4 px-6 bg-slate-950 shadow-md flex justify-center">
      <div className="flex items-center justify-center gap-4">
        {/* Ícone de Âncora (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-cyan-400"
        >
          <path d="M12 22V8" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
          <circle cx="12" cy="5" r="3" />
        </svg>

        <h1 className="text-3xl font-bold text-slate-100 tracking-wider">
          Simulador de Porto
        </h1>
      </div>
    </header>
  );
}