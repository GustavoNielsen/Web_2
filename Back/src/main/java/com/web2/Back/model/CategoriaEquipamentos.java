package com.web2.Back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categorias_equipamentos")
public class CategoriaEquipamentos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    public CategoriaEquipamentos() {}

    public CategoriaEquipamentos(String nome) {
        this.nome = nome;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    @Override
    public String toString() {
        return "CategoriaEquipamentos{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                '}';
    }
}
