from pydantic import BaseModel
from typing import List, Dict

class SimulationParams(BaseModel):
    qtdBercos: int
    tempo_medio_chegada: float
    tempo_medio_atendimento: float
    tempo_total_simulacao: float

class SimulationEvent(BaseModel):
    tempo: float
    navio_id: int
    evento: str
    detalhes: Dict = {}

class SimulationResult(BaseModel):
    log_eventos: List[SimulationEvent]
    estatisticas_finais: Dict