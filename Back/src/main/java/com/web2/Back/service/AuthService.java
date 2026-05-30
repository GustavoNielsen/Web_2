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
    private final SenhaService senhaService;

    public AuthService(ClienteRepository clienteRepository,
                       FuncionarioRepository funcionarioRepository,
                       JwtService jwtService,
                       SenhaService senhaService) {
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.jwtService = jwtService;
        this.senhaService = senhaService;
    }

    public LoginResponseDTO login(LoginDTO loginDTO) {
        System.out.println("2");
        String email = loginDTO.email();
        String senha = loginDTO.password();

        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        if (cliente.isPresent()) {
            Cliente c = cliente.get();
            System.out.println("4");
            if (validarSenha(senha, c.getSenha(), c.getSalt())) {
                System.out.println("5");
                String token = jwtService.gerarToken(c.getId(), "C");
                System.out.println("6");
                return new LoginResponseDTO(token, c.getNome(), "C");
            }
        }

        Optional<Funcionario> funcionario = funcionarioRepository.findByEmail(email);

        if (funcionario.isPresent()) {
            Funcionario f = funcionario.get();

            if (validarSenha(senha, f.getSenha(), f.getSalt())) {
                String token = jwtService.gerarToken(f.getId(), "F");
                return new LoginResponseDTO(token, f.getNome(), "F");
            }
        }
        throw new RuntimeException("Email ou senha inválidos");
    }

    private boolean validarSenha(String senhaFornecida, String senhaHash, String salt) {

        String hashCalculado = senhaService.hashSenha(senhaFornecida, salt);

        return hashCalculado.equals(senhaHash);
    }
}