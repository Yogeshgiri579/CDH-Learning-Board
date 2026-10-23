import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Award, 
  Search, 
  RotateCw, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Save, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';
import { api } from '../services/api';

export const AVAILABLE_BADGES = [
  'Module 01: FOUNDATIONS & AI',
  'Module 02: LINUX (Ubuntu + GCP)',
  'Module 03: AWS Cloud Services',
  'Module 04: CI/CD (Git & Jenkins)',
  'Module 05: DOCKER & KUBERNETES',
  'Module 06: TERRAFORM & ANSIBLE',
  'Module 07: PYTHON & AUTOMATION',
  'Module 08: AZURE (AIOps + GenAI)',
  'Module 09: CAPSTONE (9 Projects)',
  'Module 10: CAREER & REFERRALS',
];

const getInitials = (name = 'U') => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const AVATAR_GRADIENTS = [
  'from-emerald-500 to-teal-700',
  'from-blue-500 to-indigo-700',
  'from-violet-500 to-purple-800',
  'from-amber-500 to-orange-700',
  'from-rose-500 to-red-700',
  'from-cyan-500 to-blue-700',
];

const getAvatarGradient = (str = 'user') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

export const LeaderboardManagementPanel = ({ showToast }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [recalculating, setRecalculating] = useState(false);

  // Modal for Edit / Create Entry
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    points: 100,
    completedCount: 5,
    badges: ['Module 01: FOUNDATIONS & AI'],
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminLeaderboard();
      if (res && res.success) {
        setLeaderboard(res.leaderboard || []);
      }
    } catch (err) {
      console.error('Failed to load admin leaderboard:', err);
      showToast('Error loading leaderboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = useMemo(() => {
    if (!search.trim()) return leaderboard;
    const q = search.toLowerCase().trim();
    return leaderboard.filter(
      (item) => item.name?.toLowerCase().includes(q) || item.email?.toLowerCase().includes(q)
    );
  }, [leaderboard, search]);

  const top3 = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);

  const stats = useMemo(() => {
    const total = leaderboard.length;
    const topScore = leaderboard[0]?.points || 0;
    const avgScore = total > 0 ? Math.round(leaderboard.reduce((s, i) => s + (i.points || 0), 0) / total) : 0;
    const totalBadges = leaderboard.reduce((s, i) => s + (i.badges?.length || 0), 0);
    return { total, topScore, avgScore, totalBadges };
  }, [leaderboard]);

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormData({
      name: '',
      email: '',
      points: 100,
      completedCount: 1,
      badges: ['Module 01: FOUNDATIONS & AI'],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      name: entry.name || '',
      email: entry.email || '',
      points: entry.points || 0,
      completedCount: entry.completedCount || 0,
      badges: entry.badges || [],
    });
    setModalOpen(true);
  };

  const handleToggleBadge = (badgeName) => {
    setFormData((prev) => {
      const exists = prev.badges.includes(badgeName);
      return {
        ...prev,
        badges: exists
          ? prev.badges.filter((b) => b !== badgeName)
          : [...prev.badges, badgeName],
      };
    });
  };

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    setSaveLoading(true);
    try {
      if (editingEntry) {
        const res = await api.updateLeaderboardEntry(editingEntry.id || editingEntry._id, {
          name: formData.name.trim(),
          points: Number(formData.points),
          badges: formData.badges,
        });
        if (res && res.success) {
          showToast(`Updated leaderboard for ${formData.name}`);
          setModalOpen(false);
          fetchLeaderboard();
        } else {
          showToast(res?.message || 'Failed to update entry', 'error');
        }
      } else {
        const res = await api.createLeaderboardEntry({
          name: formData.name.trim(),
          email: formData.email.trim(),
          points: Number(formData.points),
          badges: formData.badges,
          completedCount: Number(formData.completedCount),
        });
        if (res && res.success) {
          showToast(`Added ${formData.name} to leaderboard`);
          setModalOpen(false);
          fetchLeaderboard();
        } else {
          showToast(res?.message || 'Failed to create entry', 'error');
        }
      }
    } catch (err) {
      showToast(err.message || 'Error saving entry', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddBonusPoints = async (entry, bonus) => {
    try {
      const newPoints = (entry.points || 0) + bonus;
      const res = await api.updateLeaderboardEntry(entry.id || entry._id, {
        points: newPoints,
      });
      if (res && res.success) {
        showToast(`Awarded +${bonus} pts to ${entry.name}!`);
        fetchLeaderboard();
      } else {
        showToast(res?.message || 'Failed to add bonus', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating points', 'error');
    }
  };

  const handleResetScore = async (entry) => {
    if (!window.confirm(`Are you sure you want to reset leaderboard score and progress for "${entry.name}"?`)) {
      return;
    }

    try {
      const res = await api.resetLeaderboardEntry(entry.id || entry._id);
      if (res && res.success) {
        showToast(`Reset score for ${entry.name}`);
        fetchLeaderboard();
      } else {
        showToast(res?.message || 'Failed to reset score', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error resetting score', 'error');
    }
  };

  const handleRecalculateAll = async () => {
    if (!window.confirm('Recalculate scores for all learners from completed sessions & passed quizzes?')) {
      return;
    }
    setRecalculating(true);
    try {
      const res = await api.recalculateLeaderboard();
      if (res && res.success) {
        showToast(res.message || 'Leaderboard recalculated successfully!');
        fetchLeaderboard();
      } else {
        showToast(res?.message || 'Failed to recalculate', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error recalculating leaderboard', 'error');
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Ranked Students</span>
            <Users className="w-4 h-4 text-[#58a6ff]" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">{stats.total}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Active in 55-Day challenge</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Top Score</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">{stats.topScore} pts</p>
          <span className="text-[10px] text-[#8b949e] truncate block">Champion: {top3[0]?.name || 'N/A'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-300 font-mono">{stats.avgScore} pts</p>
          <span className="text-[10px] text-[#8b949e]">Across active learners</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Badges Awarded</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-mono">{stats.totalBadges}</p>
          <span className="text-[10px] text-[#8b949e]">10 challenge badges</span>
        </div>
      </div>

      {/* Podium Cards Preview */}
      {top3.length >= 3 && !search && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-xs">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Current Podium Champions
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#21262d] text-[#58a6ff] border border-[#30363d] font-bold">
              Live Standings
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {/* Rank 2 */}
            <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] text-center flex flex-col items-center">
              <span className="text-xl">🥈</span>
              <span className="text-[10px] font-bold text-[#8b949e] uppercase">Rank #2</span>
              <div className="w-10 h-10 rounded-full border-2 border-slate-300 bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-extrabold flex items-center justify-center text-xs shadow-sm my-1.5">
                {getInitials(top3[1].name)}
              </div>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{top3[1].name}</p>
              <span className="text-xs font-mono font-bold text-slate-300 mt-0.5">{top3[1].points} pts</span>
            </div>

            {/* Rank 1 */}
            <div className="p-3.5 rounded-xl bg-[#161b22] border-2 border-amber-500/60 text-center flex flex-col items-center shadow-md shadow-amber-500/10 scale-102">
              <span className="text-2xl">🥇</span>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Champion #1</span>
              <div className="w-11 h-11 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md my-1.5">
                {getInitials(top3[0].name)}
              </div>
              <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px]">{top3[0].name}</p>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-amber-400 mt-0.5">{top3[0].points} pts</span>
            </div>

            {/* Rank 3 */}
            <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] text-center flex flex-col items-center">
              <span className="text-xl">🥉</span>
              <span className="text-[10px] font-bold text-[#8b949e] uppercase">Rank #3</span>
              <div className="w-10 h-10 rounded-full border-2 border-amber-700 bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100 font-extrabold flex items-center justify-center text-xs shadow-sm my-1.5">
                {getInitials(top3[2].name)}
              </div>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{top3[2].name}</p>
              <span className="text-xs font-mono font-bold text-amber-500 mt-0.5">{top3[2].points} pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar: Search, Recalculate, Add Entry, Refresh */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0d1117] border border-[#30363d]">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search leaderboard by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#010409] border border-[#30363d] text-xs text-[#f0f6fc] placeholder-[#8b949e] outline-none focus:border-[#58a6ff]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRecalculateAll}
            disabled={recalculating}
            className="px-3 py-1.5 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Recalculate points for all students based on completed sessions & quizzes"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#58a6ff] ${recalculating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Recalculate Scores</span>
          </button>

          <button
            onClick={fetchLeaderboard}
            className="p-2 rounded-xl border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
            title="Refresh Leaderboard"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#58a6ff]' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Score Entry</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table with CRUD actions */}
      <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[620px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#161b22] border-b border-[#30363d] text-[#8b949e] uppercase text-[10px] font-semibold">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4 text-center">Completed Labs</th>
                <th className="py-3 px-4 text-center">Quizzes</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Points</th>
                <th className="py-3 px-4 text-center w-36">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8b949e]">
                    <RotateCw className="w-5 h-5 animate-spin mx-auto text-[#58a6ff] mb-2" />
                    <span>Loading leaderboard entries...</span>
                  </td>
                </tr>
              ) : filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8b949e]">
                    No leaderboard records found matching "{search}"
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((entry) => {
                  const gradient = getAvatarGradient(entry.name);
                  const initials = getInitials(entry.name);

                  return (
                    <tr 
                      key={entry.id || entry._id || entry.rank}
                      className="hover:bg-[#161b22]/70 transition-colors"
                    >
                      {/* Rank */}
                      <td className="py-3 px-4 text-center">
                        {entry.rank === 1 ? (
                          <span className="text-base">🥇</span>
                        ) : entry.rank === 2 ? (
                          <span className="text-base">🥈</span>
                        ) : entry.rank === 3 ? (
                          <span className="text-base">🥉</span>
                        ) : (
                          <span className="font-mono text-xs text-[#8b949e] font-semibold">#{entry.rank}</span>
                        )}
                      </td>

                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${gradient} text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate text-xs flex items-center space-x-1.5">
                              <span>{entry.name}</span>
                              {entry.role === 'admin' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  ADMIN
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-[#8b949e] truncate">{entry.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Completed Sessions */}
                      <td className="py-3 px-4 text-center font-mono text-[#c9d1d9]">
                        <span className="font-bold text-white">{entry.completedCount}</span>/55
                      </td>

                      {/* Quizzes Passed */}
                      <td className="py-3 px-4 text-center font-mono text-emerald-400 font-semibold">
                        {entry.quizzesPassed || 0}
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {entry.badges && entry.badges.slice(0, 2).map((b, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] whitespace-nowrap">
                              {b}
                            </span>
                          ))}
                          {entry.badges && entry.badges.length > 2 && (
                            <span className="text-[10px] text-[#8b949e]">+{entry.badges.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Points */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400 text-xs sm:text-sm">
                        {entry.points} pts
                      </td>

                      {/* Admin CRUD Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Quick +50 bonus */}
                          <button
                            onClick={() => handleAddBonusPoints(entry, 50)}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#21262d] hover:bg-[#238636] text-[#c9d1d9] hover:text-white border border-[#30363d] transition-colors cursor-pointer"
                            title="Award +50 bonus points"
                          >
                            +50
                          </button>

                          {/* Edit Entry */}
                          <button
                            onClick={() => handleOpenEdit(entry)}
                            className="p-1.5 rounded-lg text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d] transition-colors cursor-pointer"
                            title="Edit student score & badges"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset / Zero score */}
                          <button
                            onClick={() => handleResetScore(entry)}
                            className="p-1.5 rounded-lg text-[#8b949e] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Reset score to 0"
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

      {/* Modal: Create / Edit Leaderboard Entry */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="relative bg-[#0d1117] border border-[#30363d] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 text-[#f0f6fc]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingEntry ? 'Edit Leaderboard Score' : 'Add Student to Leaderboard'}
                  </h3>
                  <p className="text-xs text-[#8b949e]">
                    Adjust student points, badges, and challenge rankings.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c9d1d9] font-semibold mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-white outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div>
                <label className="block text-[#c9d1d9] font-semibold mb-1">Student Email</label>
                <input
                  type="email"
                  required
                  disabled={Boolean(editingEntry)}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-white outline-none focus:border-[#58a6ff] disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c9d1d9] font-semibold mb-1">Total Points</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-amber-400 font-mono font-bold outline-none focus:border-[#58a6ff]"
                  />
                </div>

                {!editingEntry && (
                  <div>
                    <label className="block text-[#c9d1d9] font-semibold mb-1">Completed Labs</label>
                    <input
                      type="number"
                      min="0"
                      max="55"
                      value={formData.completedCount}
                      onChange={(e) => setFormData({ ...formData, completedCount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-white font-mono outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                )}
              </div>

              {/* Badges Checklist */}
              <div>
                <label className="block text-[#c9d1d9] font-semibold mb-1.5 flex items-center justify-between">
                  <span>Earned Challenge Badges</span>
                  <span className="text-[#8b949e] font-normal">{formData.badges.length} selected</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-2 rounded-xl bg-[#010409] border border-[#30363d]">
                  {AVAILABLE_BADGES.map((b) => {
                    const isChecked = formData.badges.includes(b);
                    return (
                      <button
                        type="button"
                        key={b}
                        onClick={() => handleToggleBadge(b)}
                        className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/50'
                            : 'bg-[#161b22] text-[#8b949e] hover:text-white border border-transparent'
                        }`}
                      >
                        <span className="truncate">{b}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-[#3fb950] flex-shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  {saveLoading && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingEntry ? 'Save Changes' : 'Add to Leaderboard'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
