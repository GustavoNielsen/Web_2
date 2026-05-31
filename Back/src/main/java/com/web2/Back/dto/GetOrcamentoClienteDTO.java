package com.web2.Back.dto;

import java.time.LocalDateTime;

public record GetOrcamentoClienteDTO(
        Long idSolicitacao,
        String descricaoEquipamento,
        String categoria,
        String defeito,
        LocalDateTime dataAbertura,
        String status,
        Double valor
) {
}
