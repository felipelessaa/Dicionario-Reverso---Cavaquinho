import React from 'react';
import { ChordMatch } from '../types';
import { CAVAQUINHO_STRINGS } from '../utils/musicTheory';
import { CheckCircle2, Info } from 'lucide-react';

interface HarmonicFunctionTableProps {
  selectedChord: ChordMatch;
}

export const HarmonicFunctionTable: React.FC<HarmonicFunctionTableProps> = ({ selectedChord }) => {
  return (
    <div id="harmonic-function-table" className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
            <span>Análise de Funções Harmônicas</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              Acorde: {selectedChord.chordSymbol}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mapeamento da função técnica de cada corda para a formação de{' '}
            <strong className="text-amber-200">{selectedChord.fullChordName}</strong>
          </p>
        </div>

        {/* Root note badge */}
        <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-slate-400">Fundamental (Tônica):</span>
          <span className="font-bold text-amber-300">{selectedChord.root} ({selectedChord.rootBrazilian})</span>
        </div>
      </div>

      {/* Omission note alert if applicable */}
      {selectedChord.omittedNotes && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-700/40 text-amber-200 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Análise de Omissão de Notas: </span>
            {selectedChord.omittedNotes.description}. No cavaquinho, é uma prática muito comum para viabilizar posições confortáveis na mão esquerda.
          </div>
        </div>
      )}

      {/* Equivalence explanation if applicable */}
      {selectedChord.equivalence && (
        <div className="mb-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/40 text-indigo-200 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-indigo-300">Equivalência Harmônica Regra: </span>
            {selectedChord.equivalence.description}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-amber-200 uppercase font-mono font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Corda</th>
              <th className="py-3 px-4">Casa</th>
              <th className="py-3 px-4">Nota Tocada</th>
              <th className="py-3 px-4">Nota no Brasil</th>
              <th className="py-3 px-4">Função Harmônica neste Acorde</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {CAVAQUINHO_STRINGS.map(stringConfig => {
              const detail = selectedChord.stringFunctions.find(
                f => f.stringNumber === stringConfig.stringNumber
              );

              return (
                <tr
                  key={stringConfig.stringNumber}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* Corda */}
                  <td className="py-3 px-4 font-semibold text-amber-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {stringConfig.label}
                  </td>

                  {/* Casa */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-300">
                    {detail ? (
                      detail.fret === 0 ? (
                        <span className="text-emerald-400">0 (Solta)</span>
                      ) : (
                        `Casa ${detail.fret}`
                      )
                    ) : (
                      <span className="text-rose-400 font-bold">X (Abafada)</span>
                    )}
                  </td>

                  {/* Nota Tocada */}
                  <td className="py-3 px-4 font-mono font-extrabold text-amber-200">
                    {detail ? detail.noteName : '-'}
                  </td>

                  {/* Nota no Brasil */}
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    {detail ? detail.brazilianName : '-'}
                  </td>

                  {/* Função Harmônica */}
                  <td className="py-3 px-4">
                    {detail ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          detail.isRoot
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : 'bg-slate-800 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {detail.role}
                      </span>
                    ) : (
                      <span className="text-slate-500">Corda não utilizada</span>
                    )}
                  </td>

                  {/* Status / Tônica Indicator */}
                  <td className="py-3 px-4 text-center">
                    {detail ? (
                      detail.isRoot ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-500 text-slate-950">
                          Tônica
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Complemento</span>
                      )
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
