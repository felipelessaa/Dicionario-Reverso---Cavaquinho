import React from 'react';
import { Music, Volume2, Trash2, BookOpen, Sparkles, Search, Fingerprint } from 'lucide-react';

interface HeaderProps {
  activeTab: 'reverso' | 'tradicional';
  onSelectTab: (tab: 'reverso' | 'tradicional') => void;
  onClear: () => void;
  onStrum: () => void;
  onOpenPresets: () => void;
  onOpenGuide: () => void;
  hasActiveNotes: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onClear,
  onStrum,
  onOpenPresets,
  onOpenGuide,
  hasActiveNotes,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 border-b border-amber-950/40 text-amber-50 py-4 px-4 sm:px-6 shadow-xl sticky top-0 z-30 backdrop-blur-md bg-slate-900/95">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg ring-2 ring-amber-500/30 shrink-0">
              <Music className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-100 flex items-center gap-2">
                Dicionário de Cavaquinho
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  4 Cordas
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/70">
                Análise Harmônica Reverso • Notação Brasileira • Gerador Tradicional de Fôrmas
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Strum Sound Button */}
            {activeTab === 'reverso' && (
              <button
                id="btn-strum-audio"
                onClick={onStrum}
                disabled={!hasActiveNotes}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-md ${
                  hasActiveNotes
                    ? 'bg-amber-600 hover:bg-amber-500 text-amber-950 font-semibold shadow-amber-900/40 cursor-pointer active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
                title="Tocar som das cordas pressionadas"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir Acorde</span>
              </button>
            )}

            {/* Presets Button */}
            <button
              id="btn-open-presets"
              onClick={onOpenPresets}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/20 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Formatos Prontos</span>
            </button>

            {/* Theory Guide Button */}
            <button
              id="btn-open-guide"
              onClick={onOpenGuide}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/20 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Guia Harmônico</span>
            </button>

            {/* Clear Button (Aba 1) */}
            {activeTab === 'reverso' && (
              <button
                id="btn-clear-neck"
                onClick={onClear}
                disabled={!hasActiveNotes}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  hasActiveNotes
                    ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/50 cursor-pointer active:scale-95'
                    : 'bg-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
                }`}
                title="Limpar braço do instrumento"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-amber-900/30 self-start w-full sm:w-auto">
          <button
            id="tab-btn-reverso"
            onClick={() => onSelectTab('reverso')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'reverso'
                ? 'bg-amber-600 text-amber-950 shadow-md shadow-amber-900/30'
                : 'text-slate-400 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Aba 1: Dicionário Reverso</span>
          </button>

          <button
            id="tab-btn-tradicional"
            onClick={() => onSelectTab('tradicional')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'tradicional'
                ? 'bg-amber-600 text-amber-950 shadow-md shadow-amber-900/30'
                : 'text-slate-400 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Aba 2: Dicionário Tradicional Amplo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

