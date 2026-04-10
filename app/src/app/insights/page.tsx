'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { calculateNutrientTotals } from '@/lib/calculations';
import { predictHealthRisks, calculateOverallHealthScore, HealthRisk } from '@/lib/risk-engine';
import { analyzeWeeklyHabits, DayData, HabitScore } from '@/lib/habit-engine';

export default function InsightsPage() {
  const app = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<HealthRisk | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!app.isAuthenticated) router.push('/auth');
    else if (!app.user?.onboardingComplete) router.push('/onboarding');
  }, [app.isAuthenticated, app.user, router]);

  if (!mounted || !app.isAuthenticated || !app.user?.onboardingComplete) return null;

  const profile = app.user.profile!;
  const targets = app.user.targets!;

  // Calculate weekly data
  const weekMeals = app.getWeekMeals();
  const weekTotals = weekMeals.length > 0
    ? calculateNutrientTotals(weekMeals)
    : { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 };
  
  const daysWithMeals = new Set(weekMeals.map(m => m.date)).size || 1;
  const avgTotals = {
    calories: Math.round(weekTotals.calories / daysWithMeals),
    protein: Math.round(weekTotals.protein / daysWithMeals),
    carbs: Math.round(weekTotals.carbs / daysWithMeals),
    fats: Math.round(weekTotals.fats / daysWithMeals),
    fiber: Math.round(weekTotals.fiber / daysWithMeals),
    sugar: Math.round(weekTotals.sugar / daysWithMeals),
  };

  // Use realistic defaults if no data
  const effectiveAvg = avgTotals.calories > 0 ? avgTotals : {
    calories: Math.round(targets.calories * 0.9),
    protein: Math.round(targets.protein * 0.7),
    carbs: Math.round(targets.carbs * 0.85),
    fats: Math.round(targets.fats * 0.8),
    fiber: 18,
    sugar: 28,
  };

  const risks = predictHealthRisks(profile, effectiveAvg, targets);
  const healthScore = calculateOverallHealthScore(risks);

  // Weekly habit analysis
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
  const habits: HabitScore = analyzeWeeklyHabits(weekData);

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border-color)',
    borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-md)',
  };

  const habitLabels: Record<string, string> = {
    mealConsistency: '🍽️ Meal Consistency',
    junkFoodControl: '🍟 Junk Food Control',
    lateNightControl: '🌙 Late Night Control',
    hydration: '💧 Hydration',
    breakfastCompliance: '🌅 Breakfast Habit',
    calorieAdherence: '🎯 Calorie Adherence',
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--foreground)' }}>
            🩺 Health Insights
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
            AI-powered health risk predictions and habit analysis
          </p>
        </div>

        {/* Overall Health Score */}
        <div style={{
          ...cardStyle, marginBottom: 24, textAlign: 'center',
          background: `linear-gradient(135deg, ${healthScore > 70 ? 'rgba(16,185,129,0.06)' : healthScore > 40 ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)'}, var(--surface))`,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--muted)', marginBottom: 12, fontFamily: 'var(--font-heading)' }}>
            OVERALL HEALTH SCORE
          </h2>
          <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 16px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="76" fill="none" stroke="var(--border-color)" strokeWidth="14" />
              <circle cx="90" cy="90" r="76" fill="none"
                stroke={healthScore > 70 ? '#10b981' : healthScore > 40 ? '#f59e0b' : '#ef4444'}
                strokeWidth="14"
                strokeDasharray={`${(healthScore / 100) * 477} 477`}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
                style={{ transition: 'stroke-dasharray 1.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                fontSize: 48, fontFamily: 'var(--font-heading)', fontWeight: 800,
                color: healthScore > 70 ? '#10b981' : healthScore > 40 ? '#f59e0b' : '#ef4444',
              }} className="tabular-nums">
                {healthScore}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>out of 100</div>
            </div>
          </div>
          <div style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: 100,
            background: healthScore > 70 ? 'rgba(16,185,129,0.1)' : healthScore > 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
            color: healthScore > 70 ? '#10b981' : healthScore > 40 ? '#d97706' : '#ef4444',
            fontSize: 13, fontWeight: 700,
          }}>
            {healthScore > 70 ? '✅ Good Health' : healthScore > 40 ? '⚠️ Needs Attention' : '🔴 At Risk'}
          </div>
        </div>

        {/* Health Risks Grid */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
          🔬 Health Risk Predictions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
          {risks.map(risk => (
            <div key={risk.id} style={{
              ...cardStyle, cursor: 'pointer',
              borderLeft: `4px solid ${risk.color}`,
              transition: 'all 0.2s',
            }}
            onClick={() => setSelectedRisk(selectedRisk?.id === risk.id ? null : risk)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{risk.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>{risk.name}</div>
                  <div style={{
                    display: 'inline-block', padding: '2px 10px', borderRadius: 100,
                    background: `${risk.color}15`, color: risk.color,
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginTop: 4,
                  }}>
                    {risk.level} Risk
                  </div>
                </div>
                <div style={{ fontSize: 28, fontFamily: 'var(--font-heading)', fontWeight: 800, color: risk.color }} className="tabular-nums">
                  {risk.score}
                </div>
              </div>

              {/* Risk bar */}
              <div style={{ height: 6, borderRadius: 100, background: 'var(--border-color)', overflow: 'hidden', marginBottom: 10 }}>
                <div style={{
                  height: '100%', borderRadius: 100, background: risk.color,
                  width: `${risk.score}%`, transition: 'width 1s ease',
                }} />
              </div>

              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{risk.description}</p>

              {/* Expanded suggestions */}
              {selectedRisk?.id === risk.id && (
                <div style={{ marginTop: 14, padding: '14px 16px', borderRadius: 10, background: 'var(--surface-alt)' }} className="animate-fade-in">
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 10 }}>
                    💡 Recommendations:
                  </div>
                  {risk.suggestions.map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--foreground)', lineHeight: 1.5,
                    }}>
                      <span style={{ color: '#10b981', flexShrink: 0 }}>•</span>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Weekly Habit Analysis */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
          📊 Weekly Habit Analysis
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Habit Scores */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
                Habit Breakdown
              </h3>
              <div style={{
                padding: '4px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700,
                background: habits.overall >= 70 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                color: habits.overall >= 70 ? '#10b981' : '#d97706',
              }}>
                Score: {habits.overall}
              </div>
            </div>

            {Object.entries(habits.breakdown).map(([key, value]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>
                    {habitLabels[key] || key}
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444',
                  }} className="tabular-nums">
                    {value}%
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 100, background: 'var(--border-color)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 100,
                    background: value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444',
                    width: `${value}%`, transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Insights */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              💡 Your Week in Review
            </h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {habits.insights.map((insight, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 10,
                  background: insight.type === 'positive' ? 'rgba(16,185,129,0.06)' :
                    insight.type === 'warning' ? 'rgba(245,158,11,0.06)' : 'var(--surface-alt)',
                  border: `1px solid ${insight.type === 'positive' ? 'rgba(16,185,129,0.15)' :
                    insight.type === 'warning' ? 'rgba(245,158,11,0.15)' : 'var(--border-color)'}`,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{insight.icon}</span>
                  <div>
                    <span style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.6 }}>{insight.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Calorie Trend */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
            📈 Weekly Calorie Trend
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, padding: '0 8px' }}>
            {weekDates.map(date => {
              const dayMeals = app.getMealsByDate(date);
              const dayCal = dayMeals.reduce((s, m) => s + m.calories, 0);
              const pct = Math.min(100, (dayCal / targets.calories) * 100);
              const d = new Date(date);
              const isToday = date === new Date().toISOString().split('T')[0];

              return (
                <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }} className="tabular-nums">
                    {dayCal > 0 ? dayCal : '—'}
                  </span>
                  <div style={{
                    width: '100%', maxWidth: 36, borderRadius: '8px 8px 4px 4px',
                    background: dayCal === 0 ? 'var(--border-color)' :
                      pct > 110 ? '#ef4444' : pct >= 85 ? '#10b981' : '#f59e0b',
                    height: `${Math.max(dayCal > 0 ? pct : 10, 8)}%`,
                    transition: 'height 0.8s ease',
                    opacity: dayCal === 0 ? 0.3 : 1,
                  }} />
                  <span style={{
                    fontSize: 11, fontWeight: isToday ? 800 : 500,
                    color: isToday ? '#f59e0b' : 'var(--muted)',
                  }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()]}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Target line label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, justifyContent: 'center' }}>
            <div style={{ width: 20, height: 2, background: '#10b981', borderRadius: 1 }} />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Target: {targets.calories} kcal</span>
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
