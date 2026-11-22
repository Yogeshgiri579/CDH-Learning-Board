import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuizForSession } from './quizzes.js';
import { initialSessions } from './sessions.js';

test('every session has a 5-to-8-question source-grounded fallback quiz', async () => {
  for (const session of initialSessions) {
    const quiz = await getQuizForSession(session);

    assert.ok(quiz, `Session ${session.sessionNumber} should have a fallback quiz`);
    assert.equal(quiz.sessionNumber, session.sessionNumber);
    assert.ok(quiz.questions.length >= 5 && quiz.questions.length <= 8);
    assert.ok(quiz.questions.every((question) => question.options[question.correctIndex]));
  }
});
