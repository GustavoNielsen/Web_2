package com.web2.Back.model;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import java.time.LocalDate;

@Entity
@Table(name = "funcionarios")
// Garante que o delete disparado pelo FuncionarioRepository vire o UPDATE correto na tabela mãe
@SQLDelete(sql = "UPDATE usuarios SET ativo = false WHERE id = ?")
public class Funcionario extends Usuario {

    @Column
    private String telefone;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    // ⚠️ O campo 'ativo' foi removido daqui pois já é herdado de 'Usuario'

    public Funcionario() {
        this.tipo = "FUNCIONARIO";
    }

    public Funcionario(String nome, String email, String senha, String telefone, LocalDate dataNascimento) {
        super(email, senha, nome, "FUNCIONARIO");
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.ativo = true; // Inicializa o campo herdado da classe mãe
    }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
}