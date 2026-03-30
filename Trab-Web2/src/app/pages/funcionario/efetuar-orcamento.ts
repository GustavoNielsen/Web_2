import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-efetuar-orcamento',
  imports: [CommonModule, DatePipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './efetuar-orcamento.html',
  styleUrl: './efetuar-orcamento.css',
})
export class EfetuarOrcamento implements OnInit {

  loading = false;
  salvando = false;
  orcamentoRealizado = false;

  nomeUsuario = 'Maria Santos';
  dataAtual = new Date();
  dataOrcamento: Date | null = null;
  valorFormatado = '';

  form!: FormGroup;

  solicitacao: any = {
    id: 1,
    equipamento: 'Impressora Laser',
    modelo: 'HP LaserJet Pro M404',
    numeroSerie: 'HP123456789',
    categoria: 'Impressora',
    estado: 'ABERTA',
    descricaoDefeito: 'Impressora não está imprimindo. Luz de erro piscando. Papel travando na bandeja principal.',
    dataHora: new Date('2024-03-10T09:30:00'),
    cliente: {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-9999',
      logradouro: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Jardim Paulista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
    }
  };

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]],
      observacao: [''],
    });

    // Atualiza o relógio a cada minuto
    setInterval(() => { this.dataAtual = new Date(); }, 60000);
  }

  isValid(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.valid && c.touched);
  }

  isInvalid(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && c.touched);
  }

  maskValor(event: any): void {
    let v = event.target.value.replace(/\D/g, '');
    if (!v) { event.target.value = ''; return; }
    v = (parseInt(v) / 100).toFixed(2);
    v = v.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    event.target.value = v;
    // Guarda o valor numérico no form
    const numerico = parseFloat(v.replace(/\./g, '').replace(',', '.'));
    this.form.get('valor')?.setValue(numerico, { emitEvent: false });
  }

  getInitials(nome: string): string {
    if (!nome) return '';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  confirmarOrcamento(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;

    // Simula chamada ao backend
    setTimeout(() => {
      this.salvando = false;
      this.orcamentoRealizado = true;
      this.dataOrcamento = new Date();
      this.solicitacao.estado = 'ORÇADA';

      const valor = this.form.get('valor')?.value;
      this.valorFormatado = valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }, 1500);
  }

  voltar(): void {
    this.location.back();
  }

  sair(): void {
    this.router.navigate(['/login']);
  }
}
