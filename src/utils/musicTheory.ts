import {
  PitchClass,
  NoteName,
  BrazilianNoteName,
  CavaquinhoStringConfig,
  PlayedNote,
  ChordMatch,
  HarmonicFunctionDetail,
  HarmonicRole,
  MatchCategory,
  EquivalenceType,
  TraditionalQualityOption,
  GeneratedShape,
} from '../types';

/**
 * Standard Cavaquinho Tuning Configuration
 * String 4 (top, thickest): Ré (D3)
 * String 3: Sol (G3)
 * String 2: Si (B3)
 * String 1 (bottom, thinnest): Ré (D4)
 */
export const CAVAQUINHO_STRINGS: CavaquinhoStringConfig[] = [
  {
    stringNumber: 4,
    label: '4ª Corda (Ré3)',
    baseNote: 'D',
    baseBrazilianName: 'Ré',
    basePitchClass: 2,
    baseMidi: 50, // D3
  },
  {
    stringNumber: 3,
    label: '3ª Corda (Sol3)',
    baseNote: 'G',
    baseBrazilianName: 'Sol',
    basePitchClass: 7,
    baseMidi: 55, // G3
  },
  {
    stringNumber: 2,
    label: '2ª Corda (Si3)',
    baseNote: 'B',
    baseBrazilianName: 'Si',
    basePitchClass: 11,
    baseMidi: 59, // B3
  },
  {
    stringNumber: 1,
    label: '1ª Corda (Ré4)',
    baseNote: 'D',
    baseBrazilianName: 'Ré',
    basePitchClass: 2,
    baseMidi: 62, // D4
  },
];

/**
 * Pitch class to Note Names mapping (0 = C / Dó)
 */
export const NOTE_NAMES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const NOTE_NAMES_ENHARMONIC: NoteName[] = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
];

export const BRAZILIAN_NOTE_NAMES: Record<NoteName, BrazilianNoteName> = {
  'C': 'Dó', 'C#': 'Dó#', 'Db': 'Réb',
  'D': 'Ré', 'D#': 'Ré#', 'Eb': 'Mib',
  'E': 'Mi',
  'F': 'Fá', 'F#': 'Fá#', 'Gb': 'Solb',
  'G': 'Sol', 'G#': 'Sol#', 'Ab': 'Láb',
  'A': 'Lá', 'A#': 'Lá#', 'Bb': 'Sib',
  'B': 'Si'
};

/**
 * Full descriptive names for roots in Brazilian Portuguese
 */
export const FULL_NOTE_NAMES_PT: Record<NoteName, string> = {
  'C': 'Dó', 'C#': 'Dó sustenido', 'Db': 'Ré bemol',
  'D': 'Ré', 'D#': 'Ré sustenido', 'Eb': 'Mi bemol',
  'E': 'Mi',
  'F': 'Fá', 'F#': 'Fá sustenido', 'Gb': 'Sol bemol',
  'G': 'Sol', 'G#': 'Sol sustenido', 'Ab': 'Lá bemol',
  'A': 'Lá', 'A#': 'Lá sustenido', 'Bb': 'Si bemol',
  'B': 'Si'
};

/**
 * Get pitch class from string number and fret
 */
export function getPlayedNote(stringNumber: number, fret: number): PlayedNote {
  const config = CAVAQUINHO_STRINGS.find(s => s.stringNumber === stringNumber);
  if (!config) {
    throw new Error(`Invalid string number: ${stringNumber}`);
  }

  const midiNote = config.baseMidi + fret;
  const pitchClass = ((config.basePitchClass + fret) % 12) as PitchClass;
  const noteName = NOTE_NAMES[pitchClass];
  const brazilianName = BRAZILIAN_NOTE_NAMES[noteName];
  const octave = Math.floor(midiNote / 12) - 1;

  return {
    stringNumber,
    fret,
    noteName,
    brazilianName,
    pitchClass,
    midiNote,
    octave,
  };
}

/**
 * Interval definitions relative to root (0..11 semitones)
 */
export const INTERVAL_FUNCTIONS: Record<number, { role: HarmonicRole; labelPt: string; abbreviation: string }> = {
  0:  { role: 'Tônica (1ª)', labelPt: 'Tônica', abbreviation: 'T' },
  1:  { role: '2ª Menor (b9)', labelPt: '9ª Menor', abbreviation: 'b9' },
  2:  { role: '2ª Maior (9ª)', labelPt: '9ª Maior', abbreviation: '9' },
  3:  { role: '3ª Menor (3m)', labelPt: '3ª Menor', abbreviation: '3m' },
  4:  { role: '3ª Maior (3M)', labelPt: '3ª Maior', abbreviation: '3M' },
  5:  { role: '4ª Justa (11ª)', labelPt: '4ª / 11ª', abbreviation: '11' },
  6:  { role: '5ª Diminuta (b5 / #11)', labelPt: '5ª Diminuta / 11ª Aum.', abbreviation: 'b5' },
  7:  { role: '5ª Justa (5J)', labelPt: '5ª Justa', abbreviation: '5J' },
  8:  { role: '5ª Aumentada (b13 / #5)', labelPt: '5ª Aumentada / 13ª Menor', abbreviation: '5+' },
  9:  { role: '6ª Maior (13ª)', labelPt: '6ª Maior / 13ª', abbreviation: '13' },
  10: { role: '7ª Menor (7m)', labelPt: '7ª Menor', abbreviation: '7m' },
  11: { role: '7ª Maior (7M)', labelPt: '7ª Maior', abbreviation: '7M' },
};

/**
 * Formula definition for chords
 */
interface ChordFormula {
  code: string;
  symbolSuffix: string; // Base suffix like "", "m", "7M", "7", "m7"
  tensionSuffixes?: string[]; // e.g. ["9"], ["b5"], ["9", "13"]
  fullNamePt: string;
  requiredIntervals: number[]; // Must have these or valid omissions
  optionalIntervals: number[]; // Can have these (e.g., 5J)
  essentialTones: number[]; // Characterizing tones (e.g. 3m and 7m for m7)
  categoryPriority: number;
}

