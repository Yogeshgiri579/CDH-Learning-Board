import { QuizQuestion, inMemoryQuizQuestions, defaultQuizQuestions } from '../models/Quiz.js';
import { getDbStatus } from '../config/db.js';

// Get questions list with filtering
export const getQuizzes = async (req, res) => {
  try {
    const { sessionNumber, moduleId, search, difficulty } = req.query;
    const isMongo = getDbStatus();

    if (isMongo) {
      // Auto-seed if collection is empty
      const existingCount = await QuizQuestion.countDocuments();
      if (existingCount === 0) {
        const seedData = defaultQuizQuestions.map(({ _id, ...rest }) => rest);
        await QuizQuestion.insertMany(seedData);
      }

      let filter = {};
      if (sessionNumber !== undefined && sessionNumber !== '') {
        filter.sessionNumber = parseInt(sessionNumber, 10);
      }
      if (moduleId && moduleId !== 'all') {
        filter.moduleId = moduleId;
      }
      if (difficulty && difficulty !== 'all') {
        filter.difficulty = difficulty;
      }
      if (search) {
        filter.question = { $regex: search, $options: 'i' };
      }

      const questions = await QuizQuestion.find(filter).sort({ sessionNumber: 1, createdAt: -1 });
      return res.json({
        success: true,
        count: questions.length,
        questions,
      });
    } else {
      let results = [...inMemoryQuizQuestions];

      if (sessionNumber !== undefined && sessionNumber !== '' && sessionNumber !== 'all') {
        const num = parseInt(sessionNumber, 10);
        results = results.filter((q) => q.sessionNumber === num);
      }
      if (moduleId && moduleId !== 'all') {
        results = results.filter((q) => q.moduleId === moduleId);
      }
      if (difficulty && difficulty !== 'all') {
        results = results.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        results = results.filter((item) =>
          item.question.toLowerCase().includes(q) ||
          item.explanation?.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }

      return res.json({
        success: true,
        count: results.length,
        questions: results,
      });
    }
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving quizzes' });
  }
};

// Get quiz questions for a specific session
export const getQuizForSession = async (req, res) => {
  try {
    const sessionNum = parseInt(req.params.sessionNumber, 10);
    const isMongo = getDbStatus();

    let questions = [];
    if (isMongo) {
      questions = await QuizQuestion.find({ sessionNumber: sessionNum });
    } else {
      questions = inMemoryQuizQuestions.filter((q) => q.sessionNumber === sessionNum);
    }

    return res.json({
      success: true,
      sessionNumber: sessionNum,
      questions,
    });
  } catch (error) {
    console.error('Error fetching session quiz:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving session quiz' });
  }
};

