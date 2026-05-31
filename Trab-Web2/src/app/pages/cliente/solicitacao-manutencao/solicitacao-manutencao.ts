import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Solicitacao } from '../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-solicitacao-manutencao',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './solicitacao-manutencao.html',
  styleUrl: './solicitacao-manutencao.css',
})

export class SolicitacaoManutencao implements OnInit {
  @ViewChild('formSolicitacao') formulario!: NgForm;
 
  titulo: string = 'Solicitar manutenção';
  solicitacao: Solicitacao = new Solicitacao();
  categorias: { id: number; nome: string }[] = [];
 
  private solicitacaoService = inject(SolicitacaoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
 
  ngOnInit(): void {
    this.solicitacaoService.listarCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar categorias:', erro)
    });
  }

  inserir(): void {
    if (this.formulario.form.valid) {
      this.solicitacao.nomeCliente = 'Cliente';
      
      this.solicitacaoService.inserir(this.solicitacao).subscribe({
        next: () => {
          this.router.navigate(['/cliente/home']);
        },
        error: (erro) => {
          console.error('Erro ao criar solicitação no backend:', erro);
        }
      });
    }
  }
}