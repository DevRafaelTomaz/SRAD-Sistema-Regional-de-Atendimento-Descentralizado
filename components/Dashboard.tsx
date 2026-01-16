
import React, { useMemo, useState, useEffect } from 'react';
import { 
  Colaborador, Falta, Posto, Regiao, Incidente, 
  AuditLogEntry, CriticidadeEvento, StatusColaborador 
} from '../types';

interface DashboardProps {
  colaboradores: Colaborador[];
  faltas: Falta[];
  postos: Posto[];
  incidentes?: Incidente[];
  auditLog?: AuditLogEntry[];
}

type Layer = 'OPERACIONAL' | 'JURIDICA' | 'COMPLIANCE' | 'INCIDENTES' | 'ADM' | 'TECH';

const Dashboard: React.FC<DashboardProps> = ({ 
  colaboradores, 
  faltas, 
  postos, 
  incidentes = [], 
  auditLog = [] 
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');

  const stats = useMemo(() => {
    let score = 100;
    const faltasPendentes = faltas.filter(f => f.status === 'PENDENTE');
    const incidentesAbertos = incidentes.filter(i => i.status !== 'CONCLUIDO');
    const geofenceAlerts = colaboradores.filter(c => c.checkInStatus === 'FORA');
    const docsVencidos = colaboradores.filter(c => c.documentos.some(d => d.status === 'VENCIDO'));

    score -= (faltasPendentes.length * 15);
    score -= (incidentesAbertos.length * 20);
    score -= (geofenceAlerts.length * 10);
    score -= (docsVencidos.length * 5);

    return {
      score: Math.max(0, score),
      faltasCount: faltasPendentes.length,
      incidentesCount: incidentesAbertos.length,
      geofenceCount: geofenceAlerts.length,
      docsCount: docsVencidos.length,
      totalAtivos: colaboradores.filter(c => c.status === StatusColaborador.ATIVO).length,
      postosAtivos: postos.filter(p => p.status === 'ATIVO').length
    };
  }, [colaboradores, faltas, incidentes, postos]);

  const status = useMemo(() => {
    if (stats.score > 85) return { label: 'OPERANTE', color: 'text-emerald-500', bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' };
    if (stats.score > 60) return { label: 'ATENÇÃO', color: 'text-amber-500', bg: 'bg-amber-500', shadow: 'shadow-amber-500/20' };
    return { label: 'CRÍTICO', color: 'text-rose-500', bg: 'bg-rose-500', shadow: 'shadow-rose-500/20' };
  }, [stats.score]);

  const unifiedEvents = useMemo(() => {
    const events: any[] = [];

    auditLog.forEach(log => {
      events.push({
        id: log.id,
        timestamp: log.dataHora,
        title: log.acao,
        desc: `${log.usuario}: ${log.entidade}`,
        severity: log.acao.includes('ALERTA') ? 'HIGH' : 'INFO',
        icon: 'fa-fingerprint'
      });
    });

    incidentes.forEach(inc => {
      events.push({
        id: inc.id,
        timestamp: inc.dataHora,
        title: `CRISE: ${inc.tipo}`,
        desc: inc.descricao,
        severity: inc.criticidade === CriticidadeEvento.CRITICA ? 'CRITICAL' : 'HIGH',
        icon: 'fa-burst'
      });
    });

    faltas.forEach(f => {
      const p = postos.find(posto => posto.id === f.postoId);
      events.push({
        id: f.id,
        timestamp: f.data,
        title: f.status === 'PENDENTE' ? 'POSTO DESCOBERTO' : 'COBERTURA OK',
        desc: `Posto: ${p?.nome} - ${f.turno}`,
        severity: f.status === 'PENDENTE' ? 'CRITICAL' : 'INFO',
        icon: f.status === 'PENDENTE' ? 'fa-user-slash' : 'fa-user-check'
      });
    });

    let filtered = events;
    if (filterSeverity === 'CRITICAL') filtered = events.filter(e => e.severity === 'CRITICAL');
    if (filterSeverity === 'WARNING') filtered = events.filter(e => e.severity === 'HIGH');

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [auditLog, incidentes, faltas, postos, filterSeverity]);

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Top Section: Score + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="lg:col-span-1 bg-slate-950 rounded-[2rem] p-6 md:p-8 border border-white/5 relative overflow-hidden">
           <div className={`absolute -right-8 -top-8 w-32 h-32 ${status.bg} opacity-10 rounded-full blur-3xl`}></div>
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Risk Score</p>
           <p className={`text-5xl md:text-6xl font-black ${status.color} tracking-tighter`}>{stats.score}%</p>
           <div className={`mt-4 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase inline-block ${status.bg} text-white`}>{status.label}</div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
           {[
             { label: 'Gaps Ativos', val: stats.faltasCount, color: stats.faltasCount > 0 ? 'text-rose-500' : 'text-slate-500', icon: 'fa-user-slash' },
             { label: 'Crises', val: stats.incidentesCount, color: stats.incidentesCount > 0 ? 'text-rose-500' : 'text-slate-500', icon: 'fa-biohazard' },
             { label: 'Violação CAR', val: stats.geofenceCount, color: stats.geofenceCount > 0 ? 'text-amber-500' : 'text-slate-500', icon: 'fa-route' },
             { label: 'SLA Documental', val: stats.docsCount, color: stats.docsCount > 0 ? 'text-rose-400' : 'text-slate-500', icon: 'fa-hourglass-half' }
           ].map((c, i) => (
             <div key={i} className="bg-slate-900/50 p-5 md:p-6 rounded-[1.5rem] border border-white/5 flex flex-col justify-between">
                <i className={`fas ${c.icon} ${c.color} text-lg opacity-40 mb-3`}></i>
                <div>
                  <p className={`text-2xl md:text-3xl font-black ${c.color} tracking-tighter`}>{c.val}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{c.label}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Timeline Area */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
             <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Logs Operacionais Táticos</h3>
             <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1">
                <button onClick={() => setFilterSeverity('ALL')} className={`flex-grow sm:flex-none px-3 py-2 rounded-xl text-[8px] font-black uppercase whitespace-nowrap ${filterSeverity === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}>TODOS</button>
                <button onClick={() => setFilterSeverity('CRITICAL')} className={`flex-grow sm:flex-none px-3 py-2 rounded-xl text-[8px] font-black uppercase whitespace-nowrap ${filterSeverity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-500'}`}>CRÍTICOS</button>
             </div>
          </div>
          
          <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] h-[400px] md:h-[550px] overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-3">
             {unifiedEvents.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-xs">Aguardando eventos...</div>
             ) : (
               unifiedEvents.map(ev => (
                 <div key={ev.id} className={`p-4 md:p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start md:items-center gap-4 hover:bg-white/[0.04] transition-all cursor-pointer ${ev.severity === 'CRITICAL' ? 'border-rose-500/30 bg-rose-500/5' : ''}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      ev.severity === 'CRITICAL' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 
                      ev.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      <i className={`fas ${ev.icon}`}></i>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-[11px] font-black text-white uppercase truncate">{ev.title}</p>
                        <span className="text-[8px] font-mono text-slate-600 shrink-0">{new Date(ev.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-tight truncate">{ev.desc}</p>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
           <div className="bg-blue-600 p-6 md:p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <i className="fas fa-headset absolute -right-4 -bottom-4 text-7xl text-white/10 group-hover:scale-110 transition-transform"></i>
              <h4 className="text-white font-black uppercase text-[9px] tracking-widest mb-3">Missão Crítica</h4>
              <p className="text-white font-black text-xl md:text-2xl tracking-tighter leading-tight">Sala de Crise: {stats.faltasCount + stats.incidentesCount} alertas pendentes.</p>
              <button className="mt-6 w-full bg-white text-blue-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Atuar Imediatamente</button>
           </div>

           <div className="bg-slate-950 border border-white/5 rounded-[2rem] p-6 md:p-8">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <i className="fas fa-chart-line text-emerald-500"></i> SLA Operacional
              </h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                       <span className="text-slate-500">Resposta Convocações</span>
                       <span className="text-white">88%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full">
                       <div className="h-full bg-emerald-500 w-[88%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                       <span className="text-slate-500">Cobertura Regional CAR</span>
                       <span className="text-white">94%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full">
                       <div className="h-full bg-blue-500 w-[94%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
