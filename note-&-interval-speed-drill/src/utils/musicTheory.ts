import {
  NoteInfo,
  IntervalName,
  IntervalDefinition,
  KeySignature,
  FourStepQuestion,
  ResolutionRule,
  ResolutionChainQuestion,
} from '../types/music';

export const NATURAL_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const NATURAL_SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const INTERVALS: IntervalDefinition[] = [
  { name: 'P1', fullName: 'Perfect Unison', semitones: 0, letterDistance: 0, shortCode: 'P1' },
  { name: 'm2', fullName: 'minor 2nd', semitones: 1, letterDistance: 1, shortCode: 'm2' },
  { name: 'M2', fullName: 'Major 2nd', semitones: 2, letterDistance: 1, shortCode: 'M2' },
  { name: 'm3', fullName: 'minor 3rd', semitones: 3, letterDistance: 2, shortCode: 'm3' },
  { name: 'M3', fullName: 'Major 3rd', semitones: 4, letterDistance: 2, shortCode: 'M3' },
  { name: 'P4', fullName: 'Perfect 4th', semitones: 5, letterDistance: 3, shortCode: 'P4' },
  { name: 'A4', fullName: 'Augmented 4th', semitones: 6, letterDistance: 3, shortCode: 'A4' },
  { name: 'd5', fullName: 'Diminished 5th', semitones: 6, letterDistance: 4, shortCode: 'd5' },
  { name: 'P5', fullName: 'Perfect 5th', semitones: 7, letterDistance: 4, shortCode: 'P5' },
  { name: 'm6', fullName: 'minor 6th', semitones: 8, letterDistance: 5, shortCode: 'm6' },
  { name: 'M6', fullName: 'Major 6th', semitones: 9, letterDistance: 5, shortCode: 'M6' },
  { name: 'm7', fullName: 'minor 7th', semitones: 10, letterDistance: 6, shortCode: 'm7' },
  { name: 'M7', fullName: 'Major 7th', semitones: 11, letterDistance: 6, shortCode: 'M7' },
  { name: 'P8', fullName: 'Perfect Octave', semitones: 12, letterDistance: 7, shortCode: 'P8' },
];

