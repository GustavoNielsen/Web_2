import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-aprovar-servico',
  standalone: true,
  templateUrl: './aprovar-servico.html',
  styleUrl: './aprovar-servico.css',
})

export class AprovarServico {
  @Input() valor : string = "";
}
