
import React, { useState } from 'react';
import { Falta, Colaborador, Posto, Equipe, TurnoOperacional, ConfigSistema } from '../types';

interface CoberturaProps {
  faltas: Falta[];
  setFaltas: React.Dispatch<React.SetStateAction<Falta[]>>;
  colaboradores: Colaborador[];
  postos: Posto[];
  config: ConfigSistema;
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
  validarMissao: (colabId: string, postoId: string) => { ok: boolean; motivo?: string };
}

const CoberturaFaltas: React.FC<CoberturaProps> = ({ faltas, setFaltas, colaboradores, postos, config, registerAudit, validarMissao }) => {
  const [selectedFalta, setSelectedFalta] = useState<Falta | null>(null);

  const getSubstitutosPriorizados = (falta: Falta) => {
    const posto = postos.find(p => p.id === falta.postoId);
    if (!posto) return [];

    const equipeOposta = falta.equipe === Equipe.PAR ? Equipe.IMPAR : Equipe.PAR;
    
    return colaboradores
      .filter(c => c.equipe === equipeOposta && c.status === 'Ativo')
      .map(c => {
        const validacao = validarMissao(c.id, posto.id);
        let score = 0;
        
        // Critérios de Score SRAD
        if (validacao.ok) score += 1000;
        if (c.regioesAtendidas.includes(posto.regiao)) score += 500;
        score += (config.limiteHorasExtrasMes - c.horasExtrasMes) * 10;
        score -= c.indiceFadiga * 50;
        if (posto.turno === TurnoOperacional.NOTURNO && c.aptoNoturno) score += 300;

        return { colab: c, score, validacao };
      })
      .sort((a, b) => b.score - a.score);
  };

  const handleCobertura = (faltaId: string, substitutoId: string) => {
    setFaltas(prev => prev.map(f => f.id === faltaId ? { ...f, substitutoId, status: 'COBERTO' } : f));
    registerAudit('COBERTURA_FALTA', 'Falta', faltaId, 'PENDENTE', { substitutoId });
    setSelectedFalta(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
       <div className="lg:col-span-2 space-y-6">
          <div className="bg-rose-600/10 border border-rose-500/20 p-10 rounded-[2.5rem] flex justify-between items-center">
             <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Central de Incidentes</h3>
                <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2">Atendimento imediato para postos descobertos</p>
             </div>
             <div className="text-right">
                <p className="text-5xl font-black text-rose-500">{faltas.filter(f => f.status === 'PENDENTE').length}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase mt-1">Gaps Ativos</p>
             </div>
          </div>

          <div className="space-y-4">
             {faltas.length === 0 ? (
               <div className="py-24 text-center bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                  <i className="fas fa-check-circle text-6xl text-emerald-500 mb-6 opacity-30"></i>
                  <p className="text-slate-500 font-bold uppercase tracking-widest">Malha Operacional Integral</p>
               </div>
             ) : (
               faltas.map(f => {
                 const posto = postos.find(p => p.id === f.postoId);
                 return (
                   <div key={f.id} className={`bg-white/5 border rounded-[2.5rem] p-10 transition-all ${selectedFalta?.id === f.id ? 'border-blue-600 bg-blue-600/5' : 'border-white/5'}`}>
                      <div className="flex justify-between items-start mb-8">
                         <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                               {posto?.nome.charAt(0)}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-white uppercase">{posto?.nome}</h4>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{f.data} • TURNO: {f.turno}</p>
                            </div>
                         </div>
                         <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${f.status === 'PENDENTE' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {f.status}
                         </span>
                      </div>
                      
                      {f.status === 'PENDENTE' && (
                        <button onClick={() => setSelectedFalta(f)} className="w-full bg-white/5 hover:bg-blue-600 hover:text-white text-slate-400 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                           Acionar Motor de Prioridade SRAD
                        </button>
                      )}
                   </div>
                 );
               })
             )}
          </div>
       </div>

       <div className="bg-slate-950 border border-white/5 rounded-[3.5rem] p-10 h-fit sticky top-10 shadow-2xl">
          <h4 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
             <i className="fas fa-robot text-blue-500"></i> Sugestões do Motor IA
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 mb-10">Ordenado por conformidade CAR e Fadiga</p>
          
          {!selectedFalta ? (
            <div className="py-24 text-center opacity-20 italic font-bold">Selecione um incidente para análise de substitutos</div>
          ) : (
            <div className="space-y-4">
               {getSubstitutosPriorizados(selectedFalta).slice(0, 5).map(({ colab, score, validacao }) => (
                 <div key={colab.id} className={`bg-white/5 border rounded-3xl p-6 hover:border-blue-600 transition-all group ${!validacao.ok ? 'opacity-40 grayscale' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <p className="text-sm font-black text-white uppercase">{colab.nome}</p>
                          <p className="text-[8px] text-slate-500 font-bold uppercase">{colab.regiaoMoradia}</p>
                       </div>
                       <p className="text-blue-500 font-black text-sm">{score}pts</p>
                    </div>
                    
                    {!validacao.ok && <p className="text-[8px] text-rose-500 font-black uppercase mb-4 italic"><i className="fas fa-ban mr-1"></i> {validacao.motivo}</p>}
                    
                    <button 
                      onClick={() => handleCobertura(selectedFalta.id, colab.id)}
                      disabled={!validacao.ok}
                      className="w-full bg-blue-600 text-white p-4 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:bg-slate-800 disabled:text-slate-600 transition-all"
                    >
                       Designar para Posto
                    </button>
                 </div>
               ))}
            </div>
          )}
       </div>
    </div>
  );
};

export default CoberturaFaltas;
