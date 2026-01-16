
import React, { useState } from 'react';
import { Posto, Colaborador, PlantaoSupervisor, TurnoOperacional } from '../types';

interface COCProps {
  postos: Posto[];
  colaboradores: Colaborador[];
  supervisores: PlantaoSupervisor[];
  setSupervisores: React.Dispatch<React.SetStateAction<PlantaoSupervisor[]>>;
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
}

const CentralOperacoes: React.FC<COCProps> = ({ postos, colaboradores, supervisores, setSupervisores, registerAudit }) => {
  const [showPassagem, setShowPassagem] = useState(false);
  const [obsPassagem, setObsPassagem] = useState('');
  const [showEscalaModal, setShowEscalaModal] = useState(false);

  const activeSVP = supervisores.find(s => s.status === 'ATIVO');
  const standbySVP = supervisores.find(s => s.status === 'OFFLINE');

  const handlePassagemPlantao = () => {
    if (!obsPassagem.trim()) return alert("Descreva as ocorrências para a passagem de plantão.");
    
    const id = `PLANT-${Date.now()}`;
    const novoPlantao: PlantaoSupervisor = {
      id,
      supervisorNome: activeSVP?.supervisorNome || 'SVP DESCONHECIDO',
      turno: activeSVP?.turno || TurnoOperacional.DIURNO,
      data: new Date().toISOString(),
      status: 'ATIVO',
      passagemPlantaoObs: obsPassagem
    };
    
    // Simula a rotação: o reserva vira o ativo
    if (standbySVP) {
      setSupervisores(prev => [
        { ...standbySVP, status: 'ATIVO' as const },
        { ...novoPlantao, status: 'OFFLINE' as const }
      ]);
    } else {
      setSupervisores(prev => [...prev, novoPlantao]);
    }

    registerAudit('PASSAGEM_PLANTAO_SVP', 'Escala Supervisão', id, activeSVP?.supervisorNome, obsPassagem);
    setShowPassagem(false);
    setObsPassagem('');
    alert("Passagem de plantão concluída e auditada com sucesso.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-slate-950 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="relative z-10">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">COC - Monitoramento Live</h3>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                Terminal de Consciência Situacional 24x7
              </p>
           </div>
           
           <div className="flex gap-6 relative z-10">
              <div className="text-center px-8 py-4 bg-white/5 rounded-3xl border border-white/10">
                 <p className="text-3xl font-black text-white leading-none">{postos.length}</p>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">Postos na Malha</p>
              </div>
              <div className="text-center px-8 py-4 bg-white/5 rounded-3xl border border-white/10">
                 <p className="text-3xl font-black text-rose-500 leading-none">{postos.filter(p => !colaboradores.some(c => c.postoAtualId === p.id)).length}</p>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">Gaps Críticos</p>
              </div>
           </div>
           <i className="fas fa-satellite-dish absolute -right-10 top-1/2 -translate-y-1/2 text-white/5 text-[15rem]"></i>
        </div>

        <div className="bg-blue-600 p-8 rounded-[3rem] shadow-xl shadow-blue-600/20 flex flex-col justify-between group overflow-hidden relative">
           <div className="relative z-10">
              <p className="text-[9px] font-black text-blue-100 uppercase tracking-[0.2em] mb-4">Comando Atual</p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white text-xl border border-white/30">
                    <i className="fas fa-headset"></i>
                 </div>
                 <div>
                    <p className="text-white font-black uppercase text-sm leading-tight">{activeSVP?.supervisorNome || 'AGUARDANDO'}</p>
                    <p className="text-blue-100 text-[8px] font-bold uppercase tracking-widest">{activeSVP?.turno || 'TURNO ?'}</p>
                 </div>
              </div>
              {standbySVP && (
                <div className="mt-4 pt-4 border-t border-white/10">
                   <p className="text-[7px] font-black text-blue-200 uppercase tracking-widest">Reserva Imediato</p>
                   <p className="text-[10px] font-bold text-white uppercase mt-1">{standbySVP.supervisorNome}</p>
                </div>
              )}
           </div>
           <button 
             onClick={() => setShowPassagem(true)}
             className="relative z-10 w-full bg-white text-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all mt-6 shadow-lg"
           >
              Entregar Plantão
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-4">
           <div className="flex justify-between items-center px-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Status de Implantação Territorial</h4>
              <button onClick={() => setShowEscalaModal(true)} className="text-[9px] font-black text-blue-500 uppercase border-b border-blue-500/20 hover:text-blue-400 transition-colors">Ver Escala SVP 24x7</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {postos.map(p => {
                 const colab = colaboradores.find(c => c.postoAtualId === p.id);
                 const hasGap = !colab;
                 
                 return (
                    <div key={p.id} className={`p-8 bg-slate-950/40 rounded-[2.5rem] border ${hasGap ? 'border-rose-500/20 bg-rose-500/5' : 'border-white/5'} group hover:bg-slate-900 transition-all`}>
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${hasGap ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                <i className="fas fa-building-shield"></i>
                             </div>
                             <div>
                                <h5 className="text-white font-black uppercase text-sm mb-1">{p.nome}</h5>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{p.regiao} • {p.turno}</p>
                             </div>
                          </div>
                          <span className={`${hasGap ? 'text-rose-500' : 'text-emerald-500'} text-[8px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5`}>
                             {hasGap ? 'DESCOBERTO' : 'OPERANTE'}
                          </span>
                       </div>

                       <div className="flex justify-between items-center pt-6 border-t border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center text-[10px] font-black">
                                {colab?.nome.charAt(0) || '?'}
                             </div>
                             <p className="text-[10px] font-black text-slate-400 uppercase">{colab?.nome || 'ALERTA: VACÂNCIA'}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${colab?.checkInStatus === 'DENTRO' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-950 border border-white/5 rounded-[3rem] p-8">
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                 <i className="fas fa-history text-blue-500"></i> Histórico de Comando
              </h4>
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {supervisores.filter(s => s.passagemPlantaoObs).reverse().map(s => (
                   <div key={s.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                         <p className="text-[9px] font-black text-blue-400 uppercase">{s.supervisorNome}</p>
                         <p className="text-[7px] font-mono text-slate-600">{new Date(s.data).toLocaleDateString()}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 italic leading-tight">"{s.passagemPlantaoObs}"</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Modal de Passagem de Plantão */}
      {showPassagem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 rounded-[4rem] w-full max-w-xl p-12 shadow-2xl animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Relatório de Comando</h3>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Procedimento de Entrega Auditado</p>
                </div>
                <button onClick={() => setShowPassagem(false)} className="text-slate-500 hover:text-white transition-all"><i className="fas fa-times text-2xl"></i></button>
             </div>
             <div className="space-y-6">
                <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
                   <p className="text-[10px] font-black text-blue-500 uppercase mb-4 tracking-widest"><i className="fas fa-shield-check mr-2"></i> Aviso de Auditoria</p>
                   <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Você está transferindo o comando tático para <strong>{standbySVP?.supervisorNome || 'o próximo supervisor'}</strong>. Relate desvios operacionais críticos.</p>
                </div>
                <textarea 
                  className="w-full bg-slate-800 border-2 border-white/5 p-6 rounded-[2.5rem] text-white font-bold h-48 focus:border-blue-600 outline-none transition-all placeholder:text-slate-600" 
                  placeholder="Relate as ocorrências relevantes do plantão..."
                  value={obsPassagem}
                  onChange={e => setObsPassagem(e.target.value)}
                />
                <button 
                  onClick={handlePassagemPlantao}
                  className="w-full bg-blue-600 text-white p-6 rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                >
                  <i className="fas fa-check-double"></i> Concluir Entrega de Comando
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Modal Escala SVP 24x7 */}
      {showEscalaModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
           <div className="bg-slate-950 border border-white/10 rounded-[4rem] w-full max-w-3xl p-12 shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Escala de Supervisão 24x7</h3>
                 <button onClick={() => setShowEscalaModal(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all"><i className="fas fa-times"></i></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5">
                    <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Equipe Alpha (Diurno)</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-4 bg-slate-900 rounded-2xl border border-blue-500/20">
                          <span className="text-[10px] font-black text-white uppercase">SVP Ricardo M.</span>
                          <span className="text-[7px] font-black bg-blue-500 text-white px-2 py-0.5 rounded uppercase">Titular</span>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-slate-900 rounded-2xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase">SVP Mariana L.</span>
                          <span className="text-[7px] font-black bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase">Reserva</span>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5">
                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6">Equipe Omega (Noturno)</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-4 bg-slate-900 rounded-2xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase">SVP Carlos T.</span>
                          <span className="text-[7px] font-black bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase">Titular</span>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-slate-900 rounded-2xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase">SVP Aline J.</span>
                          <span className="text-[7px] font-black bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase">Reserva</span>
                       </div>
                    </div>
                 </div>
              </div>
              <p className="text-center text-[10px] font-bold text-slate-600 uppercase mt-12 tracking-widest">Escala definida pela diretoria operacional • Atualizada há 2h</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default CentralOperacoes;
