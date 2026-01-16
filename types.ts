
export enum Equipe {
  PAR = 'Par',
  IMPAR = 'Ímpar'
}

export enum TurnoOperacional {
  DIURNO = 'DIURNO',
  NOTURNO = 'NOTURNO',
  MISTO = '24H'
}

export enum Estado {
  DF = 'Distrito Federal',
  GO = 'Goiás'
}

export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  VIGILANTE = 'VIGILANTE',
  RH = 'RH',
  AUDITOR = 'AUDITOR'
}

export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  perfil: PerfilUsuario;
  matricula?: string;
  avatar?: string;
  senhaHash?: string; // Simulado para este contexto
}

export enum Regiao {
  // --- DISTRITO FEDERAL (Todas as RAs) ---
  PLANO_PILOTO = 'Plano Piloto',
  AGUAS_CLARAS = 'Águas Claras',
  ARNIQUEIRA = 'Arniqueira',
  BRAZLANDIA = 'Brazlândia',
  CANDANGOLANDIA = 'Candangolândia',
  CEILANDIA = 'Ceilândia',
  CRUZEIRO = 'Cruzeiro',
  FERCAL = 'Fercal',
  GAMA = 'Gama',
  GUARA = 'Guará',
  ITAPOA = 'Itapoã',
  JARDIM_BOTANICO = 'Jardim Botânico',
  LAGO_NORTE = 'Lago Norte',
  LAGO_SUL = 'Lago Sul',
  NUCLEO_BANDEIRANTE = 'Núcleo Bandeirante',
  PARANOA = 'Paranoá',
  PARK_WAY = 'Park Way',
  PLANALTINA_DF = 'Planaltina (DF)',
  RECANTO_EMAS = 'Recanto das Emas',
  RIACHO_FUNDO_I = 'Riacho Fundo I',
  RIACHO_FUNDO_II = 'Riacho Fundo II',
  SAMAMBAIA = 'Samambaia',
  SANTA_MARIA = 'Santa Maria',
  SAO_SEBASTIAO = 'São Sebastião',
  SIA = 'SIA',
  SOBRADINHO = 'Sobradinho',
  SOBRADINHO_II = 'Sobradinho II',
  SOL_NASCENTE = 'Sol Nascente / Pôr do Sol',
  SUDOESTE_OCTOGONAL = 'Sudoeste / Octogonal',
  TAGUATINGA = 'Taguatinga',
  VARJAO = 'Varjão',
  VICENTE_PIRES = 'Vicente Pires',

  // --- GOIÁS ---
  AGUAS_LINDAS = 'Águas Lindas de Goiás (GO)',
  ALEXANIA = 'Alexânia (GO)',
  CIDADE_OCIDENTAL = 'Cidade Ocidental (GO)',
  COCALZINHO = 'Cocalzinho de Goiás (GO)',
  CORUMBA = 'Corumbá de Goiás (GO)',
  CRISTALINA = 'Cristalina (GO)',
  FORMOSA = 'Formosa (GO)',
  LUZIANIA = 'Luziânia (GO)',
  MIMOSO = 'Mimoso de Goiás (GO)',
  NOVO_GAMA = 'Novo Gama (GO)',
  PADRE_BERNARDO = 'Padre Bernardo (GO)',
  PIRENOPOLIS = 'Pirenópolis (GO)',
  PLANALTINA_GO = 'Planaltina (GO)',
  SANTO_ANTONIO_DESCOBERTO = 'Santo Antônio do Descoberto (GO)',
  VALPARAISO = 'Valparaíso de Goiás (GO)',
  GOIANIA = 'Goiânia (GO)',
  APARECIDA_GOIANIA = 'Aparecida de Goiânia (GO)',
  ANAPOLIS = 'Anápolis (GO)',
  RIO_VERDE = 'Rio Verde (GO)',
  ITUMBIARA = 'Itumbiara (GO)',
  JATAI = 'Jataí (GO)',
  CALDAS_NOVAS = 'Caldas Novas (GO)',
  TRINDADE = 'Trindade (GO)'
}

