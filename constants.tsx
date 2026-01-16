
import { Regiao, LogDeslocamento } from './types';

export const TEMPO_MAXIMO_DESLOCAMENTO = 80; // 1h20 em minutos

// Matriz de deslocamento atualizada com a malha completa DF + GO
export const MATRIZ_DESLOCAMENTO: LogDeslocamento[] = [
  // --- BASE PLANO PILOTO ---
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.TAGUATINGA, tempoMinutos: 40 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.CEILANDIA, tempoMinutos: 50 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.AGUAS_CLARAS, tempoMinutos: 35 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.GUARA, tempoMinutos: 20 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.GAMA, tempoMinutos: 45 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.SAMAMBAIA, tempoMinutos: 45 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.SOBRADINHO, tempoMinutos: 30 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.PLANALTINA_DF, tempoMinutos: 55 },
  
  // --- BASE ENTORNO GO ---
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.VALPARAISO, tempoMinutos: 50 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.CIDADE_OCIDENTAL, tempoMinutos: 65 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.LUZIANIA, tempoMinutos: 85 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.AGUAS_LINDAS, tempoMinutos: 75 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.NOVO_GAMA, tempoMinutos: 60 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.FORMOSA, tempoMinutos: 95 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.PLANALTINA_GO, tempoMinutos: 80 },
  { origem: Regiao.PLANO_PILOTO, destino: Regiao.CRISTALINA, tempoMinutos: 140 },

  // --- INTER-REGIONAIS ---
  { origem: Regiao.TAGUATINGA, destino: Regiao.CEILANDIA, tempoMinutos: 15 },
  { origem: Regiao.TAGUATINGA, destino: Regiao.SAMAMBAIA, tempoMinutos: 20 },
  { origem: Regiao.GAMA, destino: Regiao.SANTA_MARIA, tempoMinutos: 15 },
  { origem: Regiao.VALPARAISO, destino: Regiao.LUZIANIA, tempoMinutos: 35 },
  { origem: Regiao.AGUAS_CLARAS, destino: Regiao.TAGUATINGA, tempoMinutos: 15 },
  { origem: Regiao.VICENTE_PIRES, destino: Regiao.TAGUATINGA, tempoMinutos: 10 },
];

export const getTempoDeslocamento = (origem: Regiao, destino: Regiao): number => {
  if (origem === destino) return 10;
  
  // Busca na matriz (ida ou volta)
  const rota = MATRIZ_DESLOCAMENTO.find(
    m => (m.origem === origem && m.destino === destino) || (m.origem === destino && m.destino === origem)
  );

  if (rota) return rota.tempoMinutos;

  // Lógica heurística para rotas não mapeadas explicitamente
  // Se for mesma UF (DF-DF), assume média de 60min se não mapeado
  const isDF_Origem = Object.values(Regiao).indexOf(origem) < 32;
  const isDF_Destino = Object.values(Regiao).indexOf(destino) < 32;
  
  if (isDF_Origem && isDF_Destino) return 60;
  
  // Se envolver GO, assume tempo maior
  return 95; 
};
