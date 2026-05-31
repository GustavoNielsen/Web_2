package com.web2.Back.dto;

public record RealizarManutencaoDTO(
        Long idSolicitacao,
        String descricao,
        String orientacao
) {
}
