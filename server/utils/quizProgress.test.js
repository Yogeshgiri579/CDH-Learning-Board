import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuizAccuracy, mergeQuizProgressAttempt } from './quizProgress.js';

test('aggregates a lower-scoring attempt without replacing the best result', () => {
  const best = {
    sessionNumber: 4,
    score: 3,
    totalQuestions: 5,
    percentage: 60,
    passed: true,
    completedAt: 'first-attempt',
  };

  const merged = mergeQuizProgressAttempt(best, {
    sessionNumber: 4,
    score: 1,
    totalQuestions: 5,
    percentage: 20,
    passed: false,
    completedAt: 'second-attempt',
  });

  assert.equal(merged.score, 3);
  assert.equal(merged.passed, true);
  assert.equal(merged.completedAt, 'first-attempt');
  assert.equal(merged.totalAttempts, 2);
  assert.equal(merged.totalCorrectAnswers, 4);
  assert.equal(merged.totalQuestionsAttempted, 10);
  assert.equal(getQuizAccuracy([merged]).accuracy, 40);
});

test('initializes aggregates for a first attempt and includes legacy records in accuracy', () => {
  const firstAttempt = mergeQuizProgressAttempt(null, {
    sessionNumber: 2,
    score: 2,
    totalQuestions: 4,
    percentage: 50,
    passed: false,
  });
  const accuracy = getQuizAccuracy([
    { sessionNumber: 1, score: 3, totalQuestions: 5 },
    firstAttempt,
  ]);

  assert.equal(firstAttempt.totalAttempts, 1);
  assert.equal(accuracy.correctAnswers, 5);
  assert.equal(accuracy.questionsAttempted, 9);
  assert.equal(accuracy.accuracy, 56);
});
