import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Categoria } from '../../../../shared/models/categoria.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoriasService } from '../../../../services/categorias.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inserir-categoria',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './inserir-categoria.component.html',
  styleUrl: './inserir-categoria.component.css',
})
export class InserirCategoriaComponent {
  @ViewChild('formCategoria') formulario! : NgForm;
  categoria: Categoria = new Categoria();

  private categoriasService = inject(CategoriasService)
  private router = inject(Router)

  inserir(): void {
    if (this.formulario.form.valid) {
      this.categoriasService.inserir(this.categoria).subscribe({
        next: () => this.router.navigate(["/funcionario/equipamento"]),
        error: (err) => console.error('Erro ao inserir categoria:', err)
      });
    }
  }
}
