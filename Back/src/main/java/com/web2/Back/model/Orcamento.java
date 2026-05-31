package com.web2.Back.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orcamentos")
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    @Column(nullable = false)
    private Double valor;

    @Column(nullable = false)
    private LocalDateTime dataOrcamento;

    public Orcamento() {
    }

    public Orcamento(
            Solicitacao solicitacao,
            Funcionario funcionario,
            Double valor
    ) {
        this.solicitacao = solicitacao;
        this.funcionario = funcionario;
        this.valor = valor;
        this.dataOrcamento = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public Funcionario getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionario funcionario) {
        this.funcionario = funcionario;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataOrcamento() {
        return dataOrcamento;
    }

    public void setDataOrcamento(LocalDateTime dataOrcamento) {
        this.dataOrcamento = dataOrcamento;
    }
}