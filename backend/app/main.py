from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import SimulationParams, SimulationResult
from app.simulation import run_port_simulation

app = FastAPI(
    title="Simulador de Porto com SimPy",
    description="API para executar simulações de teoria das filas para um processo de atracamento.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API de Simulação do Porto"}


@app.post("/simular", response_model=SimulationResult)
def simulate(params: SimulationParams) -> SimulationResult:
    
    simulation_result = run_port_simulation(params)
    return simulation_result