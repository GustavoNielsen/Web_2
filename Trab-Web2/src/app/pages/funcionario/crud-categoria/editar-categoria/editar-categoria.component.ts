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
    // Com o id, obtém a pessoa
    const res = this.categoriaService.buscarPorId(id);
    if (res !== undefined)
      this.categoria = res;
    else
      throw new Error ("Categoria não encontrada: id = " + id);

}

atualizar(): void {
  if (this.formulario.form.valid) {
    try {
      this.categoriaService.atualizar(this.categoria);
      this.router.navigate(['/funcionario/equipamento']);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  } else {
    console.log('Formulário inválido:', this.formulario.form.errors);
  }
}
}
