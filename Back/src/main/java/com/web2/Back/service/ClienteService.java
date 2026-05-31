package com.web2.Back.service;

import com.web2.Back.dto.AberturaSolicitacaoDTO;
import com.web2.Back.dto.AprovarRecusarDTO;
import com.web2.Back.dto.PagarSolicitacaoDTO;
import com.web2.Back.model.CategoriaEquipamentos;
import com.web2.Back.model.Cliente;
import com.web2.Back.model.HistoricoSolicitacao;
import com.web2.Back.model.Solicitacao;
import com.web2.Back.repository.CategoriaRepository;
import com.web2.Back.repository.ClienteRepository;
import com.web2.Back.repository.HistoricoSolicitacaoRepository;
import com.web2.Back.repository.SolicitacaoRepository;
import com.web2.Back.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private HistoricoSolicitacaoRepository historicoRepository;

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));
    }

    public Cliente salvar(Cliente cliente) {
        validarCliente(cliente);
        return clienteRepository.save(cliente);
    }

    public Cliente atualizar(Long id, Cliente dadosNovos) {
        Cliente existente = buscarPorId(id);
        existente.setNome(dadosNovos.getNome());
        existente.setEmail(dadosNovos.getEmail());
        existente.setTelefone(dadosNovos.getTelefone());
        return clienteRepository.save(existente);
    }

    public void deletar(Long id) {
        Cliente cliente = buscarPorId(id);
        clienteRepository.deleteById(id);
    }

    private void validarCliente(Cliente cliente) {
        if (cliente.getNome() == null || cliente.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (cliente.getEmail() == null || !cliente.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
    }



    public Solicitacao criarSolicitacao(AberturaSolicitacaoDTO dto, String token) {

        Long userId = jwtService.extrairUserId(token);

        Cliente cliente = clienteRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Cliente não encontrado"
                        )
                );

        CategoriaEquipamentos categoriaExistente =
                categoriaRepository.findByNome(dto.categoria())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Categoria não encontrada"
                                )
                        );

        Solicitacao solicitacao = new Solicitacao();

        solicitacao.setCliente(cliente);
        solicitacao.setDescricaoEquipamento(dto.equipamento());
        solicitacao.setCategoria(categoriaExistente.getNome());
        solicitacao.setDescricaoDefeito(dto.descricao());
        solicitacao.setDataCriacao(LocalDateTime.now());
        solicitacao.setStatus("ABERTA");

        return solicitacaoRepository.save(solicitacao);
    }

    public List<CategoriaEquipamentos> ListCategorias(){
        return categoriaRepository.findAll();
    }

    public void aprovarOrcamentoService(AprovarRecusarDTO dto, String token){
        Long userId = jwtService.extrairUserId(token);

        Cliente cliente = clienteRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Cliente não encontrado"
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

        if(!solicitacao.getCliente().getId().equals(cliente.getId())){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solitacao não pertence ao cliente"
            );
        }

        solicitacao.setStatus("APROVADA");
        HistoricoSolicitacao historico = new HistoricoSolicitacao(solicitacao, "ORÇADA");
        solicitacaoRepository.save(solicitacao);

        historicoRepository.save(historico);

    }

    public void RejeitarOrcamentoService(AprovarRecusarDTO dto, String token){
        Long userId = jwtService.extrairUserId(token);

        Cliente cliente = clienteRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Cliente não encontrado"
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

        if(!solicitacao.getCliente().getId().equals(cliente.getId())){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solitacao não pertence ao cliente"
            );
        }

        solicitacao.setStatus("REJEITADA");
        HistoricoSolicitacao historico = new HistoricoSolicitacao(solicitacao, "ORÇADA");
        solicitacaoRepository.save(solicitacao);

        historicoRepository.save(historico);

    }


    public void PagarSolicitacao(PagarSolicitacaoDTO dto, String token){
        Long userId = jwtService.extrairUserId(token);

        Cliente cliente = clienteRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Cliente não encontrado"
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

        if(!solicitacao.getCliente().getId().equals(cliente.getId())){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solitacao não pertence ao cliente"
            );
        }

        if (!solicitacao.getStatus().equals("ARRUMADA")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solicitação ainda não está arrumada"
            );
        }

        solicitacao.setDataPagamento(LocalDateTime.now());

        solicitacao.setStatus("PAGA");

        HistoricoSolicitacao historico = new HistoricoSolicitacao(solicitacao, "ARRUMADA");

        solicitacaoRepository.save(solicitacao);
        historicoRepository.save(historico);
    }
}
