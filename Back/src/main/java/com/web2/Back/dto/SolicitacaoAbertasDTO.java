package com.web2.Back.dto;

import java.time.LocalDateTime;

public record SolicitacaoAbertasDTO(
        Long id,
        LocalDateTime dataCriacao,
        String cliente,
        String equipamento,
        String status,
        String descricao,
        String categoria
) {
}
