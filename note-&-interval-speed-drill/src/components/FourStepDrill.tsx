import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { ResolutionChainQuestion } from '../types/music';
import {
  generateResolutionChainQuestion,
  normalizeResolutionCodeInput,
  isNoteMatch,
  isResolutionNotesMatch,
} from '../utils/musicTheory';
import { sound } from '../utils/audio';
import { StaffDisplay } from './StaffDisplay';
import { Keypad } from './Keypad';

interface FourStepDrillProps {
  onRecordResult: (
    isCorrect: boolean,
    timeSpentMs: number,
    qText: string,
    userAns: string,
    correctAns: string
  ) => void;
  speedLimitSec: number;
}

type StepIndex = 1 | 2 | 3 | 4;

export const FourStepDrill: React.FC<FourStepDrillProps> = ({
  onRecordResult,
  speedLimitSec,
}) => {
  const [question, setQuestion] = useState<ResolutionChainQuestion | null>(null);
  const [currentStep, setCurrentStep] = useState<StepIndex>(1);
  const [userInput, setUserInput] = useState('');

  // Track if this drill question was answered with 100% accuracy on first tries
  const [isChainFlawless, setIsChainFlawless] = useState(true);

  // Feedback states
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'incorrect';
    message: string;
    correctAnswerText?: string;
  }>({ status: 'idle', message: '' });

  // Timing
  const stepStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(speedLimitSec);

  // Initialize new resolution chain question
  const loadNewQuestion = useCallback(() => {
    const q = generateResolutionChainQuestion();
    setQuestion(q);
    setCurrentStep(1);
    setUserInput('');
    setIsChainFlawless(true);
    setFeedback({ status: 'idle', message: '' });
    stepStartTimeRef.current = Date.now();
    setTimeLeftSec(speedLimitSec);
  }, [speedLimitSec]);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  // Speed timer countdown
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
  }, [speedLimitSec, currentStep, feedback.status]);

  const handleTimeUp = () => {
    sound.playError();
    setIsChainFlawless(false);
    let correct = '';
    if (currentStep === 1 && question) correct = question.rule.code;
    if (currentStep === 2 && question) correct = question.key.name;
    if (currentStep === 3 && question) correct = question.topNote.name;
    if (currentStep === 4 && question) {
      correct = `${question.resolveBottomNote.name} & ${question.resolveTopNote.name}`;
    }

    setFeedback({
      status: 'incorrect',
      message: `Time's up! The answer was ${correct}.`,
      correctAnswerText: correct,
    });
    onRecordResult(false, speedLimitSec * 1000, `Step ${currentStep}`, 'Timeout', correct);
  };

  const playCurrentAudio = () => {
    if (!question) return;
    if (currentStep === 1) {
      // Harmonic preview of interval
      sound.playInterval(question.bottomNote.midi, question.topNote.midi, 'harmonic');
    } else if (currentStep === 2) {
      // Bottom note
      sound.playNote(question.bottomNote.midi, 0.9);
    } else if (currentStep === 3) {
      // Harmonic interval in key if correct, else bottom note
      if (feedback.status === 'correct') {
        sound.playInterval(question.bottomNote.midi, question.topNote.midi, 'harmonic');
      } else {
        sound.playNote(question.bottomNote.midi, 0.9);
      }
    } else {
      // Full resolution!
      sound.playResolution(
        question.topNote.midi,
        question.bottomNote.midi,
        question.resolveTopNote.midi,
        question.resolveBottomNote.midi
      );
    }
  };

  // Submit handler for all 4 steps
  const handleSubmit = (submittedVal?: string) => {
    if (!question || feedback.status !== 'idle') return;
    const input = (submittedVal ?? userInput).trim();
    if (!input) return;
    const timeSpent = Date.now() - stepStartTimeRef.current;

    // STEP 1: What is the scale degree pattern? (e.g. 5431, 7431)
    if (currentStep === 1) {
      const normInput = normalizeResolutionCodeInput(input);
      const isCorrect = normInput === question.rule.code;
      const correctText = question.rule.code;

      if (isCorrect) {
        sound.playSuccess();
        setFeedback({
          status: 'correct',
          message: `Correct! Scale degrees are ^${question.rule.degreeBottom} & ^${question.rule.degreeTop} resolving to ^${question.rule.resolveBottom} & ^${question.rule.resolveTop} (${question.rule.code}).`,
        });
        onRecordResult(
          true,
          timeSpent,
          `Scale Degree pattern for ${question.rule.prompt}`,
          input,
          correctText
        );

        setTimeout(() => {
          setCurrentStep(2);
          setUserInput('');
          setFeedback({ status: 'idle', message: '' });
          stepStartTimeRef.current = Date.now();
          setTimeLeftSec(speedLimitSec);
          // Play bottom note sound for step 2
          sound.playNote(question.bottomNote.midi, 0.85);
        }, 800);
      } else {
        sound.playError();
        setIsChainFlawless(false);
        setFeedback({
          status: 'incorrect',
          message: `Not quite. For ${question.rule.prompt}, the scale degrees are ${question.rule.code} (^${question.rule.degreeBottom} and ^${question.rule.degreeTop} → ^${question.rule.resolveBottom} and ^${question.rule.resolveTop}).`,
          correctAnswerText: correctText,
        });
        onRecordResult(
          false,
          timeSpent,
          `Scale Degree pattern for ${question.rule.prompt}`,
          input,
          correctText
        );
      }
    }

    // STEP 2: Asking what is the key?
    else if (currentStep === 2) {
      const normalizeKey = (str: string) =>
        str.replace(/♯/g, '#').replace(/♭/g, 'b').trim().toUpperCase();
      const userNorm = normalizeKey(input);
      const normRoot = normalizeKey(question.key.root);
      const normFullName = normalizeKey(question.key.name);

      const isCorrect =
        userNorm === normRoot ||
        userNorm === normFullName ||
        userNorm === `${normRoot}M` ||
        userNorm === `${normRoot}MAJ` ||
        userNorm === `${normRoot} MAJOR`;
      const correctText = question.key.name;

      if (isCorrect) {
        sound.playSuccess();
        setFeedback({
          status: 'correct',
          message: `Correct! When ${question.bottomNote.name} is degree ^${question.rule.degreeBottom}, the key is ${question.key.name}.`,
        });
        onRecordResult(
          true,
          timeSpent,
          `Key for ${question.bottomNote.name} (degree ^${question.rule.degreeBottom})`,
          input,
          correctText
        );

        setTimeout(() => {
          setCurrentStep(3);
          setUserInput('');
          setFeedback({ status: 'idle', message: '' });
          stepStartTimeRef.current = Date.now();
          setTimeLeftSec(speedLimitSec);
          // Play bottom note for Step 3
          sound.playNote(question.bottomNote.midi, 0.85);
        }, 850);
      } else {
        sound.playError();
        setIsChainFlawless(false);
        setFeedback({
          status: 'incorrect',
          message: `Incorrect. When ${question.bottomNote.name} is degree ^${question.rule.degreeBottom}, the key is ${question.key.name}.`,
          correctAnswerText: correctText,
        });
        onRecordResult(
          false,
          timeSpent,
          `Key for ${question.bottomNote.name} (degree ^${question.rule.degreeBottom})`,
          input,
          correctText
        );
      }
    }

    // STEP 3: What is the top note in the key? (Tension pitch spelling)
    else if (currentStep === 3) {
      const isCorrect = isNoteMatch(input, question.topNote, question.bottomNote);
      const correctText = question.topNote.name;

      if (isCorrect) {
        // Play harmonic interval
        sound.playInterval(question.bottomNote.midi, question.topNote.midi, 'harmonic');
        setFeedback({
          status: 'correct',
          message: `Correct! In ${question.key.name}, degree ^${question.rule.degreeTop} is ${question.topNote.name} (forming a ${question.rule.interval} with ${question.bottomNote.name}).`,
        });
        onRecordResult(
          true,
          timeSpent,
          `Top note in ${question.key.name} (degree ^${question.rule.degreeTop})`,
          input,
          correctText
        );

        setTimeout(() => {
          setCurrentStep(4);
          setUserInput('');
          setFeedback({ status: 'idle', message: '' });
          stepStartTimeRef.current = Date.now();
          setTimeLeftSec(speedLimitSec);
        }, 900);
      } else {
        sound.playError();
        setIsChainFlawless(false);
        setFeedback({
          status: 'incorrect',
          message: `Incorrect. In ${question.key.name}, degree ^${question.rule.degreeTop} is ${question.topNote.name}.`,
          correctAnswerText: correctText,
        });
        onRecordResult(
          false,
          timeSpent,
          `Top note in ${question.key.name} (degree ^${question.rule.degreeTop})`,
          input,
          correctText
        );
      }
    }

    // STEP 4: Spell the resolution note!
    else if (currentStep === 4) {
      const isCorrect = isResolutionNotesMatch(
        input,
        question.resolveBottomNote,
        question.resolveTopNote
      );
      const correctText = `${question.resolveBottomNote.name} and ${question.resolveTopNote.name}`;

      if (isCorrect) {
        // Play full voice-leading resolution audio!
        sound.playResolution(
          question.topNote.midi,
          question.bottomNote.midi,
          question.resolveTopNote.midi,
          question.resolveBottomNote.midi
        );

        setFeedback({
          status: 'correct',
          message: `🎉 Resolved! ${question.rule.interval} (${question.bottomNote.name} & ${question.topNote.name}) → ${question.rule.majorResolution} (${question.resolveBottomNote.name} & ${question.resolveTopNote.name}) in ${question.key.name}!`,
        });
        onRecordResult(
          true,
          timeSpent,
          `Resolution notes for ${question.rule.interval} in ${question.key.name}`,
          input,
          correctText
        );

        // Advance to next question after celebrating
        setTimeout(() => {
          loadNewQuestion();
        }, 2200);
      } else {
        sound.playError();
        setIsChainFlawless(false);
        setFeedback({
          status: 'incorrect',
          message: `Not quite. In ${question.key.name}, degree ^${question.rule.resolveBottom} is ${question.resolveBottomNote.name} and degree ^${question.rule.resolveTop} is ${question.resolveTopNote.name}.`,
          correctAnswerText: correctText,
        });
        onRecordResult(
          false,
          timeSpent,
          `Resolution notes for ${question.rule.interval} in ${question.key.name}`,
          input,
          correctText
        );
      }
    }
  };

  const handleNextStepAfterError = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setUserInput('');
      setFeedback({ status: 'idle', message: '' });
      stepStartTimeRef.current = Date.now();
      setTimeLeftSec(speedLimitSec);
      if (question) sound.playNote(question.bottomNote.midi, 0.85);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setUserInput('');
      setFeedback({ status: 'idle', message: '' });
      stepStartTimeRef.current = Date.now();
      setTimeLeftSec(speedLimitSec);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setUserInput('');
      setFeedback({ status: 'idle', message: '' });
      stepStartTimeRef.current = Date.now();
      setTimeLeftSec(speedLimitSec);
    } else {
      loadNewQuestion();
    }
  };

  if (!question) return null;

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* 4-Step Progress Indicator Header */}
      <div className="w-full max-w-xl flex items-center justify-between gap-1 px-1 font-mono text-xs">
        {[
          { num: 1, label: '1. Scale Degrees' },
          { num: 2, label: '2. What is Key?' },
          { num: 3, label: '3. The Note' },
          { num: 4, label: '4. Spell Resolution' },
        ].map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} className="flex-1 flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 border flex items-center justify-center text-xs font-mono transition-all ${
                  isCurrent
                    ? 'border-[#d44c4c] bg-[#d44c4c] text-[#fdfaf3] font-bold shadow-xs'
                    : isDone
                    ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfaf3]'
                    : 'border-[#1a1a1a]/30 text-[#1a1a1a]/40 bg-transparent'
                }`}
              >
                {isDone ? '✓' : step.num}
              </div>
              <span
                className={`text-[10px] font-mono mt-1 uppercase tracking-wider hidden sm:inline ${
                  isCurrent
                    ? 'text-[#d44c4c] font-bold'
                    : isDone
                    ? 'text-[#1a1a1a]'
                    : 'text-[#1a1a1a]/40'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Speed Countdown Timer Bar (if timed) */}
      {speedLimitSec > 0 && feedback.status === 'idle' && (
        <div className="w-full max-w-xl h-1 bg-[#1a1a1a]/10 border border-[#1a1a1a]/20 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              timeLeftSec < 1.0
                ? 'bg-[#d44c4c]'
                : timeLeftSec < 2.0
                ? 'bg-[#d44c4c]/70'
                : 'bg-[#1a1a1a]'
            }`}
            style={{ width: `${(timeLeftSec / speedLimitSec) * 100}%` }}
          />
        </div>
      )}

      {/* Musical Staff Display */}
      <div className="relative w-full max-w-xl flex flex-col items-center">
        <StaffDisplay
          notes={
            currentStep === 1
              ? []
              : currentStep === 2
              ? [question.bottomNote]
              : currentStep === 3 && feedback.status !== 'correct'
              ? [question.bottomNote]
              : [question.bottomNote, question.topNote]
          }
          degrees={
            currentStep === 1
              ? []
              : currentStep === 2
              ? [`^${question.rule.degreeBottom}`]
              : currentStep === 3 && feedback.status !== 'correct'
              ? [`^${question.rule.degreeBottom}`]
              : [`^${question.rule.degreeBottom}`, `^${question.rule.degreeTop}`]
          }
          intervalLabel={
            currentStep === 1
              ? question.rule.prompt
              : currentStep === 2
              ? `${question.rule.interval} (What is the Key?)`
              : currentStep === 3
              ? `${question.rule.interval} in ${question.key.name}`
              : `${question.rule.interval} in ${question.key.name}`
          }
          showResolution={currentStep === 4 && feedback.status === 'correct'}
          resolutionNotes={[question.resolveBottomNote, question.resolveTopNote]}
          resolutionDegrees={[
            `^${question.rule.resolveBottom}`,
            `^${question.rule.resolveTop}`,
          ]}
          resolutionIntervalLabel={`Resolves to ${question.rule.majorResolution}`}
        />

        {/* Floating Replay Sound Button */}
        <button
          type="button"
          id="replay-audio-btn"
          onClick={playCurrentAudio}
          className="absolute right-3 top-3 px-2.5 py-1 border border-[#1a1a1a] bg-[#fdfaf3] hover:bg-[#1a1a1a] hover:text-[#fdfaf3] text-[11px] font-mono uppercase tracking-wider text-[#1a1a1a] shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#d44c4c]" />
          <span>
            {currentStep === 1
              ? 'Play Interval'
              : currentStep === 2
              ? `Play Bottom (${question.bottomNote.name})`
              : currentStep === 3
              ? (feedback.status === 'correct' ? 'Play Interval' : `Play Bottom (${question.bottomNote.name})`)
              : 'Play Resolution'}
          </span>
        </button>
      </div>

      {/* Question Prompt Card (Exercise Directive) */}
      <div className="w-full max-w-xl border border-[#1a1a1a] bg-[#fdfaf3] p-5 sm:p-6 text-left shadow-xs">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 mb-2 flex items-center justify-between">
          <span>Exercise Directive</span>
          <span>Step {currentStep} of 4</span>
        </div>

        {/* STEP 1: Scale Degree Pattern */}
        {currentStep === 1 && (
          <div className="space-y-1.5">
            <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
              <span className="text-[#d44c4c] font-semibold underline decoration-[#d44c4c]/40 underline-offset-4">
                {question.rule.prompt}
              </span>
              , identify the specific scale degree pattern associated with this move.
            </p>
            <p className="font-mono text-xs text-[#1a1a1a]/60">
              Type the 4-digit code (e.g. <span className="font-bold text-[#1a1a1a]">5431</span>, <span className="font-bold text-[#1a1a1a]">7431</span>, <span className="font-bold text-[#1a1a1a]">4713</span>) or tap quick buttons below.
            </p>
          </div>
        )}

        {/* STEP 2: Asking What is the Key */}
        {currentStep === 2 && (
          <div className="space-y-1.5">
            <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
              Bottom note is{' '}
              <span className="text-[#d44c4c] font-semibold">{question.bottomNote.name}</span> (degree ^{question.rule.degreeBottom}). What is the Key?
            </p>
            <p className="font-mono text-xs text-[#1a1a1a]/60">
              Pattern: <span className="font-semibold text-[#1a1a1a]">{question.rule.prompt}</span> (code <span className="font-bold text-[#1a1a1a]">{question.rule.code}</span>). Select or type key tonic below.
            </p>
          </div>
        )}

        {/* STEP 3: The Note (Tension Pitch Spelling) */}
        {currentStep === 3 && (
          <div className="space-y-1.5">
            <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
              In <span className="text-[#d44c4c] font-semibold underline decoration-[#d44c4c]/40 underline-offset-4">{question.key.name}</span>, bottom note is{' '}
              <span className="font-semibold text-[#1a1a1a]">{question.bottomNote.name}</span>. What is the top note (degree ^{question.rule.degreeTop})?
            </p>
            <p className="font-mono text-xs text-[#1a1a1a]/60">
              Interval is <span className="font-semibold text-[#1a1a1a]">{question.rule.name}</span>. Enter the note letter (e.g. {question.topNote.natural}).
            </p>
          </div>
        )}

        {/* STEP 4: Spell the Resolution Note */}
        {currentStep === 4 && (
          <div className="space-y-2">
            <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1a1a1a] font-normal leading-snug">
              Spell the resolution notes in{' '}
              <span className="text-[#d44c4c] font-semibold underline decoration-[#d44c4c]/40 underline-offset-4">{question.key.name}</span>:
            </p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-2 py-1 border border-[#1a1a1a]/30 bg-transparent text-[#1a1a1a]">
                Bottom (^^{question.rule.degreeBottom} → ^{question.rule.resolveBottom}): {question.bottomNote.name} → ?
              </span>
              <span className="text-[#1a1a1a]/40">&</span>
              <span className="px-2 py-1 border border-[#1a1a1a]/30 bg-transparent text-[#1a1a1a]">
                Top (^^{question.rule.degreeTop} → ^{question.rule.resolveTop}): {question.topNote.name} → ?
              </span>
            </div>
            <p className="font-mono text-xs text-[#1a1a1a]/60">
              Type both notes separated by a space (e.g. <span className="font-bold text-[#1a1a1a]">{question.resolveBottomNote.name} {question.resolveTopNote.name}</span>).
            </p>
          </div>
        )}

        {/* Feedback Banner */}
        {feedback.status !== 'idle' && (
          <div
            className={`w-full mt-3 p-3 border font-mono text-xs flex items-start justify-between gap-3 text-left transition-all ${
              feedback.status === 'correct'
                ? 'border-[#1a1a1a] bg-[#fdfaf3] text-[#1a1a1a]'
                : 'border-[#d44c4c] bg-[#d44c4c]/5 text-[#d44c4c]'
            }`}
          >
            <div className="flex items-start gap-2">
              {feedback.status === 'correct' ? (
                <CheckCircle2 className="w-4 h-4 text-[#1a1a1a] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-[#d44c4c] shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{feedback.message}</p>
                {question.rule && currentStep === 4 && (
                  <p className="text-[11px] text-[#1a1a1a]/70 mt-1 font-normal italic">
                    Voice leading rule: {question.rule.description}
                  </p>
                )}
              </div>
            </div>

            {feedback.status === 'incorrect' && (
              <button
                type="button"
                id="next-step-error-btn"
                onClick={handleNextStepAfterError}
                className="shrink-0 px-3 py-1 border border-[#d44c4c] bg-[#d44c4c] hover:bg-red-700 text-[#fdfaf3] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Continue ↵
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Keypad & Quick Buttons */}
      <Keypad
        mode={
          currentStep === 1
            ? 'resolution_code'
            : currentStep === 2
            ? 'key'
            : currentStep === 3
            ? 'note'
            : 'resolution_spelling'
        }
        currentInput={userInput}
        onInputChange={setUserInput}
        onSubmit={handleSubmit}
        placeholder={
          currentStep === 1
            ? 'Enter 4-digit code (e.g. 5431)...'
            : currentStep === 2
            ? 'Enter key tonic (e.g. C, G, Bb)...'
            : currentStep === 3
            ? 'Enter top note (e.g. F, F#)...'
            : `Enter resolution notes (e.g. ${question.resolveBottomNote.name} ${question.resolveTopNote.name})...`
        }
        disabled={feedback.status !== 'idle'}
      />

      {/* Manual Skip / Replay row */}
      <div className="w-full max-w-xl flex items-center justify-between font-mono text-xs text-[#1a1a1a]/60 pt-1">
        <button
          type="button"
          onClick={loadNewQuestion}
          className="hover:text-[#1a1a1a] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Skip Interval</span>
        </button>

        <button
          type="button"
          onClick={playCurrentAudio}
          className="hover:text-[#1a1a1a] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#d44c4c]" />
          <span>Replay Audio (Space)</span>
        </button>
      </div>
    </div>
  );
};
