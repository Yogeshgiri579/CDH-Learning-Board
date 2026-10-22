import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Check 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const QuickQuizModal = ({ 
  isOpen, 
  onClose, 
  quizData, 
  session = null, 
  moduleTitle = null, 
  onOpenReader 
}) => {
  const { toggleComplete, isCompleted } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // { [qIndex]: true }
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !quizData || !quizData.questions || quizData.questions.length === 0) {
    return null;
  }

  const questions = quizData.questions;
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentSelected = selectedAnswers[currentIndex];
  const isCurrentSubmitted = submittedQuestions[currentIndex];

  const handleSelectOption = (optIndex) => {
    if (isCurrentSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleCheckAnswer = () => {
    if (currentSelected === undefined) return;
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setIsFinished(false);
  };

  // Score calculation
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);
  const isSessionCompleted = session ? isCompleted(session.sessionNumber) : false;

  const handleMarkComplete = () => {
    if (session) {
      toggleComplete(session.sessionNumber);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative bg-[#0d1117] border border-[#30363d] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#f0f6fc] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff] flex-shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
                  {session ? `Session #${session.sessionNumber.toString().padStart(2, '0')}` : 'Module Assessment'}
                </span>
                <span className="text-xs text-[#8b949e] truncate">
                  {moduleTitle || session?.module || 'DevOps Challenge'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                {quizData.title || 'Quick Knowledge Check'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
            title="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isFinished ? (
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar bg-[#010409]">
            
            {/* Question Counter & Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8b949e]">
                <span>Question {currentIndex + 1} of {totalQuestions}</span>
                <span className="font-mono text-[#58a6ff]">
                  {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
                <div 
                  className="bg-[#238636] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentQ.question}
              </h4>
              {currentQ.difficulty && (
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                  Difficulty: {currentQ.difficulty}
                </span>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = currentSelected === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let stateClasses = "border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:border-[#8b949e] hover:bg-[#21262d]";
                
                if (isCurrentSubmitted) {
                  if (isCorrect) {
                    stateClasses = "border-emerald-500/80 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/30";
                  } else if (isSelected && !isCorrect) {
                    stateClasses = "border-rose-500/80 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500/30";
                  } else {
                    stateClasses = "border-[#30363d]/50 bg-[#161b22]/40 text-[#8b949e] opacity-50";
                  }
                } else if (isSelected) {
                  stateClasses = "border-[#58a6ff] bg-[#21262d] text-white ring-1 ring-[#58a6ff]/40";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isCurrentSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer text-xs sm:text-sm font-medium ${stateClasses}`}
                  >
                    <div className="w-5 h-5 rounded-full border border-[#30363d] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-colors">
                      {isCurrentSubmitted && isCorrect ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      ) : isCurrentSubmitted && isSelected && !isCorrect ? (
                        <X className="w-3.5 h-3.5 text-rose-400 stroke-[3]" />
                      ) : (
                        <span>{String.fromCharCode(65 + idx)}</span>
                      )}
                    </div>
                    <span className="flex-1 leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {isCurrentSubmitted && (
              <div 
                className={`p-4 rounded-xl border text-xs sm:text-sm animate-in fade-in duration-200 ${
                  currentSelected === currentQ.correctIndex
                    ? 'bg-emerald-950/25 border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/25 border-rose-800/60 text-rose-200'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold mb-1.5">
                  {currentSelected === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Correct! Excellent understanding.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300">Incorrect. Review the concept below:</span>
                    </>
                  )}
                </div>
                <p className="text-[#c9d1d9] text-xs sm:text-sm leading-relaxed mt-1 pl-6">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results Completion Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200 bg-[#010409]">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border border-[#30363d] shadow-lg bg-[#161b22] text-[#58a6ff]">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#58a6ff]">
                Assessment Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                You scored {score} / {totalQuestions} ({percentage}%)
              </h2>
              <p className="text-xs sm:text-sm text-[#8b949e] mt-1.5 max-w-md mx-auto">
                {percentage >= 70
                  ? 'Great mastery! You have grasped the key engineering principles for this topic.'
                  : 'Good attempt! Review the session reading and retake the quiz to sharpen your recall.'}
              </p>
            </div>

            {/* Score Stats Badge */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d]">
                <p className="text-[11px] text-[#8b949e] font-semibold uppercase">Accuracy</p>
                <p className={`text-xl font-bold mt-0.5 ${percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {percentage}%
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d]">
                <p className="text-[11px] text-[#8b949e] font-semibold uppercase">Status</p>
                <p className="text-xl font-bold text-white mt-0.5">
                  {percentage >= 70 ? 'Passed ✓' : 'Review'}
                </p>
              </div>
            </div>

            {/* If Session Quiz, offer instant completion sync */}
            {session && (
              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] max-w-md mx-auto flex items-center justify-between gap-3 text-left">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">Session Progress</p>
                  <p className="text-[11px] text-[#8b949e] truncate">
                    Session #{session.sessionNumber.toString().padStart(2, '0')}: {session.title}
                  </p>
                </div>
                <button
                  onClick={handleMarkComplete}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer flex-shrink-0 ${
                    isSessionCompleted
                      ? 'bg-emerald-950/50 border border-emerald-800/80 text-emerald-400'
                      : 'bg-[#238636] hover:bg-[#2ea043] text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isSessionCompleted ? 'Completed ✓' : 'Mark as Done'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="px-5 py-4 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between gap-3">
          {!isFinished ? (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8b949e] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {!isCurrentSubmitted ? (
                  <button
                    type="button"
                    disabled={currentSelected === undefined}
                    onClick={handleCheckAnswer}
                    className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>{currentIndex === totalQuestions - 1 ? 'View Results' : 'Next Question'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={handleRestart}
                className="px-3.5 py-1.5 rounded-xl border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>

              <div className="flex items-center space-x-2">
                {session && onOpenReader && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenReader(session);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Back to GitHub Reader</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#30363d] hover:bg-[#484f58] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
