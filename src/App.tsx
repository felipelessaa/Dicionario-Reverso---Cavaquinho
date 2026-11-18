import { useState, useMemo } from 'react';
import { StringState, ChordMatch, ChordPreset } from './types';
import { getPlayedNote, identifyChords } from './utils/musicTheory';
import { strumChord } from './utils/audio';
import { Header } from './components/Header';
import { CavaquinhoFretboard } from './components/CavaquinhoFretboard';
import { ChordResults } from './components/ChordResults';
import { TraditionalDictionary } from './components/TraditionalDictionary';
import { PresetLibrary } from './components/PresetLibrary';
import { TheoryGuideModal } from './components/TheoryGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reverso' | 'tradicional'>('reverso');

  // Default to classic C major shape [2, 0, 1, 2] so the app starts with an active demonstration!
  const [stringStates, setStringStates] = useState<StringState[]>([
    { stringNumber: 4, fret: 2 }, // String 4 (Ré): E
    { stringNumber: 3, fret: 0 }, // String 3 (Sol): G
    { stringNumber: 2, fret: 1 }, // String 2 (Si): C
    { stringNumber: 1, fret: 2 }, // String 1 (Ré): E
  ]);

  const [selectedChordId, setSelectedChordId] = useState<string | null>(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Compute active played notes
  const activePlayedNotes = useMemo(() => {
    return stringStates
      .filter(s => s.fret !== null)
      .map(s => getPlayedNote(s.stringNumber, s.fret as number));
  }, [stringStates]);

  // Run reverse chord identification algorithm (Aba 1)
  const matches = useMemo(() => {
    return identifyChords(activePlayedNotes);
  }, [activePlayedNotes]);

  // Unique note names string
  const uniqueNotesStr = useMemo(() => {
    const unique = Array.from(new Set(activePlayedNotes.map(n => n.noteName)));
    return unique.join(', ');
  }, [activePlayedNotes]);

  // Handler for changing a string's fret
  const handleChangeFret = (stringNumber: number, fret: number | null) => {
    setStringStates(prev =>
      prev.map(s => (s.stringNumber === stringNumber ? { ...s, fret } : s))
    );
    setSelectedChordId(null); // Reset explicit selection to auto-select primary match
  };

  // Handler for resetting neck to all open strings
  const handleResetNeck = () => {
    setStringStates([
      { stringNumber: 4, fret: 0 },
      { stringNumber: 3, fret: 0 },
      { stringNumber: 2, fret: 0 },
      { stringNumber: 1, fret: 0 },
    ]);
    setSelectedChordId(null);
  };

  // Handler for clearing all frets to muted
  const handleClearNeck = () => {
    setStringStates([
      { stringNumber: 4, fret: null },
      { stringNumber: 3, fret: null },
      { stringNumber: 2, fret: null },
      { stringNumber: 1, fret: null },
    ]);
    setSelectedChordId(null);
  };

  // Strum audio handler
  const handleStrum = () => {
    const midiNotes = activePlayedNotes.map(n => n.midiNote);
    strumChord(midiNotes);
  };

  // Handler for loading a preset chord shape
  const handleSelectPreset = (preset: ChordPreset) => {
    setStringStates([
      { stringNumber: 4, fret: preset.frets[0] },
      { stringNumber: 3, fret: preset.frets[1] },
      { stringNumber: 2, fret: preset.frets[2] },
      { stringNumber: 1, fret: preset.frets[3] },
    ]);
    setSelectedChordId(null);
    setActiveTab('reverso');
  };

  // Handler for loading a generated shape from Aba 2 onto the Aba 1 interactive fretboard
  const handleLoadGeneratedShape = (frets: [number | null, number | null, number | null, number | null]) => {
    setStringStates([
      { stringNumber: 4, fret: frets[0] },
      { stringNumber: 3, fret: frets[1] },
      { stringNumber: 2, fret: frets[2] },
      { stringNumber: 1, fret: frets[3] },
    ]);
    setSelectedChordId(null);
    setActiveTab('reverso');
  };

  const handleSelectChordMatch = (chord: ChordMatch) => {
    setSelectedChordId(chord.id);
  };

  return (
    <div id="cavaquinho-app-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onClear={handleClearNeck}
        onStrum={handleStrum}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        hasActiveNotes={activePlayedNotes.length > 0}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* Tab 1: Dicionário Reverso */}
        {activeTab === 'reverso' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Fretboard Visual */}
            <CavaquinhoFretboard
              stringStates={stringStates}
              onChangeFret={handleChangeFret}
              onReset={handleResetNeck}
            />

            {/* Reverse Chord Results and Function Table */}
            <ChordResults
              matches={matches}
              selectedChordId={selectedChordId}
              onSelectChord={handleSelectChordMatch}
              uniqueNotesStr={uniqueNotesStr}
              activeCount={activePlayedNotes.length}
            />
          </div>
        )}

        {/* Tab 2: Dicionário Tradicional Amplo */}
        {activeTab === 'tradicional' && (
          <div className="animate-fadeIn">
            <TraditionalDictionary onLoadShape={handleLoadGeneratedShape} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer id="main-footer" className="bg-slate-900/60 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} Dicionário de Cavaquinho • Estudo e Análise Harmônica
          </p>
          <p className="text-slate-400">
            Afinação Padrão: <span className="font-bold text-amber-400 font-mono">D G B D</span> (Ré, Sol, Si, Ré)
          </p>
        </div>
      </footer>

      {/* Modals */}
      <PresetLibrary
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <TheoryGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

