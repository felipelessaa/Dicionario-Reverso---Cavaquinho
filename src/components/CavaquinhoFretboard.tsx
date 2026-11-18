import React from 'react';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { StringState } from '../types';
import { CAVAQUINHO_STRINGS, getPlayedNote } from '../utils/musicTheory';
import { playNote } from '../utils/audio';

interface CavaquinhoFretboardProps {
  stringStates: StringState[];
  onChangeFret: (stringNumber: number, fret: number | null) => void;
  onReset: () => void;
}

const TOTAL_FRETS = 12;
// Fret position markers (pearl inlays)
const FRET_MARKERS = [3, 5, 7, 9, 10, 12];

export const CavaquinhoFretboard: React.FC<CavaquinhoFretboardProps> = ({
  stringStates,
  onChangeFret,
  onReset,
}) => {
  const handleFretClick = (stringNumber: number, fret: number) => {
    // If clicking same fret, option to toggle or keep
    const current = stringStates.find(s => s.stringNumber === stringNumber)?.fret;
    if (current === fret) {
      // Don't unselect completely unless user explicitly clicks mute, but clicking same fret keeps it selected
      return;
    }
    onChangeFret(stringNumber, fret);

    // Play individual note sound for immediate pitch feedback
    try {
      const note = getPlayedNote(stringNumber, fret);
      playNote(note.midiNote, 1.2);
    } catch (e) {
      console.warn('Audio feedback error:', e);
    }
  };

  const handleToggleMute = (stringNumber: number) => {
    const current = stringStates.find(s => s.stringNumber === stringNumber)?.fret;
    if (current === null) {
      onChangeFret(stringNumber, 0); // Unmute to open string
    } else {
      onChangeFret(stringNumber, null); // Mute string
    }
  };

  return (
    <div id="cavaquinho-fretboard-container" className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Title & Neck Tuning Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-amber-100 flex items-center gap-2">
            <span>Braço Virtual do Cavaquinho</span>
            <span className="text-xs font-normal text-amber-300/80 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800/40">
              Afinação: D - G - B - D (Ré, Sol, Si, Ré)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Clique na casa desejada (0 a 12) em cada corda para montar o acorde.
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-100 bg-amber-950/40 hover:bg-amber-900/50 rounded-lg border border-amber-800/30 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar Cordas Soltas</span>
        </button>
      </div>

      {/* Main Interactive Fretboard Stage */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-800 scrollbar-track-slate-900">
        <div className="min-w-[720px] max-w-full select-none">
          
          {/* Fret Numbers Header */}
          <div className="flex text-center text-xs font-mono font-semibold text-amber-300/70 mb-1 pl-32">
            {/* Open string column label */}
            <div className="w-14 text-amber-400">Solta (0)</div>
            {/* Frets 1 to 12 */}
            {Array.from({ length: TOTAL_FRETS }, (_, i) => i + 1).map(fret => (
              <div key={fret} className="flex-1 min-w-[42px] relative flex justify-center items-center">
                <span>{fret}</span>
                {FRET_MARKERS.includes(fret) && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-500/80"></span>
                )}
              </div>
            ))}
          </div>

          {/* Fretboard Body with Wood Texture Background */}
          <div className="relative bg-gradient-to-r from-amber-950 via-[#2c1810] to-amber-950 rounded-xl p-3 shadow-inner border-2 border-amber-900/60 ring-1 ring-black/80">
            
            {/* Background Position Inlay Dots */}
            <div className="absolute inset-0 pl-48 pr-2 flex pointer-events-none">
              {Array.from({ length: TOTAL_FRETS }, (_, i) => i + 1).map(fret => (
                <div key={fret} className="flex-1 flex flex-col justify-center items-center">
                  {FRET_MARKERS.includes(fret) && (
                    <div className="my-auto flex flex-col gap-1 items-center opacity-30">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-100 shadow-sm"></div>
                      {fret === 12 && <div className="w-2.5 h-2.5 rounded-full bg-amber-100 shadow-sm mt-8"></div>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Render 4 Strings (From String 4 to String 1) */}
            {CAVAQUINHO_STRINGS.map(stringConfig => {
              const currentFret = stringStates.find(s => s.stringNumber === stringConfig.stringNumber)?.fret;
              const isMuted = currentFret === null;

              // Compute note if played
              const played = !isMuted ? getPlayedNote(stringConfig.stringNumber, currentFret) : null;

              // String thickness styling (String 4 thickest -> String 1 thinnest)
              const stringHeights = {
                4: 'h-[3.5px]',
                3: 'h-[2.8px]',
                2: 'h-[2.2px]',
                1: 'h-[1.6px]',
              };

              return (
                <div
                  key={stringConfig.stringNumber}
                  className="relative flex items-center h-12 my-1 border-b border-amber-900/20 last:border-b-0"
                >
                  {/* String Label & Controls Box */}
                  <div className="w-32 flex items-center justify-between pr-2 border-r-4 border-amber-200/80 bg-slate-950/70 py-1.5 px-2 rounded-l-md shadow-sm">
                    <div>
                      <div className="text-xs font-bold text-amber-200 flex items-center gap-1">
                        <span>{stringConfig.label.split(' ')[0]}</span>
                        <span className="text-[10px] text-amber-400/80">({stringConfig.baseBrazilianName})</span>
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-slate-300">
                        {isMuted ? (
                          <span className="text-rose-400 font-bold">X Abafada</span>
                        ) : (
                          <span className="text-emerald-400">
                            {played?.noteName} ({played?.brazilianName})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mute toggle button */}
                    <button
                      onClick={() => handleToggleMute(stringConfig.stringNumber)}
                      className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                        isMuted
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-400 hover:text-amber-200'
                      }`}
                      title={isMuted ? 'Desbloquear corda' : 'Abafar corda (X)'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Steel String Visual Line */}
                  <div
                    className={`absolute left-32 right-0 top-1/2 -translate-y-1/2 ${
                      stringHeights[stringConfig.stringNumber as keyof typeof stringHeights]
                    } bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.8)] pointer-events-none z-0`}
                  />

                  {/* Fret 0 (Open String) Selector */}
                  <div className="w-14 flex justify-center items-center z-10 px-1">
                    <button
                      onClick={() => handleFretClick(stringConfig.stringNumber, 0)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all shadow-md cursor-pointer ${
                        currentFret === 0
                          ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 scale-105 font-extrabold shadow-emerald-500/40'
                          : 'bg-slate-900/90 text-slate-300 hover:bg-amber-900/60 border border-amber-700/50'
                      }`}
                      title="Corda solta (Casa 0)"
                    >
                      0
                    </button>
                  </div>

                  {/* Nut (Traste 0 / Pente de Osso) */}
                  <div className="w-1.5 h-full bg-amber-100 shadow-md border-r border-amber-300 z-10"></div>

                  {/* Frets 1 to 12 Buttons */}
                  <div className="flex-1 flex justify-between items-center z-10">
                    {Array.from({ length: TOTAL_FRETS }, (_, i) => i + 1).map(fret => {
                      const isSelected = currentFret === fret;

                      return (
                        <div
                          key={fret}
                          className="flex-1 min-w-[42px] h-full flex items-center justify-center border-r-2 border-slate-400/60 relative group"
                        >
                          <button
                            onClick={() => handleFretClick(stringConfig.stringNumber, fret)}
                            className={`w-8 h-8 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer shadow-md ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-200 scale-110 font-black shadow-amber-400/50 z-20'
                                : 'bg-slate-950/40 hover:bg-amber-600/60 text-transparent hover:text-amber-100 border border-slate-700/50 group-hover:scale-105'
                            }`}
                          >
                            <span>{isSelected ? fret : ''}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fret Markers Footer */}
          <div className="flex text-center text-[10px] font-mono text-slate-400 mt-2 pl-32">
            <div className="w-14">Osso</div>
            {Array.from({ length: TOTAL_FRETS }, (_, i) => i + 1).map(fret => (
              <div key={fret} className="flex-1 flex justify-center">
                {FRET_MARKERS.includes(fret) && (
                  <span className="px-1 py-0.5 rounded bg-slate-800 text-amber-300/80 border border-slate-700">
                    C{fret}
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
