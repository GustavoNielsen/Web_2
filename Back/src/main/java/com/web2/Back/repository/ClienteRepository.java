package com.web2.Back.repository;

import com.web2.Back.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);
    Optional<Cliente> findByEmailAndAtivoTrue(String email);
    Optional<Cliente> findByIdAndAtivoTrue(Long id);
    List<Cliente> findByAtivoTrue();
    Optional<Cliente> findByNomeContainingIgnoreCase(String nome);
    boolean existsByCpf(String cpf);
}
