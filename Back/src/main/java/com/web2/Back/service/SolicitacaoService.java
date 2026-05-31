package com.web2.Back.service;

import com.web2.Back.dto.AberturaSolicitacaoDTO;
import com.web2.Back.dto.AprovarRecusarDTO;
import com.web2.Back.model.Cliente;
import com.web2.Back.model.CategoriaEquipamentos;
import com.web2.Back.model.Solicitacao;
import com.web2.Back.repository.CategoriaRepository;
import com.web2.Back.repository.ClienteRepository;
import com.web2.Back.repository.SolicitacaoRepository;
import com.web2.Back.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

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
                .findById(dto.idSolicaitacao())
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
        solicitacaoRepository.save(solicitacao);

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
                .findById(dto.idSolicaitacao())
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
        solicitacaoRepository.save(solicitacao);

    }

}