package com.web2.Back.service;

import com.web2.Back.dto.AberturaSolicitacaoDTO;
import com.web2.Back.model.Cliente;
import com.web2.Back.model.CategoriaEquipamentos;
import com.web2.Back.model.Solicitacao;
import com.web2.Back.repository.CategoriaRepository;
import com.web2.Back.repository.ClienteRepository;
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

        return solicitacao;
    }

    public List<CategoriaEquipamentos> ListCategorias(){
        return categoriaRepository.findAll();
    }
}