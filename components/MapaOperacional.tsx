
import React, { useState, useMemo } from 'react';
import { Posto, Colaborador, SolicitacaoExcecaoRegional, StatusColaborador } from '../types';

interface MapaOpsProps {
  postos: Posto[];
  colaboradores: Colaborador[];
  onRealocar: (colabId: string, novoPostoId: string, justificativa: string) => void;
  onSimulateMove: (colabId: string, lat: number, lng: number) => void;
  excecoesRegionais: SolicitacaoExcecaoRegional[];
  onCheckIn: (colabId: string) => void;
}

const MapaOperacional: React.FC<MapaOpsProps> = ({ postos, colaboradores, onRealocar, onSimulateMove, excecoesRegionais, onCheckIn }) => {
  const [selectedPosto, setSelectedPosto] = useState<Posto | null>(null);
  const [showRealocar, setShowRealocar] = useState(false);
  const [targetColab, setTargetColab] = useState('');
  const [justificativa, setJustificativa] = useState('');
  
  const statusPostos = useMemo(() => {
    return postos.map(p => {
      const colabsNoPosto = colaboradores.filter(c => c.postoAtualId === p.id);
      const temVigilanteNaoAutorizado = colabsNoPosto.some(c => {
        const autorizado = c.regioesAtendidas.includes(p.regiao);
        const excecaoAprovada = excecoesRegionais.some(e => e.colaboradorId === c.id && e.postoId === p.id && e.status === 'APROVADO');
        return !autorizado && !excecaoAprovada;
      });
      const hasAbandono = colabsNoPosto.some(c => c.checkInStatus === 'FORA');
      return { ...p, hasAbandono, hasCARViolation: temVigilanteNaoAutorizado, colabs: colabsNoPosto };
    });
  }, [postos, colaboradores, excecoesRegionais]);

  const handleMudarVigilante = () => {
    if (!targetColab || !selectedPosto || !justificativa.trim()) return alert("Justificativa obrigatória.");
    onRealocar(targetColab, selectedPosto.id, justificativa);
    setShowRealocar(false);
    setTargetColab('');
    setJustificativa('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-[600px] lg:h-[calc(100vh-180px)]">
      {/* Mapa View - Adaptive Box */}
      <div className="lg:col-span-3 bg-slate-950 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden border border-white/5 shadow-2xl min-h-[400px]">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         <div className="absolute top-6 left-6 z-20 space-y-2 max-w-[80%] md:max-w-none">
            <div className="bg-slate-900/90 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/10 text-[7px] md:text-[8px] font-black text-emerald-500 uppercase flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sistema Telemetria Live
            </div>
         </div>

         {statusPostos.map((p, idx) => {
           let statusClass = "bg-white text-slate-900";
           if (p.hasAbandono) statusClass = "bg-rose-600 text-white animate-bounce shadow-xl shadow-rose-600/30";
           else if (p.hasCARViolation) statusClass = "bg-amber-600 text-white animate-pulse shadow-xl shadow-amber-600/30";
           else if (p.colabs.length > 0) statusClass = "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20";

           return (
             <button
               key={p.id}
               onClick={() => setSelectedPosto(p)}
               className={`absolute p-3 md:p-4 rounded-xl md:rounded-2xl transition-all hover:scale-110 shadow-2xl z-10 flex flex-col items-center group ${statusClass}`}
               style={{ 
                 left: `${15 + (idx * 20) % 70}%`, 
                 top: `${15 + (idx * 15) % 70}%` 
               }}
             >
               <i className="fas fa-shield-halved text-base md:text-xl"></i>
               <span className="hidden md:block text-[8px] font-black uppercase mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/90 px-2 py-1 rounded absolute -top-8">{p.nome}</span>
               <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full text-[8px] flex items-center justify-center font-black border border-white/20">
                 {p.colabs.length}
               </div>
             </button>
           );
         })}
      </div>

      {/* Side Panel - Responsive Mobile View */}
      <div className="lg:col-span-1 flex flex-col gap-6">
         {!selectedPosto ? (
            <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 flex-grow flex flex-col items-center justify-center text-center opacity-40">
               <i className="fas fa-crosshairs text-3xl mb-4"></i>
               <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">Telemetria: Selecione um Posto</p>
            </div>
         ) : (
            <div className="bg-slate-950 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 flex-grow flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl overflow-y-auto custom-scrollbar">
               <div className="mb-6">
                  <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase ${selectedPosto.nivelRisco === 'ALTO' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>Risco {selectedPosto.nivelRisco}</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mt-3 leading-tight">{selectedPosto.nome}</h3>
                  <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 tracking-widest truncate">{selectedPosto.regiao}</p>
               </div>

               <div className="flex-grow space-y-3">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Equipe Operacional</p>
                  {colaboradores.filter(c => c.postoAtualId === selectedPosto.id).map(c => (
                    <div key={c.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-blue-500/30 transition-all">
                       <div className="flex justify-between items-center mb-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-white uppercase leading-none truncate">{c.nome}</p>
                            <p className="text-[7px] text-slate-500 font-bold mt-1 uppercase truncate">EQUIPE {c.equipe}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${c.checkInStatus === 'DENTRO' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                       </div>
                       <div className="flex gap-2">
                          <button className="flex-grow bg-white/5 text-[7px] font-black uppercase py-2 rounded-lg text-slate-400 hover:text-white transition-all">Auditar</button>
                       </div>
                    </div>
                  ))}
                  {colaboradores.filter(c => c.postoAtualId === selectedPosto.id).length === 0 && (
                    <div className="py-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                       <i className="fas fa-user-slash text-rose-500 mb-2 opacity-50"></i>
                       <p className="text-[8px] font-black text-rose-500 uppercase">Posto Descoberto</p>
                    </div>
                  )}
               </div>

               <div className="mt-6 pt-6 border-t border-white/5">
                  {showRealocar ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                       <select 
                        className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-[9px] font-black uppercase text-white outline-none focus:border-blue-600"
                        value={targetColab}
                        onChange={(e) => setTargetColab(e.target.value)}
                       >
                         <option value="">Vigilante...</option>
                         {colaboradores.filter(c => c.status === StatusColaborador.ATIVO).map(c => (
                           <option key={c.id} value={c.id}>{c.nome}</option>
                         ))}
                       </select>
                       <textarea 
                        className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-[9px] font-black uppercase text-white h-20 outline-none focus:border-blue-600 placeholder:text-slate-700"
                        placeholder="Justificativa jurídica..."
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                       />
                       <div className="flex gap-2">
                         <button onClick={() => setShowRealocar(false)} className="flex-grow p-3 text-[8px] font-black uppercase text-slate-500">Voltar</button>
                         <button onClick={handleMudarVigilante} className="flex-grow bg-blue-600 text-white p-3 rounded-xl text-[8px] font-black uppercase shadow-lg">Mover</button>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setShowRealocar(true)}
                        className="w-full bg-blue-600 text-white p-5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-shuffle"></i> Realocação Tática
                      </button>
                      <button 
                        onClick={() => setSelectedPosto(null)}
                        className="w-full bg-white/5 text-slate-500 p-4 rounded-xl text-[8px] font-black uppercase hover:text-white transition-all lg:hidden"
                      >
                        Fechar Painel
                      </button>
                    </div>
                  )}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default MapaOperacional;
