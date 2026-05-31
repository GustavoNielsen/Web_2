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
    
    //busca os dados do funcionário pelo id
    this.funcionarioService.buscarPorId(id).subscribe({
      next: (res) => {
        if (res) this.funcionario = res;
        else console.error("Funcionário não encontrado: id = " + id);
      },
      error: (err) => console.error('Erro ao buscar funcionário:', err)
    });
  }

  atualizar(): void {
    if (this.formulario.form.valid) {
      //manda as alterações para o Java e aguarda a confirmação
      this.funcionarioService.atualizar(this.funcionario).subscribe({
        next: () => this.router.navigate(['/funcionario/users']),
        error: (err) => console.error('Erro ao atualizar funcionário:', err)
      });
    } else {
      console.log('Formulário inválido:', this.formulario.form.errors);
    }
  }
}