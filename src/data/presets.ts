import { ChordPreset } from '../types';

/**
 * Classic Cavaquinho Chord Shapes Library
 * Frets array format: [String 4 (Ré), String 3 (Sol), String 2 (Si), String 1 (Ré)]
 * 0 = open, 1..12 = pressed, null = muted
 */
export const CHORD_PRESETS: ChordPreset[] = [
  // Samba & Pagode Essentials
  {
    id: 'c_maior_samba',
    name: 'C (Dó Maior - Posição Tradicional)',
    cifra: 'C',
    category: 'Samba/Pagode',
    frets: [2, 0, 1, 2], // 4ª Ré(E), 3ª Sol(G), 2ª Si(C), 1ª Ré(E)
    description: 'Forma clássica de Dó Maior no cavaquinho.',
  },
  {
    id: 'c_add9_samba',
    name: 'C(9) / Cadd9 (Dó com Nona Adicionada)',
    cifra: 'C(9)',
    category: 'Samba/Pagode',
    frets: [2, 0, 1, 0], // 4ª Ré(E), 3ª Sol(G), 2ª Si(C), 1ª Ré(D = 9ª)
    description: 'Tríade de Dó Maior com Nona adicionada (C, E, G, D). Muito usado no Samba e MPB moderna.',
  },
  {
    id: 'c7M_samba',
    name: 'C7M (Dó com Sétima Maior)',
    cifra: 'C7M',
    category: 'Samba/Pagode',
    frets: [2, 0, 0, 2], // E, G, B, E
    description: 'Acorde com sonoridade aberta e sofisticada, muito usado no Choro e Bossa.',
  },
  {
    id: 'c7_9_samba',
    name: 'C7/9 (Dó Sete com Nona)',
    cifra: 'C7/9',
    category: 'Dominantes',
    frets: [2, 3, 1, 2], // E, A#, C, E
    description: 'Tensão dominante perfeita para preparação no Samba e Pagode.',
  },
  {
    id: 'cm7_9_samba',
    name: 'Cm7/9 (Dó Menor com 7ª e 9ª)',
    cifra: 'Cm7/9',
    category: 'Samba/Pagode',
    frets: [1, 3, 1, 1], // Eb, A#, C, D#
    description: 'Acorde com formato compacto e moderno.',
  },

  // Choro & MPB Sophisticated Shapes
  {
    id: 'd7_choro',
    name: 'D7 (Ré com Sétima)',
    cifra: 'D7',
    category: 'Choro/MPB',
    frets: [0, 2, 1, 0], // D, A, C, D
    description: 'Ré dominante aberto tradicional.',
  },
  {
    id: 'g7M_choro',
    name: 'G7M (Sol Maior com Sétima Maior)',
    cifra: 'G7M',
    category: 'Choro/MPB',
    frets: [5, 4, 3, 4], // F#, B, D, F#
    description: 'Forma fechada de G7M no meio do braço.',
  },
  {
    id: 'a7_b9_choro',
    name: 'A7/b9 (Lá Sete com Nona Menor)',
    cifra: 'A7/b9',
    category: 'Dominantes',
    frets: [2, 0, 2, 2], // E, G, C#, E
    description: 'Dominante tenso para preparação menor.',
  },

  // Diminutos & Equivalências
  {
    id: 'cm5_plus_samba',
    name: 'Cm5+ (Dó Menor com Quinta Aumentada)',
    cifra: 'Cm5+',
    category: 'Choro/MPB',
    frets: [1, 1, 1, 1], // Eb (3m), G# (5+), C (T), Eb (3m)
    description: 'Pestana na 1ª casa contendo Tônica (C), 3ª Menor (Eb) e 5ª Aumentada (G#).',
  },
  {
    id: 'c_diminuto',
    name: 'C° (Dó Diminuto)',
    cifra: 'C°',
    category: 'Diminutos',
    frets: [1, 2, 1, 1], // Eb, A, C, D#
    description: 'Diminuto clássico. Lembre-se: C° = Eb° = Gb° = A°.',
  },
  {
    id: 'e_meio_diminuto',
    name: 'Em7/b5 (Mi Meio Diminuto / Gm6)',
    cifra: 'Em7/b5',
    category: 'Choro/MPB',
    frets: [2, 0, 0, 0], // E, G, B, D
    description: 'Forma versátil que equivale a Gm6 (Sol menor com sexta).',
  },
  {
    id: 'f_sustenido_m7',
    name: 'F#m7 (Fá# Menor com Sétima / A6)',
    cifra: 'F#m7',
    category: 'Samba/Pagode',
    frets: [4, 2, 2, 2], // F#, A, C#, E
    description: 'Mesmo formato que A6 (Lá com sexta).',
  },
  {
    id: 'c7_b5_tritono',
    name: 'C7/b5 (Dó 7 com 5ª Diminuta / F#7/b5)',
    cifra: 'C7/b5',
    category: 'Dominantes',
    frets: [2, 3, 1, 0], // E, A#, C, D
    description: 'Dominante simétrico que equivale a F#7/b5 por substituição de trítono.',
  },

  // Iniciante
  {
    id: 'g_maior_iniciante',
    name: 'G (Sol Maior Invertido)',
    cifra: 'G',
    category: 'Iniciante',
    frets: [0, 0, 0, 0], // D, G, B, D (Sol maior com Ré no baixo)
    description: 'A afinação solta do cavaquinho já forma um acorde de G (Sol Maior com baixo em Ré).',
  },
  {
    id: 'd_maior_iniciante',
    name: 'D (Ré Maior)',
    cifra: 'D',
    category: 'Iniciante',
    frets: [0, 2, 3, 4],
    description: 'Ré maior em posição inicial.',
  },
];
