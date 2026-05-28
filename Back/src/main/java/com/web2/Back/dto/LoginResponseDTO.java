package com.web2.Back.dto;

public record LoginResponseDTO(
        String token,
        String username,
        String cargo
) {}