package com.web2.Back.service;

import com.web2.Back.model.Cliente;
import com.web2.Back.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

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
}
