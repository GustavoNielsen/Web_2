export class Historico {
  data!: Date;
  estado!: string;
  funcionario!: string;
  destino?: string;
}

export class Solicitacao {
  id!: number;
  dataHora!: Date;
  nomeCliente!: string;
  descricaoEquipamento!: string;
  categoria!: string;
  descricaoDefeito!: string;
  estado!: string;
  historico!: Historico[];
  funcionarioDestino?: string;
}