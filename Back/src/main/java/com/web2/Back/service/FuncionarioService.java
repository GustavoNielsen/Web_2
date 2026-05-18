package com.web2.Back.service;

import com.web2.Back.model.Funcionario;
import com.web2.Back.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

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
        existente.setCargo(dadosNovos.getCargo());
        existente.setTelefone(dadosNovos.getTelefone());
        return funcionarioRepository.save(existente);
    }

    public void deletar(Long id) {
        Funcionario funcionario = buscarPorId(id);
        funcionarioRepository.deleteById(id);
    }

    public List<Funcionario> buscarPorCargo(String cargo) {
        return funcionarioRepository.findByCargo(cargo);
    }

    private void validarFuncionario(Funcionario funcionario) {
        if (funcionario.getNome() == null || funcionario.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (funcionario.getEmail() == null || !funcionario.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
        if (funcionario.getCargo() == null || funcionario.getCargo().isBlank()) {
            throw new IllegalArgumentException("Cargo é obrigatório");
        }
    }
}