/**
 * Standard Chord Formulas Library
 */
const CHORD_FORMULAS: ChordFormula[] = [
  // Triads
  {
    code: 'MAJOR',
    symbolSuffix: '',
    fullNamePt: 'Maior',
    requiredIntervals: [0, 4, 7],
    optionalIntervals: [7], // 5th can be omitted
    essentialTones: [4],
    categoryPriority: 100,
  },
  {
    code: 'MINOR',
    symbolSuffix: 'm',
    fullNamePt: 'Menor',
    requiredIntervals: [0, 3, 7],
    optionalIntervals: [7],
    essentialTones: [3],
    categoryPriority: 100,
  },
  {
    code: 'DIMINISHED_TRIAD',
    symbolSuffix: 'dim',
    fullNamePt: 'Diminuto (Tríade)',
    requiredIntervals: [0, 3, 6],
    optionalIntervals: [],
    essentialTones: [3, 6],
    categoryPriority: 90,
  },
  {
    code: 'AUGMENTED',
    symbolSuffix: '5+',
    fullNamePt: 'Aumentado (5+)',
    requiredIntervals: [0, 4, 8],
    optionalIntervals: [],
    essentialTones: [4, 8],
    categoryPriority: 90,
  },
  {
    code: 'MINOR_AUGMENTED',
    symbolSuffix: 'm5+',
    fullNamePt: 'Menor com 5ª Aumentada (m5+)',
    requiredIntervals: [0, 3, 8],
    optionalIntervals: [],
    essentialTones: [3, 8],
    categoryPriority: 90,
  },
  {
    code: 'SUS4',
    symbolSuffix: 'sus4',
    fullNamePt: 'Suspenso 4',
    requiredIntervals: [0, 5, 7],
    optionalIntervals: [7],
    essentialTones: [5],
    categoryPriority: 85,
  },
  {
    code: 'SUS2',
    symbolSuffix: 'sus2',
    fullNamePt: 'Suspenso 2',
    requiredIntervals: [0, 2, 7],
    optionalIntervals: [7],
    essentialTones: [2],
    categoryPriority: 85,
  },

  // Add9 Chords (Triad + 9th without 7th: Cadd9 / C(9) = C, E, G, D)
  {
    code: 'MAJOR_ADD9',
    symbolSuffix: '(9)',
    fullNamePt: 'Maior com Nona Adicionada (Cadd9 / C(9))',
    requiredIntervals: [0, 4, 7, 2],
    optionalIntervals: [0, 7],
    essentialTones: [4, 2],
    categoryPriority: 97,
  },
  {
    code: 'MINOR_ADD9',
    symbolSuffix: 'm(9)',
    fullNamePt: 'Menor com Nona Adicionada (Cmadd9 / Cm(9))',
    requiredIntervals: [0, 3, 7, 2],
    optionalIntervals: [0, 7],
    essentialTones: [3, 2],
    categoryPriority: 97,
  },

  // 6ths
  {
    code: 'MAJOR_6',
    symbolSuffix: '6',
    fullNamePt: 'Maior com Sexta',
    requiredIntervals: [0, 4, 7, 9],
    optionalIntervals: [7],
    essentialTones: [4, 9],
    categoryPriority: 95,
  },
  {
    code: 'MINOR_6',
    symbolSuffix: 'm6',
    fullNamePt: 'Menor com Sexta',
    requiredIntervals: [0, 3, 7, 9],
    optionalIntervals: [7],
    essentialTones: [3, 9],
    categoryPriority: 95,
  },
  {
    code: 'SIX_NINE',
    symbolSuffix: '6',
    tensionSuffixes: ['9'],
    fullNamePt: 'com Sexta e Nona',
    requiredIntervals: [0, 4, 7, 9, 2],
    optionalIntervals: [7, 0],
    essentialTones: [4, 9, 2],
    categoryPriority: 92,
  },
  {
    code: 'MINOR_SIX_NINE',
    symbolSuffix: 'm6',
    tensionSuffixes: ['9'],
    fullNamePt: 'Menor com Sexta e Nona',
    requiredIntervals: [0, 3, 7, 9, 2],
    optionalIntervals: [7, 0],
    essentialTones: [3, 9, 2],
    categoryPriority: 92,
  },

  // 7th Chords
  {
    code: 'MAJOR_7',
    symbolSuffix: '7M',
    fullNamePt: 'Maior com Sétima Maior',
    requiredIntervals: [0, 4, 7, 11],
    optionalIntervals: [7],
    essentialTones: [4, 11],
    categoryPriority: 98,
  },
  {
    code: 'DOMINANT_7',
    symbolSuffix: '7',
    fullNamePt: 'com Sétima',
    requiredIntervals: [0, 4, 7, 10],
    optionalIntervals: [7],
    essentialTones: [4, 10],
    categoryPriority: 98,
  },
  {
    code: 'MINOR_7',
    symbolSuffix: 'm7',
    fullNamePt: 'Menor com Sétima',
    requiredIntervals: [0, 3, 7, 10],
    optionalIntervals: [7],
    essentialTones: [3, 10],
    categoryPriority: 98,
  },
  {
    code: 'HALF_DIMINISHED',
    symbolSuffix: 'm7',
    tensionSuffixes: ['b5'],
    fullNamePt: 'Meio Diminuto (m7/b5)',
    requiredIntervals: [0, 3, 6, 10],
    optionalIntervals: [0], // root can be rootless
    essentialTones: [3, 6, 10],
    categoryPriority: 96,
  },
  {
    code: 'DIMINISHED_7',
    symbolSuffix: '°',
    fullNamePt: 'Diminuto',
    requiredIntervals: [0, 3, 6, 9],
    optionalIntervals: [],
    essentialTones: [0, 3, 6, 9],
    categoryPriority: 96,
  },
  {
    code: 'MINOR_MAJOR_7',
    symbolSuffix: 'm7M',
    fullNamePt: 'Menor com Sétima Maior',
    requiredIntervals: [0, 3, 7, 11],
    optionalIntervals: [7],
    essentialTones: [3, 11],
    categoryPriority: 90,
  },
  {
    code: 'DOMINANT_7_FLAT5',
    symbolSuffix: '7',
    tensionSuffixes: ['b5'],
    fullNamePt: 'Dominante com Quinta Diminuta (7/b5)',
    requiredIntervals: [0, 4, 6, 10],
    optionalIntervals: [],
    essentialTones: [4, 6, 10],
    categoryPriority: 92,
  },

  // 9th Chords with Slash Format
  {
    code: 'DOMINANT_9',
    symbolSuffix: '7',
    tensionSuffixes: ['9'],
    fullNamePt: 'com Sétima e Nona (7/9)',
    requiredIntervals: [0, 4, 7, 10, 2],
    optionalIntervals: [0, 7],
    essentialTones: [4, 10, 2],
    categoryPriority: 94,
  },
  {
    code: 'MINOR_9',
    symbolSuffix: 'm7',
    tensionSuffixes: ['9'],
    fullNamePt: 'Menor com Sétima e Nona (m7/9)',
    requiredIntervals: [0, 3, 7, 10, 2],
    optionalIntervals: [0, 7],
    essentialTones: [3, 10, 2],
    categoryPriority: 94,
  },
  {
    code: 'MAJOR_7_9',
    symbolSuffix: '7M',
    tensionSuffixes: ['9'],
    fullNamePt: 'Maior com Sétima e Nona (7M/9)',
    requiredIntervals: [0, 4, 7, 11, 2],
    optionalIntervals: [0, 7],
    essentialTones: [4, 11, 2],
    categoryPriority: 94,
  },
  {
    code: 'DOMINANT_7_FLAT9',
    symbolSuffix: '7',
    tensionSuffixes: ['b9'],
    fullNamePt: 'com Sétima e Nona Menor (7/b9)',
    requiredIntervals: [0, 4, 7, 10, 1],
    optionalIntervals: [0, 7, 10],
    essentialTones: [4, 1],
    categoryPriority: 94,
  },
  {
    code: 'MINOR_7_FLAT9',
    symbolSuffix: 'm7',
    tensionSuffixes: ['b9'],
    fullNamePt: 'Menor com Sétima e Nona Menor (m7/b9)',
    requiredIntervals: [0, 3, 7, 10, 1],
    optionalIntervals: [0, 7, 10],
    essentialTones: [3, 1],
    categoryPriority: 94,
  },
  {
    code: 'DOMINANT_7_SHARP9',
    symbolSuffix: '7',
    tensionSuffixes: ['#9'],
    fullNamePt: 'com Sétima e Nona Aumentada (7/#9)',
    requiredIntervals: [0, 4, 7, 10, 3],
    optionalIntervals: [0, 7, 10],
    essentialTones: [4, 3],
    categoryPriority: 94,
  },

  // 11th & 13th Chords (Allowing 5th & 7th Omissions)
  {
    code: 'MINOR_11',
    symbolSuffix: 'm7',
    tensionSuffixes: ['11'],
    fullNamePt: 'Menor com Sétima e 11ª',
    requiredIntervals: [0, 3, 7, 10, 5],
    optionalIntervals: [0, 7, 10, 2],
    essentialTones: [3, 5],
    categoryPriority: 92,
  },
  {
    code: 'MINOR_11_FLAT9',
    symbolSuffix: 'm11',
    tensionSuffixes: ['b9'],
    fullNamePt: 'Menor com Décima Primeira e Nona Menor',
    requiredIntervals: [0, 3, 7, 10, 5, 1],
    optionalIntervals: [0, 7, 10],
    essentialTones: [3, 5, 1],
    categoryPriority: 93,
  },
  {
    code: 'DOMINANT_11',
    symbolSuffix: '7',
    tensionSuffixes: ['11'],
    fullNamePt: 'com Sétima e Décima Primeira',
    requiredIntervals: [0, 4, 7, 10, 5],
    optionalIntervals: [0, 7, 10, 2],
    essentialTones: [4, 5],
    categoryPriority: 91,
  },
  {
    code: 'DOMINANT_13',
    symbolSuffix: '7',
    tensionSuffixes: ['13'],
    fullNamePt: 'com Sétima e Décima Terceira',
    requiredIntervals: [0, 4, 7, 10, 9],
    optionalIntervals: [0, 7, 10, 2],
    essentialTones: [4, 9],
    categoryPriority: 92,
  },
  {
    code: 'MINOR_13',
    symbolSuffix: 'm7',
    tensionSuffixes: ['13'],
    fullNamePt: 'Menor com Sétima e 13ª',
    requiredIntervals: [0, 3, 7, 10, 9],
    optionalIntervals: [0, 7, 10, 2],
    essentialTones: [3, 9],
    categoryPriority: 91,
  },
  {
    code: 'DOMINANT_7_FLAT13',
    symbolSuffix: '7',
    tensionSuffixes: ['b13'],
    fullNamePt: 'com Sétima e 13ª Menor (7/b13)',
    requiredIntervals: [0, 4, 7, 10, 8],
    optionalIntervals: [0, 7, 10],
    essentialTones: [4, 8],
    categoryPriority: 92,
  },
  {
    code: 'DOMINANT_7_9_13',
    symbolSuffix: '7',
    tensionSuffixes: ['9', '13'],
    fullNamePt: 'com Sétima, Nona e 13ª',
    requiredIntervals: [0, 4, 7, 10, 2, 9],
    optionalIntervals: [0, 7, 10],
    essentialTones: [4, 2, 9],
    categoryPriority: 90,
  },
  {
    code: 'DOMINANT_7_FLAT9_FLAT13',
    symbolSuffix: '7',
    tensionSuffixes: ['b9', 'b13'],
    fullNamePt: 'com 7ª, b9 e b13',
    requiredIntervals: [0, 4, 7, 10, 1, 8],
    optionalIntervals: [0, 7, 10],
    essentialTones: [4, 1, 8],
    categoryPriority: 90,
  },
  {
    code: 'MAJOR_7_SHARP11',
    symbolSuffix: '7M',
    tensionSuffixes: ['#11'],
    fullNamePt: 'Maior com Sétima e #11',
    requiredIntervals: [0, 4, 7, 11, 6],
    optionalIntervals: [0, 7, 11],
    essentialTones: [4, 6],
    categoryPriority: 90,
  },
  {
    code: 'DOMINANT_7_SHARP11',
    symbolSuffix: '7',
    tensionSuffixes: ['#11'],
    fullNamePt: 'com Sétima e #11',
    requiredIntervals: [0, 4, 7, 10, 6],
    optionalIntervals: [0, 7, 10],
    essentialTones: [4, 6],
    categoryPriority: 90,
  },
  {
    code: 'DOMINANT_7_SUS4',
    symbolSuffix: '7sus4',
    fullNamePt: 'com Sétima e Quarta Suspensa',
    requiredIntervals: [0, 5, 7, 10],
    optionalIntervals: [0, 7],
    essentialTones: [5, 10],
    categoryPriority: 88,
  },
];

