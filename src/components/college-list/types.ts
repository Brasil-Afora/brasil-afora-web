export interface University {
  applicationFee: string
  averageCostAfterAid: string
  averageNeedBasedAidPackage?: string
  cidade: string
  contato: string
  creditTransfer: string
  estado: string
  faixaACT: string
  faixaSAT: string
  graduationRate4anos: string
  id: number
  link: string
  majorsPrincipais: string
  medianSalary6anos: string
  nome: string
  percentualInternacionais?: string
  plataformaInscricao: string
  politicaFinanceira: string
  rankingNacional: string
  roomBoard: string
  setting: string
  taxaAceitacao: string
  testesProficiencia: string
  tiposAplicacao: string
  tiposBolsa?: string
  totalAlunos: string | number
  tuition: string
}

export interface CollegeFiltros {
  estado: string[]
  majorsPrincipais: string[]
  nome: string
  notaACT: string
  notaSAT: string
  politicaFinanceira: string[]
  taxaAceitacao: string
  testesProficiencia: string[]
}
