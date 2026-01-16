
import React, { useState } from 'react';
import { Posto, Colaborador, Regiao } from '../types';

interface SimuladorProps {
  postos: Posto[];
  colaboradores: Colaborador[];
}

const SimuladorOperacional: React.FC<SimuladorProps> = ({ postos, colaboradores }) => {
  const [novaRegiao, setNovaRegiao] = useState<Regiao>(Regiao.TAGUATINGA);
  const [novosPostosCount, setNovosPostosCount] = useState(1);

  const getDisponibilidade = (r: Regiao) => {
    return colaboradores.filter(c => c.regioesAtendidas.includes(r)).length;
  };

  const pool = getDisponibilidade(novaRegiao);
  const needed = novosPostosCount * 2;
  const ratio = pool / (needed || 1);

  return (
    <div className="space-y-6">
      <header className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
         <div className="relative z-10">
           <h3 className="text-2xl font-black tracking-tight mb-2">Simulador de Expansão Digital Twin</h3>
           <p className="text-slate-400 text-sm max-w-2xl">Projete novos contratos e valide a resiliência da malha regional antes de assinar. O SRAD analisa a capacidade de cobertura 12x36 instantaneamente.</p>
         </div>
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <i className="fas fa-microchip text-9xl"></i>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 enterprise-shadow">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Parâmetros do Contrato</h4>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-2">Região do Posto</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                value={novaRegiao}
                onChange={(e) => setNovaRegiao(e.target.value as Regiao)}
              >
                {Object.values(Regiao).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-2">Quantidade de Postos</label>
              <div className="flex items-center gap-4 bg-slate-50 border-2 border-slate-100 p-2 rounded-xl">
                 <button onClick={() => setNovosPostosCount(Math.max(1, novosPostosCount - 1))} className="w-10 h-10 bg-white rounded-lg shadow-sm font-bold text-slate-600">-</button>
                 <input 
                  type="number" 
                  className="bg-transparent text-center font-black text-lg w-full outline-none"
                  value={novosPostosCount}
                  onChange={(e) => setNovosPostosCount(parseInt(e.target.value) || 0)}
                />
                 <button onClick={() => setNovosPostosCount(novosPostosCount + 1)} className="w-10 h-10 bg-white rounded-lg shadow-sm font-bold text-slate-600">+</button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Reserva Operacional</span>
                <span className={`text-xs font-black px-2 py-1 rounded ${ratio > 1.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {Math.round(ratio * 100)}%
                </span>
             </div>
             <p className="text-[10px] text-slate-400 italic">Recomendamos uma taxa de cobertura regional mínima de 150% para absorver absenteísmo histórico.</p>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-3xl border border-slate-200 enterprise-shadow flex flex-col items-center justify-center text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Efetivo Regional Disponível</p>
              <p className="text-6xl font-black text-blue-600">{pool}</p>
              <p className="text-xs font-bold text-slate-500 mt-2">Vigilantes habilitados para {novaRegiao}</p>
           </div>
           
           <div className="bg-white p-8 rounded-3xl border border-slate-200 enterprise-shadow flex flex-col items-center justify-center text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Novas Vagas Reais (12x36)</p>
              <p className="text-6xl font-black text-slate-800">{needed}</p>
              <p className="text-xs font-bold text-slate-500 mt-2">Postos preenchidos por par e ímpar</p>
           </div>

           <div className={`md:col-span-2 p-8 rounded-3xl border-2 flex items-center gap-8 ${ratio >= 1 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${ratio >= 1 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                 <i className={`fas ${ratio >= 1 ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              </div>
              <div>
                 <h5 className={`text-xl font-black tracking-tight ${ratio >= 1 ? 'text-emerald-800' : 'text-rose-800'}`}>
                   {ratio >= 1 ? 'Operação Sustentável' : 'Risco de Ruptura Operacional'}
                 </h5>
                 <p className={`text-sm font-medium ${ratio >= 1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {ratio >= 1 
                    ? `A malha regional comporta os novos postos. Sobram ${pool - needed} vigilantes habilitados para suporte.` 
                    : `Faltam ${needed - pool} vigilantes na região de ${novaRegiao}. Contratação imediata necessária antes da ativação.`}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladorOperacional;
