package com.web2.Back.dto;

import java.time.LocalDateTime;

public record SolicitacaoResumoDTO(
        LocalDateTime dataCriacao,
        String descricaoEquipamento,
        String status
) {
}
