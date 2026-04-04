import { Component, Output, EventEmitter} from '@angular/core'; 
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

  @Output() fechar = new EventEmitter<void>();

  confirmarRejeicao() {
    window.location.href = '/cliente/home';
  }

  cancelar() {
    this.fechar.emit(); 
  }
}