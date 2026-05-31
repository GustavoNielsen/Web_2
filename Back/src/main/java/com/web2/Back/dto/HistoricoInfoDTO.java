package com.web2.Back.dto;

import java.time.LocalDateTime;

public record HistoricoInfoDTO(
        String status,
        LocalDateTime data
) {}
