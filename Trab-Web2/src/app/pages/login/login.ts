import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router"; //necessario para linkar a página de cadastro
import { FormsModule, NgForm } from '@angular/forms'; //necessário para usar ngModel e validar o formulário
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private router: Router) {}

  //teste login
  login(form: NgForm) {
    if (form.valid) {
    const { email, senha } = form.value;
    console.log('Email:', email);
    console.log('Senha:', senha);
    if(email === "maria@gmail.com" && senha === "1234"){
      this.router.navigate(['/cliente/home'])
    }
    if(email === "mario@gmail.com" && senha === "1234"){
      this.router.navigate(['/funcionario/home'])
    }
  }
  }

}