import { ChangeDetectorRef, Component, inject, OnInit,  } from '@angular/core';
import { CategoriasService } from '../../../../services/categorias.service';
import { Categoria } from '../../../../shared/models/categoria.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { Funcionario } from '../../../../shared/models/funcionario.model';

@Component({
  selector: 'app-listar-categoria',
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-categoria.component.html',
  styleUrl: './listar-categoria.component.css',
})
export class ListarCategoriaComponent implements OnInit {
  private categoriasService = inject(CategoriasService)
  private cdr = inject(ChangeDetectorRef)
  categorias: Categoria[] = []

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriasService.listarTodos().subscribe({
      next: (data) => {this.categorias = data; this.cdr.detectChanges();},
      error: (err) => console.error('Erro ao listar categorias:', err)
    });
  }

  remover($event: any, categoria: Categoria): void {
    $event.preventDefault();
    if (confirm(`Deseja realmente remover a categoria ${categoria.nome}?`)) {
      this.categoriasService.remover(categoria.id!).subscribe({
        next: () => this.carregarCategorias(),
        error: (err) => console.error('Erro ao remover categoria:', err)
      });
    }
  }

}
