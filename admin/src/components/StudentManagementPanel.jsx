import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Trophy, 
  Award, 
  RotateCw, 
  Phone, 
  Mail, 
  Shield, 
  CheckCircle2, 
  X, 
  Save, 
  Sparkles,
  Lock,
  User,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export const StudentManagementPanel = ({ isLight = false, showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal for Create / Edit Student
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    role: 'user',
    points: 50,
    password: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);

  // Modal for Inspecting Student Progress
  const [detailUser, setDetailUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      if (res && res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      showToast('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      countryCode: '+91',
      role: 'user',
      points: 50,
      password: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      countryCode: u.countryCode || '+91',
      role: u.role || 'user',
      points: u.points || 50,
      password: '',
    });
    setModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setSaveLoading(true);
    try {
      if (editingUser) {
        const res = await api.updateUser(editingUser._id, formData);
        if (res && res.success) {
          showToast(`Student "${formData.name}" updated successfully`, 'success');
          setModalOpen(false);
          await fetchUsers();
        } else {
          showToast(res?.message || 'Failed to update student', 'error');
        }
      } else {
        const res = await api.createUser(formData);
        if (res && res.success) {
          showToast(`Student "${formData.name}" added successfully`, 'success');
          setModalOpen(false);
          await fetchUsers();
        } else {
          showToast(res?.message || 'Failed to create student', 'error');
        }
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Are you sure you want to delete student "${u.name}" (${u.email})?`)) {
      return;
    }

    try {
      const res = await api.deleteUser(u._id);
      if (res && res.success) {
        showToast(`Student "${u.name}" deleted successfully`, 'success');
        await fetchUsers();
      } else {
        showToast(res?.message || 'Failed to delete student', 'error');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || '').includes(search)
  );

  // Stats calculation
  const totalStudents = users.length;
  const totalQuizzesPassed = users.reduce((acc, u) => acc + (u.quizzesPassed || 0), 0);
  const totalCompletedSessions = users.reduce((acc, u) => acc + (u.completedCount || 0), 0);
  const topUser = [...users].sort((a, b) => (b.points || 0) - (a.points || 0))[0];

  return (
    <div className="space-y-5">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-[#d0d7de] text-[#1f2328]' : 'bg-[#161b22] border-[#30363d] text-[#f0f6fc]'
        }`}>
          <div className="flex items-center justify-between text-[#8b949e]">
            <span className="text-xs font-semibold">Total Students</span>
            <Users className="w-4 h-4 text-[#58a6ff]" />
          </div>
          <p className="text-2xl font-black mt-2 font-mono">{totalStudents}</p>
          <p className="text-[11px] text-emerald-400 mt-0.5">Enrolled in 55-Session LMS</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-[#d0d7de] text-[#1f2328]' : 'bg-[#161b22] border-[#30363d] text-[#f0f6fc]'
        }`}>
          <div className="flex items-center justify-between text-[#8b949e]">
            <span className="text-xs font-semibold">Quizzes Mastered</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black mt-2 font-mono text-amber-400">{totalQuizzesPassed}</p>
          <p className="text-[11px] text-[#8b949e] mt-0.5">Passed Across Curriculum</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-[#d0d7de] text-[#1f2328]' : 'bg-[#161b22] border-[#30363d] text-[#f0f6fc]'
        }`}>
          <div className="flex items-center justify-between text-[#8b949e]">
            <span className="text-xs font-semibold">Labs Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black mt-2 font-mono text-emerald-400">{totalCompletedSessions}</p>
          <p className="text-[11px] text-[#8b949e] mt-0.5">Total Completed Sessions</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-[#d0d7de] text-[#1f2328]' : 'bg-[#161b22] border-[#30363d] text-[#f0f6fc]'
        }`}>
          <div className="flex items-center justify-between text-[#8b949e]">
            <span className="text-xs font-semibold">Leaderboard #1</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-sm font-bold mt-2 truncate text-amber-300">
            {topUser ? topUser.name : 'N/A'}
          </p>
          <p className="text-[11px] text-amber-400/80 font-mono mt-0.5">
            {topUser ? `${topUser.points || 0} Points` : '0 Pts'}
          </p>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isLight ? 'bg-white border-[#d0d7de]' : 'bg-[#161b22] border-[#30363d]'
      }`}>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8b949e] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search students by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none font-medium ${
              isLight 
                ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328] focus:border-[#0969da]' 
                : 'bg-[#010409] border-[#30363d] text-white focus:border-[#58a6ff]'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchUsers}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight 
                ? 'border-[#d0d7de] bg-slate-50 hover:bg-slate-100 text-[#656d76]' 
                : 'border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#8b949e]'
            }`}
            title="Refresh student list"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className={`border rounded-2xl overflow-hidden shadow-xl ${
        isLight ? 'bg-white border-[#d0d7de]' : 'bg-[#010409] border-[#30363d]'
      }`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[650px] text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'bg-slate-100 border-[#d0d7de] text-[#656d76]' : 'bg-[#161b22] border-[#30363d] text-[#8b949e]'
              }`}>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4 text-center">Learning Progress</th>
                <th className="py-3 px-4 text-center">Quizzes</th>
                <th className="py-3 px-4 text-center">Points</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-[#21262d]'}`}>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#8b949e]">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto text-[#58a6ff] mb-2" />
                    <span>Loading student records...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#8b949e]">
                    No students found matching "{search}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => {
                  const percent = Math.round(((u.completedCount || 0) / 55) * 100);

                  return (
                    <tr 
                      key={u._id}
                      className={`transition-colors ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-[#161b22]/50'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-4 text-center font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </td>

                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <img 
                            src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}`} 
                            alt={u.name} 
                            className="w-8 h-8 rounded-full border border-[#30363d] object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className={`font-bold text-xs truncate ${isLight ? 'text-[#1f2328]' : 'text-white'}`}>
                              {u.name}
                            </p>
                            <p className="text-[11px] text-[#8b949e] font-mono truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 font-mono text-xs">
                        {u.phone ? (
                          <span className="flex items-center space-x-1">
                            <span className="text-[#8b949e]">{u.countryCode || '+91'}</span>
                            <span className={isLight ? 'text-[#1f2328]' : 'text-[#c9d1d9]'}>{u.phone}</span>
                          </span>
                        ) : (
                          <span className="text-[#8b949e] italic text-[11px]">Not provided</span>
                        )}
                      </td>

                      {/* Progress */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-mono text-xs font-bold ${isLight ? 'text-[#1f2328]' : 'text-[#f0f6fc]'}`}>
                            {u.completedCount || 0} / 55 ({percent}%)
                          </span>
                          <div className={`w-24 h-1.5 rounded-full overflow-hidden mt-1 ${isLight ? 'bg-slate-200' : 'bg-[#21262d]'}`}>
                            <div className="bg-[#238636] h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Quizzes */}
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {u.quizzesPassed || 0} Passed
                        </span>
                      </td>

                      {/* Points */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">
                        {u.points || 0} pts
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setDetailUser(u)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isLight 
                                ? 'border-[#d0d7de] bg-slate-50 hover:bg-slate-100 text-[#0969da]' 
                                : 'border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff]'
                            }`}
                            title="Inspect Student Progress"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(u)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isLight 
                                ? 'border-[#d0d7de] bg-slate-50 hover:bg-slate-100 text-[#656d76]' 
                                : 'border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]'
                            }`}
                            title="Edit Student"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 space-y-4 text-left ${
              isLight ? 'bg-white border-[#d0d7de] text-[#1f2328]' : 'bg-[#0d1117] border-[#30363d] text-[#f0f6fc]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-[#58a6ff]" />
                <h3 className="text-base font-bold">
                  {editingUser ? `Edit Student: ${editingUser.name}` : 'Add New Student'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#8b949e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328]' 
                      : 'bg-[#010409] border-[#30363d] text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.com"
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328]' 
                      : 'bg-[#010409] border-[#30363d] text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Mobile Number (10 Digits)</label>
                <div className="flex space-x-2">
                  <div className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1 ${
                    isLight ? 'bg-slate-100 border-[#d0d7de]' : 'bg-[#161b22] border-[#30363d]'
                  }`}>
                    <span>🇮🇳</span>
                    <span>{formData.countryCode}</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none font-mono ${
                      isLight 
                        ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328]' 
                        : 'bg-[#010409] border-[#30363d] text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328]' 
                        : 'bg-[#010409] border-[#30363d] text-white'
                    }`}
                  >
                    <option value="user">Student (User)</option>
                    <option value="admin">Instructor (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Leaderboard Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none font-mono ${
                      isLight 
                        ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328]' 
                        : 'bg-[#010409] border-[#30363d] text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  {editingUser ? 'New Password (leave blank to keep unchanged)' : 'Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328]' 
                      : 'bg-[#010409] border-[#30363d] text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-[#1f2328]' : 'bg-[#21262d] text-[#c9d1d9] hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saveLoading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{editingUser ? 'Update Student' : 'Create Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Inspection Modal */}
      {detailUser && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
          onClick={() => setDetailUser(null)}
        >
          <div 
            className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 space-y-4 text-left ${
              isLight ? 'bg-white border-[#d0d7de] text-[#1f2328]' : 'bg-[#0d1117] border-[#30363d] text-[#f0f6fc]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <div className="flex items-center space-x-3">
                <img 
                  src={detailUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(detailUser.name)}`} 
                  alt={detailUser.name} 
                  className="w-10 h-10 rounded-full border border-[#30363d]"
                />
                <div>
                  <h3 className="text-base font-bold">{detailUser.name}</h3>
                  <p className="text-xs text-[#8b949e] font-mono">{detailUser.email} • {detailUser.phone ? `+91 ${detailUser.phone}` : 'No phone'}</p>
                </div>
              </div>
              <button onClick={() => setDetailUser(null)} className="p-1 text-[#8b949e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-[#d0d7de]' : 'bg-[#161b22] border-[#30363d]'}`}>
                <p className="text-[10px] text-[#8b949e] uppercase font-bold">Sessions Done</p>
                <p className="text-lg font-bold font-mono text-emerald-400 mt-1">{detailUser.completedCount || 0} / 55</p>
              </div>
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-[#d0d7de]' : 'bg-[#161b22] border-[#30363d]'}`}>
                <p className="text-[10px] text-[#8b949e] uppercase font-bold">Quizzes Passed</p>
                <p className="text-lg font-bold font-mono text-amber-400 mt-1">{detailUser.quizzesPassed || 0}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-[#d0d7de]' : 'bg-[#161b22] border-[#30363d]'}`}>
                <p className="text-[10px] text-[#8b949e] uppercase font-bold">Points</p>
                <p className="text-lg font-bold font-mono text-[#58a6ff] mt-1">{detailUser.points || 0}</p>
              </div>
            </div>

            {/* Badges list */}
            <div>
              <p className="text-xs font-bold mb-2">Unlocked Badges:</p>
              <div className="flex flex-wrap gap-1.5">
                {detailUser.badges && detailUser.badges.length > 0 ? (
                  detailUser.badges.map((b, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🏅 {b}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#8b949e] italic">No badges unlocked yet</span>
                )}
              </div>
            </div>

            {/* Completed sessions list */}
            <div>
              <p className="text-xs font-bold mb-2">Completed Session Numbers:</p>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto custom-scrollbar p-2 rounded-xl border border-[#30363d] bg-[#010409]">
                {detailUser.completedSessions && detailUser.completedSessions.length > 0 ? (
                  detailUser.completedSessions.map((num) => (
                    <span key={num} className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#161b22] border border-[#30363d] text-emerald-400">
                      #{num.toString().padStart(2, '0')}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#8b949e] italic">No completed sessions</span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailUser(null)}
                className="px-4 py-1.5 rounded-xl bg-[#238636] text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
