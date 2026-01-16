
import React, { useState } from 'react';
import { Posto, Regiao, TurnoOperacional, SolicitacaoExcecaoRegional, Colaborador, Estado } from '../types';

interface ADMProps {
  postos: Posto[];
  setPostos: React.Dispatch<React.SetStateAction<Posto[]>>;
  excecoes: SolicitacaoExcecaoRegional[];
  setExcecoes: React.Dispatch<React.SetStateAction<SolicitacaoExcecaoRegional[]>>;
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
  colaboradores: Colaborador[];
}

const GestaoAdministrativa: React.FC<ADMProps> = ({ postos, setPostos, excecoes, setExcecoes, registerAudit, colaboradores }) => {
  const [activeTab, setActiveTab] = useState<'postos' | 'car'>('postos');
  const [showPostoModal, setShowPostoModal] = useState(false);
  
  const [newPosto, setNewPosto] = useState<Partial<Posto>>({
    nome: '',
    cliente: '',
    estado: Estado.DF,
    regiao: Regiao.PLANO_PILOTO,
    turno: TurnoOperacional.DIURNO,
    nivelRisco: 'MÉDIO',
    vigilantesNecessarios: 1,
    lat: -15.7942,
    lng: -47.8822,
    raioPermitido: 100,
    status: 'ATIVO'
  });

  const handleSavePosto = () => {
    if (!newPosto.nome || !newPosto.cliente || !newPosto.endereco) {
      return alert("FALHA DE COMPLIANCE: Nome, Cliente e Endereço são obrigatórios para ativação de contrato.");
    }

    const posto: Posto = {
      ...newPosto as Posto,
      id: `PST-${Date.now()}`
    };

    setPostos(prev => [...prev, posto]);
    registerAudit('ATIVACAO_POSTO', 'Posto', posto.id, null, posto);
    setShowPostoModal(false);
  };

  const handleDecidirExcecao = (id: string, status: 'APROVADO' | 'RECUSADO') => {
    setExcecoes(prev => prev.map(e => e.id === id ? { ...e, status, decisor: 'Supervisor Master' } : e));
    registerAudit('DECISAO_CAR', 'Exceção Regional', id, 'PENDENTE', status);
  };

  // Filtra as regiões baseadas no estado selecionado para o modal
  const filteredRegioes = Object.values(Regiao).filter(r => {
    if (newPosto.estado === Estado.GO) return r.includes('(GO)');
    return !r.includes('(GO)');
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex gap-4 border-b border-white/5">
         <button onClick={() => setActiveTab('postos')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'postos' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Gestão de Contratos</button>
         <button onClick={() => setActiveTab('car')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'car' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Central de Exceções CAR</button>
      </div>

      {activeTab === 'postos' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Contratos Ativos</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Base Territorial Unificada DF + GO</p>
              </div>
              <button onClick={() => setShowPostoModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">Novo Contrato</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postos.map(p => (
                 <div key={p.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-600/50 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-all text-slate-400 group-hover:text-white">
                          <i className="fas fa-building text-xl"></i>
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${p.estado === Estado.GO ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {p.estado === Estado.GO ? 'GOIÁS' : 'DF'}
                       </span>
                    </div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight">{p.nome}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 mb-4">{p.regiao}</p>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase">Efetivo: <span className="text-white">{p.vigilantesNecessarios}</span></p>
                       <span className={`text-[8px] font-black px-2 py-1 rounded bg-slate-800 text-slate-400`}>{p.turno}</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'car' && (
        <div className="space-y-6">
           <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Fila de Decisão Regional</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Autorização excepcional de atuação fora da malha cadastrada (DF/GO)</p>
           </div>
           
           <div className="space-y-4">
              {excecoes.length === 0 ? (
                <div className="py-20 text-center opacity-30 italic">Nenhuma solicitação pendente no motor CAR.</div>
              ) : (
                excecoes.map(e => {
                  const colab = colaboradores.find(c => c.id === e.colaboradorId);
                  const posto = postos.find(p => p.id === e.postoId);
                  return (
                    <div key={e.id} className="bg-white/5 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                       <div className="flex gap-6 items-center">
                          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center text-xl">
                             <i className="fas fa-user-shield"></i>
                          </div>
                          <div>
                             <p className="text-sm font-black text-white uppercase">{colab?.nome}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase">Solicitou: {posto?.nome} ({e.regiao})</p>
                          </div>
                       </div>
                       
                       {e.status === 'PENDENTE' ? (
                         <div className="flex gap-2">
                            <button onClick={() => handleDecidirExcecao(e.id, 'RECUSADO')} className="px-6 py-3 rounded-xl bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all">Negar</button>
                            <button onClick={() => handleDecidirExcecao(e.id, 'APROVADO')} className="px-6 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all">Autorizar CAR</button>
                         </div>
                       ) : (
                         <span className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase ${e.status === 'APROVADO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {e.status} POR {e.decisor}
                         </span>
                       )}
                    </div>
                  );
                })
              )}
           </div>
        </div>
      )}

      {showPostoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-4xl p-12 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Ativar Novo Contrato Territorial</h3>
                 <button onClick={() => setShowPostoModal(false)} className="text-slate-500 hover:text-white transition-all"><i className="fas fa-times text-2xl"></i></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Identificação do Posto</label>
                       <input type="text" className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold focus:border-blue-600 outline-none" value={newPosto.nome} onChange={e => setNewPosto({...newPosto, nome: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Estado (UF)</label>
                        <select className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" value={newPosto.estado} onChange={e => setNewPosto({...newPosto, estado: e.target.value as Estado, regiao: e.target.value === Estado.DF ? Regiao.PLANO_PILOTO : Regiao.AGUAS_LINDAS})}>
                           {Object.values(Estado).map(est => <option key={est} value={est}>{est}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Região/Cidade</label>
                        <select className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" value={newPosto.regiao} onChange={e => setNewPosto({...newPosto, regiao: e.target.value as Regiao})}>
                           {filteredRegioes.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Cliente Principal</label>
                       <input type="text" className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold focus:border-blue-600 outline-none" value={newPosto.cliente} onChange={e => setNewPosto({...newPosto, cliente: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Endereço Georreferenciado</label>
                       <textarea className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold h-24 focus:border-blue-600 outline-none" value={newPosto.endereco} onChange={e => setNewPosto({...newPosto, endereco: e.target.value})} />
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Turno Operacional</label>
                          <select className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" value={newPosto.turno} onChange={e => setNewPosto({...newPosto, turno: e.target.value as TurnoOperacional})}>
                             {Object.values(TurnoOperacional).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Vigilantes/Posto</label>
                          <input type="number" className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold" value={newPosto.vigilantesNecessarios} onChange={e => setNewPosto({...newPosto, vigilantesNecessarios: parseInt(e.target.value)})} />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Latitude (GPS)</label>
                          <input type="text" className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-mono" value={newPosto.lat} onChange={e => setNewPosto({...newPosto, lat: parseFloat(e.target.value)})} />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Longitude (GPS)</label>
                          <input type="text" className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-mono" value={newPosto.lng} onChange={e => setNewPosto({...newPosto, lng: parseFloat(e.target.value)})} />
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Raio de Geofence (Metros)</label>
                       <input type="range" min="50" max="1000" step="50" className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" value={newPosto.raioPermitido} onChange={e => setNewPosto({...newPosto, raioPermitido: parseInt(e.target.value)})} />
                       <p className="text-right text-xs font-black text-blue-500 mt-2">{newPosto.raioPermitido}M</p>
                    </div>
                    <button onClick={handleSavePosto} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 transition-all mt-6">Ativar Contrato SRAD</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GestaoAdministrativa;
