package com.web2.Back.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacoes")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(nullable = false)
    private String descricaoEquipamento;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private String descricaoDefeito;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @Column
    private LocalDateTime dataPagamento;

    @OneToOne(mappedBy = "solicitacao")
    private Manutencao manutencao;

    @OneToOne(mappedBy = "solicitacao")
    private Orcamento orcamento;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "funcionario_finalizacao_id")
    private Funcionario funcionarioFinalizacao;

    @Column
    private LocalDateTime dataFinalizacao;

    public Solicitacao() {
    }

    public Solicitacao(
            Cliente cliente,
            String descricaoEquipamento,
            String categoria,
            String descricaoDefeito,
            String status
    ) {
        this.cliente = cliente;
        this.descricaoEquipamento = descricaoEquipamento;
        this.categoria = categoria;
        this.descricaoDefeito = descricaoDefeito;
        this.dataCriacao = LocalDateTime.now();
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getDescricaoEquipamento() {
        return descricaoEquipamento;
    }

    public void setDescricaoEquipamento(String descricaoEquipamento) {
        this.descricaoEquipamento = descricaoEquipamento;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescricaoDefeito() {
        return descricaoDefeito;
    }

    public void setDescricaoDefeito(String descricaoDefeito) {
        this.descricaoDefeito = descricaoDefeito;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public Manutencao getManutencao() {
        return manutencao;
    }

    public void setManutencao(Manutencao manutencao) {
        this.manutencao = manutencao;
    }

    public Orcamento getOrcamento() {
        return orcamento;
    }

    public void setOrcamento(Orcamento orcamento) {
        this.orcamento = orcamento;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDataFinalizacao() {
        return dataFinalizacao;
    }
    public void setDataFinalizacao(LocalDateTime dataFinalizacao) {
        this.dataFinalizacao = dataFinalizacao;
    }

    public Funcionario getFuncionarioFinalizacao() {
        return funcionarioFinalizacao;
    }

    public void setFuncionarioFinalizacao(Funcionario funcionarioFinalizacao) {
        this.funcionarioFinalizacao = funcionarioFinalizacao;
    }
}