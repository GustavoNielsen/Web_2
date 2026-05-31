package com.web2.Back.controller;

import com.web2.Back.model.Funcionario;
import com.web2.Back.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/crudfuncionarios")
public class CrudFuncionarioController {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    // LISTAR TODOS
    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {

        Optional<Funcionario> funcionario =
                funcionarioRepository.findById(id);

        return funcionario
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CADASTRAR
    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody Funcionario funcionario
    ) {

        // verifica email único
        if (funcionarioRepository
                .findByEmail(funcionario.getEmail())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("E-mail já cadastrado.");
        }

        funcionario.setTipo("FUNCIONARIO");

        Funcionario novoFuncionario =
                funcionarioRepository.save(funcionario);

        return ResponseEntity.ok(novoFuncionario);
    }

    // ATUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Funcionario dados
    ) {

        Optional<Funcionario> funcionarioOptional =
                funcionarioRepository.findById(id);

        if (funcionarioOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Funcionario funcionario = funcionarioOptional.get();

        // verifica email duplicado
        Optional<Funcionario> emailExistente =
                funcionarioRepository.findByEmail(dados.getEmail());

        if (
                emailExistente.isPresent()
                        && !emailExistente.get().getId().equals(id)
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("E-mail já está em uso.");
        }

        funcionario.setNome(dados.getNome());
        funcionario.setEmail(dados.getEmail());
        funcionario.setSenha(dados.getSenha());

        funcionario.setTelefone(dados.getTelefone());
        funcionario.setDataNascimento(
                dados.getDataNascimento()
        );

        funcionario.setAtivo(dados.getAtivo());

        funcionarioRepository.save(funcionario);

        return ResponseEntity.ok(funcionario);
    }

    // REMOVER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(
            @PathVariable Long id,
            @RequestParam Long funcionarioLogadoId
    ) {

        Optional<Funcionario> funcionario =
                funcionarioRepository.findById(id);

        if (funcionario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // não pode remover a si mesmo
        if (id.equals(funcionarioLogadoId)) {
            return ResponseEntity
                    .badRequest()
                    .body("Você não pode remover a si mesmo.");
        }

        // não pode remover o último funcionário
        long quantidade =
                funcionarioRepository.count();

        if (quantidade <= 1) {
            return ResponseEntity
                    .badRequest()
                    .body("Não é possível remover o último funcionário.");
        }

        funcionarioRepository.deleteById(id);

        return ResponseEntity.ok(
                "Funcionário removido com sucesso."
        );
    }
}