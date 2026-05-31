import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Categoria } from '../../../../shared/models/categoria.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriasService } from '../../../../services/categorias.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-editar-categoria',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-categoria.component.html',
  styleUrl: './editar-categoria.component.css',
})
export class EditarCategoriaComponent {
  @ViewChild('formEditarCategoria') formulario! : NgForm;
  categoria: Categoria = new Categoria();

  private categoriaService = inject(CategoriasService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.categoriaService.buscarPorId(id).subscribe({
      next: (res) => {
        if (res) this.categoria = res;
        else console.error("Categoria não encontrada: id = " + id);
      },
      error: (err) => console.error('Erro ao buscar categoria:', err)
    });
  }

atualizar(): void {
    if (this.formulario.form.valid) {
      this.categoriaService.atualizar(this.categoria).subscribe({
        next: () => this.router.navigate(['/funcionario/equipamento']),
        error: (err) => console.error('Erro ao atualizar categoria:', err)
      });
    } else {
      console.log('Formulário inválido:', this.formulario.form.errors);
    }
  }
}
