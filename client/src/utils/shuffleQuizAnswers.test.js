import assert from 'node:assert/strict';
import test from 'node:test';
import { shuffleQuizAnswers } from './shuffleQuizAnswers.js';

test('shuffles correct answer positions evenly within a quiz while preserving the answer key', () => {
  const questions = Array.from({ length: 5 }, (_, questionIndex) => ({
    question: `Question ${questionIndex + 1}`,
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 1,
  }));
  let randomValue = 0;
  const random = () => {
    randomValue = (randomValue + 0.37) % 1;
    return randomValue;
  };

  const shuffled = shuffleQuizAnswers(questions, random);
  const positionCounts = shuffled.reduce((counts, question) => {
    counts[question.correctIndex]++;
    assert.equal(question.options[question.correctIndex], 'B');
    return counts;
  }, [0, 0, 0, 0]);

  assert.deepEqual(positionCounts.sort(), [1, 1, 1, 2]);
  assert.deepEqual(questions[0].options, ['A', 'B', 'C', 'D']);
  assert.equal(questions[0].correctIndex, 1);
});

test('rejects quiz questions with invalid correct answer indexes', () => {
  assert.throws(
    () => shuffleQuizAnswers([{ options: ['Only option'], correctIndex: 1 }]),
    RangeError
  );
});

test('randomizes the correct position even for a one-question quiz', () => {
  const [question] = shuffleQuizAnswers(
    [{ options: ['wrong 1', 'correct', 'wrong 2', 'wrong 3'], correctIndex: 1 }],
    () => 0.75
  );

  assert.equal(question.correctIndex, 3);
  assert.equal(question.options[question.correctIndex], 'correct');
});
