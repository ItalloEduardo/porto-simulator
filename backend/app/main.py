from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import SimulationParams, SimulationResult
from app.simulation import run_port_simulation

# Cria a instância da aplicação FastAPI
app = FastAPI(
    title="Simulador de Porto com SimPy",
    description="API para executar simulações de teoria das filas para um processo de atracamento.",
    version="1.0.0"
)

# Configuração do CORS (Cross-Origin Resource Sharing)
# ISSO É ESSENCIAL para permitir que seu frontend React (em localhost:5173)
# se comunique com este backend (em localhost:8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restrinja para o domínio do seu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API de Simulação do Porto"}


@app.post("/simular", response_model=SimulationResult)
def simulate(params: SimulationParams) -> SimulationResult:
    """
    Executa uma nova simulação.
    Recebe os parâmetros da simulação e retorna o log de eventos e as estatísticas finais.
    """
    simulation_result = run_port_simulation(params)
    return simulation_result