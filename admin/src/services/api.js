const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, config);
    const data = await res.json();
    return data;
  } catch (err) {
    // If localhost failed, try relative proxy /api
    try {
      const fallbackRes = await fetch(`/api${path}`, config);
      return await fallbackRes.json();
    } catch {
      return { success: false, message: err.message || 'Network error connecting to API' };
    }
  }
}

export const api = {
  // Sessions API
  async getSessions() {
    return request('/sessions');
  },

  async getSessionById(id) {
    return request(`/sessions/${id}`);
  },

  // Session Files API
  async getSessionFiles(sessionNumber) {
    return request(`/sessions/${sessionNumber}/files`);
  },

  async addSessionFile(sessionNumber, fileData) {
    return request(`/sessions/${sessionNumber}/files`, {
      method: 'POST',
      body: JSON.stringify(fileData),
    });
  },

  async updateSessionFile(sessionNumber, fileId, fileData) {
    return request(`/sessions/${sessionNumber}/files/${fileId}`, {
      method: 'PUT',
      body: JSON.stringify(fileData),
    });
  },

  async deleteSessionFile(sessionNumber, fileId) {
    return request(`/sessions/${sessionNumber}/files/${fileId}`, {
      method: 'DELETE',
    });
  },

  async setPrimarySessionFile(sessionNumber, fileId) {
    return request(`/sessions/${sessionNumber}/files/${fileId}/primary`, {
      method: 'PUT',
    });
  },

  // GitHub Preview Helper API (Fetches any GitHub URL server-side)
  async previewGitHubUrl(url) {
    return request(`/github/preview?url=${encodeURIComponent(url)}`);
  },

  // Quizzes CRUD API
  async getQuizzes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/quizzes${query ? `?${query}` : ''}`);
  },

  async getQuizForSession(sessionNumber) {
    return request(`/quizzes/session/${sessionNumber}`);
  },

  async getQuizById(id) {
    return request(`/quizzes/${id}`);
  },

  async createQuizQuestion(questionData) {
    return request('/quizzes', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  async updateQuizQuestion(id, questionData) {
    return request(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  },

  async deleteQuizQuestion(id) {
    return request(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },

  async resetQuizzesToDefault() {
    return request('/quizzes/reset', {
      method: 'POST',
    });
  },

  // Health
  async getHealth() {
    return request('/health');
  },

  // Auth API
  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
  },

  // Users Management API
  async getUsers() {
    return request('/admin/users');
  },

  async createUser(userData) {
    return request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async updateUser(id, userData) {
    return request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(id) {
    return request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  async getLeaderboard() {
    return request('/leaderboard');
  },

  // Leaderboard Admin CRUD API
  async getAdminLeaderboard() {
    return request('/admin/leaderboard');
  },

  async createLeaderboardEntry(entryData) {
    return request('/admin/leaderboard', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  },

  async updateLeaderboardEntry(id, entryData) {
    return request(`/admin/leaderboard/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  },

  async resetLeaderboardEntry(id) {
    return request(`/admin/leaderboard/${id}`, {
      method: 'DELETE',
    });
  },

  async recalculateLeaderboard() {
    return request('/admin/leaderboard/recalculate', {
      method: 'POST',
    });
  },
};

