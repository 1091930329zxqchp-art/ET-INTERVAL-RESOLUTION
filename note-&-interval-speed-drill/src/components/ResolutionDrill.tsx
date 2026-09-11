import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle, BookOpen, Music } from 'lucide-react';
import { RESOLUTION_RULES, MAJOR_KEYS, getNoteByDegree } from '../utils/musicTheory';
import { sound } from '../utils/audio';
import { StaffDisplay } from './StaffDisplay';
import { Keypad } from './Keypad';
import { ResolutionRule, KeySignature, NoteInfo } from '../types/music';

interface ResolutionDrillProps {
  onRecordResult: (isCorrect: boolean, timeSpentMs: number, qText: string, userAns: string, correctAns: string) => void;
  speedLimitSec: number;
}

export const ResolutionDrill: React.FC<ResolutionDrillProps> = ({
  onRecordResult,
  speedLimitSec,
}) => {
  const [currentRule, setCurrentRule] = useState<ResolutionRule>(RESOLUTION_RULES[0]);
  const [currentKey, setCurrentKey] = useState<KeySignature>(MAJOR_KEYS[0]); // default C Major
  const [topNote, setTopNote] = useState<NoteInfo | null>(null);
  const [bottomNote, setBottomNote] = useState<NoteInfo | null>(null);
  const [resolveTopNote, setResolveTopNote] = useState<NoteInfo | null>(null);
  const [resolveBottomNote, setResolveBottomNote] = useState<NoteInfo | null>(null);

  // Question sub-type: 'ask_resolution_interval' | 'ask_scale_degrees' | 'ask_interval_name'
  const [qType, setQType] = useState<'ask_resolution_interval' | 'ask_scale_degrees' | 'ask_interval_name'>('ask_resolution_interval');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'incorrect';
    message: string;
    correctAnswerText?: string;
  }>({ status: 'idle', message: '' });

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(speedLimitSec);

  const loadNewQuestion = useCallback(() => {
    const rule = RESOLUTION_RULES[Math.floor(Math.random() * RESOLUTION_RULES.length)];
    const key = MAJOR_KEYS[Math.floor(Math.random() * MAJOR_KEYS.length)];

    const bNote = getNoteByDegree(key, rule.degreeBottom, 4);
    const tNote = getNoteByDegree(key, rule.degreeTop, 4);
    if (tNote.midi <= bNote.midi) {
      tNote.midi += 12;
      tNote.octave += 1;
    }

    const rBNote = getNoteByDegree(key, rule.resolveBottom, bNote.octave);
    const rTNote = getNoteByDegree(key, rule.resolveTop, tNote.octave);

    setCurrentRule(rule);
    setCurrentKey(key);
    setBottomNote(bNote);
    setTopNote(tNote);
    setResolveBottomNote(rBNote);
    setResolveTopNote(rTNote);

    const types: ('ask_resolution_interval' | 'ask_scale_degrees' | 'ask_interval_name')[] = [
      'ask_resolution_interval',
      'ask_interval_name',
      'ask_scale_degrees',
    ];
    setQType(types[Math.floor(Math.random() * types.length)]);

    setUserInput('');
    setFeedback({ status: 'idle', message: '' });
    startTimeRef.current = Date.now();
    setTimeLeftSec(speedLimitSec);

    // Play tension interval
    sound.playInterval(bNote.midi, tNote.midi, 'harmonic');
  }, [speedLimitSec]);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  // Speed timer
  useEffect(() => {
    if (speedLimitSec <= 0 || feedback.status !== 'idle') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeftSec(speedLimitSec);
    const interval = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [speedLimitSec, feedback.status]);

  const handleTimeUp = () => {
    sound.playError();
    const correct = getTargetAnswer();
    setFeedback({
      status: 'incorrect',
      message: `Time's up! The answer was ${correct}.`,
      correctAnswerText: correct,
    });
    onRecordResult(false, speedLimitSec * 1000, `ET Resolution Rule #${currentRule.id}`, 'Timeout', correct);
  };

  const playFullResolution = () => {
    if (!topNote || !bottomNote || !resolveTopNote || !resolveBottomNote) return;
    sound.playResolution(topNote.midi, bottomNote.midi, resolveTopNote.midi, resolveBottomNote.midi);
  };

  const getTargetAnswer = (): string => {
    if (qType === 'ask_resolution_interval') {
      // e.g. "M3" or "m6"
      return currentRule.majorResolution.split(' ')[0];
    } else if (qType === 'ask_interval_name') {
      return currentRule.interval;
    } else {
      // scale degrees: e.g. "3, 1" or "3 1" or "1 3"
      return `${currentRule.resolveTop} & ${currentRule.resolveBottom}`;
    }
  };

  const handleSubmit = (submittedVal?: string) => {
    if (!topNote || !bottomNote || !resolveTopNote || !resolveBottomNote || feedback.status !== 'idle') return;
    const input = (submittedVal ?? userInput).trim();
    const timeSpent = Date.now() - startTimeRef.current;
    const target = getTargetAnswer();

    let isCorrect = false;
    if (qType === 'ask_resolution_interval') {
      isCorrect = input.toLowerCase().includes(target.toLowerCase());
    } else if (qType === 'ask_interval_name') {
      isCorrect = input.toLowerCase() === target.toLowerCase();
    } else {
      // Degrees
      const numbers = input.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        const hasA = numbers.includes(currentRule.resolveTop.toString());
        const hasB = numbers.includes(currentRule.resolveBottom.toString());
        isCorrect = hasA && hasB;
      }
    }

    if (isCorrect) {
      sound.playSuccess();
      playFullResolution();
      setFeedback({
        status: 'correct',
        message: `Correct! ${currentRule.description} (${currentRule.majorResolution}).`,
      });
      onRecordResult(true, timeSpent, `ET Resolution Rule #${currentRule.id}`, input, target);
      setTimeout(() => {
        loadNewQuestion();
      }, 1600);
    } else {
      sound.playError();
      setFeedback({
        status: 'incorrect',
        message: `Not quite. Expected: ${target}. ${currentRule.description} (${currentRule.majorResolution}).`,
        correctAnswerText: target,
      });
      onRecordResult(false, timeSpent, `ET Resolution Rule #${currentRule.id}`, input, target);
    }
  };

  if (!topNote || !bottomNote || !resolveTopNote || !resolveBottomNote) return null;

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Header */}
      <div className="w-full max-w-xl flex items-center justify-between font-mono text-xs text-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-[#d44c4c]" />
          <span className="font-bold uppercase tracking-wider">ET Class 2: Resolution Drill</span>
        </div>
        <span className="border border-[#1a1a1a]/30 px-2 py-0.5">
          Rule #{currentRule.id} in {currentKey.name}
        </span>
      </div>

      {/* Speed Timer Bar */}
      {speedLimitSec > 0 && feedback.status === 'idle' && (
        <div className="w-full max-w-xl h-1 bg-[#1a1a1a]/10 border border-[#1a1a1a]/20 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              timeLeftSec < 1.0 ? 'bg-[#d44c4c]' : timeLeftSec < 2.0 ? 'bg-[#d44c4c]/70' : 'bg-[#1a1a1a]'
            }`}
            style={{ width: `${(timeLeftSec / speedLimitSec) * 100}%` }}
          />
        </div>
      )}

      {/* Staff Display showing Initial Interval & Resolution Measure */}
      <div className="relative w-full max-w-xl flex flex-col items-center">
        <StaffDisplay
          notes={[bottomNote, topNote]}
          degrees={[currentRule.degreeBottom, currentRule.degreeTop]}
          intervalLabel={currentRule.interval}
          showResolution={true}
          resolutionNotes={[resolveBottomNote, resolveTopNote]}
          resolutionDegrees={feedback.status === 'correct' ? [currentRule.resolveBottom, currentRule.resolveTop] : ['?', '?']}
          resolutionIntervalLabel={feedback.status === 'correct' ? currentRule.majorResolution : undefined}
        />

        <button
          type="button"
          id="play-resolution-btn"
          onClick={playFullResolution}
          className="absolute right-3 top-3 px-2.5 py-1 border border-[#1a1a1a] bg-[#fdfaf3] hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[11px] font-mono uppercase tracking-wider text-[#1a1a1a] shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#d44c4c]" />
          <span>Hear Resolution</span>
        </button>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-xl border border-[#1a1a1a] bg-[#fdfaf3] p-5 sm:p-6 text-left shadow-xs flex flex-col gap-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 mb-1">
          Exercise Directive
        </div>

        {qType === 'ask_resolution_interval' && (
          <div>
            <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
              In Major, what interval does this{' '}
              <span className="text-[#d44c4c] font-semibold underline decoration-[#d44c4c]/40 underline-offset-4">{currentRule.interval}</span> ({bottomNote.name} & {topNote.name}) resolve into?
            </p>
            <p className="font-mono text-xs text-[#1a1a1a]/60 mt-1">
              Hint: ^{currentRule.degreeTop} → ^{currentRule.resolveTop}, and ^{currentRule.degreeBottom} → ^{currentRule.resolveBottom}.
            </p>
          </div>
        )}

        {qType === 'ask_interval_name' && (
          <div>
            <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
              What is the starting interval between{' '}
              <span className="text-[#d44c4c] font-semibold">{bottomNote.name}</span> (degree ^{currentRule.degreeBottom}) and{' '}
              <span className="font-semibold">{topNote.name}</span> (degree ^{currentRule.degreeTop})?
            </p>
            <p className="font-mono text-xs text-[#1a1a1a]/60 mt-1">
              Type the interval code: e.g. <span className="font-bold text-[#1a1a1a]">d5, A4, m7, M2, m6</span>
            </p>
          </div>
        )}

        {qType === 'ask_scale_degrees' && (
          <div>
            <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
              To which scale degrees do ^{currentRule.degreeBottom} and ^{currentRule.degreeTop} resolve?
            </p>
            <p className="font-mono text-xs text-[#1a1a1a]/60 mt-1">
              e.g. Type <span className="font-bold text-[#1a1a1a]">3 and 1</span> or <span className="font-bold text-[#1a1a1a]">1 and 3</span>
            </p>
          </div>
        )}

        {feedback.status !== 'idle' && (
          <div
            className={`w-full mt-2 p-3 border font-mono text-xs flex items-center justify-between gap-3 text-left transition-all ${
              feedback.status === 'correct'
                ? 'border-[#1a1a1a] bg-[#fdfaf3] text-[#1a1a1a]'
                : 'border-[#d44c4c] bg-[#d44c4c]/5 text-[#d44c4c]'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.status === 'correct' ? (
                <CheckCircle2 className="w-4 h-4 text-[#1a1a1a] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-[#d44c4c] shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>

            {feedback.status === 'incorrect' && (
              <button
                type="button"
                id="next-res-error-btn"
                onClick={loadNewQuestion}
                className="shrink-0 px-3 py-1 border border-[#d44c4c] bg-[#d44c4c] hover:bg-red-700 text-[#fdfaf3] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Next ↵
              </button>
            )}
          </div>
        )}
      </div>

      {/* Keypad */}
      <Keypad
        mode={
          qType === 'ask_resolution_interval'
            ? 'resolution'
            : qType === 'ask_interval_name'
            ? 'interval'
            : 'scale_degree'
        }
        currentInput={userInput}
        onInputChange={setUserInput}
        onSubmit={handleSubmit}
        placeholder="Type answer..."
        disabled={feedback.status !== 'idle'}
      />
    </div>
  );
};
