import React, { useState, useEffect } from 'react';
import {
  Zap,
  BookOpen,
  Layers,
  History,
  Music,
  Compass,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { DrillMode, DrillStats } from './types/music';
import { sound } from './utils/audio';
import { ScoreBoard } from './components/ScoreBoard';
import { FourStepDrill } from './components/FourStepDrill';
import { IntervalDrill } from './components/IntervalDrill';
import { ScaleDegreeDrill } from './components/ScaleDegreeDrill';
import { ResolutionDrill } from './components/ResolutionDrill';
import { TheoryReference } from './components/TheoryReference';

export default function App() {
  const [drillMode, setDrillMode] = useState<DrillMode>('four_step');
  const [speedLimitSec, setSpeedLimitSec] = useState<number>(0); // 0 = untimed
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Global Session Statistics
  const [stats, setStats] = useState<DrillStats>({
    totalAnswered: 0,
    correctCount: 0,
    streak: 0,
    bestStreak: 0,
    totalTimeMs: 0,
    averageTimeSec: 0,
    recentHistory: [],
  });

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleResetStats = () => {
    setStats({
      totalAnswered: 0,
      correctCount: 0,
      streak: 0,
      bestStreak: 0,
      totalTimeMs: 0,
      averageTimeSec: 0,
      recentHistory: [],
    });
  };

  const handleRecordResult = (
    isCorrect: boolean,
    timeSpentMs: number,
    qText: string,
    userAns: string,
    correctAns: string
  ) => {
    setStats((prev) => {
      const totalAnswered = prev.totalAnswered + 1;
      const correctCount = isCorrect ? prev.correctCount + 1 : prev.correctCount;
      const streak = isCorrect ? prev.streak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, streak);
      const totalTimeMs = prev.totalTimeMs + timeSpentMs;
      const averageTimeSec = totalTimeMs / totalAnswered / 1000;

      const newHistory = [
        {
          questionText: qText,
          userAnswer: userAns,
          correctAnswer: correctAns,
          isCorrect,
          timeSpentMs,
        },
        ...prev.recentHistory.slice(0, 29),
      ];

      return {
        totalAnswered,
        correctCount,
        streak,
        bestStreak,
        totalTimeMs,
        averageTimeSec,
        recentHistory: newHistory,
      };
    });
  };

  // Keyboard shortcut: Space to replay sound (unless in text input typing spaces)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const activeElem = document.activeElement;
        const isInput =
          activeElem instanceof HTMLInputElement || activeElem instanceof HTMLTextAreaElement;
        if (!isInput) {
          e.preventDefault();
          const replayBtn = document.getElementById('replay-audio-btn') ||
            document.getElementById('replay-interval-btn') ||
            document.getElementById('replay-scale-note-btn') ||
            document.getElementById('play-resolution-btn');
          if (replayBtn) replayBtn.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf3] text-[#1a1a1a] flex flex-col justify-between">
      {/* Manuscript Header */}
      <header className="border-b border-[#1a1a1a] px-4 sm:px-8 py-5 flex flex-wrap justify-between items-end gap-4 bg-[#fdfaf3]">
        <div>
          <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal tracking-tight text-[#1a1a1a]">
            Study No. 02
          </h1>
          <div className="font-mono text-xs uppercase tracking-widest text-[#1a1a1a]/60 mt-1">
            Ear Training • Resolution Drills • Interval Speed
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="open-theory-btn"
            onClick={() => setShowTheoryModal(true)}
            className="px-3.5 py-1.5 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            [ View Notes ]
          </button>

          <button
            type="button"
            id="open-history-btn"
            onClick={() => setShowHistoryModal(true)}
            className="px-3.5 py-1.5 border border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            [ History Log ]
          </button>
        </div>
      </header>

      {/* Main Grid: Manuscript Area (Left) + Controls/Stats Ledger (Right) */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left Column: Manuscript Area */}
        <div className="border border-[#1a1a1a] bg-[#fdfaf3] p-5 sm:p-8 flex flex-col justify-between shadow-xs">
          {/* Manuscript Pill Tabs */}
          <div className="flex gap-4 sm:gap-6 border-b border-[#1a1a1a]/20 pb-3 mb-6 overflow-x-auto font-['Cormorant_Garamond',serif] text-base">
            <button
              type="button"
              id="mode-tab-four-step"
              onClick={() => setDrillMode('four_step')}
              className={`pb-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                drillMode === 'four_step'
                  ? 'border-[#d44c4c] font-bold text-[#1a1a1a]'
                  : 'border-transparent text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
              }`}
            >
              4-Step Chain
            </button>

            <button
              type="button"
              id="mode-tab-interval-speed"
              onClick={() => setDrillMode('interval_speed')}
              className={`pb-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                drillMode === 'interval_speed'
                  ? 'border-[#d44c4c] font-bold text-[#1a1a1a]'
                  : 'border-transparent text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
              }`}
            >
              Interval Speed
            </button>

            <button
              type="button"
              id="mode-tab-scale-degree"
              onClick={() => setDrillMode('scale_degree_key')}
              className={`pb-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                drillMode === 'scale_degree_key'
                  ? 'border-[#d44c4c] font-bold text-[#1a1a1a]'
                  : 'border-transparent text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
              }`}
            >
              Degrees & Keys
            </button>

            <button
              type="button"
              id="mode-tab-resolution"
              onClick={() => setDrillMode('resolution_class')}
              className={`pb-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                drillMode === 'resolution_class'
                  ? 'border-[#d44c4c] font-bold text-[#1a1a1a]'
                  : 'border-transparent text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
              }`}
            >
              Resolutions
            </button>
          </div>

          {/* Active Drill View */}
          <div className="w-full">
            {drillMode === 'four_step' && (
              <FourStepDrill
                onRecordResult={handleRecordResult}
                speedLimitSec={speedLimitSec}
              />
            )}

            {drillMode === 'interval_speed' && (
              <IntervalDrill
                onRecordResult={handleRecordResult}
                speedLimitSec={speedLimitSec}
              />
            )}

            {drillMode === 'scale_degree_key' && (
              <ScaleDegreeDrill
                onRecordResult={handleRecordResult}
                speedLimitSec={speedLimitSec}
              />
            )}

            {drillMode === 'resolution_class' && (
              <ResolutionDrill
                onRecordResult={handleRecordResult}
                speedLimitSec={speedLimitSec}
              />
            )}
          </div>
        </div>

        {/* Right Column: Controls Pane & Stats Ledger */}
        <div className="flex flex-col gap-5">
          <ScoreBoard
            stats={stats}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onResetStats={handleResetStats}
            speedLimitSec={speedLimitSec}
            onSpeedLimitChange={setSpeedLimitSec}
          />

          {/* 6 Resolution Rules Cheatsheet Card */}
          <div className="border border-[#1a1a1a] bg-[#fdfaf3] p-4 font-mono text-xs text-[#1a1a1a] shadow-xs">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 pb-2 mb-3 border-b border-[#1a1a1a] flex justify-between items-center">
              <span>6 Resolution Rules</span>
              <span>ET CLASS 2</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              {[
                { code: '7431', text: 'd5 → M3', desc: 'B & F → C & E' },
                { code: '4713', text: 'A4 → m6', desc: 'F & B → E & C' },
                { code: '5431', text: 'm7 → M3', desc: 'G & F → C & E' },
                { code: '4513', text: 'M2 → m6', desc: 'F & G → E & C' },
                { code: '4553', text: 'M2 → m3', desc: 'F & G → G & E (5-5)' },
                { code: '7531', text: 'm6 → M3', desc: 'B & G → C & E' },
              ].map(({ code, text, desc }) => (
                <div key={code} className="flex items-baseline justify-between py-1 border-b border-dashed border-[#1a1a1a]/15">
                  <span className="font-bold text-[#d44c4c]">{code}</span>
                  <span className="font-semibold">{text}</span>
                  <span className="text-[#1a1a1a]/60 text-[10px]">{desc}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-2 border-t border-[#1a1a1a]/20 font-['Gaegu',cursive] text-base text-[#d44c4c] flex items-center justify-between">
              <span>* Spacebar replays audio</span>
              <button
                type="button"
                onClick={() => setShowTheoryModal(true)}
                className="text-xs font-mono uppercase underline hover:text-[#1a1a1a] cursor-pointer"
              >
                Full Guide →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Manuscript Footer */}
      <footer className="border-t border-[#1a1a1a] px-4 sm:px-8 py-3.5 flex flex-wrap justify-between items-center text-[#1a1a1a]/60 font-mono text-xs tracking-wider bg-[#fdfaf3] mt-8">
        <div>Module: ET Class 2 • 2024 Drill System</div>
        <div>v1.0.4 • Manual Resolution Tracking</div>
      </footer>

      {/* Theory Reference Modal */}
      <TheoryReference
        isOpen={showTheoryModal}
        onClose={() => setShowTheoryModal(false)}
      />

      {/* Drill History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a1a]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#fdfaf3] border border-[#1a1a1a] p-6 flex flex-col max-h-[85vh] shadow-xl text-[#1a1a1a]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
              <div>
                <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-bold">Ledger History Log</h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#1a1a1a]/60">Recent Drill Submissions</p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="font-mono text-xs border border-[#1a1a1a] px-2 py-1 hover:bg-[#1a1a1a] hover:text-[#fdfaf3] transition-all cursor-pointer"
              >
                [ESC / Close]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 font-mono text-xs">
              {stats.recentHistory.length === 0 ? (
                <p className="text-center py-8 text-[#1a1a1a]/60 italic font-['Gaegu',cursive] text-lg">
                  No drills logged in ledger yet. Complete questions to record entries.
                </p>
              ) : (
                stats.recentHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 border text-xs flex items-center justify-between gap-3 ${
                      item.isCorrect
                        ? 'border-[#1a1a1a] bg-[#fdfaf3] text-[#1a1a1a]'
                        : 'border-[#d44c4c] bg-[#d44c4c]/5 text-[#d44c4c]'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{item.questionText}</p>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        Answer: <span className="font-bold">{item.userAnswer}</span>
                        {!item.isCorrect && (
                          <span> • Correct: <span className="font-bold">{item.correctAnswer}</span></span>
                        )}
                      </p>
                    </div>
                    <span className="text-[11px] opacity-60 shrink-0">
                      {(item.timeSpentMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#1a1a1a] flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 border border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfaf3] hover:bg-black font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
