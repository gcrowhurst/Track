import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Zap } from 'lucide-react';
import type { Question } from '../types';
import Button from './Button';

interface QuestionModalProps {
  question: Question;
  timeLimit: number;
  onAnswer: (answerIndex: number, timeTaken: number) => void;
  onSkip?: () => void;
  isLoading?: boolean;
  checkpointNumber?: number;
  totalCheckpoints?: number;
}

export default function QuestionModal({
  question,
  timeLimit,
  onAnswer,
  onSkip,
  isLoading = false,
  checkpointNumber = 1,
  totalCheckpoints = 4,
}: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [startTime] = useState(Date.now());
  const [answered, setAnswered] = useState(false);

  // Timer effect
  useEffect(() => {
    if (answered || showFeedback) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-fail when time runs out
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [answered, showFeedback]);

  const handleTimeout = () => {
    setSelectedAnswer(null);
    setIsCorrect(false);
    setShowFeedback(true);
    setAnswered(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnswered(true);

    // Notify parent after a brief delay to show feedback
    setTimeout(() => {
      const timeTaken = Date.now() - startTime;
      onAnswer(answerIndex, timeTaken);
    }, 1500);
  };

  const handleSkip = () => {
    if (answered) return;
    setAnswered(true);
    if (onSkip) {
      onSkip();
    }
  };

  const timePercentage = Math.max(0, (timeRemaining / timeLimit) * 100);
  const isTimeWarning = timeRemaining <= 10;
  const isTimeCritical = timeRemaining <= 5;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 sm:scale-in duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/10 p-4 sm:p-5">
          <div className="flex justify-between items-start gap-3 mb-4">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider mb-1">
                Checkpoint {checkpointNumber}/{totalCheckpoints}
              </p>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                Knowledge Check
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 mb-1">TIME LEFT</p>
              <p
                className={`text-2xl sm:text-3xl font-black font-mono ${
                  isTimeCritical
                    ? 'text-red-400 animate-pulse'
                    : isTimeWarning
                      ? 'text-yellow-400'
                      : 'text-green-400'
                }`}
              >
                {timeRemaining}s
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isTimeCritical
                  ? 'bg-red-500 animate-pulse'
                  : isTimeWarning
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-4 sm:p-5 border-b border-white/10">
          {question.image_url && (
            <img
              src={question.image_url}
              alt="Question illustration"
              className="w-full h-32 sm:h-40 object-cover rounded-xl mb-4"
            />
          )}
          <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {question.question_text}
          </p>
        </div>

        {/* Answer Options */}
        <div className="p-4 sm:p-5 space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={answered || isLoading}
              className={`w-full p-3 sm:p-4 rounded-xl text-left font-semibold transition-all duration-200 flex items-center gap-3 ${
                selectedAnswer === index
                  ? isCorrect
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 ring-4 ring-green-500/30'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-400 ring-4 ring-red-500/30'
                  : showFeedback && index === question.correct_answer
                    ? 'bg-gradient-to-r from-green-500/30 to-emerald-600/30 text-green-200 border-2 border-green-400/50'
                    : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40 disabled:opacity-50'
              }`}
            >
              <span className="flex-1 leading-snug text-sm sm:text-base">{option}</span>
              {selectedAnswer === index && showFeedback && isCorrect && (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              )}
              {selectedAnswer === index && showFeedback && !isCorrect && (
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              )}
              {showFeedback &&
                index === question.correct_answer &&
                selectedAnswer !== index && (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-green-400" />
                )}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`p-4 sm:p-5 border-t border-white/10 ${
              isCorrect ? 'bg-green-500/10 text-green-200' : 'bg-red-500/10 text-red-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              {isCorrect ? (
                <>
                  <Zap className="w-5 h-5 flex-shrink-0 mt-1 text-yellow-400" />
                  <div>
                    <p className="font-black text-lg sm:text-xl text-white">Correct!</p>
                    <p className="text-sm mt-1">Great job! Keep up the momentum!</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-lg sm:text-xl text-white">Incorrect</p>
                    <p className="text-sm mt-1">The correct answer is: {question.options[question.correct_answer]}</p>
                    {question.explanation && (
                      <p className="text-xs sm:text-sm mt-2 opacity-90">{question.explanation}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showFeedback && (
          <div className="p-4 sm:p-5 border-t border-white/10 space-y-3">
            {onSkip && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSkip}
                disabled={answered || isLoading}
                className="w-full"
              >
                <Clock className="w-4 h-4" />
                Skip -10 PTS
              </Button>
            )}
          </div>
        )}

        {/* Continue Button After Feedback */}
        {showFeedback && !isLoading && (
          <div className="p-4 sm:p-5 border-t border-white/10 space-y-3">
            <p className="text-center text-xs sm:text-sm text-white/60 mb-2">
              {isCorrect ? '⚡ Speed boost applied!' : '⏱️ Time penalty applied'}
            </p>
            <div className="text-center text-xs text-white/50">
              Continuing to race...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
