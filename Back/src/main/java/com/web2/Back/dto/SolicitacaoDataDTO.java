package com.web2.Back.dto;

import java.time.LocalDate;

public record SolicitacaoDataDTO(
        LocalDate dataMin,
        LocalDate dataMax,
        int page
) {
}
