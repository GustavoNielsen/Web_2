package com.web2.Back.controller;

import com.web2.Back.model.CategoriaEquipamentos;
import com.web2.Back.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // CREATE
    @PostMapping
    public CategoriaEquipamentos criar(@RequestBody CategoriaEquipamentos categoria) {
        categoria.setId(null);
        return categoriaRepository.save(categoria);
    }

    // READ - listar todos
    @GetMapping
    public List<CategoriaEquipamentos> listar() {
        return categoriaRepository.findAll();
    }

    // READ - buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEquipamentos> buscarPorId(@PathVariable Long id) {

        Optional<CategoriaEquipamentos> categoria = categoriaRepository.findById(id);

        if (categoria.isPresent()) {
            return ResponseEntity.ok(categoria.get());
        }

        return ResponseEntity.notFound().build();
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaEquipamentos> atualizar(
            @PathVariable Long id,
            @RequestBody CategoriaEquipamentos novaCategoria
    ) {

        Optional<CategoriaEquipamentos> categoriaOptional = categoriaRepository.findById(id);

        if (categoriaOptional.isPresent()) {

            CategoriaEquipamentos categoria = categoriaOptional.get();

            categoria.setNome(novaCategoria.getNome());

            CategoriaEquipamentos categoriaAtualizada = categoriaRepository.save(categoria);

            return ResponseEntity.ok(categoriaAtualizada);
        }

        return ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {

        Optional<CategoriaEquipamentos> categoria = categoriaRepository.findById(id);

        if (categoria.isPresent()) {
            categoriaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
