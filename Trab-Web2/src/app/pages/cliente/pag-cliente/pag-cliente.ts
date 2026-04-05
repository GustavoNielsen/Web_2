import { Component } from '@angular/core';
import { VisualizarServico } from '../visualizar-servico/visualizar-servico';
import { MostrarServico } from '../mostrar-servico/mostrar-servico';
import { ResgatarServico } from '../resgatar-servico/resgatar-servico';
import { PagarServico } from '../pagar-servico/pagar-servico';


@Component({
  selector: 'app-pag-cliente',
  standalone: true,
  imports: [VisualizarServico, MostrarServico, ResgatarServico, PagarServico],
  templateUrl: './pag-cliente.html',
  styleUrl: './pag-cliente.css',
})
export class PagCliente {

  modal : string = ""
  idSolicitacao: number = 0;

  openModal(modal:string){
    this.modal = modal
  }

 visualizarServico(id: number){
   this.idSolicitacao = id;
   this.openModal('visualizar')
 }

  closeModal(){
    this.modal = ""
  }

}
