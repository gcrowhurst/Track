import { Trophy, Zap, Target } from 'lucide-react';
import type { Participant } from '../types';

interface LeaderboardProps {
  participants: Participant[];
  currentUserId?: string;
  mode?: 'position' | 'knowledge' | 'combined';
  compact?: boolean;
}

export default function Leaderboard({
  participants,
  currentUserId,
  mode = 'position',
  compact = false,
}: LeaderboardProps) {
  const getSortedParticipants = () => {
    const sorted = [...participants];

    switch (mode) {
      case 'knowledge':
        return sorted.sort((a, b) => {
          const accuracyA = a.correct_answers / Math.max(1, a.total_questions);
          const accuracyB = b.correct_answers / Math.max(1, b.total_questions);
          return accuracyB - accuracyA;
        });
      case 'combined':
        return sorted.sort((a, b) => {
          const scoreA = (a.correct_answers * 10) - (a.total_time_ms / 1000);
          const scoreB = (b.correct_answers * 10) - (b.total_time_ms / 1000);
          return scoreB - scoreA;
        });
      case 'position':
      default:
        return sorted.sort((a, b) => {
          if (a.current_lap !== b.current_lap) {
            return (b.current_lap || 0) - (a.current_lap || 0);
          }
          return (b.current_position || 99) - (a.current_position || 99);
        });
    }
  };

  const sorted = getSortedParticipants();
  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${position + 1}.`;
    }
  };

  const getAccuracy = (participant: Participant) => {
    if (participant.total_questions === 0) return 0;
    return Math.round(
      (participant.correct_answers / participant.total_questions) * 100
    );
  };

  return (
    <div
      className={`${
        compact
          ? 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3'
          : 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5'
      } space-y-2`}
    >
      {/* Header */}
      {!compact && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-black text-white uppercase tracking-wide">
            {mode === 'knowledge' && 'Knowledge Rankings'}
            {mode === 'combined' && 'Combined Standings'}
            {mode === 'position' && 'Race Leaderboard'}
          </h3>
        </div>
      )}

      {/* Participants List */}
      <div className="space-y-1">
        {sorted.map((participant, index) => {
          const isCurrentUser = participant.id === currentUserId;
          const accuracy = getAccuracy(participant);

          return (
            <div
              key={participant.id}
              className={`p-3 rounded-lg transition-all ${
                isCurrentUser
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 ring-2 ring-yellow-400/30'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Position & Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl font-black text-white w-8 text-center flex-shrink-0">
                    {getMedalEmoji(index)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {participant.display_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: participant.vehicle_color }}
                      />
                      <p className="text-xs text-white/60">
                        {mode === 'position' && `Lap ${participant.current_lap || 0}`}
                        {mode === 'knowledge' && `${accuracy}% accuracy`}
                        {mode === 'combined' &&
                          `${accuracy}% • Lap ${participant.current_lap || 0}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {mode !== 'knowledge' && (
                    <div className="text-right">
                      <div className="text-sm font-bold text-yellow-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {participant.correct_answers}
                      </div>
                      <div className="text-xs text-white/50">correct</div>
                    </div>
                  )}
                  {mode !== 'position' && (
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-400 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {accuracy}%
                      </div>
                      <div className="text-xs text-white/50">accuracy</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="text-center py-6 text-white/50">
          <p className="text-sm">Waiting for participants...</p>
        </div>
      )}
    </div>
  );
}
