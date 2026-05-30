package com.web2.Back.repository;

import com.web2.Back.model.CategoriaEquipamentos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository
        extends JpaRepository<CategoriaEquipamentos, Long> {
}