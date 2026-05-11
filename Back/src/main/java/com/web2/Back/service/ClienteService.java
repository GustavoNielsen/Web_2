package com.example.app.service;

import com.example.app.dao.ClienteDAO;
import com.example.app.model.Cliente;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteDAO clienteDAO;

    public ClienteService(ClienteDAO clienteDAO) {
        this.clienteDAO = clienteDAO;
    }

    public List<Cliente> listarTodos() {
        return clienteDAO.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return clienteDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));
    }

    public Cliente salvar(Cliente cliente) {
        validarCliente(cliente);
        return clienteDAO.save(cliente);
    }

    public Cliente atualizar(Long id, Cliente dadosNovos) {
        Cliente existente = buscarPorId(id);
        existente.setNome(dadosNovos.getNome());
        existente.setEmail(dadosNovos.getEmail());
        existente.setTelefone(dadosNovos.getTelefone());
        return clienteDAO.save(existente);
    }

    public void deletar(Long id) {
        if (!clienteDAO.existsById(id)) {
            throw new RuntimeException("Não é possível deletar: ID inexistente");
        }
        clienteDAO.deleteById(id);
    }

    private void validarCliente(Cliente cliente) {
        if (cliente.getNome() == null || cliente.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (cliente.getEmail() == null || !cliente.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
    }

    public List<Cliente> buscarPorNome(String nome) {
        return clienteDAO.findByNomeContaining(nome);
    }
}