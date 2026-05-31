package com.web2.Back.dto;

import java.time.LocalDateTime;

public record SolicitacaoAbertasDTO(
        LocalDateTime dataCriacao,
        String cliente,
        String equipamento,
        String status
) {
}
