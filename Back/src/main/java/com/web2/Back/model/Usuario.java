package com.web2.Back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@SQLDelete(sql = "UPDATE usuarios SET ativo = false WHERE id = ?")
// Define o filtro dinâmico que esconde os inativos por padrão
@FilterDef(name = "deletedUserFilter", defaultCondition = "ativo = true")
@Filter(name = "deletedUserFilter")
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(nullable = false, unique = true)
    protected String email;

    @Column(nullable = false)
    protected String nome;

    @Column(nullable = false)
    protected String tipo;

    @JsonIgnore
    @Column(nullable = false)
    protected String senha;

    @JsonIgnore
    @Column(nullable = false)
    protected String salt;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    protected boolean ativo = true;

    public Usuario() {
        this.ativo = true;
    }

    public Usuario(String email, String senha, String nome, String tipo) {
        this.email = email;
        this.senha = senha;
        this.nome = nome;
        this.tipo = tipo;
        this.ativo = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getSalt() { return salt; }
    public void setSalt(String salt) { this.salt = salt; }
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}