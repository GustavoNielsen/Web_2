import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router"; //necessario para linkar a página de cadastro
import { FormsModule } from '@angular/forms'; //necessário para usar ngModel e validar o formulário

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  //teste login
  login() {
    // precisa de lógica de autenticação
    alert('Login realizado!');
    console.log('Login realizado!');
  }

}