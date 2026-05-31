import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './efetuar-orcamento.html',
  styleUrl: './efetuar-orcamento.css',
})

export class EfetuarOrcamento implements OnInit {
  @Input() solicitacao: any; 
  @Output() orcamentoConfirmado = new EventEmitter<any>();
  @Output() cancelado = new EventEmitter<void>();

  form!: FormGroup;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private solicitacaoService: SolicitacaoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({valor: [null, [Validators.required, Validators.pattern('^\\d+,\\d{2}$')]],observacao: ['']});
  }

  limparFormulario(): void {
    if (this.form) {
      this.form.reset();
    }
  }

  bloquearPonto(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === '-' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  confirmar(): void {
    if (this.form.invalid || this.salvando) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.solicitacao?.id) {
      alert('Solicitação inválida.');
      return;
    }

    const valorString = this.form.value.valor;
    const valorNumerico = parseFloat(valorString.replace(',', '.'));

    this.salvando = true;

    this.solicitacaoService.orcarSolicitacao(this.solicitacao.id, valorNumerico).subscribe({
      next: () => {
        this.orcamentoConfirmado.emit({
          id: this.solicitacao.id,
          valor: valorNumerico,
          observacao: this.form.value.observacao
        });

        this.form.reset();
        this.salvando = false;
      },
      error: (erro) => {
        console.error('Erro ao registrar orçamento:', erro);
        alert('Não foi possível registrar o orçamento.');
        this.salvando = false;
      }
    });
  }
}
