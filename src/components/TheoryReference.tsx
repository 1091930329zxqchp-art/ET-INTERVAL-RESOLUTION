import React from 'react';
import { Volume2, X, BookOpen, Music2, ArrowRight } from 'lucide-react';
import { RESOLUTION_RULES, INTERVALS, MAJOR_KEYS } from '../utils/musicTheory';
import { sound } from '../utils/audio';

interface TheoryReferenceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryReference: React.FC<TheoryReferenceProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const playRuleAudio = (ruleId: number) => {
    // In C Major:
    // C=60, D=62, E=64, F=65, G=67, A=69, B=71, C5=72
    const cMajorMidi: Record<number, number> = {
      1: 60, // C4
      2: 62, // D4
      3: 64, // E4
      4: 65, // F4
      5: 67, // G4
      6: 69, // A4
      7: 71, // B4
    };

    const rule = RESOLUTION_RULES.find((r) => r.id === ruleId);
    if (!rule) return;

    let bottom1 = cMajorMidi[rule.degreeBottom];
    let top1 = cMajorMidi[rule.degreeTop];
    if (top1 <= bottom1) top1 += 12;

    let bottom2 = cMajorMidi[rule.resolveBottom];
    let top2 = cMajorMidi[rule.resolveTop];
    if (top2 <= bottom2) top2 += 12;

    sound.playResolution(top1, bottom1, top2, bottom2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a1a]/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#fdfaf3] border border-[#1a1a1a] flex flex-col overflow-hidden text-[#1a1a1a] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-[#fdfaf3]">
          <div>
            <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold tracking-tight">
              Class Notes & Theory Reference
            </h2>
            <p className="font-mono text-xs text-[#1a1a1a]/60 uppercase tracking-wider">
              ET Class 2 • 6 Resolution Patterns & Intervals
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs border border-[#1a1a1a] px-2.5 py-1 hover:bg-[#1a1a1a] hover:text-[#fdfaf3] transition-all cursor-pointer"
          >
            [ESC / Close]
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section: ET Class 2 Resolution Sheet & 4-Step Drill Flow */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#1a1a1a]/20 pb-1">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1a1a1a] flex items-center gap-2">
                <Music2 className="w-3.5 h-3.5 text-[#d44c4c]" />
                The 6 Resolution Codes & 4-Step Drill
              </h3>
              <span className="font-mono text-[10px] text-[#1a1a1a]/60">Tap 🔊 to preview in C</span>
            </div>

            {/* Quick 4-Step Guide Callout */}
            <div className="mb-4 p-3 border border-[#1a1a1a] bg-transparent font-mono text-xs flex flex-col gap-1.5">
              <div className="font-bold text-[#d44c4c] uppercase tracking-wider text-[11px]">
                The 4-Step Speed Process:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[#1a1a1a]/80">
                <li><span className="font-bold text-[#1a1a1a]">Scale Degree Code:</span> e.g. m7 resolves to M3 → <span className="text-[#d44c4c] font-bold">5431</span></li>
                <li><span className="font-bold text-[#1a1a1a]">What is the Key:</span> Deduce tonic from bottom note & degree (e.g. bottom is G, degree ^5 → Key is C)</li>
                <li><span className="font-bold text-[#1a1a1a]">The Note:</span> Spell top tension note in that key (e.g. in C, degree ^4 is F)</li>
                <li><span className="font-bold text-[#1a1a1a]">Spell Resolution Notes:</span> Spell voice-leading pair (e.g. C and E)</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RESOLUTION_RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 border border-[#1a1a1a] bg-[#fdfaf3] flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 bg-[#1a1a1a] text-[#fdfaf3] font-mono font-bold text-xs tracking-wider">
                          {rule.code}
                        </span>
                        <span className="font-mono text-[10px] text-[#1a1a1a]/60 uppercase">
                          #{rule.id} • {rule.interval}
                        </span>
                      </div>
                      <h4 className="font-['Cormorant_Garamond',serif] font-bold text-lg text-[#1a1a1a] leading-tight">
                        {rule.prompt}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => playRuleAudio(rule.id)}
                      title="Hear this resolution in C"
                      className="p-1.5 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[#1a1a1a] transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs py-1 border-t border-b border-dashed border-[#1a1a1a]/20">
                    <div className="flex flex-col items-center">
                      <span>^{rule.degreeTop}</span>
                      <span>^{rule.degreeBottom}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#1a1a1a]/40" />
                    <div className="flex flex-col items-center text-[#d44c4c] font-bold">
                      <span>^{rule.resolveTop}</span>
                      <span>^{rule.resolveBottom}</span>
                    </div>
                    <span className="text-[#1a1a1a]/20">|</span>
                    <span className="font-serif italic text-sm">
                      Resolves to {rule.majorResolution}
                    </span>
                  </div>

                  <p className="font-mono text-[11px] text-[#1a1a1a]/70 leading-tight">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: All Intervals Table */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2 border-b border-[#1a1a1a]/20 pb-1">
              Intervals & Semitone Distance
            </h3>
            <div className="border border-[#1a1a1a] overflow-hidden text-xs font-mono">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-[#1a1a1a] text-[#1a1a1a]/70 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-2 border-r border-[#1a1a1a]/20">Code</th>
                    <th className="p-2 border-r border-[#1a1a1a]/20">Full Name</th>
                    <th className="p-2 border-r border-[#1a1a1a]/20">Semitones</th>
                    <th className="p-2 border-r border-[#1a1a1a]/20">In C Major</th>
                    <th className="p-2">Inversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]/15">
                  {INTERVALS.filter((i) => i.name !== 'P1').map((i) => {
                    const cTarget: Record<string, string> = {
                      m2: 'C - Db',
                      M2: 'C - D',
                      m3: 'C - Eb',
                      M3: 'C - E',
                      P4: 'C - F',
                      A4: 'C - F#',
                      d5: 'C - Gb (or B - F)',
                      P5: 'C - G',
                      m6: 'C - Ab',
                      M6: 'C - A',
                      m7: 'C - Bb',
                      M7: 'C - B',
                      P8: 'C - C',
                    };
                    const inversion: Record<string, string> = {
                      m2: 'M7',
                      M2: 'm7',
                      m3: 'M6',
                      M3: 'm6',
                      P4: 'P5',
                      A4: 'd5',
                      d5: 'A4',
                      P5: 'P4',
                      m6: 'M3',
                      M6: 'm3',
                      m7: 'M2',
                      M7: 'm2',
                      P8: 'P1',
                    };

                    return (
                      <tr key={i.name} className="hover:bg-[#1a1a1a]/5">
                        <td className="p-2 font-bold text-[#d44c4c] border-r border-[#1a1a1a]/20">{i.name}</td>
                        <td className="p-2 font-serif text-sm font-semibold border-r border-[#1a1a1a]/20">{i.fullName}</td>
                        <td className="p-2 text-[#1a1a1a]/70 border-r border-[#1a1a1a]/20">{i.semitones} st</td>
                        <td className="p-2 border-r border-[#1a1a1a]/20">{cTarget[i.name] || ''}</td>
                        <td className="p-2 text-[#1a1a1a]/50">{inversion[i.name] || ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1a1a1a] bg-[#fdfaf3] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-[#1a1a1a] bg-[#1a1a1a] hover:bg-black text-[#fdfaf3] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Close Notes
          </button>
        </div>
      </div>
    </div>
  );
};
