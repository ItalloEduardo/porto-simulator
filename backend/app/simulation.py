import simpy
import random
from typing import List
from app.models import SimulationParams, SimulationResult, SimulationEvent

def navio(env: simpy.Environment, navio_id: int, bercos: simpy.Resource, log_eventos: List[SimulationEvent], tempo_atendimento: float):
    tempo_chegada = env.now
    log_eventos.append(
        SimulationEvent(tempo=tempo_chegada, navio_id=navio_id, evento="chegou")
    )
    
    with bercos.request() as request:

        yield request
        
        tempo_atraca = env.now
        log_eventos.append(
            SimulationEvent(
                tempo=tempo_atraca, navio_id=navio_id, evento="atracou",
                detalhes={"tempo_de_espera": tempo_atraca - tempo_chegada}
            )
        )
        
        tempo_de_servico_real = random.expovariate(1.0 / tempo_atendimento)
        yield env.timeout(tempo_de_servico_real)
        
        tempo_saida = env.now
        log_eventos.append(
            SimulationEvent(
                tempo=tempo_saida, navio_id=navio_id, evento="saiu",
                detalhes={"tempo_no_berco": tempo_saida - tempo_atraca}
            )
        )


def gerador_de_navios(env: simpy.Environment, bercos: simpy.Resource, params: SimulationParams, log_eventos: List[SimulationEvent]):

    navio_id_counter = 0
    while True:
        tempo_entre_chegadas = random.expovariate(1.0 / params.tempo_medio_chegada)
        
        yield env.timeout(tempo_entre_chegadas)
        
        navio_id_counter += 1
        env.process(navio(env, navio_id_counter, bercos, log_eventos, params.tempo_medio_atendimento))


def run_port_simulation(params: SimulationParams) -> SimulationResult:

    log_eventos = []

    env = simpy.Environment()
    bercos = simpy.Resource(env, capacity=params.qtdBercos)
    env.process(gerador_de_navios(env, bercos, params, log_eventos))
    env.run(until=params.tempo_total_simulacao)
    log_eventos.sort(key=lambda e: e.tempo)
    
    # Calcula estatísticas finais a partir do log
    tempos_de_espera = [e.detalhes["tempo_de_espera"] for e in log_eventos if e.evento == "atracou"]
    tempo_medio_espera = sum(tempos_de_espera) / len(tempos_de_espera) if tempos_de_espera else 0
    
    navios_atendidos = len([e for e in log_eventos if e.evento == "saiu"])

    estatisticas_finais = {
        "tempo_medio_de_espera_na_fila": round(tempo_medio_espera, 2),
        "total_navios_atendidos": navios_atendidos,
        "total_eventos_registrados": len(log_eventos)
    }
    
    return SimulationResult(log_eventos=log_eventos, estatisticas_finais=estatisticas_finais)