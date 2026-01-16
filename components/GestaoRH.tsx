
import React, { useState, useMemo } from 'react';
import { Colaborador, Documento, StatusColaborador, AuditLogEntry, PerfilUsuario } from '../types';

interface GestaoRHProps {
  colaboradores: Colaborador[];
  setColaboradores: React.Dispatch<React.SetStateAction<Colaborador[]>>;
  auditLog: AuditLogEntry[];
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
}

const GestaoRH: React.FC<GestaoRHProps> = ({ colaboradores, setColaboradores, auditLog, registerAudit }) => {
  const [selectedColab, setSelectedColab] = useState<Colaborador | null>(null);
  const [filterStatus, setFilterStatus] = useState<'TODOS' | 'BLOQUEADO' | 'ALERTA'>('TODOS');

  const stats = useMemo(() => {
    const total = colaboradores.length;
    const bloqueados = colaboradores.filter(c => c.status === StatusColaborador.BLOQUEADO).length;
    const comVencidos = colaboradores.filter(c => c.documentos.some(d => d.status === 'VENCIDO')).length;
    const complianceRate = total > 0 ? Math.round(((total - comVencidos) / total) * 100) : 100;

    return { total, bloqueados, comVencidos, complianceRate };
  }, [colaboradores]);

  const handleUpdateDocumento = (colabId: string, tipo: string, novaValidade: string) => {
    setColaboradores(prev => prev.map(c => {
      if (c.id === colabId) {
        const novosDocs = c.documentos.map(d => 
          d.tipo === tipo ? { ...d, validade: novaValidade, status: 'VÁLIDO' as const } : d
        );
        registerAudit('RH_DOC_UPDATE', 'Documentação', c.id, 'VENCIDO/ALERTA', tipo);
        return { ...c, documentos: novosDocs, status: StatusColaborador.ATIVO };
      }
      return c;
    }));
    alert("DOCUMENTO ATUALIZADO: Conformidade restabelecida e bloqueios removidos.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Indicadores de Compliance RH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Taxa de Compliance</p>
           <p className={`text-4xl font-black ${stats.complianceRate < 90 ? 'text-amber-500' : 'text-emerald-500'}`}>{stats.complianceRate}%</p>
        </div>
        <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Documentos Vencidos</p>
           <p className="text-4xl font-black text-rose-500">{stats.comVencidos}</p>
        </div>
        <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Efetivo Bloqueado</p>
           <p className="text-4xl font-black text-rose-600">{stats.bloqueados}</p>
        </div>
        <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-600/20">
           <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2">Gestão de Riscos</p>
           <p className="text-white font-black text-sm uppercase leading-tight">Auditoria Trabalhista Ativa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Efetivo para o RH */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Gestão Documental (Compliance)</h3>
              <div className="flex gap-2">
                 <button onClick={() => setFilterStatus('TODOS')} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase ${filterStatus === 'TODOS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>TODOS</button>
                 <button onClick={() => setFilterStatus('BLOQUEADO')} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase ${filterStatus === 'BLOQUEADO' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>BLOQUEADOS</button>
              </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400">
                 <tr>
                    <th className="px-8 py-4 tracking-widest">Colaborador</th>
                    <th className="px-8 py-4 tracking-widest text-center">Vencimentos Próximos</th>
                    <th className="px-8 py-4 tracking-widest text-right">Ação</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {colaboradores.map(c => (
                   <tr key={c.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6">
                         <p className="text-sm font-black text-slate-800 uppercase">{c.nome}</p>
                         <p className="text-[9px] font-bold text-slate-400">MAT: {c.matricula} • {c.equipe} • {c.status}</p>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex justify-center gap-2">
                            {c.documentos.map((d, i) => (
                              <div key={i} title={`${d.tipo}: ${d.validade}`} className={`w-3 h-3 rounded-full ${d.status === 'VENCIDO' ? 'bg-rose-500' : d.status === 'ALERTA' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                            ))}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button 
                          onClick={() => setSelectedColab(c)}
                          className="bg-slate-100 group-hover:bg-blue-600 group-hover:text-white p-3 rounded-xl transition-all"
                         >
                            <i className="fas fa-file-signature"></i>
                         </button>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Painel de Ficha do Colaborador (Lateral) */}
        <div className="lg:col-span-1 space-y-6">
           {selectedColab ? (
             <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                      {selectedColab.nome.charAt(0)}
                   </div>
                   <div>
                      <h4 className="text-white font-black uppercase text-lg leading-tight">{selectedColab.nome}</h4>
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Dossiê Funcional RH</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">Documentação Legal</h5>
                   {selectedColab.documentos.map((doc, idx) => (
                     <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                        <div>
                           <p className="text-xs font-black text-white uppercase">{doc.tipo}</p>
                           <p className="text-[9px] text-slate-500 font-bold mt-1">Exp: {doc.validade}</p>
                        </div>
                        {doc.status !== 'VÁLIDO' && (
                           <button 
                            onClick={() => handleUpdateDocumento(selectedColab.id, doc.tipo, '10/10/2026')}
                            className="bg-blue-600 text-white p-2 rounded-lg text-[8px] font-black uppercase"
                           >
                              Regularizar
                           </button>
                        )}
                     </div>
                   ))}

                   <div className="pt-6">
                      <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Métricas Trabalhistas</h5>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/5 p-4 rounded-2xl">
                            <p className="text-[7px] text-slate-500 font-black uppercase mb-1">Horas Extras</p>
                            <p className="text-xl font-black text-white">{selectedColab.horasExtrasMes}h</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-2xl">
                            <p className="text-[7px] text-slate-500 font-black uppercase mb-1">Recusas</p>
                            <p className="text-xl font-black text-rose-500">{selectedColab.historicoRecusas || 0}</p>
                         </div>
                      </div>
                   </div>

                   <button className="w-full bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all mt-8 border border-white/5">
                      <i className="fas fa-file-pdf mr-2"></i> Exportar Histórico Completo
                   </button>
                </div>
             </div>
           ) : (
             <div className="bg-slate-900 border border-white/5 border-dashed rounded-[3rem] p-12 text-center opacity-30">
                <i className="fas fa-id-badge text-4xl mb-6"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Selecione um colaborador para gestão documental</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default GestaoRH;
