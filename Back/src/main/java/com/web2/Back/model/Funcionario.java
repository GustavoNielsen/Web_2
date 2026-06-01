package com.web2.Back.model;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Filter;
import java.time.LocalDate;

@Entity
@Table(name = "funcionarios")
@SQLDelete(sql = "UPDATE usuarios SET ativo = false WHERE id = ?")
@Filter(name = "deletedUserFilter") // Garante que o filtro herde corretamente na tabela filha
public class Funcionario extends Usuario {

    @Column
    private String telefone;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    public Funcionario() {
        this.tipo = "FUNCIONARIO";
    }

    public Funcionario(String nome, String email, String senha, String telefone, LocalDate dataNascimento) {
        super(email, senha, nome, "FUNCIONARIO");
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.ativo = true;
    }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
}