// Get single quiz question by ID
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongo = getDbStatus();

    if (isMongo) {
      const question = await QuizQuestion.findById(id);
      if (!question) {
        return res.status(404).json({ success: false, message: 'Question not found' });
      }
      return res.json({ success: true, question });
    } else {
      const question = inMemoryQuizQuestions.find((q) => q._id === id);
      if (!question) {
        return res.status(404).json({ success: false, message: 'Question not found' });
      }
      return res.json({ success: true, question });
    }
  } catch (error) {
    console.error('Error getting question by ID:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new quiz question
export const createQuizQuestion = async (req, res) => {
  try {
    const { question, options, correctIndex, explanation, sessionNumber, moduleId, difficulty, tags } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question text is required' });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 options are required' });
    }

    const cIndex = parseInt(correctIndex, 10);
    if (isNaN(cIndex) || cIndex < 0 || cIndex >= options.length) {
      return res.status(400).json({ success: false, message: 'Valid correctIndex matching options is required' });
    }

    const sNum = sessionNumber !== undefined && sessionNumber !== '' && sessionNumber !== null ? parseInt(sessionNumber, 10) : null;
    const isMongo = getDbStatus();

    if (isMongo) {
      const created = await QuizQuestion.create({
        question: question.trim(),
        options: options.map((o) => String(o).trim()),
        correctIndex: cIndex,
        explanation: explanation?.trim() || '',
        sessionNumber: sNum,
        moduleId: moduleId || 'm1',
        difficulty: difficulty || 'Intermediate',
        tags: Array.isArray(tags) ? tags : [],
      });

      return res.status(201).json({
        success: true,
        message: 'Quiz question created successfully',
        question: created,
      });
    } else {
      const created = {
        _id: `q_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        question: question.trim(),
        options: options.map((o) => String(o).trim()),
        correctIndex: cIndex,
        explanation: explanation?.trim() || '',
        sessionNumber: sNum,
        moduleId: moduleId || 'm1',
        difficulty: difficulty || 'Intermediate',
        tags: Array.isArray(tags) ? tags : [],
        createdAt: new Date().toISOString(),
      };
      inMemoryQuizQuestions.unshift(created);

      return res.status(201).json({
        success: true,
        message: 'Quiz question created successfully',
        question: created,
      });
    }
  } catch (error) {
    console.error('Error creating quiz question:', error);
    return res.status(500).json({ success: false, message: 'Server error creating quiz question' });
  }
};

// Update an existing quiz question
export const updateQuizQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctIndex, explanation, sessionNumber, moduleId, difficulty, tags } = req.body;

    const isMongo = getDbStatus();
    let updates = {};

    if (question) updates.question = question.trim();
    if (Array.isArray(options)) updates.options = options.map((o) => String(o).trim());
    if (correctIndex !== undefined) updates.correctIndex = parseInt(correctIndex, 10);
    if (explanation !== undefined) updates.explanation = explanation.trim();
    if (sessionNumber !== undefined) {
      updates.sessionNumber = sessionNumber !== '' && sessionNumber !== null ? parseInt(sessionNumber, 10) : null;
    }
    if (moduleId) updates.moduleId = moduleId;
    if (difficulty) updates.difficulty = difficulty;
    if (Array.isArray(tags)) updates.tags = tags;

    if (isMongo) {
      const updated = await QuizQuestion.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Question not found' });
      }
      return res.json({ success: true, message: 'Quiz question updated successfully', question: updated });
    } else {
      const index = inMemoryQuizQuestions.findIndex((q) => q._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Question not found' });
      }
      inMemoryQuizQuestions[index] = { ...inMemoryQuizQuestions[index], ...updates };
      return res.json({ success: true, message: 'Quiz question updated successfully', question: inMemoryQuizQuestions[index] });
    }
  } catch (error) {
    console.error('Error updating quiz question:', error);
    return res.status(500).json({ success: false, message: 'Server error updating question' });
  }
};

// Delete a quiz question
export const deleteQuizQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongo = getDbStatus();

    if (isMongo) {
      const deleted = await QuizQuestion.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Question not found' });
      }
      return res.json({ success: true, message: 'Question deleted successfully' });
    } else {
      const index = inMemoryQuizQuestions.findIndex((q) => q._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Question not found' });
      }
      inMemoryQuizQuestions.splice(index, 1);
      return res.json({ success: true, message: 'Question deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting quiz question:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting question' });
  }
};

// Reset questions to default bank
export const resetQuizzesToDefault = async (req, res) => {
  try {
    const isMongo = getDbStatus();
    if (isMongo) {
      await QuizQuestion.deleteMany({});
      const seedData = defaultQuizQuestions.map(({ _id, ...rest }) => rest);
      await QuizQuestion.insertMany(seedData);
    } else {
      inMemoryQuizQuestions.length = 0;
      defaultQuizQuestions.forEach((q) => inMemoryQuizQuestions.push({ ...q }));
    }
    return res.json({
      success: true,
      message: 'Quiz questions successfully reset to default curriculum bank',
      count: defaultQuizQuestions.length,
    });
  } catch (error) {
    console.error('Error resetting quiz bank:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting quizzes' });
  }
};
