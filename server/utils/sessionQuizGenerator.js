const MIN_QUESTIONS_PER_SESSION = 5;
const MAX_QUESTIONS_PER_SESSION = 8;

const cleanMarkdown = (line) => line
  .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[*`_~]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

export const extractSessionQuizFacts = (content) => {
  if (typeof content !== 'string' || !content.trim()) return [];

  const facts = [];
  const seen = new Set();
  let section = 'Session overview';
  let insideCodeBlock = false;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }
    if (insideCodeBlock || !line) continue;

    const heading = line.match(/^#{1,6}\s+(.+)/);
    if (heading) {
      section = cleanMarkdown(heading[1]);
      continue;
    }

    const statement = cleanMarkdown(line
      .replace(/^>\s*/, '')
      .replace(/^(?:[-*+]|\d+[.)])\s+/, '')
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .replace(/\|/g, ' '));

    const pieces = statement.match(/[^.!?]+[.!?]?/g) || [];
    for (const piece of pieces) {
      const text = piece.trim();
      const normalized = text.toLowerCase();
      if (text.length < 45 || text.length > 220 || seen.has(normalized)) continue;
      if (/^(?:https?:\/\/|www\.)/i.test(text) || !/[a-z]{3}/i.test(text)) continue;
      seen.add(normalized);
      facts.push({ section, text });
    }
  }

  return facts;
};

export const buildSessionSummaryQuizzes = (sessions, curatedQuestions) => {
  const factsBySession = new Map(
    sessions.map((session) => [
      session.sessionNumber,
      extractSessionQuizFacts(session._summaryContent),
    ])
  );
  const allFacts = sessions.flatMap((session) =>
    (factsBySession.get(session.sessionNumber) || []).map((fact) => ({
      ...fact,
      sessionNumber: session.sessionNumber,
    }))
  );
  const curatedBySession = new Map();

  for (const question of curatedQuestions) {
    const questions = curatedBySession.get(question.sessionNumber) || [];
    questions.push(question);
    curatedBySession.set(question.sessionNumber, questions);
  }

  return sessions.flatMap((session) => {
    const curated = (curatedBySession.get(session.sessionNumber) || [])
      .slice(0, MAX_QUESTIONS_PER_SESSION);
    const needed = Math.max(0, MIN_QUESTIONS_PER_SESSION - curated.length);
    if (curated.length + needed > MAX_QUESTIONS_PER_SESSION) {
      throw new Error(`Session ${session.sessionNumber} exceeds the quiz question limit`);
    }

    const facts = factsBySession.get(session.sessionNumber) || [];
    if (facts.length < needed) {
      throw new Error(
        `Session ${session.sessionNumber} primary notes contain only ${facts.length} usable facts; ${needed} are required`
      );
    }

    const distractorFacts = allFacts
      .filter((fact) => fact.sessionNumber !== session.sessionNumber)
      .filter((fact, index, list) => list.findIndex((candidate) => candidate.text === fact.text) === index);
    if (needed && distractorFacts.length < 3) {
      throw new Error(`Not enough source facts to build distractors for session ${session.sessionNumber}`);
    }

    const generated = Array.from({ length: needed }, (_, index) => {
      const fact = facts[index];
      const start = (session.sessionNumber * 7 + index * 11) % distractorFacts.length;
      const options = [fact.text];
      let candidateIndex = start;

      while (options.length < 4 && candidateIndex - start < distractorFacts.length) {
        const candidate = distractorFacts[candidateIndex % distractorFacts.length].text;
        if (!options.includes(candidate)) options.push(candidate);
        candidateIndex += 1;
      }
      if (options.length < 4) {
        throw new Error(`Not enough unique answer options for session ${session.sessionNumber}`);
      }

      return {
        sessionNumber: session.sessionNumber,
        moduleId: session.moduleId,
        question: `Which statement appears under "${fact.section}" in the primary notes for Session ${session.sessionNumber}?`,
        options,
        correctIndex: 0,
        explanation: `This statement is included under "${fact.section}" in the primary notes for ${session.title}.`,
        difficulty: 'Beginner',
        tags: ['Session Summary', fact.section],
      };
    });

    return [...curated, ...generated];
  });
};
