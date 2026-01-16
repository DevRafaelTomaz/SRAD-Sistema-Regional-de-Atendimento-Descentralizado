
import React from 'react';
import { ConfigSistema } from '../types';

interface GestaoParametrosProps {
  config: ConfigSistema;
  setConfig: React.Dispatch<React.SetStateAction<ConfigSistema>>;
  registerAudit: (acao: string, entidade: string, id: string, prev?: any, next?: any) => void;
}

const GestaoParametros: React.FC<GestaoParametrosProps> = ({ config, setConfig, registerAudit }) => {
  const handleUpdate = (field: keyof ConfigSistema, value: number) => {
    const prevValue = config[field];
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    registerAudit('PARAM_UPDATE', 'Configuração do Sistema', field, prevValue, value);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Informativo */}
      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter">Painel de Controle Estratégico</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
            "A agilidade operacional depende da calibração precisa." Ajuste os algoritmos de priorização e as travas de compliance do SRAD em tempo real.
          </p>
        </div>
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-12 relative z-10 border border-white/20">
          <i className="fas fa-sliders text-4xl text-white"></i>
        </div>
        <i className="fas fa-gears absolute right-10 top-1/2 -translate-y-1/2 text-white/5 text-[15rem]"></i>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Card: Travas Operacionais */}
        <div className="bg-slate-800/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center text-2xl border border-blue-500/20">
              <i className="fas fa-shield-halved"></i>
            </div>
            <div>
              <h4 className="text-xl font-black text-white uppercase tracking-tighter">Travas de Compliance</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Segurança Regional e SLA</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-400 uppercase">Limite de Deslocamento</label>
                <span className="text-2xl font-black text-blue-500">{config.limiteDeslocamento}<span className="text-xs ml-1 uppercase text-slate-600">min</span></span>
              </div>
              <input 
                type="range" min="30" max="150" step="5"
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                value={config.limiteDeslocamento}
                onChange={(e) => handleUpdate('limiteDeslocamento', parseInt(e.target.value))}
              />
              <p className="text-[10px] text-slate-500 font-medium">Define o raio máximo de atuação automática. Valores acima exigem justificativa formal do supervisor.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-400 uppercase">SLA de Resposta Aceite</label>
                <span className="text-2xl font-black text-blue-500">{config.slaRespostaMinutos}<span className="text-xs ml-1 uppercase text-slate-600">min</span></span>
              </div>
              <input 
                type="range" min="2" max="30" step="1"
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                value={config.slaRespostaMinutos}
                onChange={(e) => handleUpdate('slaRespostaMinutos', parseInt(e.target.value))}
              />
              <p className="text-[10px] text-slate-500 font-medium">Tempo limite para o vigilante confirmar a convocação extra antes do sistema repassar ao próximo do ranking.</p>
            </div>
          </div>
        </div>

        {/* Card: Algoritmo de Prioridade */}
        <div className="bg-slate-800/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-amber-600/10 text-amber-500 rounded-2xl flex items-center justify-center text-2xl border border-amber-500/20">
              <i className="fas fa-brain"></i>
            </div>
            <div>
              <h4 className="text-xl font-black text-white uppercase tracking-tighter">Inteligência de Ranking</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fadiga e Distribuição de HE</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-400 uppercase">Teto de HE Mensal</label>
                <span className="text-2xl font-black text-amber-500">{config.limiteHorasExtrasMes}<span className="text-xs ml-1 uppercase text-slate-600">h</span></span>
              </div>
              <input 
                type="range" min="20" max="100" step="2"
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                value={config.limiteHorasExtrasMes}
                onChange={(e) => handleUpdate('limiteHorasExtrasMes', parseInt(e.target.value))}
              />
              <p className="text-[10px] text-slate-500 font-medium">Limite máximo de horas extras por colaborador. A IA prioriza quem está mais longe do teto para equilibrar a remuneração.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-400 uppercase">Peso do Fator Fadiga</label>
                <span className="text-2xl font-black text-amber-500">{(config.pesoFadiga * 100).toFixed(0)}<span className="text-xs ml-1 uppercase text-slate-600">%</span></span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1"
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                value={config.pesoFadiga}
                onChange={(e) => handleUpdate('pesoFadiga', parseFloat(e.target.value))}
              />
              <p className="text-[10px] text-slate-500 font-medium">Aumente para priorizar vigilantes com maior tempo de descanso acumulado. Reduza para priorizar proximidade geográfica.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex items-center gap-8 shadow-sm">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg animate-pulse">
          <i className="fas fa-check-double"></i>
        </div>
        <div>
          <h5 className="text-lg font-black text-blue-400 uppercase tracking-tighter">Modificações Vivas</h5>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">As alterações acima são propagadas instantaneamente em toda a malha operacional. Nenhuma reinicialização é necessária para o cálculo das próximas coberturas.</p>
        </div>
      </div>
    </div>
  );
};

export default GestaoParametros;
