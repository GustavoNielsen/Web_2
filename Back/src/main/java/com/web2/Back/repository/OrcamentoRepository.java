package com.web2.Back.repository;

import com.web2.Back.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    Optional<Orcamento> findBySolicitacaoId(Long solicitacaoId);
}