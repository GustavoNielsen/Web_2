package com.web2.Back.repository;

import com.web2.Back.model.Redirecionamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RedirecionamentoRepository extends JpaRepository<Redirecionamento, Long> {

    List<Redirecionamento> findBySolicitacaoId(Long solicitacaoId);

    boolean existsBySolicitacaoId(Long solicitacaoId);

    Optional<Redirecionamento> findTopBySolicitacaoIdOrderByDataRedirecionamentoDesc(Long solicitacaoId);
}