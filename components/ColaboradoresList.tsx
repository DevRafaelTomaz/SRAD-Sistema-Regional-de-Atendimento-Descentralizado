
import React, { useState, useMemo } from 'react';
import { 
  Colaborador, Equipe, Regiao, StatusColaborador, ConfigSistema 
} from '../types';
import { getTempoDeslocamento } from '../constants';

interface ColaboradoresListProps {
  colaboradores: Colaborador[];
  setColaboradores: React.Dispatch<React.SetStateAction<Colaborador[]>>;
  config: ConfigSistema;
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
}

const ColaboradoresList: React.FC<ColaboradoresListProps> = ({ colaboradores, setColaboradores, config, registerAudit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newColab, setNewColab] = useState<Partial<Colaborador>>({
    nome: '',
    matricula: '',
    cpf: '',
    equipe: Equipe.PAR,
    regiaoMoradia: Regiao.TAGUATINGA,
    regioesAtendidas: [Regiao.PLANO_PILOTO],
    status: StatusColaborador.ATIVO,
    cargo: 'Vigilante',
    telefone: ''
  });

  // FIX: Added filteredColaboradores logic to resolve "Cannot find name 'filteredColaboradores'" error.
  const filteredColaboradores = useMemo(() => {
    return colaboradores.filter(c => 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf.includes(searchTerm)
    );
  }, [colaboradores, searchTerm]);

  const isCpfValid = (cpf: string) => cpf.replace(/\D/g, '').length === 11;

  const temposCalculados = useMemo(() => {
    return (newColab.regioesAtendidas || []).map(r => ({
      regiao: r,
      tempo: getTempoDeslocamento(newColab.regiaoMoradia as Regiao, r)
    }));
  }, [newColab.regiaoMoradia, newColab.regioesAtendidas]);

  const violacoesTempo = temposCalculados.filter(t => t.tempo > 80);
  const temViolaçãoCritica = violacoesTempo.length > 0;

  const handleToggleRegiao = (r: Regiao) => {
    if (r === Regiao.PLANO_PILOTO) return;
    setNewColab(prev => {
      const current = prev.regioesAtendidas || [];
      if (current.includes(r)) {
        return { ...prev, regioesAtendidas: current.filter(x => x !== r) };
      }
      if (current.length >= 4) {
        return prev;
      }
      return { ...prev, regioesAtendidas: [...current, r] };
    });
  };

  const handleSaveNew = () => {
    if (!newColab.nome || !newColab.matricula || !isCpfValid(newColab.cpf || '')) {
      alert("ERRO DE IDENTIFICAÇÃO: Campos obrigatórios ausentes.");
      return;
    }
    const colabCompleto: Colaborador = {
      ...(newColab as Colaborador),
      id: `V-${Date.now()}`,
      horasExtrasMes: 0,
      indiceFadiga: 0,
      historicoRecusas: 0,
      documentos: [],
      aptoNoturno: true,
      checkInStatus: 'PENDENTE'
    };
    setColaboradores(prev => [...prev, colabCompleto]);
    registerAudit('ADMISSAO_VIGILANTE', 'Colaborador', colabCompleto.id, null, colabCompleto);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Efetivo Regionalizado</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Gestão de Regionalização CAR</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <label htmlFor="search-input" className="sr-only">Buscar colaborador</label>
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"></i>
              <input 
                id="search-input"
                type="search" 
                placeholder="Nome, Matrícula ou CPF..." 
                className="pl-12 pr-6 py-4 bg-white border border-slate-300 rounded-2xl text-sm font-medium w-full md:w-80 outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-slate-900"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 shrink-0"
              aria-haspopup="dialog"
            >
              <i className="fas fa-user-plus" aria-hidden="true"></i> Novo Cadastro
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-10 py-6">Vigilante / Documento</th>
                <th className="px-10 py-6 text-center">Escala Fixa</th>
                <th className="px-10 py-6">Moradia / CAR</th>
                <th className="px-10 py-6">Status Operacional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredColaboradores.map(c => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition-all">
                  <td className="px-10 py-6">
                    <p className="font-black text-slate-900 text-base leading-tight">{c.nome}</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">MAT: {c.matricula} • CPF: {c.cpf}</p>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border ${c.equipe === Equipe.PAR ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {c.equipe}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-[11px] font-bold text-slate-700 uppercase">{c.regiaoMoradia}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.regioesAtendidas.map(r => (
                        <span key={r} className="text-[8px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 uppercase">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${c.status === StatusColaborador.ATIVO ? 'bg-emerald-500' : 'bg-rose-500'}`} aria-hidden="true"></span>
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{c.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] w-full max-w-5xl shadow-2xl animate-in zoom-in duration-300 border border-white/20">
            <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-[2.5rem] md:rounded-t-[4rem]">
              <div>
                <h3 id="modal-title" className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Admissão de Efetivo</h3>
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-[0.2em] mt-1">Compliance Regional e Regras CAR</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-12 h-12 bg-white border border-slate-300 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 focus:ring-4 focus:ring-rose-500/20 transition-all outline-none"
                aria-label="Fechar modal"
              >
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-6">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Dados do Colaborador</h4>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="colab-nome" className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-2">Nome Completo</label>
                    <input 
                      id="colab-nome"
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-300 p-4 rounded-2xl text-sm font-medium focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all text-slate-900" 
                      value={newColab.nome} 
                      onChange={e => setNewColab({...newColab, nome: e.target.value})} 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="colab-mat" className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-2">Matrícula</label>
                      <input 
                        id="colab-mat"
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-300 p-4 rounded-2xl text-sm font-medium focus:border-blue-600 outline-none text-slate-900" 
                        value={newColab.matricula} 
                        onChange={e => setNewColab({...newColab, matricula: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label htmlFor="colab-cpf" className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-2">CPF</label>
                      <input 
                        id="colab-cpf"
                        type="text" 
                        maxLength={11} 
                        className="w-full bg-slate-50 border border-slate-300 p-4 rounded-2xl text-sm font-medium focus:border-blue-600 outline-none text-slate-900" 
                        value={newColab.cpf} 
                        onChange={e => setNewColab({...newColab, cpf: e.target.value.replace(/\D/g, '')})} 
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colab-moradia" className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-2">Moradia (Origem)</label>
                    <select 
                      id="colab-moradia"
                      className="w-full bg-slate-50 border border-slate-300 p-4 rounded-2xl text-sm font-medium outline-none text-slate-900 cursor-pointer focus:border-blue-600" 
                      value={newColab.regiaoMoradia} 
                      onChange={e => setNewColab({...newColab, regiaoMoradia: e.target.value as Regiao})}
                    >
                      {Object.values(Regiao).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Atribuição de Postos (4 Regiões)</h4>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${newColab.regioesAtendidas?.length === 4 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                    {newColab.regioesAtendidas?.length} / 4 Selecionadas
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
                  {Object.values(Regiao).map(r => {
                    const isSelected = newColab.regioesAtendidas?.includes(r);
                    const tempo = getTempoDeslocamento(newColab.regiaoMoradia as Regiao, r);
                    const isExceeded = tempo > 80;
                    
                    return (
                      <button 
                        key={r}
                        type="button"
                        onClick={() => handleToggleRegiao(r)}
                        aria-pressed={isSelected}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative outline-none focus:ring-4 focus:ring-blue-600/20 ${
                          isSelected 
                            ? (isExceeded ? 'border-rose-600 bg-rose-50' : 'border-blue-600 bg-blue-50') 
                            : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                           <p className={`text-[10px] font-black uppercase leading-tight pr-4 ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{r}</p>
                           {isSelected && <i className={`fas ${isExceeded ? 'fa-triangle-exclamation text-rose-600' : 'fa-check-circle text-blue-600'} text-xs`}></i>}
                        </div>
                        <div className="flex items-center gap-2">
                          <i className={`fas fa-clock text-[10px] ${isExceeded ? 'text-rose-500' : 'text-slate-400'}`}></i>
                          <span className={`text-[11px] font-black ${isExceeded ? 'text-rose-700' : 'text-slate-600'}`}>{tempo} min</span>
                        </div>
                        {r === Regiao.PLANO_PILOTO && (
                          <span className="absolute -top-2 left-2 bg-blue-700 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Obrigatório</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className={`p-6 rounded-[2rem] flex items-center gap-6 border-2 ${temViolaçãoCritica ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${temViolaçãoCritica ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    <i className={`fas ${temViolaçãoCritica ? 'fa-triangle-exclamation' : 'fa-shield-check'}`}></i>
                  </div>
                  <div>
                    <h5 className={`text-xs font-black uppercase ${temViolaçãoCritica ? 'text-rose-900' : 'text-emerald-900'}`}>
                      {temViolaçãoCritica ? 'Violação de Segurança Operacional' : 'Limite de Deslocamento OK'}
                    </h5>
                    <p className={`text-[10px] font-bold mt-1 uppercase ${temViolaçãoCritica ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {temViolaçãoCritica 
                        ? 'Deslocamento acima de 1h20 detectado. Ajuste a malha regional.' 
                        : 'Todas as regiões dentro do limite regulamentar de 80 minutos.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-200 rounded-b-[2.5rem] md:rounded-b-[4rem] flex flex-col sm:flex-row justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-5 rounded-3xl text-[10px] font-black uppercase text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveNew}
                disabled={temViolaçãoCritica || newColab.regioesAtendidas?.length !== 4}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4"
              >
                Confirmar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColaboradoresList;
