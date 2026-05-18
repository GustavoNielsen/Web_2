package com.web2.Back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/funcionario/solicitacoes")
@CrossOrigin(origins = "*")
public class FuncionarioSolicitacaoController {

    // TODO: Implementar SolicitacaoService
    // private final SolicitacaoService solicitacaoService;

    // TODO: Implementar construtor com injeção de SolicitacaoService
    // public FuncionarioSolicitacaoController(SolicitacaoService solicitacaoService) {
    //     this.solicitacaoService = solicitacaoService;
    // }

    // RF011 - Listar solicitações ABERTAS
    @GetMapping("/abertas")
    public ResponseEntity<List<?>> listarAbertas() {
        // TODO: Retornar solicitacaoService.listarPorStatus("ABERTA")
        return ResponseEntity.ok(new ArrayList<>());
    }

    // RF013 - Listagem geral com filtros (hoje, período ou todas)
    @GetMapping
    public ResponseEntity<List<?>> listarComFiltros(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {
        // TODO: Retornar solicitacaoService.listarComFiltros(filtro, dataInicio, dataFim)
        return ResponseEntity.ok(new ArrayList<>());
    }

    // RF012 - Efetuar orçamento
    @PutMapping("/{id}/orcamento")
    public ResponseEntity<?> efetuarOrcamento(
            @PathVariable Long id,
            @RequestParam Double valor,
            @RequestParam Long funcionarioId) {
        // TODO: Implementar efetuarOrcamento
        return ResponseEntity.ok("Orçamento recebido - em implementação");
    }

    // RF014 - Efetuar manutenção
    @PutMapping("/{id}/manutencao")
    public ResponseEntity<?> efetuarManutencao(
            @PathVariable Long id,
            @RequestParam String descricaoManutencao,
            @RequestParam String orientacoes,
            @RequestParam Long funcionarioId) {
        // TODO: Implementar efetuarManutencao
        return ResponseEntity.ok("Manutenção recebida - em implementação");
    }

    // RF015 - Redirecionar manutenção
    @PutMapping("/{id}/redirecionar")
    public ResponseEntity<?> redirecionar(
            @PathVariable Long id,
            @RequestParam Long funcionarioOrigemId,
            @RequestParam Long funcionarioDestinoId) {
        // TODO: Implementar redirecionar
        return ResponseEntity.ok("Redirecionamento recebido - em implementação");
    }

    // RF016 - Finalizar solicitação
    @PutMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizar(
            @PathVariable Long id,
            @RequestParam Long funcionarioId) {
        // TODO: Implementar finalizarSolicitacao
        return ResponseEntity.ok("Solicitação finalizada - em implementação");
    }

    // Visualizar detalhes (usado em várias telas do funcionário)
    @GetMapping("/{id}")
    public ResponseEntity<?> visualizar(@PathVariable Long id) {
        // TODO: Implementar buscar por ID
        return ResponseEntity.ok("Solicitação encontrada - em implementação");
    }
}
