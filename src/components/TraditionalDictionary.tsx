import React, { useState, useMemo } from 'react';
import { NoteName, GeneratedShape } from '../types';
import {
  NOTE_NAMES,
  BRAZILIAN_NOTE_NAMES,
  FULL_NOTE_NAMES_PT,
  TRADITIONAL_QUALITIES,
  generateTraditionalChordShapes,
} from '../utils/musicTheory';
import { MiniFretboardDiagram } from './MiniFretboardDiagram';
import { strumChord } from '../utils/audio';
import { Search, Volume2, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface TraditionalDictionaryProps {
  onLoadShape: (frets: [number | null, number | null, number | null, number | null]) => void;
}

const ROOT_OPTIONS: { name: NoteName; label: string }[] = [
  { name: 'C', label: 'C (Dó)' },
  { name: 'C#', label: 'C# (Dó#)' },
  { name: 'Db', label: 'Db (Réb)' },
  { name: 'D', label: 'D (Ré)' },
  { name: 'D#', label: 'D# (Ré#)' },
  { name: 'Eb', label: 'Eb (Mib)' },
  { name: 'E', label: 'E (Mi)' },
  { name: 'F', label: 'F (Fá)' },
  { name: 'F#', label: 'F# (Fá#)' },
  { name: 'Gb', label: 'Gb (Solb)' },
  { name: 'G', label: 'G (Sol)' },
  { name: 'G#', label: 'G# (Sol#)' },
  { name: 'Ab', label: 'Ab (Láb)' },
  { name: 'A', label: 'A (Lá)' },
  { name: 'A#', label: 'A# (Lá#)' },
  { name: 'Bb', label: 'Bb (Sib)' },
  { name: 'B', label: 'B (Si)' },
];

export const TraditionalDictionary: React.FC<TraditionalDictionaryProps> = ({ onLoadShape }) => {
  const [selectedRoot, setSelectedRoot] = useState<NoteName>('C');
  const [selectedQualityCode, setSelectedQualityCode] = useState<string>('MAJOR_7_9'); // Default to C7M/9 for demonstration

  // Run permutation generator engine
  const generatedShapes = useMemo(() => {
    return generateTraditionalChordShapes(selectedRoot, selectedQualityCode);
  }, [selectedRoot, selectedQualityCode]);

  const currentQuality = useMemo(() => {
    return TRADITIONAL_QUALITIES.find(q => q.code === selectedQualityCode) || TRADITIONAL_QUALITIES[0];
  }, [selectedQualityCode]);

  const currentCifra = `${selectedRoot}${currentQuality.symbolSuffix}`;
  const currentFullName = `${FULL_NOTE_NAMES_PT[selectedRoot] || selectedRoot} ${currentQuality.fullNamePt}`;

  // Strum audio for a generated shape
  const handleStrumShape = (shape: GeneratedShape) => {
    strumChord(shape.midiNotes);
  };

  return (
    <div id="traditional-dictionary-section" className="space-y-6">
      {/* Search & Filter Controls Panel */}
      <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
              <Search className="w-6 h-6 text-amber-400" />
              Pesquisa Ampla de Acordes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Gere dezenas de fôrmas reais, tocáveis e otimizadas para o cavaquinho (afinação D-G-B-D).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-950/40 px-3.5 py-2 rounded-xl border border-amber-800/40 text-xs text-amber-300 self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Filtro Harmônico Ativo: Omissão de 1ª e 5ª permitida</span>
          </div>
        </div>

        {/* 2 Select Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campo 1: Tônica */}
          <div>
            <label id="label-select-root" htmlFor="select-root" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
              1. Tônica (Nota Fundamental)
            </label>
            <div className="relative">
              <select
                id="select-root"
                value={selectedRoot}
                onChange={e => setSelectedRoot(e.target.value as NoteName)}
                className="w-full bg-slate-950 border border-amber-900/60 hover:border-amber-500/60 focus:border-amber-400 text-amber-100 font-semibold py-3 px-4 rounded-xl text-sm sm:text-base transition-colors focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer appearance-none"
              >
                {ROOT_OPTIONS.map(opt => (
                  <option key={opt.name} value={opt.name} className="bg-slate-950 text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amber-400">
                ▼
              </div>
            </div>
          </div>

          {/* Campo 2: Qualidade / Tensão */}
          <div>
            <label id="label-select-quality" htmlFor="select-quality" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
              2. Qualidade & Tensões (Notação /)
            </label>
            <div className="relative">
              <select
                id="select-quality"
                value={selectedQualityCode}
                onChange={e => setSelectedQualityCode(e.target.value)}
                className="w-full bg-slate-950 border border-amber-900/60 hover:border-amber-500/60 focus:border-amber-400 text-amber-100 font-semibold py-3 px-4 rounded-xl text-sm sm:text-base transition-colors focus:ring-2 focus:ring-amber-500/20 outline-none cursor-pointer appearance-none"
              >
                {TRADITIONAL_QUALITIES.map(q => {
                  const cifraPreview = `${selectedRoot}${q.symbolSuffix}`;
                  return (
                    <option key={q.code} value={q.code} className="bg-slate-950 text-slate-100">
                      {cifraPreview} — {q.fullNamePt}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amber-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Selected Summary Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Acorde pesquisado:</span>
            <span className="text-xl font-extrabold text-amber-400 tracking-tight font-mono">
              {currentCifra}
            </span>
            <span className="text-slate-400 font-medium">({currentFullName})</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-semibold text-amber-300">
            {generatedShapes.length} {generatedShapes.length === 1 ? 'fôrma encontrada' : 'fôrmas geradas'}
          </div>
        </div>
      </div>

      {/* Shapes Output Grid */}
      {generatedShapes.length > 0 ? (
        <div id="shapes-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {generatedShapes.map((shape, idx) => {
            const fretsStr = shape.frets.join(' • ');
            const isComplete = shape.omittedDescription === 'Fôrma Completa';

            return (
              <div
                key={shape.id}
                id={`shape-card-${idx}`}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-amber-950/20 group"
              >
                {/* Card Top Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <h3 className="text-lg font-black text-amber-300 tracking-tight font-mono">
                        {shape.cifra}
                      </h3>
                    </div>

                    <div className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-amber-950/60 text-amber-200 border border-amber-800/50">
                      [ {fretsStr} ]
                    </div>
                  </div>

                  {/* Omission Tag */}
                  <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold">
                    {isComplete ? (
                      <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                        <CheckCircle2 className="w-3 h-3" />
                        {shape.omittedDescription}
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                        <AlertCircle className="w-3 h-3" />
                        {shape.omittedDescription}
                      </span>
                    )}
                  </div>

                  {/* Fretboard Diagram */}
                  <div className="my-2 flex justify-center">
                    <MiniFretboardDiagram shape={shape} />
                  </div>

                  {/* Notes & Roles breakdown list */}
                  <div className="mt-3 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 text-xs">
                    {shape.notesDetail.map((detail, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 text-[11px]">
                          {detail.stringNumber}ª Corda ({detail.fret === 0 ? 'Solta' : `${detail.fret}ª casa`})
                        </span>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="font-bold text-amber-200">{detail.brazilianName}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">
                            {detail.roleLabel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    id={`btn-strum-shape-${idx}`}
                    onClick={() => handleStrumShape(shape)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-amber-950 transition-colors cursor-pointer active:scale-95 shadow"
                    title="Ouvir o som deste formato"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir</span>
                  </button>

                  <button
                    id={`btn-load-shape-${idx}`}
                    onClick={() => onLoadShape(shape.frets)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/30 transition-colors cursor-pointer active:scale-95"
                    title="Carregar no braço interativo da Aba 1 para análise"
                  >
                    <span>No Braço</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto opacity-60" />
          <p className="text-base font-semibold text-slate-200">
            Nenhuma fôrma tocável encontrada para o acorde {currentCifra} dentro do limite físico de 4 trastes.
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Experimente selecionar outra tensão ou tônica. O algoritmo exige a presença de todas as notas essenciais (3ª e tensões).
          </p>
        </div>
      )}
    </div>
  );
};
