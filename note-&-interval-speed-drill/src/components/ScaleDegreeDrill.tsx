import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle, Compass } from 'lucide-react';
import { generateScaleDegreeQuestion } from '../utils/musicTheory';
import { sound } from '../utils/audio';
import { StaffDisplay } from './StaffDisplay';
import { Keypad } from './Keypad';

interface ScaleDegreeDrillProps {
  onRecordResult: (isCorrect: boolean, timeSpentMs: number, qText: string, userAns: string, correctAns: string) => void;
  speedLimitSec: number;
}

export const ScaleDegreeDrill: React.FC<ScaleDegreeDrillProps> = ({
  onRecordResult,
  speedLimitSec,
}) => {
  const [question, setQuestion] = useState<ReturnType<typeof generateScaleDegreeQuestion> | null>(null);
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
    const q = generateScaleDegreeQuestion();
    setQuestion(q);
    setUserInput('');
    setFeedback({ status: 'idle', message: '' });
    startTimeRef.current = Date.now();
    setTimeLeftSec(speedLimitSec);

    // Play note audio
    sound.playNote(q.note.midi, 0.9);
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
    if (!question) return;
    sound.playError();
    setFeedback({
      status: 'incorrect',
      message: `Time's up! The answer was ${question.correctAnswer}.`,
      correctAnswerText: question.correctAnswer,
    });
    onRecordResult(false, speedLimitSec * 1000, question.questionText, 'Timeout', question.correctAnswer);
  };

  const handleSubmit = (submittedVal?: string) => {
    if (!question || feedback.status !== 'idle') return;
    const input = (submittedVal ?? userInput).trim();
    const timeSpent = Date.now() - startTimeRef.current;

    const normInput = input.replace(/[\^]/g, '').toLowerCase();
    const targetNorm = question.correctAnswer.toLowerCase();
    const isCorrect = normInput === targetNorm;

    if (isCorrect) {
      sound.playSuccess();
      setFeedback({
        status: 'correct',
        message: `Correct! ${question.explanation}`,
      });
      onRecordResult(true, timeSpent, question.questionText, input, question.correctAnswer);
      setTimeout(() => {
        loadNewQuestion();
      }, 1100);
    } else {
      sound.playError();
      setFeedback({
        status: 'incorrect',
        message: `Not quite. ${question.explanation}`,
        correctAnswerText: question.correctAnswer,
      });
      onRecordResult(false, timeSpent, question.questionText, input, question.correctAnswer);
    }
  };

  if (!question) return null;

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Header */}
      <div className="w-full max-w-xl flex items-center justify-between font-mono text-xs text-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#d44c4c]" />
          <span className="font-bold uppercase tracking-wider">Scale Degree & Key Drill</span>
        </div>
        <span className="border border-[#1a1a1a]/30 px-2 py-0.5">
          Key: {question.key.name}
        </span>
      </div>

      {/* Speed Timer */}
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
          notes={[question.note]}
          degrees={question.type === 'find_degree' ? ['?'] : [question.degree]}
        />

        <button
          type="button"
          id="replay-scale-note-btn"
          onClick={() => sound.playNote(question.note.midi, 0.9)}
          className="absolute right-3 top-3 px-2.5 py-1 border border-[#1a1a1a] bg-[#fdfaf3] hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[11px] font-mono uppercase tracking-wider text-[#1a1a1a] shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#d44c4c]" />
          <span>Play Note</span>
        </button>
      </div>

      {/* Question Prompt */}
      <div className="w-full max-w-xl border border-[#1a1a1a] bg-[#fdfaf3] p-5 sm:p-6 text-left shadow-xs flex flex-col gap-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 mb-1">
          Exercise Directive
        </div>
        <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
          {question.questionText}
        </p>
        <p className="font-mono text-xs text-[#1a1a1a]/60">
          {question.type === 'find_degree' && 'Type scale degree (1 - 7)'}
          {question.type === 'find_key' && 'Type the Key tonic (e.g. C, D, Eb, G)'}
          {question.type === 'find_note' && 'Type note name (e.g. F, F#, Bb)'}
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
                id="next-scale-error-btn"
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
          question.type === 'find_degree'
            ? 'scale_degree'
            : question.type === 'find_key'
            ? 'key'
            : 'note'
        }
        currentInput={userInput}
        onInputChange={setUserInput}
        onSubmit={handleSubmit}
        placeholder="Enter answer..."
        disabled={feedback.status !== 'idle'}
      />
    </div>
  );
};
