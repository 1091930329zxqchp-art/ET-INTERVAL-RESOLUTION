/**
 * Music Theory Types & Constants
 */

export type Accidental = '#' | 'b' | 'natural';

export interface NoteInfo {
  name: string; // e.g. 'C', 'F#', 'Bb'
  natural: string; // 'C', 'D', 'E', 'F', 'G', 'A', 'B'
  accidental: '' | '#' | 'b';
  midi: number; // e.g. 60 for C4
  octave: number;
}

export type IntervalName =
  | 'P1'
  | 'm2'
  | 'M2'
  | 'm3'
  | 'M3'
  | 'P4'
  | 'A4'
  | 'd5'
  | 'P5'
  | 'm6'
  | 'M6'
  | 'm7'
  | 'M7'
  | 'P8';

export interface IntervalDefinition {
  name: IntervalName;
  fullName: string;
  semitones: number;
  letterDistance: number; // 0 for unison, 1 for 2nd, etc.
  shortCode: string;
}

export interface KeySignature {
  name: string; // e.g. 'C Major', 'G Major', 'A minor'
  root: string; // 'C', 'G', 'A'
  mode: 'Major' | 'minor';
  accidentalsCount: number; // positive for sharps, negative for flats
  scaleNotes: string[]; // 7 notes in order
}

export interface FourStepQuestion {
  id: string;
  // Step 1: Note 1
  note1: NoteInfo;
  // Step 2: Scale degree
  note1Degree: number; // 1 to 7
  // Step 3: Key
  key: KeySignature;
  // Step 4: Note 2 and interval
  note2: NoteInfo;
  interval: IntervalName;
  intervalDirection: 'up' | 'down';
  
  // Resolution info (for ET class connection)
  resolution?: {
    note1ResolvesTo: NoteInfo;
    note2ResolvesTo: NoteInfo;
    resolutionInterval: string;
    description: string;
  };
}

export interface ResolutionRule {
  id: number;
  interval: IntervalName;
  name: string;
  code: string; // e.g. '7431', '4713', '5431', '4513', '4553', '7531'
  prompt: string; // e.g. 'm7 resolves to M3'
  degreeTop: number;
  degreeBottom: number;
  resolveTop: number;
  resolveBottom: number;
  majorResolution: string; // e.g. 'M3'
  minorResolution: string; // e.g. 'm3'
  description: string;
}

export interface ResolutionChainQuestion {
  id: string;
  rule: ResolutionRule;
  key: KeySignature;
  bottomNote: NoteInfo;
  topNote: NoteInfo;
  resolveBottomNote: NoteInfo;
  resolveTopNote: NoteInfo;
}

export type DrillMode = 'four_step' | 'interval_speed' | 'scale_degree_key' | 'resolution_class';

export interface DrillStats {
  totalAnswered: number;
  correctCount: number;
  streak: number;
  bestStreak: number;
  totalTimeMs: number;
  averageTimeSec: number;
  recentHistory: {
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpentMs: number;
  }[];
}
