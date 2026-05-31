package com.web2.Back.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "manutencoes")
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricaoManutencao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String orientacoesCliente;

    @Column(nullable = false)
    private LocalDateTime dataManutencao;

    public Manutencao() {
    }

    public Manutencao(
            Solicitacao solicitacao,
            Funcionario funcionario,
            String descricaoManutencao,
            String orientacoesCliente
    ) {
        this.solicitacao = solicitacao;
        this.funcionario = funcionario;
        this.descricaoManutencao = descricaoManutencao;
        this.orientacoesCliente = orientacoesCliente;
        this.dataManutencao = LocalDateTime.now();
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

    public String getDescricaoManutencao() {
        return descricaoManutencao;
    }

    public void setDescricaoManutencao(String descricaoManutencao) {
        this.descricaoManutencao = descricaoManutencao;
    }

    public String getOrientacoesCliente() {
        return orientacoesCliente;
    }

    public void setOrientacoesCliente(String orientacoesCliente) {
        this.orientacoesCliente = orientacoesCliente;
    }

    public LocalDateTime getDataManutencao() {
        return dataManutencao;
    }

    public void setDataManutencao(LocalDateTime dataManutencao) {
        this.dataManutencao = dataManutencao;
    }
}