import React, { useState } from 'react';
import { ChordMatch, MatchCategory } from '../types';
import { HarmonicFunctionTable } from './HarmonicFunctionTable';
import { Music, Check, ArrowRight, Award, ShieldAlert, Repeat } from 'lucide-react';

interface ChordResultsProps {
  matches: ChordMatch[];
  selectedChordId: string | null;
  onSelectChord: (chord: ChordMatch) => void;
  uniqueNotesStr: string;
  activeCount: number;
}

export const ChordResults: React.FC<ChordResultsProps> = ({
  matches,
  selectedChordId,
  onSelectChord,
  uniqueNotesStr,
  activeCount,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | MatchCategory>('ALL');

  if (activeCount === 0) {
    return (
      <div id="no-notes-selected" className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-8 text-center text-amber-200/70 shadow-xl backdrop-blur-md">
        <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-800/40 flex items-center justify-center mx-auto mb-3">
          <Music className="w-6 h-6 text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-amber-100 mb-1">Nenhuma Corda Selecionada</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Selecione as casas nas cordas do braço do cavaquinho acima para calcular e identificar os acordes correspondentes.
        </p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div id="no-chords-found" className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-8 text-center text-amber-200/70 shadow-xl backdrop-blur-md">
        <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/40 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-lg font-bold text-amber-100 mb-1">Acorde Não Identificado na Notação Padrão</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
          As notas tocadas <span className="text-amber-300 font-mono font-bold">({uniqueNotesStr})</span> formam uma combinação atípica ou dissonante.
        </p>
      </div>
    );
  }

  // Filter matches based on selected tab
  const filteredMatches = filterCategory === 'ALL' 
    ? matches 
    : matches.filter(m => m.category === filterCategory);

  // Selected chord object
  const activeChord = matches.find(m => m.id === selectedChordId) || matches[0];

  const counts = {
    ALL: matches.length,
    DIRECT: matches.filter(m => m.category === 'DIRECT').length,
    OMISSION: matches.filter(m => m.category === 'OMISSION').length,
    EQUIVALENCE: matches.filter(m => m.category === 'EQUIVALENCE').length,
  };

  return (
    <div id="chord-results-container" className="space-y-6">
      
      {/* Top Banner & Primary Match Card */}
      <div className="bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-950 border-2 border-amber-600/50 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                Principal Resultado Identificado
              </span>
              <span className="text-xs text-slate-400">
                Notas: <strong className="text-amber-200 font-mono">{uniqueNotesStr}</strong>
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-amber-100 tracking-tight flex items-baseline gap-3 my-2">
              <span className="text-amber-400">{activeChord.chordSymbol}</span>
              {activeChord.formattedWithBass && activeChord.formattedWithBass !== activeChord.chordSymbol && (
                <span className="text-lg text-amber-300/70 font-mono">({activeChord.formattedWithBass})</span>
              )}
            </h2>

            <p className="text-sm text-slate-300 font-medium">
              {activeChord.fullChordName}
            </p>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-amber-800/40 text-xs space-y-1.5 shrink-0 min-w-[200px]">
            <div className="text-slate-400 flex items-center justify-between">
              <span>Classificação:</span>
              <strong className="text-amber-300 font-semibold">
                {activeChord.category === 'DIRECT' && 'Acorde Completo'}
                {activeChord.category === 'OMISSION' && 'Com Omissão'}
                {activeChord.category === 'EQUIVALENCE' && 'Equivalente'}
              </strong>
            </div>

            <div className="text-slate-400 flex items-center justify-between">
              <span>Fundamental (Tônica):</span>
              <strong className="text-amber-200">{activeChord.root} ({activeChord.rootBrazilian})</strong>
            </div>

            <div className="text-slate-400 flex items-center justify-between">
              <span>Nota do Baixo:</span>
              <strong className="text-amber-200">{activeChord.bassNoteName}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Chords Selector Tabs */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-amber-100">
              Todos os Acordes Correspondentes ({matches.length})
            </h3>
            <p className="text-xs text-slate-400">
              O cavaquinho permite diversas leituras para a mesma forma no braço. Escolha uma cifra abaixo para detalhar.
            </p>
          </div>

          {/* Filter category tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterCategory === 'ALL'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              Todos ({counts.ALL})
            </button>
            <button
              onClick={() => setFilterCategory('DIRECT')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterCategory === 'DIRECT'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              Diretos ({counts.DIRECT})
            </button>
            <button
              onClick={() => setFilterCategory('OMISSION')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterCategory === 'OMISSION'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              Omissões ({counts.OMISSION})
            </button>
            <button
              onClick={() => setFilterCategory('EQUIVALENCE')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterCategory === 'EQUIVALENCE'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              Equivalentes ({counts.EQUIVALENCE})
            </button>
          </div>
        </div>

        {/* Chord Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMatches.map(match => {
            const isSelected = match.id === activeChord.id;

            return (
              <div
                key={match.id}
                onClick={() => onSelectChord(match)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-950/80 to-slate-900 border-amber-500 shadow-lg ring-1 ring-amber-500/40'
                    : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 hover:border-amber-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xl font-black text-amber-300 font-mono">
                      {match.chordSymbol}
                    </span>

                    {/* Badge */}
                    {match.category === 'DIRECT' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Completo
                      </span>
                    )}
                    {match.category === 'OMISSION' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        Sem Tônica / 5ª
                      </span>
                    )}
                    {match.category === 'EQUIVALENCE' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                        <Repeat className="w-3 h-3" /> Equivalência
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-medium line-clamp-1 mb-2">
                    {match.fullChordName}
                  </p>

                  {/* Details text */}
                  {match.omittedNotes && (
                    <p className="text-[11px] text-amber-400/90 italic bg-amber-950/40 p-1.5 rounded border border-amber-900/30">
                      {match.omittedNotes.description}
                    </p>
                  )}

                  {match.equivalence && (
                    <p className="text-[11px] text-indigo-300/90 italic bg-indigo-950/40 p-1.5 rounded border border-indigo-900/30">
                      {match.equivalence.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tônica: {match.root}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Selecionado
                      </span>
                    ) : (
                      <>
                        Ver Tabela <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Harmonic Function Table for currently selected chord match */}
      <HarmonicFunctionTable selectedChord={activeChord} />

    </div>
  );
};
