import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from "@angular/router";
import { FormsModule, NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loading = false;
  erroLogin = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.loading = true;
    this.erroLogin = '';

    const { email, senha } = form.value;

    this.authService.login(email, senha).subscribe({

      next: (response) => {

        this.loading = false;

        console.log(response);

        localStorage.setItem('token', response.token);


        localStorage.setItem('nome', response.nome);
        localStorage.setItem('tipo', response.tipo);

        if (response.cargo === 'C') {
          this.router.navigate(['/cliente/home']);
        }
        else if (response.cargo === 'F') {
          this.router.navigate(['/funcionario/home']);
        }
      },

      error: (error) => {

        this.loading = false;

        console.error(error);

        this.erroLogin =
          error.error || 'Email ou senha inválidos';
      }
    });
  }
}