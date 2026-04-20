package com.example.app.controller;

import com.example.app.dao.ClienteDAO;
import com.example.app.model.Cliente;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteDAO clienteDAO;

    public ClienteController(ClienteDAO clienteDAO) {
        this.clienteDAO = clienteDAO;
    }

    // 🔹 Listar todos os clientes
    @GetMapping
    public List<Cliente> listarTodos() {
        return clienteDAO.findAll();
    }

    // 🔹 Buscar cliente por ID
    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteDAO.findById(id);
        return cliente.orElse(null);
    }

    // 🔹 Criar cliente
    @PostMapping
    public Cliente criar(@RequestBody Cliente cliente) {

        if (cliente.getNome() == null || cliente.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }

        if (cliente.getEmail() == null || !cliente.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }

        return clienteDAO.save(cliente);
    }

    // 🔹 Atualizar cliente
    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Long id, @RequestBody Cliente novoCliente) {

        Cliente clienteExistente = clienteDAO.findById(id).orElse(null);

        if (clienteExistente == null) {
            return null;
        }

        clienteExistente.setNome(novoCliente.getNome());
        clienteExistente.setEmail(novoCliente.getEmail());
        clienteExistente.setTelefone(novoCliente.getTelefone());

        return clienteDAO.save(clienteExistente);
    }

    // 🔹 Deletar cliente
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        clienteDAO.deleteById(id);
    }

    // 🔹 Buscar por nome (simples)
    @GetMapping("/buscar")
    public List<Cliente> buscarPorNome(@RequestParam String nome) {
        return clienteDAO.findByNomeContaining(nome);
    }

    // 🔹 Contagem total
    @GetMapping("/count")
    public long contarClientes() {
        return clienteDAO.count();
    }

    // 🔹 Verificar se cliente existe
    @GetMapping("/exists/{id}")
    public boolean existe(@PathVariable Long id) {
        return clienteDAO.existsById(id);
    }

    // 🔹 Atualização parcial (email só)
    @PatchMapping("/{id}/email")
    public Cliente atualizarEmail(@PathVariable Long id, @RequestBody String email) {

        Cliente cliente = clienteDAO.findById(id).orElse(null);

        if (cliente == null) {
            return null;
        }

        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }

        cliente.setEmail(email);
        return clienteDAO.save(cliente);
    }
}