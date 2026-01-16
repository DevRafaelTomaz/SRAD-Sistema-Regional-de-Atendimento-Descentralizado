
import React from 'react';
import { Posto, Colaborador, Equipe } from '../types';

interface EscalaViewProps {
  postos: Posto[];
  colaboradores: Colaborador[];
}

const EscalaView: React.FC<EscalaViewProps> = ({ postos, colaboradores }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lado Par */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Escala PAR (Dias Pares)</h3>
          </div>
          {postos.map(p => {
            const vinculados = colaboradores.filter(c => 
              c.equipe === Equipe.PAR && 
              c.regioesAtendidas.includes(p.regiao) &&
              c.status === 'Ativo'
            );

            return (
              <div key={`par-${p.id}`} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-slate-700">{p.nome}</p>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{p.regiao}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Vigilantes Regionais Disponíveis:</p>
                  <div className="flex flex-wrap gap-2">
                    {vinculados.length > 0 ? vinculados.map(v => (
                      <div key={v.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs border border-blue-100">
                        {v.nome}
                      </div>
                    )) : (
                      <span className="text-xs text-amber-500 bg-amber-50 px-2 py-1 rounded border border-amber-100 italic">
                        Alerta: Sem vigilantes nesta região para equipe Par
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lado Ímpar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Escala ÍMPAR (Dias Ímpares)</h3>
          </div>
          {postos.map(p => {
            const vinculados = colaboradores.filter(c => 
              c.equipe === Equipe.IMPAR && 
              c.regioesAtendidas.includes(p.regiao) &&
              c.status === 'Ativo'
            );

            return (
              <div key={`impar-${p.id}`} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-slate-700">{p.nome}</p>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{p.regiao}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Vigilantes Regionais Disponíveis:</p>
                  <div className="flex flex-wrap gap-2">
                    {vinculados.length > 0 ? vinculados.map(v => (
                      <div key={v.id} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs border border-amber-100">
                        {v.nome}
                      </div>
                    )) : (
                      <span className="text-xs text-amber-500 bg-amber-50 px-2 py-1 rounded border border-amber-100 italic">
                        Alerta: Sem vigilantes nesta região para equipe Ímpar
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EscalaView;
