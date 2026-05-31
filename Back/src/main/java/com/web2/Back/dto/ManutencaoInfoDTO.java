package com.web2.Back.dto;

import java.time.LocalDateTime;

public record ManutencaoInfoDTO(
        String descricao,
        String orientacao,
        LocalDateTime dataManutencao,
        String funcionario
) {}
