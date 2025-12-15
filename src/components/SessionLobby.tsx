import { useState, useEffect } from 'react';
import { Users, Play, Zap, Target } from 'lucide-react';
import Button from './Button';
import Leaderboard from './Leaderboard';
import type { Session, Participant } from '../types';

interface SessionLobbyProps {
  session: Session;
  currentParticipant: Participant | null;
  participants: Participant[];
  onStart?: () => void;
  onReady?: () => void;
  isHost?: boolean;
  isReady?: boolean;
  maxParticipants?: number;
}

export default function SessionLobby({
  session,
  currentParticipant,
  participants,
  onStart,
  onReady,
  isHost = false,
  isReady = false,
  maxParticipants = 30,
}: SessionLobbyProps) {
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!countdownActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCountdownActive(false);
          onStart?.();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownActive, onStart]);

  const handleStartRace = () => {
    if (participants.length < 2) {
      return; // Need at least 2 participants
    }
    setCountdownActive(true);
  };

  const totalParticipants = participants.length;
  const allReady = participants.every((p) => p.id === currentParticipant?.id ? isReady : true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
                Race Session
              </h1>
              <p className="text-white/60 text-sm">
                Join Code: <span className="font-mono font-bold text-white">{session.code}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-4 py-2">
                <p className="text-xs text-white/60 mb-1">PARTICIPANTS</p>
                <p className="text-3xl font-black text-white">
                  {totalParticipants}/{maxParticipants}
                </p>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-white/60 mb-2 uppercase font-semibold">TRACK</p>
              <p className="text-white font-bold">Rookie Circuit</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-white/60 mb-2 uppercase font-semibold">LAPS</p>
              <p className="text-white font-bold">{session.rules?.laps || 3} Laps</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-white/60 mb-2 uppercase font-semibold">TIME LIMIT</p>
              <p className="text-white font-bold">{session.rules?.time_per_question || 30}s per question</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants List - Left */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Users className="w-6 h-6" />
              Ready Check
            </h2>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-3">
              {participants.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">Waiting for participants to join...</p>
                </div>
              ) : (
                participants.map((participant) => {
                  const isCurrentUser = participant.id === currentParticipant?.id;
                  const participantReady = isCurrentUser ? isReady : true;

                  return (
                    <div
                      key={participant.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isCurrentUser
                          ? 'bg-yellow-500/10 border-yellow-400/50'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className="w-6 h-6 rounded-lg border-2 border-white/30"
                            style={{ backgroundColor: participant.vehicle_color }}
                          />
                          <div>
                            <p className="font-semibold text-white">
                              {participant.display_name}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded font-bold">
                                  YOU
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-white/60">
                              {participant.team_id ? `Team: ${participant.team_id}` : 'Solo'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {participantReady ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-xs font-semibold text-green-400">READY</span>
                            </div>
                          ) : (
                            <span className="text-xs text-white/60">Joining...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right */}
        <div className="space-y-4">
          {/* Current Player Card */}
          {currentParticipant && (
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-2xl p-6">
              <p className="text-xs text-white/60 mb-2 uppercase font-semibold">YOUR VEHICLE</p>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-white/30"
                  style={{ backgroundColor: currentParticipant.vehicle_color }}
                />
                <div>
                  <p className="font-black text-white text-lg">
                    {currentParticipant.display_name}
                  </p>
                  <p className="text-xs text-white/60">Ready to race</p>
                </div>
              </div>

              {/* Ready Button */}
              {!countdownActive && (
                <Button
                  variant={isReady ? 'success' : 'primary'}
                  size="lg"
                  onClick={onReady}
                  className="w-full font-black uppercase"
                >
                  {isReady ? '✓ Ready!' : 'Mark Ready'}
                </Button>
              )}

              {/* Countdown */}
              {countdownActive && (
                <div className="text-center">
                  <p className="text-white/60 text-sm mb-2">Race starting in...</p>
                  <p className="text-5xl font-black text-yellow-400 animate-pulse">
                    {countdown}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Host Controls */}
          {isHost && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wide">HOST CONTROLS</h3>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/60 mb-1">Participants Ready</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {participants.filter((p) => p.id === currentParticipant?.id ? isReady : true).length}/
                      {participants.length}
                    </span>
                    {allReady && (
                      <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded font-semibold">
                        All Ready!
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartRace}
                  disabled={participants.length < 2 || !allReady}
                  className="w-full font-black uppercase flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {countdownActive ? 'Starting...' : 'Start Race'}
                </Button>

                {participants.length < 2 && (
                  <p className="text-xs text-red-300 text-center">
                    Need at least 2 participants to start
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                <div className="text-center">
                  <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-white/60">Total Correct</p>
                  <p className="text-lg font-black text-white">
                    {participants.reduce((sum, p) => sum + p.correct_answers, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <Target className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-white/60">Avg Accuracy</p>
                  <p className="text-lg font-black text-white">
                    {participants.length > 0
                      ? Math.round(
                          (participants.reduce((sum, p) => sum + (p.correct_answers / Math.max(1, p.total_questions)), 0) /
                            participants.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Preview */}
          <Leaderboard
            participants={participants}
            currentUserId={currentParticipant?.id}
            mode="position"
            compact={true}
          />
        </div>
      </div>
    </div>
  );
}
