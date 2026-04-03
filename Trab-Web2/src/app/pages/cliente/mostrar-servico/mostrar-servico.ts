import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mostrar-servico',
  imports: [],
  standalone: true,
  templateUrl: './mostrar-servico.html',
  styleUrl: './mostrar-servico.css',
})
export class MostrarServico {

  @Output() fechar = new EventEmitter<void>();


  voltar(){
    this.fechar.emit();
  }

  redirecionarParaRejeicao(){

}

aprovarServico(){
  
}

}
