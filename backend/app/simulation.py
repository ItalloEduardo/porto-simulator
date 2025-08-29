from app.models import SimulationParams, SimulationResult, SimulationEvent

def run_port_simulation(params: SimulationParams) -> SimulationResult:
    """
    Executa a simulação do porto com base nos parâmetros fornecidos.
    POR ENQUANTO, esta função retorna dados mockados para teste.
    """
    print(f"Rodando simulação com {params.qtdBercos} berços.")

    mock_events = [
        SimulationEvent(tempo=2.5, navio_id=1, evento="chegou"),
        SimulationEvent(tempo=2.5, navio_id=1, evento="atracou", detalhes={"berco_id": 1}),
        SimulationEvent(tempo=3.1, navio_id=2, evento="chegou"),
        SimulationEvent(tempo=3.1, navio_id=2, evento="atracou", detalhes={"berco_id": 2}),
        SimulationEvent(tempo=8.9, navio_id=1, evento="saiu", detalhes={"berco_id": 1}),
    ]

    mock_stats = {
        "tempo_medio_espera_fila": 0.0,
        "utilizacao_media_bercos": 0.92,
        "total_navios_atendidos": 2
    }

    return SimulationResult(log_eventos=mock_events, estatisticas_finais=mock_stats)