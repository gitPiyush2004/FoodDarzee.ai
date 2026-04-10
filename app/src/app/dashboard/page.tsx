'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { calculateNutrientTotals, getPercentage, getCalorieStatus } from '@/lib/calculations';
import { predictHealthRisks, calculateOverallHealthScore } from '@/lib/risk-engine';
import { analyzeWeeklyHabits, DayData } from '@/lib/habit-engine';
import Link from 'next/link';

export default function DashboardPage() {
  const app = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!app.isAuthenticated) router.push('/auth');
    else if (!app.user?.onboardingComplete) router.push('/onboarding');
  }, [app.isAuthenticated, app.user, router]);

  if (!mounted || !app.isAuthenticated || !app.user?.onboardingComplete) return null;

  const profile = app.user.profile!;
  const targets = app.user.targets!;
  const todayTotals = calculateNutrientTotals(app.todayMeals);
  const calStatus = getCalorieStatus(todayTotals.calories, targets.calories);

  // Health risks
  const weekMeals = app.getWeekMeals();
  const avgTotals = weekMeals.length > 0
    ? calculateNutrientTotals(weekMeals.map(m => ({ calories: m.calories / 7, protein: m.protein / 7, carbs: m.carbs / 7, fats: m.fats / 7, fiber: m.fiber / 7, sugar: m.sugar / 7 })))
    : todayTotals;
  const risks = predictHealthRisks(profile, avgTotals.calories > 0 ? avgTotals : { calories: targets.calories * 0.9, protein: targets.protein * 0.7, carbs: targets.carbs * 0.8, fats: targets.fats * 0.8, fiber: 18, sugar: 25 }, targets);
  const healthScore = calculateOverallHealthScore(risks);

  // Habit score
  const weekDates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    weekDates.push(d.toISOString().split('T')[0]);
  }
  const weekData: DayData[] = weekDates.map(date => {
    const dayMeals = app.getMealsByDate(date);
    return {
      date,
      meals: dayMeals.map(m => ({ category: m.category, timestamp: m.timestamp, calories: m.calories, tags: m.tags })),
      hydration: date === new Date().toISOString().split('T')[0] ? app.hydration : 6,
      calorieTarget: targets.calories,
      calorieActual: dayMeals.reduce((s, m) => s + m.calories, 0),
    };
  });
  const habits = analyzeWeeklyHabits(weekData);

  const calPct = getPercentage(todayTotals.calories, targets.calories);
  const proteinPct = getPercentage(todayTotals.protein, targets.protein);
  const carbsPct = getPercentage(todayTotals.carbs, targets.carbs);
  const fatsPct = getPercentage(todayTotals.fats, targets.fats);
  const waterPct = getPercentage(app.hydration, app.hydrationGoal);

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border-color)',
    borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-md)',
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--foreground)' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {app.user.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
            Here&apos;s your health snapshot for today
          </p>
        </div>

        {/* Top Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }} className="stagger-children">
          {/* Streak */}
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))' }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🔥</div>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#d97706' }}>{app.streak}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Day Streak</div>
          </div>

          {/* Health Score */}
          <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${healthScore > 60 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'}, transparent)` }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>💚</div>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-heading)', fontWeight: 800, color: healthScore > 60 ? '#10b981' : '#ef4444' }}>{healthScore}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Health Score</div>
          </div>

          {/* Habit Score */}
          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>📊</div>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--foreground)' }}>{habits.overall}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Habit Score</div>
          </div>

          {/* BMI */}
          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>⚖️</div>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--foreground)' }}>{app.user.bmi}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>BMI</div>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Calorie Ring */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              Today&apos;s Calories
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 160, height: 160 }}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="var(--border-color)" strokeWidth="12" />
                  <circle cx="80" cy="80" r="68" fill="none" stroke={calStatus.color} strokeWidth="12"
                    strokeDasharray={`${(calPct / 100) * 427} 427`}
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 28, fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--foreground)' }} className="tabular-nums">
                    {todayTotals.calories}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>/ {targets.calories} kcal</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 16px', borderRadius: 8, background: `${calStatus.color}15`, fontSize: 13, fontWeight: 600, color: calStatus.color }}>
              {calStatus.status}
            </div>
          </div>

          {/* Macros */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              Macronutrients
            </h3>
            {[
              { label: 'Protein', value: todayTotals.protein, target: targets.protein, pct: proteinPct, color: '#6366f1', unit: 'g' },
              { label: 'Carbs', value: todayTotals.carbs, target: targets.carbs, pct: carbsPct, color: '#f59e0b', unit: 'g' },
              { label: 'Fats', value: todayTotals.fats, target: targets.fats, pct: fatsPct, color: '#ef4444', unit: 'g' },
            ].map(m => (
              <div key={m.label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{m.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }} className="tabular-nums">{m.value}{m.unit} / {m.target}{m.unit}</span>
                </div>
                <div style={{ height: 8, borderRadius: 100, background: 'var(--border-color)', overflow: 'hidden' }}>
                  <div className="progress-bar-fill" style={{
                    height: '100%', borderRadius: 100,
                    background: m.color, width: `${m.pct}%`,
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}

            {/* Meals logged */}
            <div style={{
              marginTop: 20, padding: '12px 16px', borderRadius: 10,
              background: 'var(--surface-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Meals logged today</span>
              <span style={{ fontWeight: 700, fontSize: 18, fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>{app.todayMeals.length}</span>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Hydration Tracker */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              💧 Hydration
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 32, fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#3b82f6' }} className="tabular-nums">
                  {app.hydration}
                  <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500 }}> / {app.hydrationGoal}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>glasses today</div>
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: waterPct >= 100 ? '#10b981' : '#3b82f6',
              }}>
                {waterPct}%
              </div>
            </div>

            {/* Water glasses visual */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {Array.from({ length: app.hydrationGoal }, (_, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: i < app.hydration ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, transition: 'all 0.3s',
                  cursor: 'pointer',
                }}>
                  {i < app.hydration ? '💧' : ''}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={app.addWater} style={{
                flex: 1, padding: '10px', borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff', border: 'none', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'opacity 0.2s',
              }}>
                + Add Glass
              </button>
              <button onClick={app.removeWater} style={{
                padding: '10px 16px', borderRadius: 10,
                border: '1px solid var(--border-color)', background: 'var(--surface)',
                color: 'var(--foreground)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}>
                −
              </button>
            </div>
          </div>

          {/* Health Risks Preview */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
                🩺 Health Risks
              </h3>
              <Link href="/insights" style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {risks.slice(0, 3).map(risk => (
                <div key={risk.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--surface-alt)',
                }}>
                  <span style={{ fontSize: 22 }}>{risk.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{risk.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 100, background: 'var(--border-color)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 100, background: risk.color, width: `${risk.score}%` }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: risk.color, textTransform: 'uppercase' }}>{risk.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Quick Log */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <Link href="/meals" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 16px', borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
                border: '1px solid rgba(245,158,11,0.15)',
                textDecoration: 'none', color: 'var(--foreground)',
                transition: 'transform 0.2s',
              }}>
                <span style={{ fontSize: 22 }}>🍽️</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Log a Meal</span>
              </Link>
              <Link href="/recommendations" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 16px', borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.02))',
                border: '1px solid rgba(99,102,241,0.15)',
                textDecoration: 'none', color: 'var(--foreground)',
                transition: 'transform 0.2s',
              }}>
                <span style={{ fontSize: 22 }}>🤖</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Get AI Suggestions</span>
              </Link>
              <Link href="/insights" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 16px', borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))',
                border: '1px solid rgba(16,185,129,0.15)',
                textDecoration: 'none', color: 'var(--foreground)',
                transition: 'transform 0.2s',
              }}>
                <span style={{ fontSize: 22 }}>📈</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>View Health Insights</span>
              </Link>
            </div>
          </div>

          {/* Recent Insights */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              💡 Weekly Insights
            </h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {habits.insights.slice(0, 4).map((insight, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8,
                  background: insight.type === 'positive' ? 'rgba(16,185,129,0.06)' : insight.type === 'warning' ? 'rgba(245,158,11,0.06)' : 'var(--surface-alt)',
                  border: `1px solid ${insight.type === 'positive' ? 'rgba(16,185,129,0.15)' : insight.type === 'warning' ? 'rgba(245,158,11,0.15)' : 'var(--border-color)'}`,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{insight.icon}</span>
                  <span style={{ fontSize: 12, color: 'var(--foreground)', lineHeight: 1.5 }}>{insight.message}</span>
                </div>
              ))}
            </div>
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
