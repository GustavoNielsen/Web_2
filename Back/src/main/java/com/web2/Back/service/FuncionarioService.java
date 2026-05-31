package com.web2.Back.service;

import com.web2.Back.dto.*;
import com.web2.Back.model.*;
import com.web2.Back.repository.*;
import com.web2.Back.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private OrcamentoRepository orcamentoRepository;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private ManutencaoRepository manutencaoRepository;

    @Autowired
    private HistoricoSolicitacaoRepository historicoRepository;

    @Autowired
    private RedirecionamentoRepository redirecionamentoRepository;


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


    public void Orcar(OrcarSolicitacaoDTO dto, String token) {

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
        HistoricoSolicitacao historico = new HistoricoSolicitacao(solicitacao, "ABERTA");

        solicitacaoRepository.save(solicitacao);

        historicoRepository.save(historico);


    }

    public void Manutencao(RealizarManutencaoDTO dto, String token){

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

        Orcamento orcamento = orcamentoRepository
                .findBySolicitacaoId(dto.idSolicitacao())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Orcamento não encontrado"
                        )
                );

        boolean existe = redirecionamentoRepository
                .existsBySolicitacaoId(dto.idSolicitacao());

        if(existe){

            Redirecionamento ultimoRedirecionamento =
                    redirecionamentoRepository
                            .findTopBySolicitacaoIdOrderByDataRedirecionamentoDesc(
                                    dto.idSolicitacao()
                            )
                            .orElseThrow(() ->
                                    new ResponseStatusException(
                                            HttpStatus.NOT_FOUND,
                                            "Redirecionamento não encontrado"
                                    )
                            );

            if(!ultimoRedirecionamento
                    .getFuncionarioDestino()
                    .getId()
                    .equals(funcionario.getId())){

                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Solicitação não pertence a esse funcionário"
                );
            }

        } else {

            if(!funcionario.getId().equals(orcamento.getFuncionario().getId())){
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Orcamento não pertence a esse funcionario"
                );
            }
        }

        Manutencao manutencao = new Manutencao(
                solicitacao,
                funcionario,
                dto.descricao(),
                dto.orientacao()
        );

        solicitacao.setStatus("ARRUMADA");
        solicitacao.setManutencao(manutencao);

        HistoricoSolicitacao historico =
                new HistoricoSolicitacao(solicitacao, "APROVADA");

        manutencaoRepository.save(manutencao);
        solicitacaoRepository.save(solicitacao);
        historicoRepository.save(historico);
    }

    public void RedirecionarManutencao(RedirecionamentoDTO dto, String token){
        Long userId = jwtService.extrairUserId(token);

        Funcionario funcionario = funcionarioRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionário origem não encontrado"
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

        Orcamento orcamento = orcamentoRepository
                .findBySolicitacaoId(dto.idSolicitacao())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Orcamento não encontrado"
                        )
                );

        boolean existe = redirecionamentoRepository
                .existsBySolicitacaoId(dto.idSolicitacao());

        if(existe){

            Redirecionamento ultimoRedirecionamento =
                    redirecionamentoRepository
                            .findTopBySolicitacaoIdOrderByDataRedirecionamentoDesc(
                                    dto.idSolicitacao()
                            )
                            .orElseThrow(() ->
                                    new ResponseStatusException(
                                            HttpStatus.NOT_FOUND,
                                            "Redirecionamento não encontrado"
                                    )
                            );

            if(!ultimoRedirecionamento
                    .getFuncionarioDestino()
                    .getId()
                    .equals(funcionario.getId())){

                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Solicitação não pertence a esse funcionário"
                );
            }

        } else {

            if(!funcionario.getId().equals(orcamento.getFuncionario().getId())){
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Orcamento não pertence a esse funcionario"
                );
            }
        }

        Funcionario funcionarioDestino = funcionarioRepository.findById(dto.funcionarioDestino())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionário destino não encontrado"
                        )
                );

        if(funcionario.getId().equals(funcionarioDestino.getId())){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Funcionário não pode redirecionar para si mesmo"
            );
        }

        Redirecionamento redirecionamento = new Redirecionamento(solicitacao, funcionario, funcionarioDestino);

        String statusAnterior = solicitacao.getStatus();

        solicitacao.setStatus("REDIRECIONADA");

        HistoricoSolicitacao historico =
                new HistoricoSolicitacao(solicitacao, statusAnterior);

        solicitacaoRepository.save(solicitacao);
        historicoRepository.save(historico);
        redirecionamentoRepository.save(redirecionamento);
    }

    public void Finalizar(FinalizarSolicitacaoDTO dto, String token){
        Long userId = jwtService.extrairUserId(token);

        Funcionario funcionario = funcionarioRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionário origem não encontrado"
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

        if (!solicitacao.getStatus().equals("PAGA")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solicitação ainda não está paga"
            );
        }

        solicitacao.setStatus("FINALIZADA");
        solicitacao.setDataFinalizacao(LocalDateTime.now());
        solicitacao.setFuncionarioFinalizacao(funcionario);

        HistoricoSolicitacao historico =
                new HistoricoSolicitacao(solicitacao, "PAGA");


        solicitacaoRepository.save(solicitacao);
        historicoRepository.save(historico);

    }


    public List<SolicitacaoAbertasDTO> SolicitacoesAbertas(int page){

        return solicitacaoRepository
                .findByStatus(
                        "ABERTA",
                        PageRequest.of(page, 30)
                )
                .stream()
                .map(s -> new SolicitacaoAbertasDTO(
                        s.getDataCriacao(),
                        s.getCliente().getNome(),
                        s.getDescricaoEquipamento(),
                        s.getStatus()
                ))
                .toList();
    }

    public List<SolicitacaoAbertasDTO> SolicitacoesHoje(int page, String token){
        Long userId = jwtService.extrairUserId(token);

        Funcionario funcionario = funcionarioRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionário origem não encontrado"
                        )
                );

        int pageSize = 30;
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicio = hoje.atStartOfDay();
        LocalDateTime fim = hoje.plusDays(1).atStartOfDay();

        return solicitacaoRepository
                .findAtuadasPorFuncionarioNoPeriodo(
                        funcionario.getId(),
                        inicio,
                        fim,
                        PageRequest.of(Math.max(page, 0), pageSize)
                )
                .stream()
                .map(s -> new SolicitacaoAbertasDTO(
                        s.getDataCriacao(),
                        s.getCliente().getNome(),
                        s.getDescricaoEquipamento(),
                        s.getStatus()
                ))
                .toList();
    }

    public List<SolicitacaoAbertasDTO> SolicitacoesTotais(int page, String token){
        Long userId = jwtService.extrairUserId(token);

        Funcionario funcionario = funcionarioRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionário origem não encontrado"
                        )
                );

        int pageSize = 30;

        return solicitacaoRepository
                .findAtuadasPorFuncionario(
                        funcionario.getId(),
                        PageRequest.of(Math.max(page, 0), pageSize)
                )
                .stream()
                .map(s -> new SolicitacaoAbertasDTO(
                        s.getDataCriacao(),
                        s.getCliente().getNome(),
                        s.getDescricaoEquipamento(),
                        s.getStatus()
                ))
                .toList();
    }

    public List<SolicitacaoAbertasDTO> SolicitacoesPorPeriodo(SolicitacaoDataDTO dto, String token) {
        Long userId = jwtService.extrairUserId(token);

        Funcionario funcionario = funcionarioRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Funcionário origem não encontrado"
                        )
                );

        int pageSize = 30;
        int page = Math.max(dto.page(), 0);
        LocalDateTime inicio = dto.dataMin().atStartOfDay();
        LocalDateTime fim = dto.dataMax().plusDays(1).atStartOfDay();

        return solicitacaoRepository
                .findAtuadasPorFuncionarioNoPeriodo(
                        funcionario.getId(),
                        inicio,
                        fim,
                        PageRequest.of(page, pageSize)
                )
                .stream()
                .map(s -> new SolicitacaoAbertasDTO(
                        s.getDataCriacao(),
                        s.getCliente().getNome(),
                        s.getDescricaoEquipamento(),
                        s.getStatus()
                ))
                .toList();
    }

}
