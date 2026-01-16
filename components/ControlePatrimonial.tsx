
import React, { useState } from 'react';
import { Equipamento, Colaborador } from '../types';

interface PatrimonialProps {
  equipamentos: Equipamento[];
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>;
  colaboradores: Colaborador[];
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
}

const ControlePatrimonial: React.FC<PatrimonialProps> = ({ equipamentos, setEquipamentos, colaboradores, registerAudit }) => {
  const [showModal, setShowModal] = useState(false);
  const [newEquip, setNewEquip] = useState<Partial<Equipamento>>({ tipo: 'ARMA', status: 'DISPONIVEL' });

  const handleAdd = () => {
    const equip: Equipamento = {
      ...newEquip as Equipamento,
      id: `EQUIP-${Date.now()}`
    };
    setEquipamentos(prev => [...prev, equip]);
    registerAudit('CADASTRO_PATRIMONIO', 'Equipamento', equip.id, null, equip);
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
        <div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Patrimônio Operacional</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Gestão de armamento e ativos críticos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Novo Ativo</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['ARMA', 'COLETE', 'RADIO', 'VIATURA'].map(tipo => (
          <div key={tipo} className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 text-center">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-2 tracking-widest">{tipo}</p>
            <p className="text-3xl font-black text-white">{equipamentos.filter(e => e.tipo === tipo).length}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Patrimônio / Tipo</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Responsável</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Status</th>
              <th className="px-10 py-6 text-right text-[10px] font-black uppercase text-slate-500">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {equipamentos.length === 0 ? (
              <tr><td colSpan={4} className="py-20 text-center opacity-20 italic">Aguardando inclusão de ativos...</td></tr>
            ) : (
              equipamentos.map(e => (
                <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-6">
                    <p className="text-sm font-black text-white uppercase">{e.patrimonio}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{e.tipo}</p>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs font-bold text-slate-400">{e.vigilanteResponsavelId ? colaboradores.find(c => c.id === e.vigilanteResponsavelId)?.nome : '--'}</p>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${e.status === 'DISPONIVEL' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>{e.status}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="text-slate-500 hover:text-white transition-all"><i className="fas fa-right-from-bracket"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-lg p-12 shadow-2xl">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Cadastrar Ativo</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Tipo de Ativo</label>
                <select className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" value={newEquip.tipo} onChange={e => setNewEquip({...newEquip, tipo: e.target.value as any})}>
                  {['ARMA', 'COLETE', 'RADIO', 'VIATURA'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Número de Patrimônio</label>
                <input type="text" className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none" placeholder="Ex: PT-40-12345" onChange={e => setNewEquip({...newEquip, patrimonio: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-grow p-5 text-slate-500 font-black uppercase text-[10px]">Cancelar</button>
                <button onClick={handleAdd} className="flex-grow bg-blue-600 text-white p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Cadastrar Patrimônio</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlePatrimonial;
