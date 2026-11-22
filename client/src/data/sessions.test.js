import test from 'node:test';
import assert from 'node:assert/strict';
import { initialSessions } from './sessions.js';
import { CURRICULUM_MODULE_BADGES } from '../../../shared/curriculumBadges.mjs';

test('assigns unique session numbers and keeps the extra Jenkins session in module 4', () => {
  const sessionNumbers = initialSessions.map((session) => session.sessionNumber);
  const uniqueSessionNumbers = new Set(sessionNumbers);
  const gitLabSession = initialSessions.find((session) => session.folder === 'Session-27- GITLAB');
  const jenkinsPluginsSession = initialSessions.find((session) => session.folder === 'Session-27-Jenkins-Plugins');
  const moduleFourBadge = CURRICULUM_MODULE_BADGES.find((badge) => badge.moduleId === 'm4');

  assert.equal(initialSessions.length, 60);
  assert.equal(uniqueSessionNumbers.size, initialSessions.length);
  assert.equal(gitLabSession.sessionNumber, 27);
  assert.equal(jenkinsPluginsSession.sessionNumber, 59);
  assert.ok(moduleFourBadge.sessions.includes(jenkinsPluginsSession.sessionNumber));
});
