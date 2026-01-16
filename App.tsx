
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Colaborador, Equipe, Regiao, StatusColaborador, 
  Posto, Falta, AuditLogEntry, ConfigSistema, 
  SolicitacaoExcecaoRegional, TurnoOperacional, Incidente, Equipamento, 
  PlantaoSupervisor, PerfilUsuario, Usuario, Estado, CriticidadeEvento
} from './types';
import Dashboard from './components/Dashboard';
import ColaboradoresList from './components/ColaboradoresList';
import CoberturaFaltas from './components/CoberturaFaltas';
import GestaoAdministrativa from './components/GestaoAdministrativa';
import GestaoParametros from './components/GestaoParametros';
import MapaOperacional from './components/MapaOperacional';
import CentralOperacoes from './components/CentralOperacoes';
import GestaoIncidentes from './components/GestaoIncidentes';
import VigilantePortal from './components/VigilantePortal';
import GestaoRH from './components/GestaoRH';

const App: React.FC = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loginForm, setLoginForm] = useState({ cpf: '', senha: '' });
  const [view, setView] = useState<'dashboard' | 'coc' | 'incidentes' | 'colaboradores' | 'faltas' | 'adm' | 'mapa' | 'config' | 'auditoria' | 'meu_perfil' | 'rh_gestao'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [config, setConfig] = useState<ConfigSistema>({
    limiteDeslocamento: 80,
    limiteHorasExtrasMes: 60,
    pesoFadigaNoturna: 1.5,
    intersticioMinimoHoras: 11,
    slaRespostaMinutos: 15,
    pesoFadiga: 0.5
  });

  const [colaboradores, setColaboradores] = useState<Colaborador[]>([
    {
      id: 'V1', nome: 'JOÃO SILVA (ALPHA)', matricula: '1001', cpf: '222', cargo: 'Vigilante', equipe: Equipe.PAR,
      regiaoMoradia: Regiao.TAGUATINGA, status: StatusColaborador.ATIVO, telefone: '61988887777',
      regioesAtendidas: [Regiao.PLANO_PILOTO, Regiao.TAGUATINGA, Regiao.CEILANDIA, Regiao.SAMAMBAIA],
      aptoNoturno: true, horasExtrasMes: 12, indiceFadiga: 0.2, checkInStatus: 'DENTRO', lastCheckInTime: new Date().toISOString(),
      documentos: [{ tipo: 'Reciclagem', validade: '12/12/2025', status: 'VÁLIDO' }],
      postoAtualId: 'P1'
    }
  ]);

  const [postos, setPostos] = useState<Posto[]>([
    {
      id: 'P1', nome: 'CONGRESSO NACIONAL', cliente: 'UNIÃO', regiao: Regiao.PLANO_PILOTO,
      estado: Estado.DF, endereco: 'Esplanada', vigilantesNecessarios: 10,
      nivelRisco: 'ALTO', turno: TurnoOperacional.MISTO, lat: -15.7997, lng: -47.8641,
      raioPermitido: 200, status: 'ATIVO', isCritico: true
    }
  ]);

  const [faltas, setFaltas] = useState<Falta[]>([
    { id: 'F1', data: new Date().toLocaleDateString(), postoId: 'P1', colaboradorFaltanteId: 'V1', equipe: Equipe.PAR, turno: TurnoOperacional.DIURNO, status: 'PENDENTE' }
  ]);

  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [excecoesRegionais, setExcecoesRegionais] = useState<SolicitacaoExcecaoRegional[]>([]);
  const [supervisoresAtivos, setSupervisoresAtivos] = useState<PlantaoSupervisor[]>([
    { id: 'S1', supervisorNome: 'SVP RICARDO M.', turno: TurnoOperacional.DIURNO, data: new Date().toISOString(), status: 'ATIVO' }
  ]);

  const registerAudit = useCallback((acao: string, entidade: string, id: string, prev?: any, next?: any) => {
    const entry: AuditLogEntry = {
      id: `SRAD-AUD-${Date.now()}`,
      usuario: user?.nome || 'SISTEMA',
      perfil: user?.perfil || PerfilUsuario.AUDITOR,
      acao, entidade, entidadeId: id,
      valorAnterior: prev ? JSON.stringify(prev) : undefined,
      valorNovo: next ? JSON.stringify(next) : undefined,
      dataHora: new Date().toISOString()
    };
    setAuditLog(prev => [entry, ...prev]);
  }, [user]);

  const validarMissao = useCallback((colabId: string, postoId: string) => {
    const colab = colaboradores.find(c => c.id === colabId);
    const posto = postos.find(p => p.id === postoId);
    if (!colab || !posto) return { ok: false, motivo: 'Dados Inválidos' };
    const atendeRegiao = colab.regioesAtendidas.includes(posto.regiao);
    if (!atendeRegiao) return { ok: false, motivo: 'VIOLAÇÃO CAR' };
    return { ok: true };
  }, [colaboradores, postos]);

  const handleCheckIn = (colabId: string) => {
    setColaboradores(prev => prev.map(c => c.id === colabId ? { ...c, checkInStatus: 'DENTRO', lastCheckInTime: new Date().toISOString() } : c));
    registerAudit('CHECKIN_GEO', 'Colaborador', colabId);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let authUser: Usuario | null = null;
    const cpf = loginForm.cpf;

    if (cpf === '000') authUser = { id: 'u1', nome: 'Diretoria SRAD', cpf, perfil: PerfilUsuario.ADMIN, avatar: 'D' };
    else if (cpf === '111') authUser = { id: 'u2', nome: 'SVP Regional Alpha', cpf, perfil: PerfilUsuario.SUPERVISOR, avatar: 'S' };
    else if (cpf === '222') authUser = { id: 'u3', nome: 'João Silva', cpf, perfil: PerfilUsuario.VIGILANTE, avatar: 'J', matricula: '1001' };
    else if (cpf === '333') authUser = { id: 'u4', nome: 'RH Mariana', cpf, perfil: PerfilUsuario.RH, avatar: 'R' };
    else if (cpf === '444') authUser = { id: 'u5', nome: 'Auditoria Externa', cpf, perfil: PerfilUsuario.AUDITOR, avatar: 'A' };

    if (authUser) {
      setUser(authUser);
      registerAudit('LOGIN_SUCCESS', 'Sessão', authUser.id);
      if (authUser.perfil === PerfilUsuario.VIGILANTE) setView('meu_perfil' as any);
      else if (authUser.perfil === PerfilUsuario.RH) setView('rh_gestao');
      else if (authUser.perfil === PerfilUsuario.AUDITOR) setView('auditoria');
      else setView('dashboard');
    } else {
      alert('CPF de acesso inválido. Tente: 000, 111, 222, 333 ou 444.');
    }
  };

  const renderContent = () => {
    if (!user) return null;
    if (user.perfil === PerfilUsuario.VIGILANTE) {
       const me = colaboradores.find(c => c.cpf === user.cpf) || colaboradores[0];
       return <VigilantePortal colaborador={me} postos={postos} onCheckIn={handleCheckIn} registerAudit={registerAudit} />;
    }

    return (
      <div className="view-transition h-full w-full">
        {(() => {
          switch (view) {
            case 'dashboard': return <Dashboard colaboradores={colaboradores} faltas={faltas} postos={postos} incidentes={incidentes} auditLog={auditLog} />;
            case 'rh_gestao': return <GestaoRH colaboradores={colaboradores} setColaboradores={setColaboradores} auditLog={auditLog} registerAudit={registerAudit} />;
            case 'coc': return <CentralOperacoes postos={postos} colaboradores={colaboradores} supervisores={supervisoresAtivos} setSupervisores={setSupervisoresAtivos} registerAudit={registerAudit} />;
            case 'mapa': return <MapaOperacional postos={postos} colaboradores={colaboradores} onRealocar={() => {}} onSimulateMove={() => {}} excecoesRegionais={excecoesRegionais} onCheckIn={handleCheckIn} />;
            case 'faltas': return <CoberturaFaltas faltas={faltas} setFaltas={setFaltas} colaboradores={colaboradores} postos={postos} config={config} registerAudit={registerAudit} validarMissao={validarMissao} />;
            case 'colaboradores': return <ColaboradoresList colaboradores={colaboradores} setColaboradores={setColaboradores} config={config} registerAudit={registerAudit} />;
            case 'incidentes': return <GestaoIncidentes incidentes={incidentes} setIncidentes={setIncidentes} postos={postos} colaboradores={colaboradores} registerAudit={registerAudit} />;
            case 'adm': return <GestaoAdministrativa postos={postos} setPostos={setPostos} excecoes={excecoesRegionais} setExcecoes={setExcecoesRegionais} registerAudit={registerAudit} colaboradores={colaboradores} />;
            case 'config': return <GestaoParametros config={config} setConfig={setConfig} registerAudit={registerAudit} />;
            case 'auditoria': return (
              <div className="h-full p-4 md:p-10 bg-slate-950 rounded-[1.5rem] md:rounded-[3rem] border border-white/10 flex flex-col overflow-hidden">
                <h3 className="text-white font-black mb-6 uppercase tracking-widest text-sm flex items-center gap-3 shrink-0">
                  <i className="fas fa-fingerprint text-blue-500"></i> Auditoria de Logs
                </h3>
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3">
                  {auditLog.length === 0 ? (
                    <p className="text-slate-600 italic text-xs">Sem registros recentes.</p>
                  ) : (
                    auditLog.map(log => (
                      <div key={log.id} className="p-4 bg-white/5 rounded-xl border border-white/5 font-mono text-[10px] text-blue-400">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-500">{new Date(log.dataHora).toLocaleString()}</span>
                          <span className="text-blue-900 bg-blue-500/20 px-2 py-0.5 rounded text-[8px]">{log.id}</span>
                        </div>
                        <p className="text-white font-black uppercase text-[11px] mb-1">[{log.perfil}] {log.usuario}</p>
                        <p className="text-slate-400 truncate">AÇÃO: {log.acao}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
            default: return <Dashboard colaboradores={colaboradores} faltas={faltas} postos={postos} incidentes={incidentes} auditLog={auditLog} />;
          }
        })()}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black overflow-y-auto">
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 font-black text-white text-3xl">S</div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">SRAD Secure</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Portal de Operações 24x7</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input type="text" placeholder="CPF" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold text-center tracking-widest outline-none focus:ring-2 focus:ring-blue-600" value={loginForm.cpf} onChange={e => setLoginForm({...loginForm, cpf: e.target.value})} />
            <input type="password" placeholder="Senha" className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold text-center outline-none focus:ring-2 focus:ring-blue-600" value={loginForm.senha} onChange={e => setLoginForm({...loginForm, senha: e.target.value})} />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98]">Entrar</button>
          </form>
          <p className="text-center text-[8px] text-slate-600 mt-8 uppercase font-black tracking-widest">Auditor: 444 | Admin: 000 | RH: 333</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-900 overflow-hidden text-slate-100 font-['Inter']">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"></div>
      )}

      {/* Sidebar - Adaptive */}
      <aside className={`fixed lg:relative h-full bg-slate-950 border-r border-white/5 transition-all duration-300 flex flex-col z-[110] ${sidebarOpen ? 'translate-x-0 w-72 md:w-80' : '-translate-x-full lg:translate-x-0 lg:w-24'} shadow-2xl lg:shadow-none`}>
        <div className="h-20 md:h-24 flex items-center px-6 md:px-8 bg-blue-600 shrink-0">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 text-xl">S</div>
          {sidebarOpen && <h1 className="ml-4 font-black text-base uppercase text-white tracking-tighter truncate">SRAD Secure</h1>}
        </div>
        
        <nav className="flex-grow p-4 md:p-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard', profiles: [PerfilUsuario.ADMIN, PerfilUsuario.SUPERVISOR, PerfilUsuario.RH, PerfilUsuario.AUDITOR] },
            { id: 'rh_gestao', icon: 'fa-id-card-clip', label: 'Gestão RH', profiles: [PerfilUsuario.RH, PerfilUsuario.ADMIN, PerfilUsuario.AUDITOR] },
            { id: 'coc', icon: 'fa-satellite-dish', label: 'COC Live', profiles: [PerfilUsuario.SUPERVISOR, PerfilUsuario.ADMIN, PerfilUsuario.AUDITOR] },
            { id: 'mapa', icon: 'fa-map-location-dot', label: 'Mapa CAR', profiles: [PerfilUsuario.SUPERVISOR, PerfilUsuario.ADMIN, PerfilUsuario.AUDITOR] },
            { id: 'faltas', icon: 'fa-user-slash', label: 'Cobertura', profiles: [PerfilUsuario.SUPERVISOR, PerfilUsuario.ADMIN, PerfilUsuario.AUDITOR] },
            { id: 'colaboradores', icon: 'fa-users', label: 'Efetivo', profiles: [PerfilUsuario.RH, PerfilUsuario.ADMIN, PerfilUsuario.AUDITOR] },
            { id: 'incidentes', icon: 'fa-biohazard', label: 'Incidentes', profiles: [PerfilUsuario.SUPERVISOR, PerfilUsuario.ADMIN, PerfilUsuario.AUDITOR] },
            { id: 'adm', icon: 'fa-building-shield', label: 'Contratos', profiles: [PerfilUsuario.ADMIN, PerfilUsuario.RH, PerfilUsuario.AUDITOR] },
            { id: 'auditoria', icon: 'fa-fingerprint', label: 'Auditoria', profiles: [PerfilUsuario.ADMIN, PerfilUsuario.AUDITOR] },
            { id: 'config', icon: 'fa-sliders', label: 'Parâmetros', profiles: [PerfilUsuario.ADMIN] }
          ].filter(item => item.profiles.includes(user.perfil)).map(item => (
            <button 
              key={item.id} 
              onClick={() => { setView(item.id as any); if(window.innerWidth < 1024) setSidebarOpen(false); }} 
              className={`w-full flex items-center px-4 py-4 rounded-xl transition-all ${view === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-base`}></i>
              {sidebarOpen && <span className="ml-4 font-bold text-[10px] uppercase tracking-widest truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <button onClick={() => setUser(null)} className="w-full p-4 text-rose-500 font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-rose-500/10 rounded-xl transition-all">
            <i className="fas fa-power-off"></i> {sidebarOpen && 'Sair da Sessão'}
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow flex flex-col h-full overflow-hidden bg-slate-900 relative">
        <header className="h-20 lg:h-24 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-slate-950/40 backdrop-blur-xl z-[90] shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-10 h-10 border border-white/10 rounded-xl text-slate-400 flex items-center justify-center hover:bg-white/5 transition-all">
               <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-bars'}`}></i>
             </button>
             <h2 className="text-base md:text-xl font-black uppercase text-white tracking-tighter truncate max-w-[140px] md:max-w-none">{view.replace('_', ' ')}</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase text-white truncate max-w-[120px]">{user.nome}</p>
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{user.perfil}</p>
             </div>
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg">{user.avatar}</div>
          </div>
        </header>

        {/* Main Scrolling View */}
        <div className="flex-grow overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 custom-scrollbar touch-scroll">
          <div className="max-w-[1600px] mx-auto min-h-full flex flex-col">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
