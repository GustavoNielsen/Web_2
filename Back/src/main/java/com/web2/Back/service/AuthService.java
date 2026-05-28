package com.web2.Back.service;

import com.web2.Back.dto.LoginDTO;
import com.web2.Back.dto.LoginResponseDTO;
import com.web2.Back.model.Cliente;
import com.web2.Back.model.Funcionario;
import com.web2.Back.repository.ClienteRepository;
import com.web2.Back.repository.FuncionarioRepository;
import com.web2.Back.security.JwtService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final JwtService jwtService;

    public AuthService(ClienteRepository clienteRepository,
                       FuncionarioRepository funcionarioRepository,
                       JwtService jwtService) {
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(LoginDTO loginDTO) {
        String email = loginDTO.getEmail();
        String senha = loginDTO.getPassword();

        // Tentar encontrar como cliente
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        if (cliente.isPresent()) {
            Cliente c = cliente.get();
            if (validarSenha(senha, c.getSenha())) {
                String token = jwtService.gerarToken(c.getId(), "C");
                return new LoginResponseDTO(token, c.getNome(), "C");
            }
        }

        // Tentar encontrar como funcionário
        Optional<Funcionario> funcionario = funcionarioRepository.findByEmail(email);
        if (funcionario.isPresent()) {
            Funcionario f = funcionario.get();
            if (validarSenha(senha, f.getSenha())) {
                String token = jwtService.gerarToken(f.getId(), "F");
                return new LoginResponseDTO(token, f.getNome(), "F");
            }
        }

        throw new RuntimeException("Email ou senha inválidos");
    }

    private boolean validarSenha(String senhaFornecida, String senhaArmazenada) {
        // TODO: Implementar validação com BCrypt ou SHA-256+SALT
        return senhaFornecida.equals(senhaArmazenada);
    }
}
