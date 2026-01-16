
import React, { useState } from 'react';
import { Colaborador, Posto, Equipe, StatusColaborador } from '../types';

interface VigilantePortalProps {
  colaborador: Colaborador;
  postos: Posto[];
  onCheckIn: (colabId: string) => void;
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
}

const VigilantePortal: React.FC<VigilantePortalProps> = ({ colaborador, postos, onCheckIn, registerAudit }) => {
  const [activeTab, setActiveTab] = useState<'escala' | 'operacoes' | 'documentos' | 'solicitacoes'>('escala');
  const [voluntarioHE, setVoluntarioHE] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const meuPosto = postos.find(p => p.id === colaborador.postoAtualId);

  const handleAction = (label: string) => {
    setLoadingAction(label);
    setTimeout(() => {
      registerAudit('SOLICITACAO_VIGILANTE', 'Solicitação', colaborador.id, null, { tipo: label, status: 'PENDENTE' });
      alert(`Solicitação de ${label} enviada ao Supervisor Regional.`);
      setLoadingAction(null);
    }, 1000);
  };

  const handleToggleVoluntario = () => {
    const newState = !voluntarioHE;
    setVoluntarioHE(newState);
    registerAudit('DISPONIBILIDADE_VOLUNTARIA', 'Vigilante', colaborador.id, !newState, newState);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-10">
      <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{colaborador.nome}</h2>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">MAT: {colaborador.matricula} • {colaborador.equipe}</p>
          </div>
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-600/20">
            {colaborador.nome.charAt(0)}
          </div>
        </div>
        
        <div className="mt-8 flex gap-3 relative z-10">
          <div className="flex-grow bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Horas Extras</p>
             <p className="text-xl font-black text-white">{colaborador.horasExtrasMes}h</p>
          </div>
          <div className="flex-grow bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Geofence</p>
             <p className={`text-xl font-black ${colaborador.checkInStatus === 'DENTRO' ? 'text-emerald-500' : 'text-rose-500'}`}>
               {colaborador.checkInStatus === 'DENTRO' ? 'OK' : 'FORA'}
             </p>
          </div>
        </div>
      </div>

      <nav className="flex bg-slate-950/80 backdrop-blur-md p-2 rounded-3xl border border-white/10 sticky top-4 z-20 shadow-xl">
        {[
          { id: 'escala', icon: 'fa-calendar-days', label: 'Escala' },
          { id: 'operacoes', icon: 'fa-location-dot', label: 'Posto' },
          { id: 'documentos', icon: 'fa-file-shield', label: 'Docs' },
          { id: 'solicitacoes', icon: 'fa-hand-paper', label: 'Pedidos' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-grow flex flex-col items-center py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <i className={`fas ${tab.icon} text-lg mb-1`}></i>
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="space-y-6">
        {activeTab === 'escala' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Próximo Serviço</h4>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl border border-emerald-500/20">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <p className="text-xl font-black text-white uppercase leading-none">Amanhã • 07:00</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">{meuPosto?.nome || 'Posto Regional'}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleToggleVoluntario}
              className={`w-full p-8 rounded-[2.5rem] border flex justify-between items-center transition-all ${voluntarioHE ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-white/10'}`}
            >
               <div className="text-left">
                  <h4 className={`text-sm font-black uppercase ${voluntarioHE ? 'text-blue-400' : 'text-slate-300'}`}>Voluntário Extras</h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Acionar em dias de folga</p>
               </div>
               <div className={`w-14 h-8 rounded-full transition-all relative ${voluntarioHE ? 'bg-blue-600' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${voluntarioHE ? 'left-7' : 'left-1'}`}></div>
               </div>
            </button>
          </div>
        )}

        {activeTab === 'operacoes' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-10 duration-300">
            <div className="bg-slate-950 border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl">
              <i className="fas fa-location-crosshairs text-5xl text-blue-500 mb-6 animate-pulse"></i>
              <h3 className="text-2xl font-black text-white uppercase">Terminal Operacional</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 mb-10">Validação Georreferenciada</p>
              
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 mb-8 text-left">
                <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Posto Designado</p>
                <p className="text-lg font-black text-white uppercase">{meuPosto?.nome || 'POSTO NÃO LOCALIZADO'}</p>
              </div>

              <button 
                onClick={() => onCheckIn(colaborador.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl transition-all"
              >
                {colaborador.checkInStatus === 'DENTRO' ? 'Check-in Confirmado' : 'Registrar Início Turno'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'documentos' && (
          <div className="space-y-3 animate-in fade-in duration-300">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Compliance Legal</h4>
             {colaborador.documentos.map((doc, idx) => (
               <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-black text-white uppercase">{doc.tipo}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Vencimento: {doc.validade}</p>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase border ${doc.status === 'VÁLIDO' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                    {doc.status}
                  </span>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'solicitacoes' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
             {[
               { label: 'Troca Plantão', icon: 'fa-repeat', color: 'text-blue-500', bg: 'bg-blue-500/5' },
               { label: 'Atestado Médico', icon: 'fa-file-medical', color: 'text-rose-500', bg: 'bg-rose-500/5' },
               { label: 'Reciclagem', icon: 'fa-user-graduate', color: 'text-amber-500', bg: 'bg-amber-500/5' },
               { label: 'Ocorrência', icon: 'fa-clipboard-list', color: 'text-slate-400', bg: 'bg-slate-500/5' }
             ].map((item, idx) => (
               <button 
                 key={idx} 
                 onClick={() => handleAction(item.label)}
                 disabled={loadingAction === item.label}
                 className={`border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center hover:bg-white/10 active:scale-95 transition-all group ${item.bg}`}
               >
                  {loadingAction === item.label ? (
                    <i className="fas fa-circle-notch animate-spin text-3xl mb-4 text-white"></i>
                  ) : (
                    <i className={`fas ${item.icon} text-3xl mb-4 ${item.color} group-hover:scale-110 transition-transform`}></i>
                  )}
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
               </button>
             ))}
          </div>
        )}
      </div>
      <div className="text-center pt-8 opacity-40">
         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
           SESSÃO CRIPTOGRAFADA E AUDITADA<br/>VIG: {colaborador.matricula} • GEO: ATIVA
         </p>
      </div>
    </div>
  );
};

export default VigilantePortal;
