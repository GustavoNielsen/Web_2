package com.web2.Back.dto;

public record GetResgateDTO(
        Long idSolicitacao,
        String descricaoEquipamento,
        String defeito,
        String status,
        Double valor
) {
}
