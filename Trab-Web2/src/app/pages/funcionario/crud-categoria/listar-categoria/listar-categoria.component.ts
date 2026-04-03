import { Component, inject, OnInit,  } from '@angular/core';
import { CategoriasService } from '../../../../services/categorias.service';
import { Categoria } from '../../../../shared/models/categoria.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-listar-categoria',
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-categoria.component.html',
  styleUrl: './listar-categoria.component.css',
})
export class ListarCategoriaComponent implements OnInit {
  private categoriasService = inject(CategoriasService)
  categorias: Categoria[] = []

  ngOnInit(): void {
    this.categorias = this.categoriasService.listarTodos()

  }
}
