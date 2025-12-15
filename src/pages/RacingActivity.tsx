import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDRacingEngine } from '../utils/threeDRacingEngine';
import QuestionModal from '../components/QuestionModal';
import Button from '../components/Button';
import { SAMPLE_QUESTIONS } from '../data/questions';
import { Zap, Home, Trophy } from 'lucide-react';

interface RaceStats {
  finalTime: string;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  topSpeed: number;
  finalLap: number;
}

export default function RacingActivity() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ThreeDRacingEngine | null>(null);
  const navigate = useNavigate();

  // Game state
  const [isRacing, setIsRacing] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionsPassed, setQuestionsPassed] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentLap, setCurrentLap] = useState(1);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceTime, setRaceTime] = useState(0);
  const [stats, setStats] = useState<RaceStats | null>(null);
  const [showingQuestion, setShowingQuestion] = useState(false);
  const [maxSpeed, setMaxSpeed] = useState(0);

  // Keyboard state
  const keysPressed = useRef<Set<string>>(new Set());

  // Initialize engine and set up race
  useEffect(() => {
    if (!containerRef.current) return;

    // Create engine
    const engine = new ThreeDRacingEngine(
      containerRef.current,
      (vehicleId, checkpointId) => {
        // Checkpoint reached - show question if not already answered
        if (!questionsPassed.has(checkpointId)) {
          const randomQuestion = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
          setCurrentQuestion({ ...randomQuestion, checkpointId });
          setShowingQuestion(true);
        }
      },
      (vehicleId, lapNumber) => {
        // Update current lap on completion
        if (lapNumber <= 3) {
          setCurrentLap(lapNumber);
        }
        // Finish race after 3 laps
        if (lapNumber >= 3) {
          setRaceFinished(true);
        }
      }
    );

    // Add player vehicle
    const playerName = sessionStorage.getItem('playerName') || 'Racer';
    const playerColor = sessionStorage.getItem('playerColor') || '#3b82f6';
    engine.addVehicle('player', playerName, playerColor);

    engineRef.current = engine;

    // Countdown and start
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsRacing(true);
          engine.start();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
      engine.dispose();
    };
  }, []);

  // Race timer
  useEffect(() => {
    if (!isRacing || raceFinished) return;

    const timer = setInterval(() => {
      setRaceTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRacing, raceFinished]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Vehicle update loop
  useEffect(() => {
    if (!isRacing || !engineRef.current) return;

    const interval = setInterval(() => {
      const controls = {
        forward: keysPressed.current.has('arrowup') || keysPressed.current.has('w'),
        backward: keysPressed.current.has('arrowdown') || keysPressed.current.has('s'),
        left: keysPressed.current.has('arrowleft') || keysPressed.current.has('a'),
        right: keysPressed.current.has('arrowright') || keysPressed.current.has('d'),
      };

      engineRef.current?.updateVehicle('player', controls);

      // Track max speed
      const vehicle = engineRef.current?.getVehicle('player');
      if (vehicle) {
        setMaxSpeed((prev) => Math.max(prev, Math.abs(vehicle.velocity) * 100));
      }
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [isRacing]);

  // Handle race finish
  useEffect(() => {
    if (!raceFinished) return;

    const totalQuestions = questionsPassed.size;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    setStats({
      finalTime: `${Math.floor(raceTime / 60)}:${(raceTime % 60).toString().padStart(2, '0')}`,
      correctAnswers,
      totalAnswers: totalQuestions,
      accuracy,
      topSpeed: Math.round(maxSpeed),
      finalLap: currentLap,
    });
  }, [raceFinished]);

  const handleAnswer = (selectedIndex: number) => {
    if (!currentQuestion) return;

    const isCorrect = selectedIndex === currentQuestion.correct_answer;
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setQuestionsPassed((prev) => new Set([...prev, currentQuestion.checkpointId]));
    setShowingQuestion(false);
    setCurrentQuestion(null);
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Pre-race Countdown */}
      {!isRacing && countdown > 0 && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="text-8xl font-black text-yellow-400 mb-8 animate-bounce">
              {countdown}
            </div>
            <p className="text-white text-2xl font-bold">Get Ready to Race!</p>
          </div>
        </div>
      )}

      {/* HUD Overlay (during race) */}
      {isRacing && !raceFinished && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Top left - Race info */}
          <div className="absolute top-6 left-6 text-white font-bold">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-yellow-400">
              <div className="text-2xl mb-2">
                <span className="text-yellow-400">LAP</span> {currentLap}/3
              </div>
              <div className="text-xl">
                <span className="text-cyan-400">TIME</span> {formatTime(raceTime)}
              </div>
              <div className="text-lg mt-2">
                <span className="text-green-400">✓</span> {correctAnswers}/{questionsPassed.size}
              </div>
              <div className="text-lg">
                <span className="text-purple-400">⚡</span> {maxSpeed} km/h
              </div>
            </div>
          </div>

          {/* Top right - Controls hint */}
          <div className="absolute top-6 right-6 text-white text-sm bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-blue-400">
            <p className="font-bold mb-2">CONTROLS</p>
            <p>↑ / W - Forward</p>
            <p>↓ / S - Backward</p>
            <p>← / A - Left</p>
            <p>→ / D - Right</p>
          </div>

          {/* Bottom - Speed bar */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-64">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-400">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>SPEED</span>
                <span>{Math.round(maxSpeed)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all"
                  style={{ width: `${Math.min((maxSpeed / 300) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showingQuestion && currentQuestion && !raceFinished && (
        <QuestionModal
          question={currentQuestion}
          timeLimit={30}
          onAnswer={handleAnswer}
          onSkip={() => {
            setQuestionsPassed((prev) => new Set([...prev, currentQuestion.checkpointId]));
            setShowingQuestion(false);
            setCurrentQuestion(null);
          }}
          checkpointNumber={questionsPassed.size}
          totalCheckpoints={SAMPLE_QUESTIONS.length}
        />
      )}

      {/* Race Finished Screen */}
      {raceFinished && stats && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-slate-900/90 flex items-center justify-center z-50">
          <div className="text-center max-w-md">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h1 className="text-5xl font-black text-yellow-400 mb-8">RACE COMPLETE!</h1>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border-2 border-yellow-400 p-8 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between text-white text-lg">
                  <span>Final Time:</span>
                  <span className="text-cyan-400 font-bold">{stats.finalTime}</span>
                </div>
                <div className="flex justify-between text-white text-lg">
                  <span>Lap Completed:</span>
                  <span className="text-green-400 font-bold">{stats.finalLap}</span>
                </div>
                <div className="flex justify-between text-white text-lg">
                  <span>Questions Answered:</span>
                  <span className="text-purple-400 font-bold">
                    {stats.correctAnswers}/{stats.totalAnswers}
                  </span>
                </div>
                <div className="flex justify-between text-white text-lg">
                  <span>Accuracy:</span>
                  <span className="text-yellow-400 font-bold">{stats.accuracy}%</span>
                </div>
                <div className="flex justify-between text-white text-lg">
                  <span>Top Speed:</span>
                  <span className="text-red-400 font-bold">{stats.topSpeed} km/h</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => window.location.reload()}
              >
                <Zap className="w-5 h-5" />
                Race Again
              </Button>
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => navigate('/')}
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit button */}
      {!raceFinished && (
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 z-30 bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          Exit
        </button>
      )}
    </div>
  );
}
