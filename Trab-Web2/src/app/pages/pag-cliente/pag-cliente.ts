import { Component } from '@angular/core';
import { VisualizarServico } from '../visualizar-servico/visualizar-servico';
@Component({
  selector: 'app-pag-cliente',
  standalone: true,
  imports: [VisualizarServico],
  templateUrl: './pag-cliente.html',
  styleUrl: './pag-cliente.css',
})
export class PagCliente {

  modal : string = ""

  openModal(modal:string){
    this.modal = modal
  }

  closeModal(){
    this.modal = ""
  }

}
