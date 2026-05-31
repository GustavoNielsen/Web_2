package com.web2.Back.controller;

import com.web2.Back.dto.*;
import com.web2.Back.model.CategoriaEquipamentos;
import com.web2.Back.model.Cliente;
import com.web2.Back.model.Solicitacao;
import com.web2.Back.service.ClienteService;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(
            ClienteService clienteService

    ) {
        this.clienteService = clienteService;
    }


    @GetMapping("/listarcategorias")
    public ResponseEntity<List<CategoriaEquipamentos>> ListarCategorias(){
        List<CategoriaEquipamentos> lista = clienteService.ListCategorias();
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/abrirsolicitacao")
    public ResponseEntity<?> novaSolicitacao(@RequestBody AberturaSolicitacaoDTO dto, @CookieValue("jwt") String token) {

        Solicitacao solicitacao = clienteService.criarSolicitacao(dto, token);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/solicitacoes")
    public ResponseEntity<SolicitacoesClienteResponseDTO> Solicitoes(@CookieValue("jwt") String token){
        SolicitacoesClienteResponseDTO response =
                clienteService.enviarSolicitacoes(token);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/solicitacoes/{id}")
    public ResponseEntity<InformacoesSolicitacaoDTO> VisualizarSolicitacao(@PathVariable Long id, @CookieValue("jwt") String token){
        InformacoesSolicitacaoDTO response =
                clienteService.visualizarSolicitacao(id, token);

        return ResponseEntity.ok(response);
    }


    @PutMapping("/aprovarsolicitacao")
    public ResponseEntity<?> aprovarOrcamento(@RequestBody AprovarRecusarDTO dto, @CookieValue("jwt") String token){

        clienteService.aprovarOrcamentoService(dto, token);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/rejeitarlicitacao")
    public ResponseEntity<?> rejeitarOrcamento(@RequestBody AprovarRecusarDTO dto, @CookieValue("jwt") String token){
        clienteService.RejeitarOrcamentoService(dto, token);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/pagar/{id}")
    public ResponseEntity<GetPagarDTO> getPagamento(@PathVariable Long id, @CookieValue("jwt") String token){
        GetPagarDTO response = clienteService.getPagarService(id, token);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/pagar")
    public ResponseEntity<?> pagarSolicitacao(@RequestBody PagarSolicitacaoDTO dto, @CookieValue("jwt") String token){
        clienteService.PagarSolicitacao(dto, token);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarTodos() {
        List<Cliente> clientes = clienteService.listarTodos();
        return ResponseEntity.ok(clientes);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        try {
            Cliente cliente = clienteService.buscarPorId(id);
            return ResponseEntity.ok(cliente);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<Cliente> criar(@RequestBody Cliente cliente) {
        try {
            Cliente novoCliente = clienteService.salvar(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(
            @PathVariable Long id,
            @RequestBody Cliente novoCliente
    ) {
        try {
            Cliente clienteAtualizado =
                    clienteService.atualizar(id, novoCliente);

            return ResponseEntity.ok(clienteAtualizado);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            clienteService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
