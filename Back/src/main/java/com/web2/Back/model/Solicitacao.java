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

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaEquipamentos categoria;

    @Column(nullable = false)
    private String descricaoDefeito;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @Column
    private Double valorOrcado;

    @Column
    private LocalDateTime dataOrcamento;

    @ManyToOne
    @JoinColumn(name = "funcionario_orcamento_id")
    private Funcionario funcionarioOrcamento;

    public Solicitacao() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public String getDescricaoEquipamento() { return descricaoEquipamento; }
    public void setDescricaoEquipamento(String descricaoEquipamento) { this.descricaoEquipamento = descricaoEquipamento; }
    public CategoriaEquipamentos getCategoria() { return categoria; }
    public void setCategoria(CategoriaEquipamentos categoria) { this.categoria = categoria; }
    public String getDescricaoDefeito() { return descricaoDefeito; }
    public void setDescricaoDefeito(String descricaoDefeito) { this.descricaoDefeito = descricaoDefeito; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
