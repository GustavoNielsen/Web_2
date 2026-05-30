import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

// ── Validator CPF ──────────────────────────────────────
function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const cpf = control.value?.replace(/\D/g, '');
  if (!cpf || cpf.length !== 11) return { cpfInvalido: true };
  if (/^(\d)\1+$/.test(cpf)) return { cpfInvalido: true };
  const calc = (slice: string) => {
    const len = slice.length + 1;
    const sum = slice.split('').reduce((a, d, i) => a + Number(d) * (len - i), 0);
    const r = (sum * 10) % 11;
    return r >= 10 ? 0 : r;
  };
  if (calc(cpf.slice(0, 9)) !== Number(cpf[9]) || calc(cpf.slice(0, 10)) !== Number(cpf[10]))
    return { cpfInvalido: true };
  return null;
}

@Component({
  selector: 'app-tela-autocadastro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './tela-autocadastro.html',
  styleUrl: './tela-autocadastro.css',
})
export class TelaAutocadastro {

  form: FormGroup;
  loading = false;
  cadastroRealizado = false;
  buscandoCEP = false;
  erroCEP = '';
  erroRegistro = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      nome:        ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/)]],
      cpf:         ['', [Validators.required, cpfValidator]],
      telefone:    ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      email:       ['', [Validators.required, Validators.email]],
      cep:         ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      numero:      ['', Validators.required],
      logradouro:  ['', Validators.required],
      bairro:      ['', Validators.required],
      complemento: [''],
      cidade:      ['', Validators.required],
      estado:      ['', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]],
    });
  }

  // ── Máscaras ──────────────────────────────────────────
  maskCPF(event: Event) {
    const el = event.target as HTMLInputElement;
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9)      v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
    else if (v.length > 6) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    else if (v.length > 3) v = `${v.slice(0,3)}.${v.slice(3)}`;
    el.value = v;
    this.form.get('cpf')!.setValue(v, { emitEvent: false });
  }

  maskTelefone(event: Event) {
    const el = event.target as HTMLInputElement;
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10)     v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    el.value = v;
    this.form.get('telefone')!.setValue(v, { emitEvent: false });
  }

  maskCEP(event: Event) {
    const el = event.target as HTMLInputElement;
    let v = el.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = `${v.slice(0,5)}-${v.slice(5)}`;
    el.value = v;
    this.form.get('cep')!.setValue(v, { emitEvent: false });
    this.erroCEP = '';
  }

  // ── ViaCEP ────────────────────────────────────────────
  buscarCEP() {
    const cep = this.form.get('cep')?.value?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;
    this.buscandoCEP = true;
    this.erroCEP = '';
    this.form.patchValue({ logradouro: '', bairro: '', cidade: '', estado: '', complemento: '' });

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(finalize(() => this.buscandoCEP = false))
      .subscribe({
        next: (data) => {
          if (data.erro) { this.erroCEP = 'CEP não encontrado.'; return; }
          this.form.patchValue({
            logradouro: data.logradouro || '',
            bairro:     data.bairro     || '',
            cidade:     data.localidade || '',
            estado:     data.uf         || '',
            complemento: data.complemento || '',
          });
        },
        error: () => this.erroCEP = 'Erro ao buscar o CEP.',
      });
  }

  // ── Validação para template ───────────────────────────
  isValid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.valid && (c.dirty || c.touched));
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required'])    return 'Campo obrigatório.';
    if (c.errors['email'])       return 'E-mail inválido.';
    if (c.errors['minlength'])   return `Mínimo ${c.errors['minlength'].requiredLength} caracteres.`;
    if (c.errors['pattern'])     return this.patternMsg(field);
    if (c.errors['cpfInvalido']) return 'CPF inválido.';
    return 'Campo inválido.';
  }

  private patternMsg(field: string): string {
    const msgs: Record<string, string> = {
      telefone: 'Formato: (00) 00000-0000',
      cep:      'Formato: 00000-000',
      estado:   'Use a sigla do estado (ex: SP)',
      nome:     'Apenas letras são permitidas',
    };
    return msgs[field] ?? 'Formato inválido.';
  }

  // ── Submit ────────────────────────────────────────────
  onSubmit() {
    
    this.loading = true;
    this.erroRegistro = '';

    const dados = {
      nome: this.form.get('nome')?.value,
      cpf: (this.form.get('cpf')?.value ?? '').replace(/\D/g, ''),
      email: this.form.get('email')?.value,
      telefone: this.form.get('telefone')?.value,
      cep: this.form.get('cep')?.value,
      numero: this.form.get('numero')?.value,
      logradouro: this.form.get('logradouro')?.value,
      complemento: this.form.get('complemento')?.value,
      bairro: this.form.get('bairro')?.value,
      cidade: this.form.get('cidade')?.value,
      uf: this.form.get('estado')?.value
    };
    this.authService.registrar(dados).subscribe({
      next: (response) => {
        this.loading = false;
        this.cadastroRealizado = true;
        console.log(response)
        this.irParaLogin()
      },
      error: (error) => {
        console.log(error)
        this.loading = false;
        this.erroRegistro = error.error || 'Erro ao registrar. Tente novamente.';
      }
    });
  }

  irParaLogin() {
    this.router.navigate(['/']);
  }
}