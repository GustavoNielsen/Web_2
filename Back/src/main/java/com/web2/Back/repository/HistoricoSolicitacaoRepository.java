package com.web2.Back.repository;

import com.web2.Back.model.HistoricoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface HistoricoSolicitacaoRepository extends JpaRepository<HistoricoSolicitacao, Long> {
    List<HistoricoSolicitacao> findBySolicitacaoId(Long solicitacaoId);
}
