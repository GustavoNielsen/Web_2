import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resgatar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resgatar-servico.html',
  styleUrl: './resgatar-servico.css',
})
export class ResgatarServico {

//função para voltar para a página anterior
  voltar() { // simmulando a navegação para a página anterior para testar o botão de voltar
    window.history.back(); //navega para a página anterior no histórico do navegador
  }

// função exemplo para simular o resgate
  confirmarResgate() {
    alert('Serviço resgatado com sucesso! A manutenção será realizada assim que possível.'); // exibe um alerta no navegador do usuário confirmando o resgate 
    console.log('Enviando para o servidor: Status -> EM MANUTENÇÃO'); //registra a ação no console
    //tem que ser feita a chamada para o bd
  }

}