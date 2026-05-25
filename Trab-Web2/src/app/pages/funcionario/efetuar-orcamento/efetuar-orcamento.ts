import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valorString = this.form.value.valor;
    const valorNumerico = parseFloat(valorString.replace(',', '.'));

    this.orcamentoConfirmado.emit({
      id: this.solicitacao?.id,
      valor: valorNumerico,
      observacao: this.form.value.observacao
    });

    this.form.reset();
  }
}