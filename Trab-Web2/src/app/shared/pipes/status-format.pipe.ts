import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFormat',
  standalone: true
})
export class StatusFormatPipe implements PipeTransform {

  //Transforma strings do backend (ex: EM_MANUTENCAO) 
  //para um formato melhor(Em Manutenção)
  
  transform(value: string | undefined | null): string {
    if (!value) return '';

    // casos  com acentuação
    const excessoes: { [key: string]: string } = {
      'ORCADA': 'Orçada',
      'EM_MANUTENCAO': 'Em Manutenção',
      'PAGA': 'Paga'
    };

    if (excessoes[value]) {
      return excessoes[value];
    }

    // remove underline e formata cada palavra
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}