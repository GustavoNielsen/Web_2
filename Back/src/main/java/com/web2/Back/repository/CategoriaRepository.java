package com.web2.Back.repository;

import com.web2.Back.model.CategoriaEquipamentos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<CategoriaEquipamentos, Long> {

    Optional<CategoriaEquipamentos> findByNome(String nome);
}