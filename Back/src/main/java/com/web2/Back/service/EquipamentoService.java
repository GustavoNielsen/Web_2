package com.web2.Back.service;

import com.web2.Back.model.Equipamento;
import com.web2.Back.repository.EquipamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipamentoService {

    private final EquipamentoRepository equipamentoRepository;

    public EquipamentoService(EquipamentoRepository equipamentoRepository) {
        this.equipamentoRepository = equipamentoRepository;
    }

    public List<Equipamento> listarTodos() {
        return equipamentoRepository.findAll();
    }

    public Equipamento buscarPorId(Long id) {
        return equipamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado com ID: " + id));
    }

    public Equipamento salvar(Equipamento equipamento) {
        validarEquipamento(equipamento);
        return equipamentoRepository.save(equipamento);
    }

    public Equipamento atualizar(Long id, Equipamento dadosNovos) {
        Equipamento existente = buscarPorId(id);
        existente.setNome(dadosNovos.getNome());
        existente.setDescricao(dadosNovos.getDescricao());
        existente.setQuantidadeEstoque(dadosNovos.getQuantidadeEstoque());
        existente.setValor(dadosNovos.getValor());
        return equipamentoRepository.save(existente);
    }

    public void deletar(Long id) {
        Equipamento equipamento = buscarPorId(id);
        equipamentoRepository.deleteById(id);
    }

    public List<Equipamento> listarEmEstoque() {
        return equipamentoRepository.findByQuantidadeEstoqueGreaterThan(0);
    }

    private void validarEquipamento(Equipamento equipamento) {
        if (equipamento.getNome() == null || equipamento.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (equipamento.getQuantidadeEstoque() == null || equipamento.getQuantidadeEstoque() < 0) {
            throw new IllegalArgumentException("Quantidade em estoque inválida");
        }
    }
}
