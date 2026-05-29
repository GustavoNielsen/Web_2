package com.web2.Back.dto;

public record RegisterClienteDTO(
    String nome,
    String cpf,
    String telefone,
    String email,
    String cep,
    String numero,
    String complemento,
    String logradouro,
    String bairro,
    String cidade,
    String uf
) {}
