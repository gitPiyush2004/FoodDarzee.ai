'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { calculateBMI, getBMICategory, calculateMacroTargets } from '@/lib/calculations';
import { achievements, getAchievementById, getLevel, getTotalPoints } from '@/data/achievements';

export default function ProfilePage() {
  const app = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Edit form state
  const [editAge, setEditAge] = useState(25);
  const [editHeight, setEditHeight] = useState(170);
  const [editWeight, setEditWeight] = useState(70);
  const [editGoal, setEditGoal] = useState('maintain');
  const [editActivity, setEditActivity] = useState('moderate');
  const [editSleep, setEditSleep] = useState(7);

  useEffect(() => {
    setMounted(true);
    if (!app.isAuthenticated) router.push('/auth');
    else if (!app.user?.onboardingComplete) router.push('/onboarding');
    if (app.user?.profile) {
      setEditAge(app.user.profile.age);
      setEditHeight(app.user.profile.height);
      setEditWeight(app.user.profile.weight);
      setEditGoal(app.user.profile.goal);
      setEditActivity(app.user.profile.activityLevel);
      setEditSleep(app.user.profile.sleepHours);
    }
  }, [app.isAuthenticated, app.user, router]);

  if (!mounted || !app.isAuthenticated || !app.user?.onboardingComplete) return null;

  const profile = app.user.profile!;
  const targets = app.user.targets!;
  const bmi = app.user.bmi || calculateBMI(profile.weight, profile.height);
  const bmiInfo = getBMICategory(bmi);
  const levelInfo = getLevel(app.totalPoints);

  const handleSaveProfile = () => {
    app.updateProfile({
      age: editAge,
      height: editHeight,
      weight: editWeight,
      goal: editGoal as typeof profile.goal,
      activityLevel: editActivity as typeof profile.activityLevel,
      sleepHours: editSleep,
    });
    setEditMode(false);
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border-color)',
    borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-md)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1px solid var(--border-color)', background: 'var(--background)',
    fontSize: 14, color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box',
  };

  const goalLabels: Record<string, string> = {
    weight_loss: '⬇️ Lose Weight', weight_gain: '⬆️ Gain Weight',
    maintain: '⚖️ Maintain', fitness: '💪 Fitness', medical: '🩺 Medical',
  };

  const activityLabels: Record<string, string> = {
    sedentary: '🪑 Sedentary', light: '🚶 Light', moderate: '🏋️ Moderate',
    active: '🏃 Active', very_active: '🔥 Very Active',
  };

  const dietLabels: Record<string, string> = { veg: '🥬 Vegetarian', 'non-veg': '🍗 Non-Veg', vegan: '🌱 Vegan' };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--foreground)' }}>
            👤 Profile
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>Manage your health profile and settings</p>
        </div>

        {/* Profile Card */}
        <div style={{
          ...cardStyle, marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(245,158,11,0.06), var(--surface))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-heading)',
              flexShrink: 0,
            }}>
              {app.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
                {app.user.name}
              </h2>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{app.user.email}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                  background: 'rgba(245,158,11,0.1)', color: '#d97706',
                }}>
                  Level {levelInfo.level} — {levelInfo.title}
                </span>
                <span style={{
                  padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                  background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                }}>
                  {app.totalPoints} Points
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Level {levelInfo.level}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Level {levelInfo.level + 1}</span>
            </div>
            <div style={{ height: 8, borderRadius: 100, background: 'var(--border-color)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 100,
                background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                width: `${levelInfo.progress}%`,
                transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, textAlign: 'center' }}>
              {levelInfo.nextLevelPoints - app.totalPoints} points to next level
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Health Info */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
                Health Profile
              </h3>
              <button onClick={() => setEditMode(!editMode)} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: '1px solid var(--border-color)', background: 'var(--surface)',
                cursor: 'pointer', color: '#f59e0b',
              }}>
                {editMode ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>

            {!editMode ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  { label: 'Age', value: `${profile.age} years` },
                  { label: 'Gender', value: profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) },
                  { label: 'Height', value: `${profile.height} cm` },
                  { label: 'Weight', value: `${profile.weight} kg` },
                  { label: 'BMI', value: `${bmi} (${bmiInfo.category})`, color: bmiInfo.color },
                  { label: 'Diet', value: dietLabels[profile.dietaryPref] },
                  { label: 'Goal', value: goalLabels[profile.goal] },
                  { label: 'Activity', value: activityLabels[profile.activityLevel] },
                  { label: 'Sleep', value: `${profile.sleepHours} hours` },
                  { label: 'Conditions', value: profile.conditions.length > 0 ? profile.conditions.join(', ') : 'None' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'color' in item && item.color ? item.color : 'var(--foreground)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  { label: 'Age', val: editAge, set: setEditAge, min: 10, max: 100 },
                  { label: 'Height (cm)', val: editHeight, set: setEditHeight, min: 100, max: 250 },
                  { label: 'Weight (kg)', val: editWeight, set: setEditWeight, min: 20, max: 300 },
                  { label: 'Sleep (hours)', val: editSleep, set: setEditSleep, min: 3, max: 12 },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} min={f.min} max={f.max} style={inputStyle} />
                  </div>
                ))}

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Goal</label>
                  <select value={editGoal} onChange={e => setEditGoal(e.target.value)} style={inputStyle}>
                    {Object.entries(goalLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Activity Level</label>
                  <select value={editActivity} onChange={e => setEditActivity(e.target.value)} style={inputStyle}>
                    {Object.entries(activityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                <button onClick={handleSaveProfile} style={{
                  padding: '12px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  marginTop: 8,
                }}>
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Daily Targets */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
              🎯 Daily Targets
            </h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { label: 'Calories', value: `${targets.calories} kcal`, icon: '🔥', color: '#f59e0b' },
                { label: 'Protein', value: `${targets.protein}g`, icon: '💪', color: '#6366f1' },
                { label: 'Carbs', value: `${targets.carbs}g`, icon: '🍞', color: '#10b981' },
                { label: 'Fats', value: `${targets.fats}g`, icon: '🧈', color: '#ef4444' },
                { label: 'Fiber', value: `${targets.fiber}g`, icon: '🥦', color: '#8b5cf6' },
                { label: 'Water', value: `${targets.water} glasses`, icon: '💧', color: '#3b82f6' },
              ].map(t => (
                <div key={t.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 10, background: 'var(--surface-alt)',
                }}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t.label}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-heading)', color: t.color }} className="tabular-nums">
                    {t.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
              🏆 Achievements
            </h3>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {app.unlockedAchievements.length} / {achievements.length} unlocked
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {achievements.map(badge => {
              const unlocked = app.unlockedAchievements.includes(badge.id);
              return (
                <div key={badge.id} style={{
                  padding: '14px', borderRadius: 12, textAlign: 'center',
                  background: unlocked ? 'rgba(245,158,11,0.06)' : 'var(--surface-alt)',
                  border: `1px solid ${unlocked ? 'rgba(245,158,11,0.2)' : 'var(--border-color)'}`,
                  opacity: unlocked ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 6, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                    {badge.icon}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground)', marginBottom: 2 }}>
                    {badge.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>
                    {badge.description}
                  </div>
                  <div style={{
                    marginTop: 6, fontSize: 10, fontWeight: 700,
                    color: unlocked ? '#d97706' : 'var(--muted)',
                  }}>
                    {badge.points} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div style={{ ...cardStyle, marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
            ⚙️ Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 14px', borderRadius: 10, background: 'var(--surface-alt)',
            }}>
              <span style={{ fontSize: 14, color: 'var(--foreground)' }}>
                {app.darkMode ? '🌙' : '☀️'} {app.darkMode ? 'Dark' : 'Light'} Mode
              </span>
              <button onClick={app.toggleDarkMode} style={{
                padding: '6px 18px', borderRadius: 100,
                background: app.darkMode ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--border-color)',
                color: app.darkMode ? '#fff' : 'var(--foreground)',
                border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
              }}>
                {app.darkMode ? 'ON' : 'OFF'}
              </button>
            </div>

            <button onClick={app.logout} style={{
              width: '100%', padding: '13px', borderRadius: 10,
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.05)',
              color: '#ef4444', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', transition: 'background 0.2s',
            }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
