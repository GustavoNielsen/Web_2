import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tela-autocadastro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tela-autocadastro.html',
  styleUrl: './tela-autocadastro.css',
})
export class TelaAutocadastro {

  form: FormGroup;
  loading = false;
  cadastroRealizado = false;

  buscandoCEP = false;
  erroCEP = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: [''],
      cpf: [''],
      telefone: [''],
      email: [''],
      cep: [''],
      numero: [''],
      logradouro: [''],
      bairro: [''],
      complemento: [''],
      cidade: [''],
      estado: ['']
    });
  }


  isValid(field: string): boolean {
    return false;
  }

  isInvalid(field: string): boolean {
    return false;
  }

  getError(field: string): string {
    return '';
  }

  maskCPF(event: any) {}
  maskTelefone(event: any) {}
  maskCEP(event: any) {}

  buscarCEP() {}

  onSubmit() {
    this.loading = true;

    // simula envio
    setTimeout(() => {
      this.loading = false;
      this.cadastroRealizado = true;
    }, 1000);
  }

  irParaLogin() {}
}