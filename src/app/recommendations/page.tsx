'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { calculateNutrientTotals } from '@/lib/calculations';
import { getSmartRecommendations, getCurrentMealType, MealRecommendation } from '@/lib/ai-engine';
import { generateChatResponse, ChatMessage } from '@/lib/chat-engine';

export default function RecommendationsPage() {
  const app = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!app.isAuthenticated) router.push('/auth');
    else if (!app.user?.onboardingComplete) router.push('/onboarding');
  }, [app.isAuthenticated, app.user, router]);

  if (!mounted || !app.isAuthenticated || !app.user?.onboardingComplete) return null;

  const profile = app.user.profile!;
  const targets = app.user.targets!;
  const todayTotals = calculateNutrientTotals(app.todayMeals);
  const mealType = getCurrentMealType();

  const todayMealCategories = [...new Set(app.todayMeals.map(m => m.category))];
  const recentFoodIds = app.todayMeals.map(m => m.name).slice(-5);

  const recommendations: MealRecommendation[] = getSmartRecommendations(
    profile, todayTotals, targets, todayMealCategories, recentFoodIds
  );

  // Nutritional gap analysis
  const gaps = {
    calories: Math.max(0, targets.calories - todayTotals.calories),
    protein: Math.max(0, targets.protein - todayTotals.protein),
    carbs: Math.max(0, targets.carbs - todayTotals.carbs),
    fats: Math.max(0, targets.fats - todayTotals.fats),
    fiber: Math.max(0, targets.fiber - todayTotals.fiber),
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);

    const response = generateChatResponse(chatInput, {
      profile, todayTotals, targets,
      todayMealCount: app.todayMeals.length,
      streak: app.streak,
      habitScore: 70,
    });

    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: Date.now() };
    setChatMessages(prev => [...prev, botMsg]);
    setChatInput('');
  };

  const handleQuickAdd = (rec: MealRecommendation) => {
    app.addMeal({
      name: rec.food.name,
      category: rec.food.category,
      calories: rec.food.calories,
      protein: rec.food.protein,
      carbs: rec.food.carbs,
      fats: rec.food.fats,
      fiber: rec.food.fiber,
      sugar: rec.food.sugar,
      tags: rec.food.tags,
    });
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border-color)',
    borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-md)',
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--foreground)' }}>
            🤖 AI Recommendations
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
            Personalized meal suggestions based on your goals and today&apos;s intake
          </p>
        </div>

        {/* Context Banner */}
        <div style={{
          ...cardStyle, marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))',
          border: '1px solid rgba(245,158,11,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{
              padding: '6px 14px', borderRadius: 100,
              background: 'rgba(245,158,11,0.15)', fontSize: 13, fontWeight: 700, color: '#d97706',
            }}>
              {mealType === 'breakfast' ? '🌅 Breakfast Time' : mealType === 'lunch' ? '☀️ Lunch Time' : mealType === 'snack' ? '🍪 Snack Time' : '🌙 Dinner Time'}
            </div>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {todayTotals.calories > 0
                ? `${gaps.calories} cal · ${gaps.protein}g protein remaining today`
                : "No meals logged yet — let's plan your day!"}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Recommendations */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              Suggested for You
            </h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{
                  ...cardStyle,
                  borderLeft: `4px solid ${rec.priority === 'high' ? '#f59e0b' : rec.priority === 'medium' ? '#6366f1' : 'var(--border-color)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>
                        {rec.food.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{rec.reason}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--muted)' }}>
                        <span>🔥 {rec.food.calories} cal</span>
                        <span>💪 P: {rec.food.protein}g</span>
                        <span>🍞 C: {rec.food.carbs}g</span>
                        <span>🧈 F: {rec.food.fats}g</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{rec.food.servingSize}</div>
                    </div>
                    <button onClick={() => handleQuickAdd(rec)} style={{
                      padding: '8px 18px', borderRadius: 10, border: 'none',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      + Add
                    </button>
                  </div>
                </div>
              ))}

              {recommendations.length === 0 && (
                <div style={{ ...cardStyle, textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
                  <p style={{ fontSize: 15, color: 'var(--muted)' }}>You&apos;re all set! Great job hitting your targets today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Nutritional Gaps */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              Nutritional Gaps
            </h2>
            <div style={cardStyle}>
              {Object.entries(gaps).map(([key, value]) => {
                const colors: Record<string, string> = { calories: '#f59e0b', protein: '#6366f1', carbs: '#10b981', fats: '#ef4444', fiber: '#8b5cf6' };
                const units: Record<string, string> = { calories: 'kcal', protein: 'g', carbs: 'g', fats: 'g', fiber: 'g' };
                const pct = Math.max(0, 100 - ((value / (targets[key as keyof typeof targets] || 1)) * 100));
                return (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', textTransform: 'capitalize' }}>{key}</span>
                      <span style={{ fontSize: 12, color: value === 0 ? '#10b981' : 'var(--muted)' }}>
                        {value === 0 ? '✅ Met' : `${value} ${units[key]} left`}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 100, background: 'var(--border-color)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 100,
                        background: value === 0 ? '#10b981' : colors[key],
                        width: `${pct}%`, transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Chat Toggle */}
            <button onClick={() => setShowChat(!showChat)} style={{
              width: '100%', marginTop: 16, padding: '14px 20px', borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff', border: 'none', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              💬 {showChat ? 'Hide' : 'Ask'} AI Assistant
            </button>
          </div>
        </div>

        {/* AI Chat */}
        {showChat && (
          <div style={{ ...cardStyle, marginBottom: 24 }} className="animate-slide-up">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              💬 AI Chat Assistant
            </h2>

            {/* Messages */}
            <div style={{ maxHeight: 400, overflow: 'auto', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>Ask me anything about your nutrition!</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['What should I eat?', 'How am I doing today?', 'Give me a health tip'].map(q => (
                      <button key={q} onClick={() => { setChatInput(q); }} style={{
                        padding: '8px 14px', borderRadius: 100, fontSize: 12,
                        border: '1px solid var(--border-color)', background: 'var(--surface)',
                        color: 'var(--foreground)', cursor: 'pointer', fontWeight: 500,
                      }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.map(msg => (
                <div key={msg.id} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%', padding: '12px 16px', borderRadius: 14,
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--surface-alt)',
                  color: msg.role === 'user' ? '#fff' : 'var(--foreground)',
                  fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text" value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask me anything..."
                aria-label="Chat input"
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 12,
                  border: '1px solid var(--border-color)', background: 'var(--background)',
                  fontSize: 14, color: 'var(--foreground)', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
              <button onClick={handleSendChat} disabled={!chatInput.trim()} style={{
                padding: '12px 20px', borderRadius: 12, border: 'none',
                background: chatInput.trim() ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'var(--border-color)',
                color: '#fff', fontWeight: 700, fontSize: 14, cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
              }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
