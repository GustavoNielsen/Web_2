package com.web2.Back.repository;

import com.web2.Back.model.Solicitacao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByClienteId(Long clienteId);
    Page<Solicitacao> findByStatus(String status, Pageable pageable);

    @Query("""
            select s
            from Solicitacao s
            join fetch s.orcamento o
            where s.dataPagamento is not null
            order by s.dataPagamento asc
            """)
    List<Solicitacao> findPagasComOrcamento();

    @Query("""
            select distinct s
            from Solicitacao s
            left join s.orcamento o
            left join s.manutencao m
            left join Redirecionamento r on r.solicitacao = s
            where
                (o is not null and o.funcionario.id = :funcionarioId)
                or (m is not null and m.funcionario.id = :funcionarioId)
                or (r is not null and r.funcionarioOrigem.id = :funcionarioId)
                or (s.funcionarioFinalizacao is not null and s.funcionarioFinalizacao.id = :funcionarioId)
            """)
    Page<Solicitacao> findAtuadasPorFuncionario(
            @Param("funcionarioId") Long funcionarioId,
            Pageable pageable
    );

    @Query("""
            select distinct s
            from Solicitacao s
            left join s.orcamento o
            left join s.manutencao m
            left join Redirecionamento r on r.solicitacao = s
            where
                (
                    o is not null
                    and o.funcionario.id = :funcionarioId
                    and o.dataOrcamento >= :dataMin
                    and o.dataOrcamento < :dataMax
                )
                or
                (
                    m is not null
                    and m.funcionario.id = :funcionarioId
                    and m.dataManutencao >= :dataMin
                    and m.dataManutencao < :dataMax
                )
                or
                (
                    r is not null
                    and r.funcionarioOrigem.id = :funcionarioId
                    and r.dataRedirecionamento >= :dataMin
                    and r.dataRedirecionamento < :dataMax
                )
                or
                (
                    s.funcionarioFinalizacao is not null
                    and s.funcionarioFinalizacao.id = :funcionarioId
                    and s.dataFinalizacao >= :dataMin
                    and s.dataFinalizacao < :dataMax
                )
            """)
    Page<Solicitacao> findAtuadasPorFuncionarioNoPeriodo(
            @Param("funcionarioId") Long funcionarioId,
            @Param("dataMin") LocalDateTime dataMin,
            @Param("dataMax") LocalDateTime dataMax,
            Pageable pageable
    );
}
