package com.web2.Back.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InformacoesSolicitacaoDTO(
        Long id,
        String equipamento,
        String categoria,
        String defeito,
        String motivoRejeicao,
        String status,
        LocalDateTime dataCriacao,
        LocalDateTime dataPagamento,
        LocalDateTime dataFinalizacao,
        OrcamentoInfoDTO orcamento,
        ManutencaoInfoDTO manutencao,
        List<HistoricoInfoDTO> historico
) {}
