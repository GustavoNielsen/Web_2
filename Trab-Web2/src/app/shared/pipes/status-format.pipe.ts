import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFormat',
  standalone: true
})
export class StatusFormatPipe implements PipeTransform {

  //Transforma strings do backend (ex: EM_MANUTENCAO) 
  //para um formato melhor(EM MANUTENÇÃO)
  
  transform(value: string | undefined | null): string {
    if (!value) return '';

    // casos  com acentuação
    const excessoes: { [key: string]: string } = {
      'ORCADA': 'ORÇADA',
      'EM_MANUTENCAO': 'EM MANUTENÇÃO',
      'PAGA': 'PAGA'
    };

    if (excessoes[value]) {
      return excessoes[value];
    }

    // remove underline e formata cada palavra
    return value
      .toUpperCase()
      .split('_')
      .join(' ');
  }
}