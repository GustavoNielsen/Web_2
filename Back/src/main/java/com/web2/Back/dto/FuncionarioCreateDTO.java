package com.web2.Back.dto;

import java.time.LocalDate;

public record FuncionarioCreateDTO(

         String nome,
         String email,
         String telefone,
         LocalDate dataNascimento
) {
}
