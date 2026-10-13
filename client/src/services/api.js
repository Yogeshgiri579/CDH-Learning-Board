const PRIMARY_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DIRECT_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('cdh_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function request(path, options = {}) {
  const config = {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  };

  try {
    const res = await fetch(`${PRIMARY_URL}${path}`, config);
    const contentType = res.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      return await res.json();
    }

    // If non-JSON returned on proxy, try direct backend URL
    if (PRIMARY_URL !== DIRECT_URL) {
      const fallbackRes = await fetch(`${DIRECT_URL}${path}`, config);
      return await fallbackRes.json();
    }

    return { success: false, message: `Unexpected server response (${res.status})` };
  } catch (err) {
    // If PRIMARY_URL threw network error, try direct backend URL
    if (PRIMARY_URL !== DIRECT_URL) {
      try {
        const fallbackRes = await fetch(`${DIRECT_URL}${path}`, config);
        return await fallbackRes.json();
      } catch {
        return { success: false, message: 'Unable to reach backend server. Please verify the server is running on port 5000.' };
      }
    }
    return { success: false, message: err.message || 'Network error occurred' };
  }
}

export const api = {
  // Auth API
  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
  },

  async register(name, email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
    });
  },

  async googleAuth(profile) {
    return request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },

  async githubAuth(profile) {
    return request('/auth/github', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },

  async getMe() {
    return request('/auth/me');
  },

  async toggleComplete(sessionNumber) {
    return request('/auth/progress/toggle', {
      method: 'POST',
      body: JSON.stringify({ sessionNumber }),
    });
  },

  // Sessions API
  async getSessions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/sessions${query ? `?${query}` : ''}`);
  },

  async getSessionById(id) {
    return request(`/sessions/${id}`);
  },

  async getSessionRedirect(sessionNumber) {
    return request(`/sessions/${sessionNumber}/redirect`);
  },

  async getOverview() {
    return request('/sessions/overview');
  },

  async getSessionReadme(sessionNumber) {
    return request(`/sessions/${sessionNumber}/readme`);
  },

  // Session Files & GitHub Resources API
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

  // GitHub Preview Helper API (Fetches any GitHub URL server-side)
  async previewGitHubUrl(url) {
    return request(`/github/preview?url=${encodeURIComponent(url)}`);
  },

  // Quiz Management CRUD API
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
};

