import React, { useState } from 'react';
import { CHORD_PRESETS } from '../data/presets';
import { ChordPreset } from '../types';
import { X, Sparkles, Music, Check } from 'lucide-react';

interface PresetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: ChordPreset) => void;
}

export const PresetLibrary: React.FC<PresetLibraryProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', 'Samba/Pagode', 'Choro/MPB', 'Dominantes', 'Diminutos', 'Iniciante'];

  const filteredPresets = selectedCategory === 'ALL'
    ? CHORD_PRESETS
    : CHORD_PRESETS.filter(p => p.category === selectedCategory);

  return (
    <div id="modal-preset-library" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-100">Biblioteca de Formatos Prontos</h3>
              <p className="text-xs text-slate-400">
                Selecione posições clássicas de Samba, Choro e Pagode para carregar direto no braço.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'Todos os Formatos' : cat}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 scrollbar-thin scrollbar-thumb-amber-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPresets.map(preset => (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-600/60 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-lg font-black text-amber-300 font-mono">
                      {preset.cifra}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/50">
                      {preset.category}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-amber-100 mb-1">
                    {preset.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {preset.description}
                  </p>
                </div>

                {/* Frets positions badge */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Casas (4ª-1ª): <strong className="text-amber-200">[{preset.frets.map(f => f === null ? 'X' : f).join(', ')}]</strong>
                  </span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Carregar <Check className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
