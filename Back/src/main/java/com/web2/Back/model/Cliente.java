package com.web2.Back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente extends Usuario {
    @Column(nullable = false, unique = true)
    private String cpf;

    @Column
    private String telefone;

    @OneToOne(cascade = CascadeType.PERSIST, optional = false)
    @JoinColumn(name = "endereco_id", nullable = false)
    private Endereco endereco;

    public Cliente() {
        this.tipo = "CLIENTE";
    }

    public Cliente(String cpf, String nome, String email, String telefone, String senha, Endereco endereco) {
        super(email, senha, nome, "CLIENTE");
        this.cpf = cpf;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
}
