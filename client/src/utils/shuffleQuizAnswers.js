const shuffleInPlace = (items, random) => {
  for (let index = items.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
};

export const shuffleQuizAnswers = (questions, random = Math.random) => {
  const groupedIndexes = new Map();

  questions.forEach((question, questionIndex) => {
    if (!Array.isArray(question.options) || question.options.length === 0) {
      throw new TypeError(`Quiz question ${questionIndex + 1} must have at least one option`);
    }
    if (
      !Number.isInteger(question.correctIndex) ||
      question.correctIndex < 0 ||
      question.correctIndex >= question.options.length
    ) {
      throw new RangeError(`Quiz question ${questionIndex + 1} has an invalid correct answer index`);
    }

    const optionCount = question.options.length;
    if (!groupedIndexes.has(optionCount)) groupedIndexes.set(optionCount, []);
    groupedIndexes.get(optionCount).push(questionIndex);
  });

  const correctIndexes = new Array(questions.length);
  for (const [optionCount, indexes] of groupedIndexes) {
    const startingIndex = Math.floor(random() * optionCount);
    const targetIndexes = indexes.map((_, index) => (index + startingIndex) % optionCount);
    shuffleInPlace(targetIndexes, random);
    indexes.forEach((questionIndex, index) => {
      correctIndexes[questionIndex] = targetIndexes[index];
    });
  }

  return questions.map((question, questionIndex) => {
    const correctIndex = correctIndexes[questionIndex];
    const correctOption = question.options[question.correctIndex];
    const otherOptions = shuffleInPlace(
      question.options.filter((_, index) => index !== question.correctIndex),
      random
    );
    const options = new Array(question.options.length);
    let otherOptionIndex = 0;

    for (let index = 0; index < options.length; index++) {
      options[index] = index === correctIndex ? correctOption : otherOptions[otherOptionIndex++];
    }

    return { ...question, options, correctIndex };
  });
};