export enum CriticidadeEvento {
  BAIXA = 'BAIXA',
  MEDIA = 'MÉDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRÍTICA'
}

export interface Incidente {
  id: string;
  tipo: 'ASSALTO' | 'INVASAO' | 'AMEACA' | 'EMERGENCIA_MEDICA' | 'POLICIAL' | 'FALHA_EQUIPAMENTO';
  criticidade: CriticidadeEvento;
  postoId: string;
  colaboradorId: string;
  dataHora: string;
  descricao: string;
  acoesTomadas: string[];
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  operadorResponsavel: string;
}

export interface Equipamento {
  id: string;
  tipo: 'ARMA' | 'COLETE' | 'RADIO' | 'VIATURA';
  patrimonio: string;
  status: 'DISPONIVEL' | 'EM_USO' | 'MANUTENCAO';
  vigilanteResponsavelId?: string;
  dataRetirada?: string;
}

export interface PlantaoSupervisor {
  id: string;
  supervisorNome: string;
  turno: TurnoOperacional;
  data: string;
  status: 'ATIVO' | 'OFFLINE';
  passagemPlantaoObs?: string;
}

export interface Colaborador {
  id: string;
  nome: string;
  matricula: string;
  cpf: string;
  cargo: string;
  equipe: Equipe;
  regiaoMoradia: Regiao;
  status: StatusColaborador;
  telefone: string;
  regioesAtendidas: Regiao[]; 
  aptoNoturno: boolean;
  horasExtrasMes: number;
  indiceFadiga: number;
  documentos: Documento[];
  postoAtualId?: string; 
  checkInStatus?: 'DENTRO' | 'FORA' | 'PENDENTE';
  lastCheckInTime?: string;
  lastLat?: number;
  lastLng?: number;
  dataAdmissao?: string;
  historicoRecusas?: number;
}

export enum StatusColaborador {
  ATIVO = 'Ativo',
  AFASTADO = 'Afastado',
  FERIAS = 'Férias',
  BLOQUEADO = 'Bloqueado'
}

export interface Documento {
  tipo: 'Reciclagem' | 'Porte de Arma' | 'Exame Médico' | 'EPI' | 'Curso de Formação';
  validade: string;
  status: 'VÁLIDO' | 'VENCIDO' | 'ALERTA';
}

export interface SolicitacaoExcecaoRegional {
  id: string;
  colaboradorId: string;
  postoId: string;
  regiao: Regiao;
  motivo: string;
  dataHora: string;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
  decisor?: string;
}

export interface Posto {
  id: string;
  nome: string;
  cliente: string;
  regiao: Regiao;
  estado: Estado;
  endereco: string;
  vigilantesNecessarios: number;
  nivelRisco: 'BAIXO' | 'MÉDIO' | 'ALTO';
  turno: TurnoOperacional;
  lat: number;
  lng: number;
  raioPermitido: number;
  status: 'ATIVO' | 'INATIVO';
  isCritico?: boolean;
}

export interface Falta {
  id: string;
  data: string;
  postoId: string;
  colaboradorFaltanteId: string;
  equipe: Equipe;
  turno: TurnoOperacional;
  substitutoId?: string;
  status: 'PENDENTE' | 'COBERTO' | 'DESCOBERTO';
  excecaoId?: string;
}

export interface AuditLogEntry {
  id: string;
  usuario: string;
  perfil: PerfilUsuario;
  acao: string;
  entidade: string;
  entidadeId: string;
  valorAnterior?: string;
  valorNovo?: string;
  dataHora: string;
  coordenadas?: { lat: number; lng: number };
}

export interface ConfigSistema {
  limiteDeslocamento: number;
  limiteHorasExtrasMes: number;
  pesoFadigaNoturna: number;
  intersticioMinimoHoras: number;
  slaRespostaMinutos: number;
  pesoFadiga: number;
}

export interface LogDeslocamento {
  origem: Regiao;
  destino: Regiao;
  tempoMinutos: number;
}
