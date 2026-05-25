import { Component, Output, EventEmitter, Input} from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-rejeitar-servico',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './rejeitar-servico.html',
  styleUrl: './rejeitar-servico.css',
})

export class RejeitarServico {
  motivoRejeicao: string = ""; 

  @Output() atualizado = new EventEmitter<any>();
  @Input() solicitacao: any;

  confirmarRejeicao() {
    this.atualizado.emit({
      id: this.solicitacao.id,
      estado: 'REJEITADA',
       motivoRejeicao: this.motivoRejeicao,
      historico: [
        {
          data: new Date(),
          estado: 'REJEITADA',
          funcionario: 'Cliente',
          observacao: `Serviço rejeitado. Motivo: ${this.motivoRejeicao}`
        }
      ]
    });
  }

  cancelar() {
    this.atualizado.emit(); 
  }
}