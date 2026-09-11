import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle, Zap, RefreshCw } from 'lucide-react';
import { NoteInfo, IntervalName } from '../types/music';
import {
  generateIntervalQuestion,
  normalizeIntervalInput,
} from '../utils/musicTheory';
import { sound } from '../utils/audio';
import { StaffDisplay } from './StaffDisplay';
import { Keypad } from './Keypad';

interface IntervalDrillProps {
  onRecordResult: (isCorrect: boolean, timeSpentMs: number, qText: string, userAns: string, correctAns: string) => void;
  speedLimitSec: number;
}

export const IntervalDrill: React.FC<IntervalDrillProps> = ({
  onRecordResult,
  speedLimitSec,
}) => {
  const [question, setQuestion] = useState<{
    note1: NoteInfo;
    note2: NoteInfo;
    correctInterval: IntervalName;
    direction: 'up' | 'down';
  } | null>(null);

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'incorrect';
    message: string;
    correctAnswerText?: string;
  }>({ status: 'idle', message: '' });

  const [audioPlaybackMode, setAudioPlaybackMode] = useState<'melodic' | 'harmonic'>('melodic');
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(speedLimitSec);

  const loadNewQuestion = useCallback(() => {
    const q = generateIntervalQuestion();
    setQuestion(q);
    setUserInput('');
    setFeedback({ status: 'idle', message: '' });
    startTimeRef.current = Date.now();
    setTimeLeftSec(speedLimitSec);

    // Play interval audio
    sound.playInterval(q.note1.midi, q.note2.midi, audioPlaybackMode);
  }, [speedLimitSec, audioPlaybackMode]);

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
    if (!question) return;
    sound.playError();
    setFeedback({
      status: 'incorrect',
      message: `Time's up! The interval is ${question.correctInterval}.`,
      correctAnswerText: question.correctInterval,
    });
    onRecordResult(false, speedLimitSec * 1000, `Interval ${question.note1.name} -> ${question.note2.name}`, 'Timeout', question.correctInterval);
  };

  const playAudio = () => {
    if (!question) return;
    sound.playInterval(question.note1.midi, question.note2.midi, audioPlaybackMode);
  };

  const handleSubmit = (submittedVal?: string) => {
    if (!question || feedback.status !== 'idle') return;
    const input = (submittedVal ?? userInput).trim();
    const timeSpent = Date.now() - startTimeRef.current;

    const normalized = normalizeIntervalInput(input);
    const isCorrect = normalized === question.correctInterval;

    if (isCorrect) {
      sound.playSuccess();
      setFeedback({
        status: 'correct',
        message: `Correct! ${question.note1.name} to ${question.note2.name} is a ${question.correctInterval}.`,
      });
      onRecordResult(true, timeSpent, `Interval ${question.note1.name} -> ${question.note2.name}`, input, question.correctInterval);
      setTimeout(() => {
        loadNewQuestion();
      }, 950);
    } else {
      sound.playError();
      setFeedback({
        status: 'incorrect',
        message: `Incorrect. Between ${question.note1.name} and ${question.note2.name} is a ${question.correctInterval}.`,
        correctAnswerText: question.correctInterval,
      });
      onRecordResult(false, timeSpent, `Interval ${question.note1.name} -> ${question.note2.name}`, input, question.correctInterval);
    }
  };

  if (!question) return null;

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Header Info */}
      <div className="w-full max-w-xl flex items-center justify-between font-mono text-xs text-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#d44c4c]" />
          <span className="font-bold uppercase tracking-wider">Interval Speed Typer</span>
        </div>

        <div className="flex items-center gap-1 border border-[#1a1a1a] p-0.5">
          <button
            type="button"
            id="audio-mode-melodic"
            onClick={() => setAudioPlaybackMode('melodic')}
            className={`px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              audioPlaybackMode === 'melodic'
                ? 'bg-[#1a1a1a] text-[#fdfaf3] font-bold'
                : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
            }`}
          >
            Melodic
          </button>
          <button
            type="button"
            id="audio-mode-harmonic"
            onClick={() => setAudioPlaybackMode('harmonic')}
            className={`px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              audioPlaybackMode === 'harmonic'
                ? 'bg-[#1a1a1a] text-[#fdfaf3] font-bold'
                : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
            }`}
          >
            Harmonic
          </button>
        </div>
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

      {/* Staff Display */}
      <div className="relative w-full max-w-xl flex flex-col items-center">
        <StaffDisplay
          notes={[question.note1, question.note2]}
          intervalLabel={feedback.status === 'correct' ? question.correctInterval : undefined}
        />

        <button
          type="button"
          id="replay-interval-btn"
          onClick={playAudio}
          className="absolute right-3 top-3 px-2.5 py-1 border border-[#1a1a1a] bg-[#fdfaf3] hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[11px] font-mono uppercase tracking-wider text-[#1a1a1a] shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#d44c4c]" />
          <span>Replay Sound (Space)</span>
        </button>
      </div>

      {/* Prompt Card */}
      <div className="w-full max-w-xl border border-[#1a1a1a] bg-[#fdfaf3] p-5 sm:p-6 text-left shadow-xs flex flex-col gap-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 mb-1">
          Direct Query
        </div>
        <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
          Identify the interval:{' '}
          <span className="text-[#d44c4c] font-semibold">{question.note1.name}</span>
          {' → '}
          <span className="font-semibold">{question.note2.name}</span>
        </p>
        <p className="font-mono text-xs text-[#1a1a1a]/60">
          Type interval shortcut (e.g. <span className="font-bold text-[#1a1a1a]">m2, M3, P4, d5, A4, P5, m7</span>) or tap keypad below.
        </p>

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
                id="next-interval-error-btn"
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
        mode="interval"
        currentInput={userInput}
        onInputChange={setUserInput}
        onSubmit={handleSubmit}
        placeholder="Type interval (e.g. m3, M3, P5, d5)..."
        disabled={feedback.status !== 'idle'}
      />
    </div>
  );
};
