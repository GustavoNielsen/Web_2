package com.web2.Back.dto;


import java.util.List;

public record SolicitacoesClienteResponseDTO(
        List<SolicitacaoResumoDTO> solicitacoes
) {
}
