import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // padrão para componentes exigido no PDF do trabalho
  imports: [RouterOutlet], // registra os componentes para uso
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Trab-Web2');
}