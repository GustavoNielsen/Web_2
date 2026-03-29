import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitacao-manutencao',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './solicitacao-manutencao.html',
  styleUrl: './solicitacao-manutencao.css',
})
export class SolicitacaoManutencao {
  titulo: string = "Solicitar manutenção";
  descricaoEquipamento: string = "";
  tipoEquipamento: string = "";
  descricaoProblema: string = "";
  erroTipoEquipamento: boolean = false;
  mensagemErroEquipamentoSelect: string = "";

  validarDesEquipamento() {}

  validarTipoEquipamento() {

    if (this.tipoEquipamento === "") {
      this.erroTipoEquipamento = true;
      this.mensagemErroEquipamentoSelect = "Seleção obrigatória!";
    } else {
      this.erroTipoEquipamento = false;
    }
  }

  validarDesProblema() {}

  enviarSolicitacao() {
    this.validarTipoEquipamento();
    
    if (!this.erroTipoEquipamento) {
      console.log("Dados enviados:", this.descricaoEquipamento, this.tipoEquipamento, this.descricaoProblema);
    }
  }
}