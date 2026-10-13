import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const QuickQuizModal = ({ 
  isOpen, 
  onClose, 
  quizData, 
  session, 
  moduleTitle,
  onOpenReader 
}) => {
  const { toggleComplete, isCompleted } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // { [questionId]: boolean }
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !quizData || !quizData.questions || quizData.questions.length === 0) {
    return null;
  }

  const questions = React.useMemo(() => {
    return (quizData?.questions || []).map((q, idx) => ({
      ...q,
      id: q.id || q._id || `q_${idx}`,
    }));
  }, [quizData]);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;

  const currentSelected = selectedAnswers[currentQ.id];
  const isCurrentSubmitted = Boolean(submittedQuestions[currentQ.id]);

  // Calculate score
  const score = Object.keys(submittedQuestions).reduce((acc, qId) => {
    const q = questions.find((item) => item.id === qId);
    if (q && selectedAnswers[qId] === q.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const percentage = Math.round((score / totalQuestions) * 100);

  const handleSelectOption = (index) => {
    if (isCurrentSubmitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: index }));
  };

  const handleCheckAnswer = () => {
    if (currentSelected === undefined) return;
    setSubmittedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
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

  const isSessionCompleted = session ? isCompleted(session.sessionNumber) : false;

  const handleMarkComplete = () => {
    if (session) {
      toggleComplete(session.sessionNumber);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative bg-[#0d1322] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#0a0f1d] flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {session ? `Session #${session.sessionNumber.toString().padStart(2, '0')}` : 'Module Assessment'}
                </span>
                <span className="text-xs text-slate-400 truncate">
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full transition-all duration-300"
            style={{ 
              width: `${isFinished ? 100 : ((currentIndex + (isCurrentSubmitted ? 1 : 0)) / totalQuestions) * 100}%` 
            }}
          />
        </div>

        {/* Modal Body: Active Question OR Final Results */}
        {!isFinished ? (
          <div className="p-5 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Question Counter & Badge */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                Question <span className="text-blue-400 font-bold">{currentIndex + 1}</span> of {totalQuestions}
              </span>
              <span className="font-mono bg-slate-800/80 px-2.5 py-0.5 rounded text-slate-300 border border-slate-700/50">
                {Object.keys(submittedQuestions).length} answered
              </span>
            </div>

            {/* Question Prompt */}
            <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800/90 shadow-inner">
              <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = currentSelected === idx;
                const isCorrect = currentQ.correctIndex === idx;

                let stateClasses = "border-slate-800 bg-[#080d19]/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50";
                
                if (isCurrentSubmitted) {
                  if (isCorrect) {
                    stateClasses = "border-emerald-500/80 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/30";
                  } else if (isSelected && !isCorrect) {
                    stateClasses = "border-rose-500/80 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500/30";
                  } else {
                    stateClasses = "border-slate-800/50 bg-[#080d19]/40 text-slate-500 opacity-60";
                  }
                } else if (isSelected) {
                  stateClasses = "border-blue-500 bg-blue-950/30 text-white ring-1 ring-blue-500/40";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isCurrentSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer text-xs sm:text-sm font-medium ${stateClasses}`}
                  >
                    <div className="w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-colors">
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

            {/* Feedback & Explanation Box upon submission */}
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
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-1 pl-6">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results Completion Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border shadow-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/30 border-blue-500/40 text-blue-400">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Assessment Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                You scored {score} / {totalQuestions} ({percentage}%)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
                {percentage >= 70
                  ? 'Great mastery! You have grasped the key engineering principles for this topic.'
                  : 'Good attempt! Review the session reading and retake the quiz to sharpen your recall.'}
              </p>
            </div>

            {/* Score Stats Badge */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Accuracy</p>
                <p className={`text-xl font-bold mt-0.5 ${percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {percentage}%
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Status</p>
                <p className="text-xl font-bold text-white mt-0.5">
                  {percentage >= 70 ? 'Passed ✓' : 'Review'}
                </p>
              </div>
            </div>

            {/* If Session Quiz, offer instant completion sync */}
            {session && (
              <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800 max-w-md mx-auto flex items-center justify-between gap-3 text-left">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">Session Progress</p>
                  <p className="text-[11px] text-slate-400 truncate">
                    Session #{session.sessionNumber.toString().padStart(2, '0')}: {session.title}
                  </p>
                </div>
                <button
                  onClick={handleMarkComplete}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer flex-shrink-0 ${
                    isSessionCompleted
                      ? 'bg-emerald-950/50 border border-emerald-800/80 text-emerald-400'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
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
        <div className="px-5 py-4 border-t border-slate-800 bg-[#0a0f1d] flex items-center justify-between gap-3">
          {!isFinished ? (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {!isCurrentSubmitted ? (
                  <button
                    type="button"
                    disabled={currentSelected === undefined}
                    onClick={handleCheckAnswer}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
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
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-[#080d19] hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
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
                    className="px-3.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Back to GitHub Reader</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
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
