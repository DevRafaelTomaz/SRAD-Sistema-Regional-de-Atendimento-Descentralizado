
import React, { useState } from 'react';
import { Incidente, Posto, Colaborador, CriticidadeEvento } from '../types';

interface IncidentesProps {
  incidentes: Incidente[];
  setIncidentes: React.Dispatch<React.SetStateAction<Incidente[]>>;
  postos: Posto[];
  colaboradores: Colaborador[];
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
}

const GestaoIncidentes: React.FC<IncidentesProps> = ({ incidentes, setIncidentes, postos, colaboradores, registerAudit }) => {
  const [showModal, setShowModal] = useState(false);
  const [newIncidente, setNewIncidente] = useState<Partial<Incidente>>({
    tipo: 'ASSALTO',
    criticidade: CriticidadeEvento.MEDIA,
    status: 'ABERTO'
  });

  const handleSave = () => {
    const incidente: Incidente = {
      ...newIncidente as Incidente,
      id: `INC-${Date.now()}`,
      dataHora: new Date().toISOString(),
      acoesTomadas: [],
      operadorResponsavel: 'Operador COC Alpha'
    };
    setIncidentes(prev => [incidente, ...prev]);
    registerAudit('REGISTRO_INCIDENTE', 'Incidente', incidente.id, null, incidente);
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Gestão de Crises</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Controle rigoroso de incidentes em postos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/20">Registrar Emergência</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {incidentes.length === 0 ? (
          <div className="py-20 text-center bg-white/5 border border-white/5 border-dashed rounded-[3rem]">
            <i className="fas fa-shield-check text-5xl text-emerald-500/20 mb-4"></i>
            <p className="text-slate-500 font-bold uppercase text-[10px]">Nenhuma crise reportada nas últimas 24h</p>
          </div>
        ) : (
          incidentes.map(inc => {
            const posto = postos.find(p => p.id === inc.postoId);
            return (
              <div key={inc.id} className="bg-slate-800/50 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-6 items-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${inc.criticidade === CriticidadeEvento.CRITICA ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500/10 text-amber-500'}`}>
                    <i className="fas fa-triangle-exclamation"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white uppercase">{inc.tipo}</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${inc.criticidade === CriticidadeEvento.CRITICA ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-700 text-slate-400'}`}>{inc.criticidade}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{posto?.nome} • {new Date(inc.dataHora).toLocaleString()}</p>
                    <p className="text-[11px] text-slate-300 mt-2 max-w-md italic">"{inc.descricao}"</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase ${inc.status === 'CONCLUIDO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>{inc.status}</span>
                  <button className="w-12 h-12 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><i className="fas fa-ellipsis-vertical"></i></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-2xl p-12 shadow-2xl my-auto">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Novo Alerta de Emergência</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Posto do Evento</label>
                  <select className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" onChange={e => setNewIncidente({...newIncidente, postoId: e.target.value})}>
                    <option value="">Selecione...</option>
                    {postos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Vigilante Reportante</label>
                  <select className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" onChange={e => setNewIncidente({...newIncidente, colaboradorId: e.target.value})}>
                    <option value="">Selecione...</option>
                    {colaboradores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Natureza da Crise</label>
                  <select className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" value={newIncidente.tipo} onChange={e => setNewIncidente({...newIncidente, tipo: e.target.value as any})}>
                    {['ASSALTO', 'INVASAO', 'AMEACA', 'EMERGENCIA_MEDICA', 'POLICIAL', 'FALHA_EQUIPAMENTO'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Nível de Gravidade</label>
                  <select className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" value={newIncidente.criticidade} onChange={e => setNewIncidente({...newIncidente, criticidade: e.target.value as any})}>
                    {Object.values(CriticidadeEvento).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Relato Inicial</label>
                <textarea className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold h-32 outline-none focus:border-rose-600 transition-all" placeholder="Detalhes do ocorrido..." onChange={e => setNewIncidente({...newIncidente, descricao: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-grow p-5 text-slate-500 font-black uppercase text-[10px]">Descartar</button>
                <button onClick={handleSave} className="flex-grow bg-rose-600 text-white p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Protocolar Crise</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestaoIncidentes;
