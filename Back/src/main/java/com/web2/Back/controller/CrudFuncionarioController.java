package com.web2.Back.controller;

import com.web2.Back.dto.FuncionarioCreateDTO;
import com.web2.Back.model.Funcionario;
import com.web2.Back.repository.FuncionarioRepository;
import com.web2.Back.security.JwtService;
import com.web2.Back.service.EmailService;
import com.web2.Back.service.SenhaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/crudfuncionarios")
public class CrudFuncionarioController {

    private final FuncionarioRepository funcionarioRepository;
    private final SenhaService senhaService;
    private final EmailService emailService;
    private final JwtService jwtService;

    public CrudFuncionarioController(
            FuncionarioRepository funcionarioRepository,
            SenhaService senhaService,
            EmailService emailService,
            JwtService jwtService
    ) {
        this.funcionarioRepository = funcionarioRepository;
        this.senhaService = senhaService;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> listarTodos() {
        return ResponseEntity.ok(funcionarioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return funcionarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody FuncionarioCreateDTO dados) {
        validarDadosCadastro(dados);
        validarEmailDisponivel(dados.email(), null);

        String senhaPura = senhaService.gerarSenhaAleatoria();
        String salt = senhaService.gerarSalt();

        Funcionario funcionario = new Funcionario();
        funcionario.setNome(dados.nome().trim());
        funcionario.setEmail(dados.email().trim());
        funcionario.setTelefone(dados.telefone());
        funcionario.setDataNascimento(dados.dataNascimento());
        funcionario.setSenha(senhaService.hashSenha(senhaPura, salt));
        funcionario.setSalt(salt);
        funcionario.setTipo("FUNCIONARIO");
        funcionario.setAtivo(true);

        funcionarioRepository.save(funcionario);
        emailService.enviarSenha(funcionario.getEmail(), senhaPura);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Funcionario cadastrado com sucesso.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody FuncionarioCreateDTO dados
    ) {
        validarDadosCadastro(dados);
        validarEmailDisponivel(dados.email(), id);

        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElse(null);

        if (funcionario == null) {
            return ResponseEntity.notFound().build();
        }

        funcionario.setNome(dados.nome().trim());
        funcionario.setEmail(dados.email().trim());
        funcionario.setTelefone(dados.telefone());
        funcionario.setDataNascimento(dados.dataNascimento());

        funcionarioRepository.save(funcionario);

        return ResponseEntity.ok("Funcionario atualizado com sucesso.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id, @CookieValue("jwt") String token) {

        Long userId = jwtService.extrairUserId(token);

        Funcionario funcionarioRequest = funcionarioRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionario nao encontrado"
                        )
                );

        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElse(null);

        if (funcionario == null) {
            return ResponseEntity.notFound().build();
        }

        if (funcionario.getId().equals(funcionarioRequest.getId())) {
            return ResponseEntity
                    .badRequest()
                    .body("Voce nao pode remover a si mesmo.");
        }

        if (funcionarioRepository.count() <= 1) {
            return ResponseEntity
                    .badRequest()
                    .body("Nao e possivel remover o ultimo funcionario.");
        }

        funcionarioRepository.delete(funcionario);

        return ResponseEntity.ok("Funcionario removido com sucesso.");
    }

    private Funcionario buscarFuncionario(Long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionario nao encontrado"
                        )
                );
    }

    private void validarDadosCadastro(FuncionarioCreateDTO dados) {
        if (dados == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados do funcionario sao obrigatorios");
        }

        if (dados.nome() == null || dados.nome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome e obrigatorio");
        }

        if (dados.email() == null || dados.email().isBlank() || !dados.email().contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email invalido");
        }

        if (dados.dataNascimento() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data de nascimento e obrigatoria");
        }
    }

    private void validarEmailDisponivel(String email, Long funcionarioIdIgnorado) {
        funcionarioRepository.findByEmail(email.trim())
                .filter(funcionario -> !funcionario.getId().equals(funcionarioIdIgnorado))
                .ifPresent(funcionario -> {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Email ja esta em uso"
                    );
                });
    }
}
