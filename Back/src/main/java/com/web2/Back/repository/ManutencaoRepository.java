package com.web2.Back.repository;

import com.web2.Back.model.Manutencao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
    Optional<Manutencao> findBySolicitacaoId(Long solicitacaoId);
}