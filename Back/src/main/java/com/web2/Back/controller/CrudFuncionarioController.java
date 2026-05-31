package com.web2.Back.controller;

import com.web2.Back.dto.FuncionarioCreateDTO;
import com.web2.Back.model.Funcionario;
import com.web2.Back.repository.FuncionarioRepository;
import com.web2.Back.service.EmailService;
import com.web2.Back.service.SenhaService;

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

    @Autowired
    private SenhaService senhaService;

    @Autowired
    private EmailService emailService;

    // LISTAR TODOS
    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(
            @PathVariable Long id
    ) {

        Optional<Funcionario> funcionario =
                funcionarioRepository.findById(id);

        return funcionario
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CADASTRAR
    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody FuncionarioCreateDTO dados
    ) {

        // verifica email duplicado
        if (funcionarioRepository
                .findByEmail(dados.email())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("E-mail já cadastrado.");
        }

        // gera senha aleatória
        String senhaPura =
                senhaService.gerarSenhaAleatoria();

        // gera salt
        String salt =
                senhaService.gerarSalt();

        // gera hash da senha
        String senhaHash =
                senhaService.hashSenha(
                        senhaPura,
                        salt
                );

        // cria funcionário
        Funcionario funcionario = new Funcionario();

        funcionario.setNome(dados.nome());
        funcionario.setEmail(dados.email());
        funcionario.setTelefone(dados.telefone());
        funcionario.setDataNascimento(
                dados.dataNascimento()
        );

        funcionario.setSenha(senhaHash);
        funcionario.setSalt(salt);

        funcionario.setTipo("FUNCIONARIO");
        funcionario.setAtivo(true);

        // salva no banco
        funcionarioRepository.save(funcionario);

        // envia senha por email
        emailService.enviarSenha(
                funcionario.getEmail(),
                senhaPura
        );

        return ResponseEntity.ok(
                "Funcionário cadastrado com sucesso."
        );
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

        Funcionario funcionario =
                funcionarioOptional.get();

        // verifica email duplicado
        Optional<Funcionario> emailExistente =
                funcionarioRepository.findByEmail(
                        dados.getEmail()
                );

        if (
                emailExistente.isPresent()
                        && !emailExistente.get()
                        .getId()
                        .equals(id)
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("E-mail já está em uso.");
        }

        funcionario.setNome(dados.getNome());
        funcionario.setEmail(dados.getEmail());
        funcionario.setTelefone(dados.getTelefone());

        funcionario.setDataNascimento(
                dados.getDataNascimento()
        );

        funcionario.setAtivo(dados.getAtivo());

        funcionarioRepository.save(funcionario);

        return ResponseEntity.ok(
                "Funcionário atualizado com sucesso."
        );
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
                    .body(
                            "Você não pode remover a si mesmo."
                    );
        }

        // não pode remover último funcionário
        long quantidade =
                funcionarioRepository.count();

        if (quantidade <= 1) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Não é possível remover o último funcionário."
                    );
        }

        funcionarioRepository.deleteById(id);

        return ResponseEntity.ok(
                "Funcionário removido com sucesso."
        );
    }
}