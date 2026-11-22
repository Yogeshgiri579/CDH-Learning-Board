import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSessionSummaryQuizzes, extractSessionQuizFacts } from './sessionQuizGenerator.js';

const sessions = [
  {
    sessionNumber: 1,
    moduleId: 'm1',
    title: 'DevOps foundations',
    _summaryContent: `## Workflow
- Developers write unit tests before packaging application code into a release artifact.
- A Dockerfile packages the application artifact with dependencies into a Docker image.
- CI pipelines automate build and test stages after a source code change.
- Teams publish the resulting image to a registry so other environments can pull it.
## Practice
- Students should inspect deployment health checks after completing the hands-on exercise.`,
  },
  {
    sessionNumber: 2,
    moduleId: 'm1',
    title: 'Cloud basics',
    _summaryContent: `## Cloud
- Virtual machines provide isolated compute resources for cloud workloads.
- Cloud storage keeps application data outside an individual virtual machine.
- Teams select a region based on service availability and data residency needs.
- Network rules control which services can communicate with cloud resources.
- Monitoring alerts help operators identify changes in application health.`,
  },
  {
    sessionNumber: 3,
    moduleId: 'm2',
    title: 'Linux basics',
    _summaryContent: `## Linux
- File permissions determine which users can read, write, or execute a file.
- Administrators use package managers to install and update software.
- Shell commands can inspect running processes and system resource usage.
- Service managers control whether background services start at boot.
- Logs provide details that help diagnose operating system failures.`,
  },
];

test('builds five questions per session using source facts and bounded distractors', () => {
  const curatedQuestions = sessions.flatMap((session) =>
    Array.from({ length: 3 }, (_, index) => ({
      sessionNumber: session.sessionNumber,
      moduleId: session.moduleId,
      question: `Curated question ${index + 1}`,
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 1,
    }))
  );

  const questions = buildSessionSummaryQuizzes(sessions, curatedQuestions);

  for (const session of sessions) {
    const sessionQuestions = questions.filter((question) => question.sessionNumber === session.sessionNumber);
    const sourceFacts = extractSessionQuizFacts(session._summaryContent).map((fact) => fact.text);
    const generated = sessionQuestions.slice(3);

    assert.equal(sessionQuestions.length, 5);
    assert.ok(sessionQuestions.length <= 8);
    assert.equal(generated.length, 2);
    assert.ok(generated.every((question) => question.options[question.correctIndex] && sourceFacts.includes(question.options[question.correctIndex])));
  }
});

test('fails explicitly when primary notes cannot supply enough facts', () => {
  assert.throws(
    () => buildSessionSummaryQuizzes(
      [{ sessionNumber: 1, moduleId: 'm1', title: 'No notes', _summaryContent: '' }],
      []
    ),
    /primary notes contain only 0 usable facts/
  );
});

test('creates a complete source-only quiz when a session has no curated questions', () => {
  const questions = buildSessionSummaryQuizzes(sessions, []);
  const sessionQuestions = questions.filter((question) => question.sessionNumber === 1);
  const sourceFacts = extractSessionQuizFacts(sessions[0]._summaryContent).map((fact) => fact.text);

  assert.equal(sessionQuestions.length, 5);
  assert.ok(sessionQuestions.every((question) => sourceFacts.includes(question.options[question.correctIndex])));
});
