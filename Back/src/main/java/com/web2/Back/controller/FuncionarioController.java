package com.exemplo.manutencao.controller;

import com.exemplo.manutencao.dto.SolicitacaoDTO;
import com.exemplo.manutencao.service.SolicitacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/funcionario/solicitacoes")
@CrossOrigin(origins = "*")
public class FuncionarioSolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    // RF011 - Listar solicitações ABERTAS
    @GetMapping("/abertas")
    public ResponseEntity<List<SolicitacaoDTO>> listarAbertas() {
        return ResponseEntity.ok(solicitacaoService.listarPorStatus("ABERTA"));
    }

    // RF013 - Listagem geral com filtros (hoje, período ou todas)
    @GetMapping
    public ResponseEntity<List<SolicitacaoDTO>> listarComFiltros(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataInicio,
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataFim) {

        List<SolicitacaoDTO> lista = solicitacaoService.listarComFiltros(filtro, dataInicio, dataFim);
        return ResponseEntity.ok(lista);
    }

    // RF012 - Efetuar orçamento
    @PutMapping("/{id}/orcamento")
    public ResponseEntity<SolicitacaoDTO> efetuarOrcamento(
            @PathVariable Long id,
            @RequestParam Double valor,
            @RequestParam Long funcionarioId) {

        SolicitacaoDTO dto = solicitacaoService.efetuarOrcamento(id, valor, funcionarioId);
        return ResponseEntity.ok(dto);
    }

    // RF014 - Efetuar manutenção
    @PutMapping("/{id}/manutencao")
    public ResponseEntity<SolicitacaoDTO> efetuarManutencao(
            @PathVariable Long id,
            @RequestParam String descricaoManutencao,
            @RequestParam String orientacoes,
            @RequestParam Long funcionarioId) {

        SolicitacaoDTO dto = solicitacaoService.efetuarManutencao(
                id,
                descricaoManutencao,
                orientacoes,
                funcionarioId
        );

        return ResponseEntity.ok(dto);
    }

    // RF015 - Redirecionar manutenção
    @PutMapping("/{id}/redirecionar")
    public ResponseEntity<SolicitacaoDTO> redirecionar(
            @PathVariable Long id,
            @RequestParam Long funcionarioOrigemId,
            @RequestParam Long funcionarioDestinoId) {

        SolicitacaoDTO dto = solicitacaoService.redirecionar(
                id,
                funcionarioOrigemId,
                funcionarioDestinoId
        );

        return ResponseEntity.ok(dto);
    }

    // RF016 - Finalizar solicitação
    @PutMapping("/{id}/finalizar")
    public ResponseEntity<SolicitacaoDTO> finalizar(
            @PathVariable Long id,
            @RequestParam Long funcionarioId) {

        SolicitacaoDTO dto = solicitacaoService.finalizarSolicitacao(id, funcionarioId);
        return ResponseEntity.ok(dto);
    }

    // Visualizar detalhes (usado em várias telas do funcionário)
    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoDTO> visualizar(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id));
    }

    // Listar solicitações atribuídas ao funcionário (útil pra redirecionadas)
    @GetMapping("/funcionario/{funcionarioId}")
    public ResponseEntity<List<SolicitacaoDTO>> listarPorFuncionario(
            @PathVariable Long funcionarioId) {

        return ResponseEntity.ok(
                solicitacaoService.listarPorFuncionario(funcionarioId)
        );
    }
}