const asNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const mergeQuizProgressAttempt = (previous, attempt) => {
  if (!previous) {
    return {
      ...attempt,
      totalAttempts: 1,
      totalCorrectAnswers: asNumber(attempt.score),
      totalQuestionsAttempted: asNumber(attempt.totalQuestions),
    };
  }

  const existing = typeof previous.toObject === 'function' ? previous.toObject() : previous;
  const hasAggregateData = asNumber(existing.totalAttempts) > 0;
  const totalAttempts = hasAggregateData ? asNumber(existing.totalAttempts) : 1;
  const totalCorrectAnswers = hasAggregateData
    ? asNumber(existing.totalCorrectAnswers)
    : asNumber(existing.score);
  const totalQuestionsAttempted = hasAggregateData
    ? asNumber(existing.totalQuestionsAttempted)
    : asNumber(existing.totalQuestions);

  return {
    ...existing,
    ...(attempt.percentage >= asNumber(existing.percentage) ? attempt : {}),
    totalAttempts: totalAttempts + 1,
    totalCorrectAnswers: totalCorrectAnswers + asNumber(attempt.score),
    totalQuestionsAttempted: totalQuestionsAttempted + asNumber(attempt.totalQuestions),
  };
};

export const getQuizAccuracy = (quizProgress = []) => {
  const totals = quizProgress.reduce(
    (result, progress) => {
      const hasAggregateData = asNumber(progress.totalAttempts) > 0;
      result.correctAnswers += hasAggregateData
        ? asNumber(progress.totalCorrectAnswers)
        : asNumber(progress.score);
      result.questionsAttempted += hasAggregateData
        ? asNumber(progress.totalQuestionsAttempted)
        : asNumber(progress.totalQuestions);
      return result;
    },
    { correctAnswers: 0, questionsAttempted: 0 }
  );

  return {
    ...totals,
    accuracy: totals.questionsAttempted
      ? Math.round((totals.correctAnswers / totals.questionsAttempted) * 100)
      : null,
  };
};