/**
 * Format chord symbol using Brazilian Cifra rules with slash (`/`) separation for tensions
 * Prompt requirement #2:
 * - Major triads: C, D, E (just letter)
 * - Tensions / alterations separated by `/`: e.g. Cm7/9, C7M/9, Cm7/b5, C7/b9, C6/9
 */
export function formatBrazilianCifra(root: NoteName, symbolSuffix: string, tensionSuffixes?: string[]): string {
  let base = `${root}${symbolSuffix}`;
  if (!tensionSuffixes || tensionSuffixes.length === 0) {
    return base;
  }
  const tensionsFormatted = tensionSuffixes.join('/');
  return `${base}/${tensionsFormatted}`;
}

/**
 * Main reverse dictionary algorithm to identify chords from played notes
 */
export function identifyChords(playedNotes: PlayedNote[]): ChordMatch[] {
  // If no notes played, return empty
  const activeNotes = playedNotes.filter(n => n.fret !== null);
  if (activeNotes.length === 0) {
    return [];
  }

  // Find lowest sounding note (Bass note)
  const sortedByMidi = [...activeNotes].sort((a, b) => a.midiNote - b.midiNote);
  const bassNote = sortedByMidi[0];

  // Extract unique pitch classes (0..11)
  const uniquePitchClasses = Array.from(new Set(activeNotes.map(n => n.pitchClass)));

  const matchesMap = new Map<string, ChordMatch>();

  // Evaluate candidate roots across all 12 chromatic notes
  for (let rootIndex = 0; rootIndex < 12; rootIndex++) {
    const candidateRootNote = NOTE_NAMES[rootIndex];
    const candidateRootPt = BRAZILIAN_NOTE_NAMES[candidateRootNote];

    // Compute intervals of all played pitches relative to candidate root
    const playedIntervals = uniquePitchClasses.map(p => (p - rootIndex + 12) % 12);

    for (const formula of CHORD_FORMULAS) {
      // Check if all played intervals are valid members of the formula
      const allFormulaIntervals = [...formula.requiredIntervals, ...formula.optionalIntervals];
      
      const containsInvalidInterval = playedIntervals.some(inv => !allFormulaIntervals.includes(inv));
      if (containsInvalidInterval) {
        continue;
      }

      // Check essential tones
      const hasEssentialTones = formula.essentialTones.every(inv => playedIntervals.includes(inv));
      if (!hasEssentialTones) {
        continue;
      }

      // Determine omissions
      const rootPresent = playedIntervals.includes(0);
      const fifthPresent = playedIntervals.includes(7) || formula.requiredIntervals.includes(6) || formula.requiredIntervals.includes(8);
      
      const hasSeventhInFormula = formula.requiredIntervals.includes(10) || formula.requiredIntervals.includes(11);
      const seventhPresent = playedIntervals.includes(10) || playedIntervals.includes(11);

      const rootOmitted = !rootPresent;
      const fifthOmitted = formula.requiredIntervals.includes(7) && !fifthPresent;
      const seventhOmitted = hasSeventhInFormula && !seventhPresent;

      // Determine Match Category
      let category: MatchCategory = 'DIRECT';
      let matchScore = formula.categoryPriority;

      let omittedDescription = '';
      const omittedNoteNames: NoteName[] = [];

      if (rootOmitted || fifthOmitted || seventhOmitted) {
        category = 'OMISSION';
        matchScore -= (rootOmitted ? 10 : 0) + (fifthOmitted ? 5 : 0) + (seventhOmitted ? 3 : 0);
        
        const omissionsText: string[] = [];
        if (rootOmitted) {
          omissionsText.push(`Tônica '${candidateRootNote}' omitida`);
          omittedNoteNames.push(candidateRootNote);
        }
        if (fifthOmitted) {
          const fifthNoteName = NOTE_NAMES[(rootIndex + 7) % 12];
          omissionsText.push(`5ª '${fifthNoteName}' omitida`);
          omittedNoteNames.push(fifthNoteName);
        }
        if (seventhOmitted) {
          const seventhInterval = formula.requiredIntervals.includes(11) ? 11 : 10;
          const seventhNoteName = NOTE_NAMES[(rootIndex + seventhInterval) % 12];
          omissionsText.push(`7ª '${seventhNoteName}' omitida`);
          omittedNoteNames.push(seventhNoteName);
        }
        omittedDescription = omissionsText.join(' e ');
      }

      // Format Brazilian Cifra
      const cifrasSymbol = formatBrazilianCifra(candidateRootNote, formula.symbolSuffix, formula.tensionSuffixes);
      
      // Calculate string harmonic roles
      const stringFunctions = computeStringFunctions(activeNotes, rootIndex);

      // Check bass note relation
      const isRootInBass = bassNote.pitchClass === rootIndex;
      const formattedWithBass = isRootInBass 
        ? cifrasSymbol 
        : `${cifrasSymbol}/${bassNote.noteName}`;

      const matchId = `${cifrasSymbol}_root${candidateRootNote}_cat${category}`;

      if (!matchesMap.has(matchId)) {
        matchesMap.set(matchId, {
          id: matchId,
          root: candidateRootNote,
          rootBrazilian: candidateRootPt,
          chordSymbol: cifrasSymbol,
          fullChordName: `${FULL_NOTE_NAMES_PT[candidateRootNote]} ${formula.fullNamePt}`,
          category,
          matchScore,
          omittedNotes: (rootOmitted || fifthOmitted || seventhOmitted) ? {
            rootOmitted,
            fifthOmitted,
            omittedNoteNames,
            description: omittedDescription,
          } : undefined,
          stringFunctions,
          bassNoteName: bassNote.noteName,
          isRootInBass,
          formattedWithBass,
        });
      }
    }
  }

  // Convert matches map to array
  let results = Array.from(matchesMap.values());

  // Deduplicate and process Functional Equivalences (#4 in prompt requirements)
  results = processHarmonicEquivalences(results, uniquePitchClasses, activeNotes, bassNote.noteName);

  // Sort by score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}

/**
 * Process explicit equivalence rules from Prompt Requirement #4:
 * 1. Tensões Enarmônicas: 6 = 13; 4 = 11; b5 = #11; #5 = b13.
 * 2. Diminutos (°): C° = Eb° = Gb° = A° (equivalência a cada 1,5 tom)
 * 3. Meio Diminutos e Menor com 6ª: m7/b5 equivale a m6 uma terça menor acima (ex: Em7/b5 = Gm6)
 * 4. Dominantes 7/b5: separados por trítono (3 tons) compartilham mesma forma (ex: C7/b5 = F#7/b5)
 * 5. Menor com 7ª e Maior com 6ª: m7 equivale a Maior com 6ª formado uma terça menor acima (ex: F#m7 = A6)
 */
function processHarmonicEquivalences(
  existingMatches: ChordMatch[],
  uniquePitches: number[],
  activeNotes: PlayedNote[],
  bassNoteName: NoteName
): ChordMatch[] {
  const finalMatches = [...existingMatches];

  existingMatches.forEach(match => {
    // 1. Half-diminished to Minor 6th (m7/b5 = m6 3 semitones above)
    // E.g., Em7/b5 (E=root) -> Gm6 (G=root, 3 semitones above E)
    if (match.chordSymbol.includes('m7/b5')) {
      const rootIndex = NOTE_NAMES.indexOf(match.root);
      const m6RootIndex = (rootIndex + 3) % 12;
      const m6RootNote = NOTE_NAMES[m6RootIndex];
      const m6Symbol = `${m6RootNote}m6`;

      if (!finalMatches.some(m => m.chordSymbol === m6Symbol)) {
        finalMatches.push({
          id: `eq_m6_${m6Symbol}`,
          root: m6RootNote,
          rootBrazilian: BRAZILIAN_NOTE_NAMES[m6RootNote],
          chordSymbol: m6Symbol,
          fullChordName: `${FULL_NOTE_NAMES_PT[m6RootNote]} menor com sexta (Equivalente)`,
          category: 'EQUIVALENCE',
          matchScore: match.matchScore - 2,
          equivalence: {
            type: 'HALF_DIM_TO_MINOR_6TH',
            originalChordSymbol: match.chordSymbol,
            description: `Equivalência Harmônica: O acorde ${match.chordSymbol} possui as mesmas notas do ${m6Symbol} (formado uma terça menor acima).`,
          },
          stringFunctions: computeStringFunctions(activeNotes, m6RootIndex),
          bassNoteName,
          isRootInBass: bassNoteName === m6RootNote,
          formattedWithBass: bassNoteName === m6RootNote ? m6Symbol : `${m6Symbol}/${bassNoteName}`,
        });
      }
    }

    // 2. Minor 7th to Major 6th (m7 = 6th a minor 3rd above)
    // E.g., F#m7 -> A6 (A is 3 semitones above F#)
    if (match.chordSymbol.endsWith('m7') && !match.chordSymbol.includes('b5')) {
      const rootIndex = NOTE_NAMES.indexOf(match.root);
      const maj6RootIndex = (rootIndex + 3) % 12;
      const maj6RootNote = NOTE_NAMES[maj6RootIndex];
      const maj6Symbol = `${maj6RootNote}6`;

      if (!finalMatches.some(m => m.chordSymbol === maj6Symbol)) {
        finalMatches.push({
          id: `eq_maj6_${maj6Symbol}`,
          root: maj6RootNote,
          rootBrazilian: BRAZILIAN_NOTE_NAMES[maj6RootNote],
          chordSymbol: maj6Symbol,
          fullChordName: `${FULL_NOTE_NAMES_PT[maj6RootNote]} maior com sexta (Equivalente)`,
          category: 'EQUIVALENCE',
          matchScore: match.matchScore - 3,
          equivalence: {
            type: 'MINOR_7TH_TO_MAJOR_6TH',
            originalChordSymbol: match.chordSymbol,
            description: `Equivalência Relativa: Um acorde ${match.chordSymbol} é simétrico ao ${maj6Symbol} (formado uma terça menor acima).`,
          },
          stringFunctions: computeStringFunctions(activeNotes, maj6RootIndex),
          bassNoteName,
          isRootInBass: bassNoteName === maj6RootNote,
          formattedWithBass: bassNoteName === maj6RootNote ? maj6Symbol : `${maj6Symbol}/${bassNoteName}`,
        });
      }
    }

    // 3. Dominant 7/b5 Tritone Swap (C7/b5 = F#7/b5)
    if (match.chordSymbol.includes('7/b5')) {
      const rootIndex = NOTE_NAMES.indexOf(match.root);
      const tritoneRootIndex = (rootIndex + 6) % 12;
      const tritoneRootNote = NOTE_NAMES[tritoneRootIndex];
      const tritoneSymbol = `${tritoneRootNote}7/b5`;

      if (!finalMatches.some(m => m.chordSymbol === tritoneSymbol)) {
        finalMatches.push({
          id: `eq_tritone_${tritoneSymbol}`,
          root: tritoneRootNote,
          rootBrazilian: BRAZILIAN_NOTE_NAMES[tritoneRootNote],
          chordSymbol: tritoneSymbol,
          fullChordName: `${FULL_NOTE_NAMES_PT[tritoneRootNote]} sete com quinta diminuta (Equivalência por Trítono)`,
          category: 'EQUIVALENCE',
          matchScore: match.matchScore - 1,
          equivalence: {
            type: 'TRITONE_DOMINANT_7B5',
            originalChordSymbol: match.chordSymbol,
            description: `Substituição por Trítono: Os acordes 7/b5 a uma distância de trítono (${match.chordSymbol} e ${tritoneSymbol}) compartilham a exata mesma forma de notas.`,
          },
          stringFunctions: computeStringFunctions(activeNotes, tritoneRootIndex),
          bassNoteName,
          isRootInBass: bassNoteName === tritoneRootNote,
          formattedWithBass: bassNoteName === tritoneRootNote ? tritoneSymbol : `${tritoneSymbol}/${bassNoteName}`,
        });
      }
    }

    // 4. Diminished 7th Symmetry (°): C° = Eb° = Gb° = A° (every 3 semitones)
    if (match.chordSymbol.endsWith('°') || match.chordSymbol.endsWith('dim')) {
      const rootIndex = NOTE_NAMES.indexOf(match.root);
      [3, 6, 9].forEach(shift => {
        const dimRootIndex = (rootIndex + shift) % 12;
        const dimRootNote = NOTE_NAMES[dimRootIndex];
        const dimSymbol = `${dimRootNote}°`;

        if (!finalMatches.some(m => m.chordSymbol === dimSymbol)) {
          finalMatches.push({
            id: `eq_dim_${dimSymbol}`,
            root: dimRootNote,
            rootBrazilian: BRAZILIAN_NOTE_NAMES[dimRootNote],
            chordSymbol: dimSymbol,
            fullChordName: `${FULL_NOTE_NAMES_PT[dimRootNote]} diminuto (Inversão Enarmônica)`,
            category: 'EQUIVALENCE',
            matchScore: match.matchScore - 1,
            equivalence: {
              type: 'DIMINISHED_SYMMETRY',
              originalChordSymbol: match.chordSymbol,
              description: `Simetria Diminuta: Os acordes diminutos (° ) são totalmente simétricos a cada 1,5 tom (${match.chordSymbol} = ${dimSymbol}).`,
            },
            stringFunctions: computeStringFunctions(activeNotes, dimRootIndex),
            bassNoteName,
            isRootInBass: bassNoteName === dimRootNote,
            formattedWithBass: bassNoteName === dimRootNote ? dimSymbol : `${dimSymbol}/${bassNoteName}`,
          });
        }
      });
    }
  });

  return finalMatches;
}

/**
 * Compute detailed string harmonic functions for each played string relative to root index
 */
export function computeStringFunctions(activeNotes: PlayedNote[], rootIndex: number): HarmonicFunctionDetail[] {
  return activeNotes.map(note => {
    const intervalSemitones = (note.pitchClass - rootIndex + 12) % 12;
    const intervalInfo = INTERVAL_FUNCTIONS[intervalSemitones];
    
    return {
      stringNumber: note.stringNumber,
      fret: note.fret,
      noteName: note.noteName,
      brazilianName: note.brazilianName,
      midiNote: note.midiNote,
      role: intervalInfo.role,
      intervalSemitones,
      isRoot: intervalSemitones === 0,
    };
  });
}

/**
 * Traditional Chord Generator Quality Definitions (Aba 2)
 */
export const TRADITIONAL_QUALITIES: TraditionalQualityOption[] = [
  {
    code: 'MAJOR',
    symbolSuffix: '',
    fullNamePt: 'Maior',
    requiredIntervals: [0, 4, 7],
    optionalIntervals: [0, 7],
    essentialTones: [4],
  },
  {
    code: 'MAJOR_ADD9',
    symbolSuffix: '(9)',
    fullNamePt: 'Maior com Nona Adicionada (Cadd9 / C(9))',
    requiredIntervals: [0, 4, 7, 2],
    optionalIntervals: [0, 7],
    essentialTones: [4, 2],
  },
  {
    code: 'MINOR',
    symbolSuffix: 'm',
    fullNamePt: 'Menor',
    requiredIntervals: [0, 3, 7],
    optionalIntervals: [0, 7],
    essentialTones: [3],
  },
  {
    code: 'MINOR_ADD9',
    symbolSuffix: 'm(9)',
    fullNamePt: 'Menor com Nona Adicionada (Cmadd9 / Cm(9))',
    requiredIntervals: [0, 3, 7, 2],
    optionalIntervals: [0, 7],
    essentialTones: [3, 2],
  },
  {
    code: 'DOMINANT_7',
    symbolSuffix: '7',
    fullNamePt: 'Dominante (7ª Menor)',
    requiredIntervals: [0, 4, 7, 10],
    optionalIntervals: [0, 7],
    essentialTones: [4, 10],
  },
  {
    code: 'MAJOR_7',
    symbolSuffix: '7M',
    fullNamePt: 'Maior com 7ª Maior',
    requiredIntervals: [0, 4, 7, 11],
    optionalIntervals: [0, 7],
    essentialTones: [4, 11],
  },
  {
    code: 'MINOR_7',
    symbolSuffix: 'm7',
    fullNamePt: 'Menor com Sétima',
    requiredIntervals: [0, 3, 7, 10],
    optionalIntervals: [0, 7],
    essentialTones: [3, 10],
  },
  {
    code: 'HALF_DIMINISHED',
    symbolSuffix: 'm7/b5',
    fullNamePt: 'Meio-Diminuto (m7/b5)',
    requiredIntervals: [0, 3, 6, 10],
    optionalIntervals: [0],
    essentialTones: [3, 6, 10],
  },
  {
    code: 'DIMINISHED',
    symbolSuffix: 'dim',
    fullNamePt: 'Diminuto (°)',
    requiredIntervals: [0, 3, 6, 9],
    optionalIntervals: [0],
    essentialTones: [3, 6, 9],
  },
  {
    code: 'MAJOR_6',
    symbolSuffix: '6',
    fullNamePt: 'Maior com Sexta',
    requiredIntervals: [0, 4, 7, 9],
    optionalIntervals: [0, 7],
    essentialTones: [4, 9],
  },
  {
    code: 'MINOR_6',
    symbolSuffix: 'm6',
    fullNamePt: 'Menor com Sexta',
    requiredIntervals: [0, 3, 7, 9],
    optionalIntervals: [0, 7],
    essentialTones: [3, 9],
  },
  {
    code: 'MAJOR_6_9',
    symbolSuffix: '6/9',
    fullNamePt: 'Maior com 6ª e Nona',
    requiredIntervals: [0, 4, 7, 9, 2],
    optionalIntervals: [0, 7],
    essentialTones: [4, 9, 2],
  },
  {
    code: 'MINOR_6_9',
    symbolSuffix: 'm6/9',
    fullNamePt: 'Menor com 6ª e Nona',
    requiredIntervals: [0, 3, 7, 9, 2],
    optionalIntervals: [0, 7],
    essentialTones: [3, 9, 2],
  },
  {
    code: 'DOMINANT_9',
    symbolSuffix: '7/9',
    fullNamePt: 'Dominante com Nona (7/9)',
    requiredIntervals: [0, 4, 7, 10, 2],
    optionalIntervals: [0, 7],
    essentialTones: [4, 10, 2],
  },
  {
    code: 'MINOR_7_9',
    symbolSuffix: 'm7/9',
    fullNamePt: 'Menor com Sétima e Nona (m7/9)',
    requiredIntervals: [0, 3, 7, 10, 2],
    optionalIntervals: [0, 7],
    essentialTones: [3, 10, 2],
  },
  {
    code: 'MAJOR_7_9',
    symbolSuffix: '7M/9',
    fullNamePt: 'Maior com Sétima e Nona (7M/9)',
    requiredIntervals: [0, 4, 7, 11, 2],
    optionalIntervals: [0, 7],
    essentialTones: [4, 11, 2],
  },
  {
    code: 'DOMINANT_FLAT9',
    symbolSuffix: '7/b9',
    fullNamePt: 'Dominante com Nona Menor (7/b9)',
    requiredIntervals: [0, 4, 7, 10, 1],
    optionalIntervals: [0, 7],
    essentialTones: [4, 10, 1],
  },
  {
    code: 'DOMINANT_SHARP9',
    symbolSuffix: '7/#9',
    fullNamePt: 'Dominante com Nona Aumentada (7/#9)',
    requiredIntervals: [0, 4, 7, 10, 3],
    optionalIntervals: [0, 7],
    essentialTones: [4, 10, 3],
  },
  {
    code: 'DOMINANT_13',
    symbolSuffix: '7/13',
    fullNamePt: 'Dominante com 13ª (7/13)',
    requiredIntervals: [0, 4, 7, 10, 9],
    optionalIntervals: [0, 7, 2],
    essentialTones: [4, 10, 9],
  },
  {
    code: 'DOMINANT_FLAT13',
    symbolSuffix: '7/b13',
    fullNamePt: 'Dominante com 13ª Menor (7/b13)',
    requiredIntervals: [0, 4, 7, 10, 8],
    optionalIntervals: [0, 7],
    essentialTones: [4, 10, 8],
  },
  {
    code: 'DOMINANT_FLAT5',
    symbolSuffix: '7/b5',
    fullNamePt: 'Dominante com Quinta Diminuta (7/b5)',
    requiredIntervals: [0, 4, 6, 10],
    optionalIntervals: [0],
    essentialTones: [4, 6, 10],
  },
  {
    code: 'DOMINANT_SHARP11',
    symbolSuffix: '7/#11',
    fullNamePt: 'Dominante com 11ª Aumentada (7/#11)',
    requiredIntervals: [0, 4, 7, 10, 6],
    optionalIntervals: [0, 7],
    essentialTones: [4, 10, 6],
  },
  {
    code: 'MINOR_11',
    symbolSuffix: 'm11',
    fullNamePt: 'Menor com 11ª (m11)',
    requiredIntervals: [0, 3, 7, 10, 5],
    optionalIntervals: [0, 7, 2],
    essentialTones: [3, 5],
  },
  {
    code: 'DOMINANT_7SUS4',
    symbolSuffix: '7sus4',
    fullNamePt: 'Dominante com 4ª Suspensa (7sus4)',
    requiredIntervals: [0, 5, 7, 10],
    optionalIntervals: [0, 7],
    essentialTones: [5, 10],
  },
  {
    code: 'SUS4',
    symbolSuffix: 'sus4',
    fullNamePt: 'Tríade Suspensa (sus4)',
    requiredIntervals: [0, 5, 7],
    optionalIntervals: [0, 7],
    essentialTones: [5],
  },
  {
    code: 'AUGMENTED',
    symbolSuffix: '5+',
    fullNamePt: 'Tríade Aumentada (5+)',
    requiredIntervals: [0, 4, 8],
    optionalIntervals: [0],
    essentialTones: [4, 8],
  },
  {
    code: 'MINOR_AUGMENTED',
    symbolSuffix: 'm5+',
    fullNamePt: 'Menor com 5ª Aumentada (m5+)',
    requiredIntervals: [0, 3, 8],
    optionalIntervals: [0],
    essentialTones: [3, 8],
  },
];

/**
 * Traditional Chord Generator Engine (Aba 2)
 * Generates all valid shapes for a given root note and chord quality/tension on cavaquinho (D-G-B-D).
 * Applies:
 * 1. Tocabilidade Filter: Fret distance (span) between lowest pressed fret (>0) and highest pressed fret <= 4.
 * 2. Harmoniico Filter: Must contain all essential tones (3rd, 7th, tensions). Root and 5th can be omitted.
 * 3. Sorting: From simplest (lower frets/open strings) to most complex.
 */
export function generateTraditionalChordShapes(
  rootName: NoteName,
  qualityCode: string
): GeneratedShape[] {
  let rootIndex = NOTE_NAMES.indexOf(rootName);
  if (rootIndex === -1) {
    rootIndex = NOTE_NAMES_ENHARMONIC.indexOf(rootName);
  }

  if (rootIndex === -1) return [];

  const quality = TRADITIONAL_QUALITIES.find(q => q.code === qualityCode) || TRADITIONAL_QUALITIES[0];

  const cifra = `${rootName}${quality.symbolSuffix}`;
  const fullChordName = `${FULL_NOTE_NAMES_PT[rootName] || rootName} ${quality.fullNamePt}`;

  // Allowed intervals set
  const allowedIntervals = Array.from(new Set([...quality.requiredIntervals, ...quality.optionalIntervals]));
  const allowedPitchClasses = new Set(allowedIntervals.map(i => (rootIndex + i) % 12));
  
  // Essential pitch classes set
  const essentialPitchClasses = new Set(quality.essentialTones.map(i => (rootIndex + i) % 12));

  const results: GeneratedShape[] = [];

  // Base pitches for Cavaquinho Tuning: S4=D3(2), S3=G3(7), S2=B3(11), S1=D4(2)
  const basePitches = [
    CAVAQUINHO_STRINGS[0].basePitchClass,
    CAVAQUINHO_STRINGS[1].basePitchClass,
    CAVAQUINHO_STRINGS[2].basePitchClass,
    CAVAQUINHO_STRINGS[3].basePitchClass,
  ];

  // Base MIDI notes: S4=50 (D3), S3=55 (G3), S2=59 (B3), S1=62 (D4)
  const baseMidis = [
    CAVAQUINHO_STRINGS[0].baseMidi,
    CAVAQUINHO_STRINGS[1].baseMidi,
    CAVAQUINHO_STRINGS[2].baseMidi,
    CAVAQUINHO_STRINGS[3].baseMidi,
  ];

  for (let f4 = 0; f4 <= 12; f4++) {
    const p4 = (basePitches[0] + f4) % 12;
    if (!allowedPitchClasses.has(p4)) continue;

    for (let f3 = 0; f3 <= 12; f3++) {
      const p3 = (basePitches[1] + f3) % 12;
      if (!allowedPitchClasses.has(p3)) continue;

      for (let f2 = 0; f2 <= 12; f2++) {
        const p2 = (basePitches[2] + f2) % 12;
        if (!allowedPitchClasses.has(p2)) continue;

        for (let f1 = 0; f1 <= 12; f1++) {
          const p1 = (basePitches[3] + f1) % 12;
          if (!allowedPitchClasses.has(p1)) continue;

          // 1. Filtro de Tocabilidade: Span <= 4 for frets > 0
          const frets = [f4, f3, f2, f1] as [number, number, number, number];
          const pressedFrets = frets.filter(f => f > 0);
          
          if (pressedFrets.length > 0) {
            const minF = Math.min(...pressedFrets);
            const maxF = Math.max(...pressedFrets);
            if (maxF - minF > 4) {
              continue; // Exceeds max stretch of 4 frets
            }
          }

          // 2. Filtro Harmônico: Must contain all essential pitch classes
          const shapePitches = new Set([p4, p3, p2, p1]);
          let hasAllEssentials = true;
          for (const epc of essentialPitchClasses) {
            if (!shapePitches.has(epc)) {
              hasAllEssentials = false;
              break;
            }
          }

          if (!hasAllEssentials) continue;

          // Note details for each string
          const stringPitches = [p4, p3, p2, p1];
          const notesDetail = frets.map((fret, idx) => {
            const stringNumber = 4 - idx;
            const pClass = stringPitches[idx];
            const noteName = NOTE_NAMES[pClass];
            const brazilianName = BRAZILIAN_NOTE_NAMES[noteName];
            const midiNote = baseMidis[idx] + fret;
            const intervalSemitones = (pClass - rootIndex + 12) % 12;
            const intervalInfo = INTERVAL_FUNCTIONS[intervalSemitones];

            return {
              stringNumber,
              fret,
              noteName,
              brazilianName,
              midiNote,
              intervalSemitones,
              roleLabel: intervalInfo.labelPt,
              abbreviation: intervalInfo.abbreviation,
            };
          });

          // Omission Analysis
          const hasRoot = shapePitches.has(rootIndex);
          let fifthInterval = 7;
          if (quality.requiredIntervals.includes(6)) fifthInterval = 6;
          else if (quality.requiredIntervals.includes(8)) fifthInterval = 8;
          const hasFifth = shapePitches.has((rootIndex + fifthInterval) % 12);

          let omittedDescription = 'Fôrma Completa';
          if (!hasRoot && !hasFifth) {
            omittedDescription = 'Tônica e 5ª Omitidas';
          } else if (!hasRoot) {
            omittedDescription = 'Tônica Omitida';
          } else if (!hasFifth) {
            omittedDescription = '5ª Omitida';
          }

          const minF = pressedFrets.length > 0 ? Math.min(...pressedFrets) : 0;
          const maxF = pressedFrets.length > 0 ? Math.max(...pressedFrets) : 0;
          const openStringCount = frets.filter(f => f === 0).length;
          const fretSpan = maxF - minF;

          results.push({
            id: `shape_${f4}_${f3}_${f2}_${f1}`,
            frets,
            cifra,
            rootNoteName: rootName,
            rootBrazilianName: (BRAZILIAN_NOTE_NAMES[rootName] || 'Dó') as BrazilianNoteName,
            fullChordName,
            notesDetail,
            omittedDescription,
            minFret: minF,
            maxFret: maxF,
            fretSpan,
            openStringCount,
            midiNotes: [baseMidis[0] + f4, baseMidis[1] + f3, baseMidis[2] + f2, baseMidis[3] + f1],
          });
        }
      }
    }
  }

  // 3. Sort: simplest (lower frets/open strings) to most complex
  results.sort((a, b) => {
    if (a.minFret !== b.minFret) {
      return a.minFret - b.minFret;
    }
    if (a.maxFret !== b.maxFret) {
      return a.maxFret - b.maxFret;
    }
    if (a.openStringCount !== b.openStringCount) {
      return b.openStringCount - a.openStringCount;
    }
    const sumA = a.frets.reduce((acc, f) => acc + f, 0);
    const sumB = b.frets.reduce((acc, f) => acc + f, 0);
    return sumA - sumB;
  });

  return results;
}

