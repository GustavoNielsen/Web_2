package com.web2.Back.dto;

public record GetPagarDTO(
        String descricaoEquipamento,
        String categoria,
        String status,
        float valor
) {
}
