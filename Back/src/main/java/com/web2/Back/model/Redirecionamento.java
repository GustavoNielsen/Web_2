package com.web2.Back.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "redirecionamentos")
public class Redirecionamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @ManyToOne
    @JoinColumn(name = "funcionario_origem_id", nullable = false)
    private Funcionario funcionarioOrigem;

    @ManyToOne
    @JoinColumn(name = "funcionario_destino_id", nullable = false)
    private Funcionario funcionarioDestino;

    @Column(nullable = false)
    private LocalDateTime dataRedirecionamento;

    public Redirecionamento() {
    }

    public Redirecionamento(
            Solicitacao solicitacao,
            Funcionario funcionarioOrigem,
            Funcionario funcionarioDestino
    ) {
        this.solicitacao = solicitacao;
        this.funcionarioOrigem = funcionarioOrigem;
        this.funcionarioDestino = funcionarioDestino;
        this.dataRedirecionamento = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public Funcionario getFuncionarioOrigem() {
        return funcionarioOrigem;
    }

    public void setFuncionarioOrigem(Funcionario funcionarioOrigem) {
        this.funcionarioOrigem = funcionarioOrigem;
    }

    public Funcionario getFuncionarioDestino() {
        return funcionarioDestino;
    }

    public void setFuncionarioDestino(Funcionario funcionarioDestino) {
        this.funcionarioDestino = funcionarioDestino;
    }

    public LocalDateTime getDataRedirecionamento() {
        return dataRedirecionamento;
    }

    public void setDataRedirecionamento(LocalDateTime dataRedirecionamento) {
        this.dataRedirecionamento = dataRedirecionamento;
    }
}