from pydantic import BaseModel
from typing import List, Dict

# Modelo para os parâmetros que o frontend enviará
class SimulationParams(BaseModel):
    qtdBercos: int
    tempo_medio_chegada: float
    tempo_medio_atendimento: float
    tempo_total_simulacao: float

# Modelo para um único evento que ocorreu na simulação
class SimulationEvent(BaseModel):
    tempo: float
    navio_id: int
    evento: str # Ex: "chegou", "entrou na fila", "atracou", "saiu"
    detalhes: Dict = {} # Dicionário para informações extras

# Modelo para o resultado final que será retornado ao frontend
class SimulationResult(BaseModel):
    log_eventos: List[SimulationEvent]
    estatisticas_finais: Dict # Ex: {"tempo_medio_espera": 15.2, "utilizacao_bercos": 0.85}