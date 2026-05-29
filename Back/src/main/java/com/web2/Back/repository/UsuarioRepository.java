package com.web2.Back.repository;

import com.web2.Back.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    boolean existsByEmail(String email);
}