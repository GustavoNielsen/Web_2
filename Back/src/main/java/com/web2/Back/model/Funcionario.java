package com.web2.Back.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "funcionarios")
public class Funcionario extends Usuario {
    @Column
    private String telefone;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean ativo = true;

    public Funcionario() {
        this.tipo = "FUNCIONARIO";
    }

    public Funcionario(String nome, String email, String senha, String telefone, LocalDate dataNascimento) {
        super(email, senha, nome, "FUNCIONARIO");
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
    }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
