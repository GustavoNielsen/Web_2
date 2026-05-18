package com.web2.Back.controller;

import com.web2.Back.model.Equipamento;
import com.web2.Back.service.EquipamentoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
@CrossOrigin(origins = "*")
public class EquipamentoController {

    private final EquipamentoService equipamentoService;

    public EquipamentoController(EquipamentoService equipamentoService) {
        this.equipamentoService = equipamentoService;
    }

    // 🔹 Listar todos os equipamentos
    @GetMapping
    public ResponseEntity<List<Equipamento>> listarTodos() {
        List<Equipamento> equipamentos = equipamentoService.listarTodos();
        return ResponseEntity.ok(equipamentos);
    }

    // 🔹 Buscar equipamento por ID
    @GetMapping("/{id}")
    public ResponseEntity<Equipamento> buscarPorId(@PathVariable Long id) {
        try {
            Equipamento equipamento = equipamentoService.buscarPorId(id);
            return ResponseEntity.ok(equipamento);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔹 Criar equipamento
    @PostMapping
    public ResponseEntity<Equipamento> criar(@RequestBody Equipamento equipamento) {
        try {
            Equipamento novoEquipamento = equipamentoService.salvar(equipamento);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoEquipamento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 🔹 Atualizar equipamento
    @PutMapping("/{id}")
    public ResponseEntity<Equipamento> atualizar(@PathVariable Long id, @RequestBody Equipamento novoEquipamento) {
        try {
            Equipamento equipamentoAtualizado = equipamentoService.atualizar(id, novoEquipamento);
            return ResponseEntity.ok(equipamentoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔹 Deletar equipamento
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            equipamentoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔹 Listar equipamentos em estoque
    @GetMapping("/estoque")
    public ResponseEntity<List<Equipamento>> listarEmEstoque() {
        List<Equipamento> equipamentos = equipamentoService.listarEmEstoque();
        return ResponseEntity.ok(equipamentos);
    }
}
