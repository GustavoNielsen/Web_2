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

    public AuthService(
            ClienteRepository clienteRepository,
            FuncionarioRepository funcionarioRepository,
            JwtService jwtService,
            SenhaService senhaService
    ) {
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.jwtService = jwtService;
        this.senhaService = senhaService;
    }

    public String login(LoginDTO loginDTO) {

        String email = loginDTO.email().trim();
        String senha = loginDTO.password().trim();

        Optional<Cliente> cliente = clienteRepository.findByEmailAndAtivoTrue(email);

        if (cliente.isPresent()) {

            Cliente c = cliente.get();

            if (validarSenha(senha, c.getSenha(), c.getSalt())) {

                return jwtService.gerarToken(
                        c.getId(),
                        "C"
                );
            }
        }

        Optional<Funcionario> funcionario =
                funcionarioRepository.findByEmailAndAtivoTrue(email);

        if (funcionario.isPresent()) {

            Funcionario f = funcionario.get();

            if (validarSenha(senha, f.getSenha(), f.getSalt())) {

                return jwtService.gerarToken(
                        f.getId(),
                        "F"
                );
            }
        }

        throw new RuntimeException("Email ou senha inválidos");
    }

    public LoginResponseDTO getResponseDTO(LoginDTO loginDTO) {

        String email = loginDTO.email().trim();

        Optional<Cliente> cliente = clienteRepository.findByEmailAndAtivoTrue(email);

        if (cliente.isPresent()) {

            Cliente c = cliente.get();

            return new LoginResponseDTO(
                    c.getNome(),
                    "C"
            );
        }

        Optional<Funcionario> funcionario =
                funcionarioRepository.findByEmailAndAtivoTrue(email);

        if (funcionario.isPresent()) {

            Funcionario f = funcionario.get();

            return new LoginResponseDTO(
                    f.getNome(),
                    "F"
            );
        }

        throw new RuntimeException("Usuário não encontrado");
    }

    private boolean validarSenha(
            String senhaFornecida,
            String senhaHash,
            String salt
    ) {

        String hashCalculado =
                senhaService.hashSenha(senhaFornecida, salt);

        return hashCalculado.equals(senhaHash);
    }
}