export const MAJOR_KEYS: KeySignature[] = [
  { name: 'C Major', root: 'C', mode: 'Major', accidentalsCount: 0, scaleNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { name: 'G Major', root: 'G', mode: 'Major', accidentalsCount: 1, scaleNotes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  { name: 'D Major', root: 'D', mode: 'Major', accidentalsCount: 2, scaleNotes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  { name: 'A Major', root: 'A', mode: 'Major', accidentalsCount: 3, scaleNotes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
  { name: 'E Major', root: 'E', mode: 'Major', accidentalsCount: 4, scaleNotes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
  { name: 'B Major', root: 'B', mode: 'Major', accidentalsCount: 5, scaleNotes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
  { name: 'F# Major', root: 'F#', mode: 'Major', accidentalsCount: 6, scaleNotes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'] },
  { name: 'F Major', root: 'F', mode: 'Major', accidentalsCount: -1, scaleNotes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'] },
  { name: 'Bb Major', root: 'Bb', mode: 'Major', accidentalsCount: -2, scaleNotes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'] },
  { name: 'Eb Major', root: 'Eb', mode: 'Major', accidentalsCount: -3, scaleNotes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'] },
  { name: 'Ab Major', root: 'Ab', mode: 'Major', accidentalsCount: -4, scaleNotes: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'] },
  { name: 'Db Major', root: 'Db', mode: 'Major', accidentalsCount: -5, scaleNotes: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'] },
];

export const MINOR_KEYS: KeySignature[] = [
  { name: 'A minor', root: 'A', mode: 'minor', accidentalsCount: 0, scaleNotes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  { name: 'E minor', root: 'E', mode: 'minor', accidentalsCount: 1, scaleNotes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'] },
  { name: 'B minor', root: 'B', mode: 'minor', accidentalsCount: 2, scaleNotes: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'] },
  { name: 'F# minor', root: 'F#', mode: 'minor', accidentalsCount: 3, scaleNotes: ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'] },
  { name: 'C# minor', root: 'C#', mode: 'minor', accidentalsCount: 4, scaleNotes: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'] },
  { name: 'D minor', root: 'D', mode: 'minor', accidentalsCount: -1, scaleNotes: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'] },
  { name: 'G minor', root: 'G', mode: 'minor', accidentalsCount: -2, scaleNotes: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'] },
  { name: 'C minor', root: 'C', mode: 'minor', accidentalsCount: -3, scaleNotes: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'] },
  { name: 'F minor', root: 'F', mode: 'minor', accidentalsCount: -4, scaleNotes: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'] },
];

export const ALL_KEYS: KeySignature[] = [...MAJOR_KEYS, ...MINOR_KEYS];

/**
 * The 6 core interval resolution rules from ET Class 2 (Sept. 9th):
 * 1. d5: 7431 (d5 resolves to M3)
 * 2. A4: 4713 (A4 resolves to m6)
 * 3. m7: 5431 (m7 resolves to M3)
 * 4. M2: 4513 (M2 resolves to m6)
 * 5. M2: 4553 (M2 resolves to m3, 5 stays on 5)
 * 6. m6: 7531 (m6 resolves to M3)
 */
export const RESOLUTION_RULES: ResolutionRule[] = [
  {
    id: 1,
    interval: 'd5',
    name: 'Diminished 5th (d5)',
    code: '7431',
    prompt: 'd5 resolves to M3',
    degreeTop: 4,
    degreeBottom: 7,
    resolveTop: 3,
    resolveBottom: 1,
    majorResolution: 'M3',
    minorResolution: 'm3',
    description: 'Degree 7 resolves to 1, degree 4 resolves to 3 (Inward to 3rd: 7 4 -> 3 1).',
  },
  {
    id: 2,
    interval: 'A4',
    name: 'Augmented 4th (A4)',
    code: '4713',
    prompt: 'A4 resolves to m6',
    degreeTop: 7,
    degreeBottom: 4,
    resolveTop: 1,
    resolveBottom: 3,
    majorResolution: 'm6',
    minorResolution: 'M6',
    description: 'Degree 4 resolves to 3, degree 7 resolves to 1 (Outward to 6th: 4 7 -> 1 3).',
  },
  {
    id: 3,
    interval: 'm7',
    name: 'minor 7th (m7)',
    code: '5431',
    prompt: 'm7 resolves to M3',
    degreeTop: 4,
    degreeBottom: 5,
    resolveTop: 3,
    resolveBottom: 1,
    majorResolution: 'M3',
    minorResolution: 'm3',
    description: 'Degree 5 resolves to 1, degree 4 resolves to 3 (Dominant to 3rd: 5 4 -> 3 1).',
  },
  {
    id: 4,
    interval: 'M2',
    name: 'Major 2nd (M2) -> 6th',
    code: '4513',
    prompt: 'M2 resolves to m6',
    degreeTop: 5,
    degreeBottom: 4,
    resolveTop: 1,
    resolveBottom: 3,
    majorResolution: 'm6',
    minorResolution: 'M6',
    description: 'Degree 4 resolves to 3, degree 5 resolves to 1 (Inversion of m7: 4 5 -> 1 3).',
  },
  {
    id: 5,
    interval: 'M2',
    name: 'Major 2nd (M2) [5-5]',
    code: '4553',
    prompt: 'M2 resolves to m3 (5 stays on 5)',
    degreeTop: 5,
    degreeBottom: 4,
    resolveTop: 5,
    resolveBottom: 3,
    majorResolution: 'm3',
    minorResolution: 'M3',
    description: 'Degree 4 moves to 3 while degree 5 stays on 5 (Sustained 5th: 4 5 -> 5 3).',
  },
  {
    id: 6,
    interval: 'm6',
    name: 'minor 6th (m6)',
    code: '7531',
    prompt: 'm6 resolves to M3',
    degreeTop: 5,
    degreeBottom: 7,
    resolveTop: 3,
    resolveBottom: 1,
    majorResolution: 'M3',
    minorResolution: 'm3',
    description: 'Degree 7 resolves to 1, degree 5 resolves to 3 (Resolves into 3rd: 7 5 -> 3 1).',
  },
];

export const RESOLUTION_CODES = ['7431', '4713', '5431', '4513', '4553', '7531'] as const;

export function normalizeResolutionCodeInput(input: string): string {
  // Extract all digits e.g. "5431", "5 4 3 1", "54->31" -> "5431"
  return input.replace(/\D/g, '').trim();
}

/**
 * Generate a complete 4-Step Interval Resolution Chain question:
 * 1. "m7 resolves to M3, what's the scale degree?" -> 5431
 * 2. "In C Major, bottom note is G (5). What is the top note (4)?" -> F
 * 3. "What is the key?" -> C
 * 4. "Spell the resolution note (1 and 3 in C Major)" -> C and E
 */
export function generateResolutionChainQuestion(): ResolutionChainQuestion {
  const rule = RESOLUTION_RULES[Math.floor(Math.random() * RESOLUTION_RULES.length)];
  // Keys: focus on standard keys for clear pitch spelling
  const keysPool = [
    MAJOR_KEYS[0], // C
    MAJOR_KEYS[1], // G
    MAJOR_KEYS[2], // D
    MAJOR_KEYS[3], // A
    MAJOR_KEYS[7], // F
    MAJOR_KEYS[8], // Bb
    MAJOR_KEYS[9], // Eb
  ];
  const key = keysPool[Math.floor(Math.random() * keysPool.length)];

  const bottomNote = getNoteByDegree(key, rule.degreeBottom, 4);
  const topNote = getNoteByDegree(key, rule.degreeTop, 4);

  // Ensure top note is higher than bottom note
  if (topNote.midi <= bottomNote.midi) {
    topNote.midi += 12;
    topNote.octave += 1;
  }

  const resolveBottomNote = getNoteByDegree(key, rule.resolveBottom, bottomNote.octave);
  const resolveTopNote = getNoteByDegree(key, rule.resolveTop, topNote.octave);

  return {
    id: Math.random().toString(36).substring(2, 9),
    rule,
    key,
    bottomNote,
    topNote,
    resolveBottomNote,
    resolveTopNote,
  };
}

export function isNoteMatch(userVal: string, targetNote: NoteInfo, bottomNote?: NoteInfo): boolean {
  const clean = userVal.trim().toUpperCase().replace(/\s+/g, ' ');
  const targetName = targetNote.name.toUpperCase();
  const targetWithOctave = `${targetNote.name}${targetNote.octave}`.toUpperCase();

  // Direct match to target note (e.g. "F" or "F4" or "f")
  if (clean === targetName || clean === targetWithOctave) return true;

  // If user entered both bottom and top notes (e.g. "G F" or "G, F" or "G AND F")
  if (bottomNote) {
    const bottomName = bottomNote.name.toUpperCase();
    const cleanTokens = clean.replace(/[,&]/g, ' ').replace(/\s+AND\s+/g, ' ').split(/\s+/).filter(Boolean);
    if (cleanTokens.length === 2) {
      if ((cleanTokens[0] === bottomName && cleanTokens[1] === targetName) ||
          (cleanTokens[0] === targetName && cleanTokens[1] === bottomName)) {
        return true;
      }
    }
  }

  return false;
}

export function isResolutionNotesMatch(
  userVal: string,
  bottomNote: NoteInfo,
  topNote: NoteInfo
): boolean {
  const clean = userVal.trim().toUpperCase();
  const bName = bottomNote.name.toUpperCase();
  const tName = topNote.name.toUpperCase();

  // If user entered e.g. "C E" or "C, E" or "C AND E" or "C+E" or "E C"
  const tokens = clean
    .replace(/[,&+]/g, ' ')
    .replace(/\s+AND\s+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 2) {
    const [n1, n2] = tokens;
    const matchForward = (n1 === bName && n2 === tName);
    const matchBackward = (n1 === tName && n2 === bName);
    if (matchForward || matchBackward) return true;
  }

  // Also check single token if user typed "CE"
  if (tokens.length === 1) {
    if (clean === `${bName}${tName}` || clean === `${tName}${bName}`) return true;
  }

  return false;
}

/**
 * Helper to build NoteInfo from note name and octave
 */
export function createNoteInfo(name: string, octave: number = 4): NoteInfo {
  const natural = name.charAt(0);
  const accidentalStr = name.slice(1);
  const accidental: '' | '#' | 'b' = accidentalStr === '#' ? '#' : accidentalStr === 'b' ? 'b' : '';
  
  let semitone = NATURAL_SEMITONES[natural] ?? 0;
  if (accidental === '#') semitone += 1;
  else if (accidental === 'b') semitone -= 1;
  
  const midi = (octave + 1) * 12 + semitone;

  return {
    name,
    natural,
    accidental,
    midi,
    octave,
  };
}

/**
 * Calculate the precise IntervalName between two notes (taking letter distance into account!)
 */
export function getIntervalBetweenNotes(noteA: NoteInfo, noteB: NoteInfo): {
  interval: IntervalName;
  direction: 'up' | 'down';
  semitones: number;
} {
  const diff = noteB.midi - noteA.midi;
  const direction: 'up' | 'down' = diff >= 0 ? 'up' : 'down';
  const semitonesAbs = Math.abs(diff) % 12;

  // Natural letter distance
  const idxA = NATURAL_NOTES.indexOf(noteA.natural);
  const idxB = NATURAL_NOTES.indexOf(noteB.natural);
  let letterDist = (idxB - idxA + 7) % 7;
  if (direction === 'down' && diff !== 0) {
    letterDist = (idxA - idxB + 7) % 7;
  }

  // Find matching interval by semitones and letter distance
  const matched = INTERVALS.find(
    (i) => i.semitones === semitonesAbs && i.letterDistance === letterDist
  );

  if (matched) {
    return { interval: matched.name, direction, semitones: semitonesAbs };
  }

  // Fallback if enharmonically spelled
  const fallback = INTERVALS.find((i) => i.semitones === semitonesAbs) || INTERVALS[0];
  return { interval: fallback.name, direction, semitones: semitonesAbs };
}

/**
 * Get scale degree of a note within a key (1 to 7, or null if non-diatonic)
 */
export function getScaleDegreeInKey(noteName: string, key: KeySignature): number | null {
  const cleanNote = noteName.trim();
  const index = key.scaleNotes.indexOf(cleanNote);
  return index >= 0 ? index + 1 : null;
}

/**
 * Get note by scale degree in a key (degree 1 to 7)
 */
export function getNoteByDegree(key: KeySignature, degree: number, octave: number = 4): NoteInfo {
  const noteName = key.scaleNotes[(degree - 1) % 7];
  return createNoteInfo(noteName, octave);
}

/**
 * Calculate the target note given a starting note and interval up/down
 */
export function getNoteByInterval(
  startNote: NoteInfo,
  intervalName: IntervalName,
  direction: 'up' | 'down' = 'up'
): NoteInfo {
  const def = INTERVALS.find((i) => i.name === intervalName);
  if (!def) return startNote;

  const startIdx = NATURAL_NOTES.indexOf(startNote.natural);
  const targetLetterIdx = direction === 'up'
    ? (startIdx + def.letterDistance) % 7
    : (startIdx - def.letterDistance + 7) % 7;
  const targetNatural = NATURAL_NOTES[targetLetterIdx];

  const targetMidi = direction === 'up'
    ? startNote.midi + def.semitones
    : startNote.midi - def.semitones;

  // Determine accidental needed to match targetMidi
  const targetOctave = Math.floor(targetMidi / 12) - 1;
  const targetBaseSemi = NATURAL_SEMITONES[targetNatural];
  const naturalMidiAtOctave = (targetOctave + 1) * 12 + targetBaseSemi;
  const diffSemi = targetMidi - naturalMidiAtOctave;

  let accidental = '';
  if (diffSemi === 1 || diffSemi === -11) accidental = '#';
  else if (diffSemi === -1 || diffSemi === 11) accidental = 'b';
  else if (diffSemi === 2) accidental = '##';
  else if (diffSemi === -2) accidental = 'bb';

  return {
    name: `${targetNatural}${accidental}`,
    natural: targetNatural,
    accidental: accidental as '' | '#' | 'b',
    midi: targetMidi,
    octave: targetOctave,
  };
}

/**
 * Normalize interval answer typed by the user:
 * e.g. "m3", "minor 3", "minor 3rd", "M3", "major 3", "P5", "p5", "d5", "A4", "aug 4", "dim 5"
 */
export function normalizeIntervalInput(input: string): IntervalName | null {
  const s = input.trim().toLowerCase().replace(/\s+/g, '');
  if (!s) return null;

  // Exact mappings
  const directMap: Record<string, IntervalName> = {
    p1: 'P1',
    unison: 'P1',
    m2: 'm2',
    min2: 'm2',
    minor2: 'm2',
    minor2nd: 'm2',
    'b2': 'm2',
    m2nd: 'm2',
    m_2: 'm2',
    M2: 'M2',
    maj2: 'M2',
    major2: 'M2',
    major2nd: 'M2',
    '2': 'M2',
    m3: 'm3',
    min3: 'm3',
    minor3: 'm3',
    minor3rd: 'm3',
    'b3': 'm3',
    m3rd: 'm3',
    M3: 'M3',
    maj3: 'M3',
    major3: 'M3',
    major3rd: 'M3',
    '3': 'M3',
    p4: 'P4',
    perf4: 'P4',
    perfect4: 'P4',
    perfect4th: 'P4',
    '4': 'P4',
    a4: 'A4',
    aug4: 'A4',
    augmented4: 'A4',
    augmented4th: 'A4',
    tritone: 'A4',
    tt: 'A4',
    d5: 'd5',
    dim5: 'd5',
    diminished5: 'd5',
    diminished5th: 'd5',
    'b5': 'd5',
    p5: 'P5',
    perf5: 'P5',
    perfect5: 'P5',
    perfect5th: 'P5',
    '5': 'P5',
    m6: 'm6',
    min6: 'm6',
    minor6: 'm6',
    minor6th: 'm6',
    'b6': 'm6',
    m6th: 'm6',
    M6: 'M6',
    maj6: 'M6',
    major6: 'M6',
    major6th: 'M6',
    '6': 'M6',
    m7: 'm7',
    min7: 'm7',
    minor7: 'm7',
    minor7th: 'm7',
    'b7': 'm7',
    m7th: 'm7',
    M7: 'M7',
    maj7: 'M7',
    major7: 'M7',
    major7th: 'M7',
    '7': 'M7',
    p8: 'P8',
    octave: 'P8',
    '8': 'P8',
  };

  // Check case-sensitive first for m vs M
  if (input.trim() === 'm2') return 'm2';
  if (input.trim() === 'M2') return 'M2';
  if (input.trim() === 'm3') return 'm3';
  if (input.trim() === 'M3') return 'M3';
  if (input.trim() === 'm6') return 'm6';
  if (input.trim() === 'M6') return 'M6';
  if (input.trim() === 'm7') return 'm7';
  if (input.trim() === 'M7') return 'M7';

  return directMap[s] || null;
}

/**
 * Generate a complete 4-Step Chain Drill Question:
 * 1. Note (e.g. F#4)
 * 2. Scale Degree (e.g. Degree 4)
 * 3. Key (e.g. C# minor or D Major)
 * 4. Note 2 & Interval (e.g. C5 -> A4 / d5 / etc.)
 */
export function generateFourStepQuestion(options?: {
  includeMinor?: boolean;
  resolutionFocused?: boolean;
}): FourStepQuestion {
  const keysPool = options?.includeMinor ? ALL_KEYS : MAJOR_KEYS;
  const selectedKey = keysPool[Math.floor(Math.random() * keysPool.length)];

  if (options?.resolutionFocused) {
    // Pick one of the 6 class resolution rules!
    const rule = RESOLUTION_RULES[Math.floor(Math.random() * RESOLUTION_RULES.length)];
    const topNote = getNoteByDegree(selectedKey, rule.degreeTop, 4);
    const bottomNote = getNoteByDegree(selectedKey, rule.degreeBottom, 4);

    // Adjust octave so top note is above bottom note
    if (topNote.midi <= bottomNote.midi) {
      topNote.midi += 12;
      topNote.octave += 1;
    }

    const resolveTopNote = getNoteByDegree(selectedKey, rule.resolveTop, topNote.octave);
    const resolveBottomNote = getNoteByDegree(selectedKey, rule.resolveBottom, bottomNote.octave);

    const isMajor = selectedKey.mode === 'Major';
    const resolutionInterval = isMajor ? rule.majorResolution : rule.minorResolution;

    return {
      id: Math.random().toString(36).substring(2, 9),
      note1: bottomNote,
      note1Degree: rule.degreeBottom,
      key: selectedKey,
      note2: topNote,
      interval: rule.interval,
      intervalDirection: 'up',
      resolution: {
        note1ResolvesTo: resolveBottomNote,
        note2ResolvesTo: resolveTopNote,
        resolutionInterval,
        description: rule.description,
      },
    };
  }

  // Standard random diatonic drill
  const degree1 = Math.floor(Math.random() * 7) + 1;
  let degree2 = Math.floor(Math.random() * 7) + 1;
  while (degree2 === degree1) {
    degree2 = Math.floor(Math.random() * 7) + 1;
  }

  const note1 = getNoteByDegree(selectedKey, degree1, 4);
  const note2 = getNoteByDegree(selectedKey, degree2, degree2 < degree1 ? 5 : 4);

  const { interval, direction } = getIntervalBetweenNotes(note1, note2);

  return {
    id: Math.random().toString(36).substring(2, 9),
    note1,
    note1Degree: degree1,
    key: selectedKey,
    note2,
    interval,
    intervalDirection: direction,
  };
}

/**
 * Generate a standalone Interval question (2 notes -> type interval)
 */
export function generateIntervalQuestion(): {
  note1: NoteInfo;
  note2: NoteInfo;
  correctInterval: IntervalName;
  direction: 'up' | 'down';
} {
  const commonNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Bb', 'Eb', 'Ab', 'F#', 'C#', 'G#'];
  const name1 = commonNotes[Math.floor(Math.random() * commonNotes.length)];
  const note1 = createNoteInfo(name1, 4);

  // Pick random interval from m2 to P8
  const validIntervals = INTERVALS.filter((i) => i.name !== 'P1');
  const targetInterval = validIntervals[Math.floor(Math.random() * validIntervals.length)];
  const direction: 'up' | 'down' = Math.random() > 0.25 ? 'up' : 'down';

  const note2 = getNoteByInterval(note1, targetInterval.name, direction);

  return {
    note1,
    note2,
    correctInterval: targetInterval.name,
    direction,
  };
}

/**
 * Generate a Scale Degree & Key question
 */
export function generateScaleDegreeQuestion(): {
  type: 'find_degree' | 'find_key' | 'find_note';
  key: KeySignature;
  note: NoteInfo;
  degree: number;
  questionText: string;
  correctAnswer: string;
  explanation: string;
} {
  const key = MAJOR_KEYS[Math.floor(Math.random() * MAJOR_KEYS.length)];
  const degree = Math.floor(Math.random() * 7) + 1;
  const note = getNoteByDegree(key, degree, 4);

  const types: ('find_degree' | 'find_key' | 'find_note')[] = ['find_degree', 'find_key', 'find_note'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'find_degree') {
    return {
      type,
      key,
      note,
      degree,
      questionText: `What scale degree is ${note.name} in the key of ${key.name}?`,
      correctAnswer: degree.toString(),
      explanation: `In ${key.name} (${key.scaleNotes.join(', ')}), ${note.name} is scale degree ^${degree}.`,
    };
  } else if (type === 'find_key') {
    return {
      type,
      key,
      note,
      degree,
      questionText: `If ${note.name} is scale degree ^${degree}, what is the Major key?`,
      correctAnswer: key.root,
      explanation: `When ${note.name} is degree ^${degree}, the tonic (degree 1) is ${key.root}, making it ${key.name}.`,
    };
  } else {
    return {
      type,
      key,
      note,
      degree,
      questionText: `In ${key.name}, what note is scale degree ^${degree}?`,
      correctAnswer: note.name,
      explanation: `The notes of ${key.name} are ${key.scaleNotes.join(' - ')}. Degree ^${degree} is ${note.name}.`,
    };
  }
}
