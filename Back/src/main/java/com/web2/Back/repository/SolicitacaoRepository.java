package com.web2.Back.repository;

import com.web2.Back.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByClienteId(Long clienteId);
    Page<Solicitacao> findByStatus(String status, Pageable pageable);
}