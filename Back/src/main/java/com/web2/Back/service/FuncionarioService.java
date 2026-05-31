package com.web2.Back.service;

import com.web2.Back.dto.OrcarSolicitacaoDTO;
import com.web2.Back.model.Funcionario;
import com.web2.Back.repository.FuncionarioRepository;
import com.web2.Back.repository.OrcamentoRepository;
import com.web2.Back.repository.SolicitacaoRepository;
import com.web2.Back.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.web2.Back.model.Solicitacao;
import com.web2.Back.model.Orcamento;


import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private OrcamentoRepository orcamentoRepository;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;


    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Funcionario buscarPorId(Long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado com ID: " + id));
    }

    public Funcionario salvar(Funcionario funcionario) {
        validarFuncionario(funcionario);
        return funcionarioRepository.save(funcionario);
    }

    public Funcionario atualizar(Long id, Funcionario dadosNovos) {
        Funcionario existente = buscarPorId(id);
        existente.setNome(dadosNovos.getNome());
        existente.setEmail(dadosNovos.getEmail());
        existente.setTelefone(dadosNovos.getTelefone());
        return funcionarioRepository.save(existente);
    }

    public void deletar(Long id) {
        Funcionario funcionario = buscarPorId(id);
        funcionarioRepository.deleteById(id);
    }


    private void validarFuncionario(Funcionario funcionario) {
        if (funcionario.getNome() == null || funcionario.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (funcionario.getEmail() == null || !funcionario.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
    }


    public void orcar(OrcarSolicitacaoDTO dto, String token) {

        Long userId = jwtService.extrairUserId(token);

        Funcionario funcionario = funcionarioRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionário não encontrado"
                        )
                );

        Solicitacao solicitacao = solicitacaoRepository
                .findById(dto.idSolicitacao())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Solicitação não encontrada"
                        )
                );

        if (solicitacao.getOrcamento() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solicitação já possui orçamento"
            );
        }

        Orcamento orcamento = new Orcamento(
                solicitacao,
                funcionario,
                dto.valor()
        );

        orcamentoRepository.save(orcamento);

        solicitacao.setOrcamento(orcamento);
        solicitacao.setStatus("ORÇADA");

        solicitacaoRepository.save(solicitacao);
    }
}
