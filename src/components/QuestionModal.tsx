import { useState, useEffect } from 'react';
import type { Question } from '../types';
import Button from './Button';
import { Clock, CheckCircle, XCircle, Zap } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  onAnswer: (answerIndex: number, timeTaken: number) => void;
  onSkip?: () => void;
  timeLimit?: number; // seconds
  showSkipButton?: boolean;
}

export default function QuestionModal({
  question,
  onAnswer,
  onSkip,
  timeLimit = 30,
  showSkipButton = true,
}: QuestionModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());

  // Countdown timer
  useEffect(() => {
    if (isAnswered || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit wrong answer if time runs out
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isAnswered]);

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    const timeTaken = Date.now() - startTime;
    const correct = answerIndex === question.correct_answer;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setIsCorrect(correct);

    // Show feedback for 2 seconds before closing
    setTimeout(() => {
      onAnswer(answerIndex, timeTaken);
    }, 2000);
  };

  const handleSkip = () => {
    if (onSkip && !isAnswered) {
      onSkip();
    }
  };

  const getTimerColor = () => {
    if (timeRemaining > 20) return 'text-green-400';
    if (timeRemaining > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getOptionClassName = (index: number) => {
    const baseClass =
      'w-full text-left px-6 py-4 rounded-xl transition-all border-2 font-medium';

    if (!isAnswered) {
      return `${baseClass} bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 active:scale-[0.98]`;
    }

    if (index === question.correct_answer) {
      return `${baseClass} bg-green-500/20 border-green-500 text-green-100`;
    }

    if (index === selectedAnswer && !isCorrect) {
      return `${baseClass} bg-red-500/20 border-red-500 text-red-100`;
    }

    return `${baseClass} bg-white/5 border-white/10 opacity-50`;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5" />
              <span className="font-bold">Checkpoint Question</span>
            </div>
            <div className={`flex items-center gap-2 font-bold text-lg ${getTimerColor()}`}>
              <Clock className="w-5 h-5" />
              <span>{timeRemaining}s</span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 space-y-6">
          {/* Topic & Difficulty */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-semibold rounded-full border border-orange-500/30">
              {question.topic}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">
              {question.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <div className="text-xl font-semibold text-white leading-relaxed">
            {question.question_text}
          </div>

          {/* Image (if present) */}
          {question.image_url && (
            <div className="rounded-xl overflow-hidden border border-slate-700">
              <img
                src={question.image_url}
                alt="Question illustration"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={getOptionClassName(index)}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                      isAnswered && index === question.correct_answer
                        ? 'bg-green-500 text-white'
                        : isAnswered && index === selectedAnswer && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {optionLabels[index]}
                  </span>
                  <span className="text-white">{option}</span>
                  {isAnswered && index === question.correct_answer && (
                    <CheckCircle className="w-6 h-6 text-green-400 ml-auto" />
                  )}
                  {isAnswered && index === selectedAnswer && !isCorrect && (
                    <XCircle className="w-6 h-6 text-red-400 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Feedback Message */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl border-2 ${
                isCorrect
                  ? 'bg-green-500/10 border-green-500/50 text-green-100'
                  : 'bg-red-500/10 border-red-500/50 text-red-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold mb-1">
                    {isCorrect ? '✅ Correct! +10 Points ⚡ Speed Boost!' : '❌ Incorrect - Time Penalty'}
                  </p>
                  {question.explanation && (
                    <p className="text-sm opacity-90">{question.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skip Button */}
          {!isAnswered && showSkipButton && onSkip && (
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSkip}
                className="w-full"
              >
                Skip Question (-10 Points)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
