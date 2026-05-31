package com.web2.Back.controller;

import com.web2.Back.dto.*;
import com.web2.Back.model.Funcionario;
import com.web2.Back.service.FuncionarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    // Listar todos os funcionários
    @GetMapping
    public ResponseEntity<List<Funcionario>> listarTodos() {
        List<Funcionario> funcionarios = funcionarioService.listarTodos();
        return ResponseEntity.ok(funcionarios);
    }


    //Buscar funcionário por ID
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        try {
            Funcionario funcionario = funcionarioService.buscarPorId(id);
            return ResponseEntity.ok(funcionario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/solicitacoes/{id}")
    public ResponseEntity<InformacoesSolicitacaoDTO> VisualizarSolicitacao(@PathVariable Long id, @CookieValue("jwt") String token){
        InformacoesSolicitacaoDTO response =
                funcionarioService.visualizarSolicitacao(id, token);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/solicitacaoesAbertas/{page}")
    public ResponseEntity<?>GetSolicitacoesAbertas(@PathVariable int page){
        return ResponseEntity.ok(
                funcionarioService.SolicitacoesAbertas(page)
        );
    }

    @GetMapping("/solicitacaoesHoje/{page}")
    public ResponseEntity<?>GetSolicitacoesHoje(@PathVariable int page, @CookieValue("jwt") String token){
        return ResponseEntity.ok(
                funcionarioService.SolicitacoesHoje(page, token)
        );
    }

    @GetMapping("/solicitacaoesTotais/{page}")
    public ResponseEntity<?>GetSolicitacoesTotais(@PathVariable int page, @CookieValue("jwt") String token){
        return ResponseEntity.ok(
                funcionarioService.SolicitacoesTotais(page, token)
        );
    }

    @PostMapping("/solicitacaoPeriodo")
    public ResponseEntity<?>GetSolicitacaoPeriodo(@RequestBody SolicitacaoDataDTO dto, @CookieValue("jwt") String token){
        return ResponseEntity.ok(
                funcionarioService.SolicitacoesPorPeriodo(dto, token)
        );
    }

    @PutMapping("/orcar")
    public ResponseEntity<?> orcarSolicitacao(@RequestBody OrcarSolicitacaoDTO dto, @CookieValue("jwt") String token) {

        funcionarioService.Orcar(dto, token);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/realizarmanutencao")
    public ResponseEntity<?> realizarManutencao(@RequestBody RealizarManutencaoDTO dto, @CookieValue("jwt") String token){
        funcionarioService.Manutencao(dto, token);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/redirecionar")
    public ResponseEntity<?> redirecionarManutencao(@RequestBody RedirecionamentoDTO dto, @CookieValue("jwt") String token){
        funcionarioService.RedirecionarManutencao(dto, token);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/finalizar")
    public ResponseEntity<?> finalizarSolicitacao(@RequestBody FinalizarSolicitacaoDTO dto, @CookieValue("jwt") String token){

        funcionarioService.Finalizar(dto, token);

        return ResponseEntity.ok().build();
    }


}
