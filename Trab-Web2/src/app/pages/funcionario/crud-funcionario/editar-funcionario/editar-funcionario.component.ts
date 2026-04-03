import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Funcionario } from '../../../../shared/models/funcionario.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-funcionario',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-funcionario.component.html',
  styleUrl: './editar-funcionario.component.css',
})
export class EditarFuncionarioComponent {
  @ViewChild('formFuncionario') formulario! : NgForm;
  funcionario: Funcionario = new Funcionario();

  private funcionarioService = inject(FuncionarioService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
nome: any;

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
  // Com o id, obtém a pessoa
  const res = this.funcionarioService.buscarPorId(id);
  if (res !== undefined)
   this.funcionario = res;
  else
    throw new Error ("Funcionario não encontrado: id = " + id);
}
atualizar(): void {
  if (this.formulario.form.valid) {
    try {
      if (typeof this.funcionario.nasc === 'string') {
        this.funcionario.nasc = new Date(this.funcionario.nasc);
      }
      this.funcionarioService.atualizar(this.funcionario);
      this.router.navigate(['/funcionario/users']);
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
    }
  } else {
    console.log('Formulário inválido:', this.formulario.form.errors);
  }
}
}