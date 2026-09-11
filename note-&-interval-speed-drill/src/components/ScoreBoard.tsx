import React from 'react';
import { Volume2, VolumeX, Flame, Clock, Award, RotateCcw } from 'lucide-react';
import { DrillStats } from '../types/music';

interface ScoreBoardProps {
  stats: DrillStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetStats: () => void;
  speedLimitSec: number; // 0 for untimed, or 3, 5, etc.
  onSpeedLimitChange: (sec: number) => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  stats,
  isMuted,
  onToggleMute,
  onResetStats,
  speedLimitSec,
  onSpeedLimitChange,
}) => {
  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
    : 100;

  return (
    <div className="w-full border border-[#1a1a1a] bg-[#fdfaf3] p-4 font-mono text-xs text-[#1a1a1a] shadow-xs">
      <div className="flex justify-between items-baseline pb-2 mb-2 border-b border-[#1a1a1a]">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a]/60">
          STATS LEDGER
        </span>
        <span className="font-mono text-[10px] text-[#1a1a1a]/50">
          SESSION #{stats.totalAnswered}
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between items-center py-1 border-b border-dashed border-[#1a1a1a]/20">
          <span className="text-[#1a1a1a]/70 flex items-center gap-1.5">
            <Flame className={`w-3.5 h-3.5 ${stats.streak > 0 ? 'text-[#d44c4c]' : 'text-[#1a1a1a]/40'}`} />
            Current Streak
          </span>
          <span className="font-bold text-[#d44c4c] text-sm">
            {stats.streak.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-dashed border-[#1a1a1a]/20">
          <span className="text-[#1a1a1a]/70 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#1a1a1a]/50" />
            Overall Accuracy
          </span>
          <span className="font-semibold">
            {stats.correctCount}/{stats.totalAnswered} ({accuracy}%)
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-dashed border-[#1a1a1a]/20">
          <span className="text-[#1a1a1a]/70 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#1a1a1a]/50" />
            Response Avg.
          </span>
          <span className="font-semibold">
            {stats.averageTimeSec > 0 ? `${stats.averageTimeSec.toFixed(1)}s` : '--'}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-dashed border-[#1a1a1a]/20">
          <span className="text-[#1a1a1a]/70">Speed Mode</span>
          <span className="font-bold text-[#1a1a1a]">
            {speedLimitSec === 0 ? 'Untimed' : `${speedLimitSec}s Limit`}
          </span>
        </div>
      </div>

      {/* Speed Controls & Audio Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1a1a1a]/20">
        <div className="flex items-center gap-1">
          {[
            { sec: 0, label: 'Untimed' },
            { sec: 5, label: '5s' },
            { sec: 3, label: '3s' },
            { sec: 1.5, label: '1.5s' },
          ].map(({ sec, label }) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSpeedLimitChange(sec)}
              className={`px-2 py-0.5 text-[11px] font-mono border transition-all cursor-pointer ${
                speedLimitSec === sec
                  ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfaf3] font-bold'
                  : 'border-[#1a1a1a]/30 hover:border-[#1a1a1a] bg-transparent text-[#1a1a1a]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="audio-toggle-btn"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1 border border-[#1a1a1a]/30 hover:border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] transition-all cursor-pointer text-[#1a1a1a]"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            id="reset-stats-btn"
            onClick={onResetStats}
            title="Reset statistics"
            className="p-1 border border-[#1a1a1a]/30 hover:border-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-[#fdfaf3] transition-all cursor-pointer text-[#1a1a1a]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
