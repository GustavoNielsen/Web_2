package com.web2.Back.dto;

import java.time.LocalDateTime;

public record OrcamentoInfoDTO(
        Double valor,
        LocalDateTime dataOrcamento,
        String funcionario
) {}
