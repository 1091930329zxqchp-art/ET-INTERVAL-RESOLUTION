import React, { useRef, useEffect } from 'react';
import { IntervalName } from '../types/music';

interface KeypadProps {
  mode:
    | 'interval'
    | 'scale_degree'
    | 'key'
    | 'note'
    | 'resolution'
    | 'resolution_code'
    | 'resolution_spelling';
  currentInput: string;
  onInputChange: (val: string) => void;
  onSubmit: (val?: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

const INTERVAL_KEYS: { label: IntervalName; category: 'minor' | 'major' | 'perfect' | 'tritone' }[] = [
  { label: 'm2', category: 'minor' },
  { label: 'M2', category: 'major' },
  { label: 'm3', category: 'minor' },
  { label: 'M3', category: 'major' },
  { label: 'P4', category: 'perfect' },
  { label: 'A4', category: 'tritone' },
  { label: 'd5', category: 'tritone' },
  { label: 'P5', category: 'perfect' },
  { label: 'm6', category: 'minor' },
  { label: 'M6', category: 'major' },
  { label: 'm7', category: 'minor' },
  { label: 'M7', category: 'major' },
  { label: 'P8', category: 'perfect' },
];

const NOTE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ACCIDENTAL_KEYS = ['#', 'b'];
const SCALE_DEGREE_KEYS = ['1', '2', '3', '4', '5', '6', '7'];
const COMMON_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'F#'];

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  currentInput,
  onInputChange,
  onSubmit,
  placeholder = 'Type your answer...',
  autoFocus = true,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [mode, autoFocus, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(currentInput);
    }
  };

  const handleQuickIntervalClick = (interval: IntervalName) => {
    onInputChange(interval);
    // Instant trigger on tap for high-speed drill
    onSubmit(interval);
  };

  const handleScaleDegreeClick = (degree: string) => {
    onInputChange(degree);
    onSubmit(degree);
  };

  const handleKeyClick = (keyName: string) => {
    onInputChange(keyName);
    onSubmit(keyName);
  };

  const handleNoteClick = (noteLetter: string) => {
    // If input already has a note letter without accidental, append accidental or replace
    if (currentInput.length === 1 && !currentInput.includes('#') && !currentInput.includes('b')) {
      onInputChange(noteLetter);
    } else {
      onInputChange(noteLetter);
    }
  };

  const handleAccidentalClick = (acc: string) => {
    if (currentInput.length >= 1) {
      const base = currentInput.charAt(0);
      const updated = `${base}${acc}`;
      onInputChange(updated);
      onSubmit(updated);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3">
      {/* Primary Input & Submit Form (Manuscript Entry) */}
      <div className="w-full">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[#1a1a1a]/60 mb-1 flex items-center justify-between">
          <span>Manuscript Entry</span>
          <span className="font-serif italic lowercase text-xs text-[#1a1a1a]/50">type or select below</span>
        </div>
        <div className="w-full flex items-end gap-3 pb-2 border-b-2 border-[#1a1a1a]">
          <div className="relative flex-1">
            <input
              id="primary-answer-input"
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={placeholder}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
              className="w-full bg-transparent border-none font-['Gaegu',cursive] text-2xl sm:text-3xl px-0 py-0.5 text-[#d44c4c] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:ring-0 tracking-wide"
            />
            {currentInput && (
              <button
                id="clear-input-btn"
                type="button"
                onClick={() => onInputChange('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40 hover:text-[#1a1a1a] text-xs font-mono font-bold w-6 h-6 rounded flex items-center justify-center cursor-pointer"
              >
                [clr]
              </button>
            )}
          </div>

          <button
            id="submit-answer-btn"
            type="button"
            onClick={() => onSubmit(currentInput)}
            disabled={disabled || !currentInput.trim()}
            className="px-5 py-2 bg-[#1a1a1a] hover:bg-black disabled:bg-[#1a1a1a]/30 text-[#fdfaf3] font-['Cormorant_Garamond',serif] uppercase font-bold text-sm tracking-widest border border-[#1a1a1a] transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            Submit ↵
          </button>
        </div>
      </div>

      {/* Quick Tap Buttons for Rapid-Fire Response */}
      <div className="w-full bg-[#fdfaf3] border border-[#1a1a1a] p-3">
        {mode === 'interval' && (
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1a1a1a]/60 mb-2 flex items-center justify-between">
              <span>Quick Select Interval</span>
              <span className="font-mono text-[10px] text-[#1a1a1a]/40">m=minor, M=Major, P=Perfect, d/A=Tritone</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {INTERVAL_KEYS.map(({ label, category }) => {
                let badgeClass = 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfaf3]';
                if (category === 'minor' || category === 'tritone') {
                  badgeClass = 'border-[#1a1a1a] text-[#d44c4c] hover:bg-[#d44c4c] hover:text-[#fdfaf3] font-bold';
                }

                return (
                  <button
                    key={label}
                    id={`interval-btn-${label}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleQuickIntervalClick(label)}
                    className={`h-10 border font-mono text-xs transition-all flex items-center justify-center cursor-pointer ${badgeClass}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'scale_degree' && (
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1a1a1a]/60 mb-2">
              Scale Degree (1 - 7)
            </div>
            <div className="grid grid-cols-7 gap-2">
              {SCALE_DEGREE_KEYS.map((deg) => (
                <button
                  key={deg}
                  id={`degree-btn-${deg}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleScaleDegreeClick(deg)}
                  className="h-10 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] font-['Cormorant_Garamond',serif] font-bold text-lg transition-all cursor-pointer"
                >
                  ^{deg}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'key' && (
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1a1a1a]/60 mb-2">
              Select Key Tonic
            </div>
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {COMMON_KEYS.map((k) => (
                <button
                  key={k}
                  id={`key-btn-${k}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleKeyClick(k)}
                  className="h-10 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] font-['Cormorant_Garamond',serif] font-bold text-base transition-all cursor-pointer"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'note' && (
          <div className="space-y-2">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1a1a1a]/60">
              Select Note (Letter + Accidental)
            </div>
            <div className="grid grid-cols-7 gap-2">
              {NOTE_KEYS.map((n) => (
                <button
                  key={n}
                  id={`note-btn-${n}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleNoteClick(n)}
                  className="h-10 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] font-['Cormorant_Garamond',serif] font-bold text-base transition-all cursor-pointer"
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {ACCIDENTAL_KEYS.map((acc) => (
                <button
                  key={acc}
                  id={`accidental-btn-${acc === '#' ? 'sharp' : 'flat'}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleAccidentalClick(acc)}
                  className="flex-1 h-9 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] font-['Cormorant_Garamond',serif] font-bold text-base transition-all cursor-pointer"
                >
                  {acc === '#' ? '♯ Sharp' : '♭ Flat'}
                </button>
              ))}
              <button
                id="natural-submit-btn"
                type="button"
                disabled={disabled || !currentInput}
                onClick={() => onSubmit(currentInput)}
                className="flex-1 h-9 border border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfaf3] hover:bg-black font-['Cormorant_Garamond',serif] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Done with {currentInput || 'Note'}
              </button>
            </div>
          </div>
        )}

        {mode === 'resolution' && (
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1a1a1a]/60 mb-2">
              Common Resolution Intervals
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['M3', 'm3', 'm6', 'M6'].map((res) => (
                <button
                  key={res}
                  id={`res-btn-${res}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleQuickIntervalClick(res as IntervalName)}
                  className="h-10 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] font-['Cormorant_Garamond',serif] font-bold text-base transition-all cursor-pointer"
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'resolution_code' && (
          <div className="space-y-2.5">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1a1a1a]/60 flex items-center justify-between">
              <span>6 Resolution Degree Codes (Instant Tap or Type 4 Digits)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { code: '7431', label: '7431', sub: 'd5 → M3' },
                { code: '4713', label: '4713', sub: 'A4 → m6' },
                { code: '5431', label: '5431', sub: 'm7 → M3' },
                { code: '4513', label: '4513', sub: 'M2 → m6' },
                { code: '4553', label: '4553', sub: 'M2 → m3 (5-5)' },
                { code: '7531', label: '7531', sub: 'm6 → M3' },
              ].map(({ code, label, sub }) => (
                <button
                  key={code}
                  id={`code-btn-${code}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onInputChange(code);
                    onSubmit(code);
                  }}
                  className="p-2 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] group transition-all flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="font-mono font-bold text-sm text-[#d44c4c] group-hover:text-[#fdfaf3] tracking-widest">
                    {label}
                  </span>
                  <span className="font-mono text-[10px] text-[#1a1a1a]/70 group-hover:text-[#fdfaf3]/80">
                    {sub}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <span className="font-mono text-[10px] text-[#1a1a1a]/60 uppercase tracking-wider mr-1">Digits:</span>
              {SCALE_DEGREE_KEYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={disabled}
                  onClick={() => onInputChange(currentInput + d)}
                  className="flex-1 h-8 border border-[#1a1a1a]/40 hover:border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] font-mono text-xs text-[#1a1a1a] cursor-pointer"
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                disabled={disabled || !currentInput}
                onClick={() => onInputChange(currentInput.slice(0, -1))}
                className="px-2 h-8 border border-[#1a1a1a]/40 hover:border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] font-mono text-xs text-[#1a1a1a] cursor-pointer"
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {mode === 'resolution_spelling' && (
          <div className="space-y-2">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1a1a1a]/60 flex items-center justify-between">
              <span>Spell Resolution Notes (e.g. C E or C and E)</span>
              <span className="font-mono text-[10px] text-[#1a1a1a]/40">Tap letter to insert</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {NOTE_KEYS.map((n) => (
                <button
                  key={n}
                  id={`res-note-btn-${n}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    const next = currentInput ? `${currentInput} ${n}` : n;
                    onInputChange(next);
                  }}
                  className="h-10 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] font-['Cormorant_Garamond',serif] font-bold text-base transition-all cursor-pointer"
                >
                  {n}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {ACCIDENTAL_KEYS.map((acc) => (
                <button
                  key={acc}
                  type="button"
                  disabled={disabled}
                  onClick={() => onInputChange(currentInput + acc)}
                  className="flex-1 h-9 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] font-['Cormorant_Garamond',serif] font-bold text-base transition-all cursor-pointer"
                >
                  {acc === '#' ? '♯ Sharp' : '♭ Flat'}
                </button>
              ))}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onInputChange(currentInput ? `${currentInput} ` : '')}
                className="flex-1 h-9 border border-[#1a1a1a]/40 hover:border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] font-mono text-xs cursor-pointer"
              >
                Space (Next Note)
              </button>
              <button
                type="button"
                disabled={disabled || !currentInput.trim()}
                onClick={() => onSubmit(currentInput)}
                className="flex-1 h-9 border border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfaf3] hover:bg-black font-['Cormorant_Garamond',serif] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Submit ↵
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
