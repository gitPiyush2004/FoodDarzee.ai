'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { foodDatabase, searchFoods, FoodItem } from '@/data/foods';
import { calculateNutrientTotals } from '@/lib/calculations';

export default function MealsPage() {
  const app = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Manual meal form
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage'>('lunch');
  const [manualCalories, setManualCalories] = useState(300);
  const [manualProtein, setManualProtein] = useState(15);
  const [manualCarbs, setManualCarbs] = useState(40);
  const [manualFats, setManualFats] = useState(10);
  const [manualFiber, setManualFiber] = useState(5);
  const [manualSugar, setManualSugar] = useState(5);

  useEffect(() => {
    setMounted(true);
    if (!app.isAuthenticated) router.push('/auth');
    else if (!app.user?.onboardingComplete) router.push('/onboarding');
  }, [app.isAuthenticated, app.user, router]);

  const filteredFoods = useMemo(() => {
    return searchFoods(searchQuery, {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      dietType: app.user?.profile?.dietaryPref,
    });
  }, [searchQuery, selectedCategory, app.user?.profile?.dietaryPref]);

  const dateMeals = app.getMealsByDate(selectedDate);
  const dayTotals = calculateNutrientTotals(dateMeals);
  const targets = app.user?.targets;

  if (!mounted || !app.isAuthenticated || !app.user?.onboardingComplete) return null;

  const handleAddFromDB = (food: FoodItem) => {
    app.addMeal({
      name: food.name,
      category: food.category,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      fiber: food.fiber,
      sugar: food.sugar,
      tags: food.tags,
    });
    setShowAddModal(false);
    setSearchQuery('');
  };

  const handleAddManual = () => {
    if (!manualName.trim()) return;
    app.addMeal({
      name: manualName,
      category: manualCategory,
      calories: manualCalories,
      protein: manualProtein,
      carbs: manualCarbs,
      fats: manualFats,
      fiber: manualFiber,
      sugar: manualSugar,
      tags: [],
    });
    setShowManualForm(false);
    setManualName('');
    setShowAddModal(false);
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

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage'];
  const categoryEmojis: Record<string, string> = { all: '📋', breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪', beverage: '🥤' };

  const getMealTimeIcon = (category: string) => {
    const icons: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪', beverage: '🥤' };
    return icons[category] || '🍽️';
  };

  // Generate week dates for the date picker
  const weekDates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--foreground)' }}>
              🍽️ Meal Tracker
            </h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>Log and track your daily meals</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={{
            padding: '12px 24px', borderRadius: 12,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
            transition: 'all 0.2s',
          }}>
            + Add Meal
          </button>
        </div>

        {/* Date Picker */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {weekDates.map(date => {
            const isToday = date === new Date().toISOString().split('T')[0];
            const isSelected = date === selectedDate;
            const d = new Date(date);
            return (
              <button key={date} onClick={() => setSelectedDate(date)} style={{
                padding: '10px 16px', borderRadius: 12, border: '2px solid',
                borderColor: isSelected ? '#f59e0b' : 'var(--border-color)',
                background: isSelected ? 'rgba(245,158,11,0.08)' : 'var(--surface)',
                cursor: 'pointer', textAlign: 'center', minWidth: 60, flexShrink: 0,
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 11, color: isSelected ? '#d97706' : 'var(--muted)', fontWeight: 600 }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-heading)', color: isSelected ? '#d97706' : 'var(--foreground)' }}>
                  {d.getDate()}
                </div>
                {isToday && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', margin: '4px auto 0' }} />}
              </button>
            );
          })}
        </div>

        {/* Day Summary */}
        {targets && (
          <div style={{ ...cardStyle, marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              Daily Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
              {[
                { label: 'Calories', val: dayTotals.calories, target: targets.calories, color: '#f59e0b', unit: '' },
                { label: 'Protein', val: dayTotals.protein, target: targets.protein, color: '#6366f1', unit: 'g' },
                { label: 'Carbs', val: dayTotals.carbs, target: targets.carbs, color: '#10b981', unit: 'g' },
                { label: 'Fats', val: dayTotals.fats, target: targets.fats, color: '#ef4444', unit: 'g' },
                { label: 'Fiber', val: dayTotals.fiber, target: targets.fiber, color: '#8b5cf6', unit: 'g' },
              ].map(n => (
                <div key={n.label} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 10, background: 'var(--surface-alt)' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{n.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-heading)', color: n.color }} className="tabular-nums">
                    {n.val}<span style={{ fontSize: 11, fontWeight: 500 }}>{n.unit}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>/ {n.target}{n.unit}</div>
                  <div style={{ height: 3, borderRadius: 100, background: 'var(--border-color)', marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 100, background: n.color, width: `${Math.min(100, (n.val / n.target) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meals List */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
            Meals — {selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </h3>

          {dateMeals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>No meals logged for this day</p>
              {selectedDate === new Date().toISOString().split('T')[0] && (
                <button onClick={() => setShowAddModal(true)} style={{
                  padding: '10px 24px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}>
                  Log Your First Meal
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {['breakfast', 'lunch', 'dinner', 'snack', 'beverage'].map(category => {
                const categoryMeals = dateMeals.filter(m => m.category === category);
                if (categoryMeals.length === 0) return null;
                return (
                  <div key={category}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, marginTop: 8 }}>
                      {getMealTimeIcon(category)} {category}
                    </div>
                    {categoryMeals.map(meal => (
                      <div key={meal.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', borderRadius: 10,
                        background: 'var(--surface-alt)', marginBottom: 6,
                        transition: 'all 0.2s',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{meal.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                            {meal.calories} cal · P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fats}g
                          </div>
                        </div>
                        <button onClick={() => app.removeMeal(meal.id)} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 16, color: 'var(--muted)', padding: 4,
                        }} aria-label="Remove meal">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 24,
        }} onClick={e => { if (e.target === e.currentTarget) { setShowAddModal(false); setShowManualForm(false); } }}>
          <div className="animate-slide-up" style={{
            width: '100%', maxWidth: 560, maxHeight: '80vh', overflow: 'auto',
            background: 'var(--surface)', borderRadius: 20, padding: 28,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--foreground)' }}>
                {showManualForm ? '✏️ Manual Entry' : '🍽️ Add Meal'}
              </h2>
              <button onClick={() => { setShowAddModal(false); setShowManualForm(false); }} style={{
                background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)',
              }}>✕</button>
            </div>

            {!showManualForm ? (
              <>
                {/* Search */}
                <input
                  type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search foods..." aria-label="Search foods"
                  style={{ ...inputStyle, marginBottom: 14, padding: '12px 16px' }}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />

                {/* Category filters */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                  {categories.map(c => (
                    <button key={c} onClick={() => setSelectedCategory(c)} style={{
                      padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                      border: '1px solid', cursor: 'pointer',
                      borderColor: selectedCategory === c ? '#f59e0b' : 'var(--border-color)',
                      background: selectedCategory === c ? 'rgba(245,158,11,0.08)' : 'var(--surface)',
                      color: selectedCategory === c ? '#d97706' : 'var(--muted)',
                    }}>
                      {categoryEmojis[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Manual entry button */}
                <button onClick={() => setShowManualForm(true)} style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  border: '2px dashed var(--border-color)', background: 'transparent',
                  color: 'var(--muted)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  marginBottom: 16, transition: 'all 0.2s',
                }}>
                  ✏️ Add Meal Manually
                </button>

                {/* Food list */}
                <div style={{ maxHeight: 400, overflow: 'auto', display: 'grid', gap: 6 }}>
                  {filteredFoods.slice(0, 30).map(food => (
                    <button key={food.id} onClick={() => handleAddFromDB(food)} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 14px', borderRadius: 10, width: '100%',
                      border: '1px solid var(--border-color)', background: 'var(--surface)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{food.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                          {food.calories} cal · P:{food.protein}g · C:{food.carbs}g · F:{food.fats}g
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{food.servingSize}</div>
                      </div>
                      <div style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: 'rgba(245,158,11,0.1)', color: '#d97706',
                      }}>
                        + Add
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* Manual Form */
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: 'var(--foreground)' }}>Meal Name</label>
                  <input type="text" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="e.g. Homemade Pasta" style={inputStyle} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: 'var(--foreground)' }}>Category</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['breakfast', 'lunch', 'dinner', 'snack', 'beverage'].map(c => (
                      <button key={c} onClick={() => setManualCategory(c as typeof manualCategory)} style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        border: '1px solid', cursor: 'pointer',
                        borderColor: manualCategory === c ? '#f59e0b' : 'var(--border-color)',
                        background: manualCategory === c ? 'rgba(245,158,11,0.08)' : 'var(--surface)',
                        color: manualCategory === c ? '#d97706' : 'var(--muted)',
                      }}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                  {[
                    { label: 'Calories', val: manualCalories, set: setManualCalories },
                    { label: 'Protein (g)', val: manualProtein, set: setManualProtein },
                    { label: 'Carbs (g)', val: manualCarbs, set: setManualCarbs },
                    { label: 'Fats (g)', val: manualFats, set: setManualFats },
                    { label: 'Fiber (g)', val: manualFiber, set: setManualFiber },
                    { label: 'Sugar (g)', val: manualSugar, set: setManualSugar },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                      <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} min={0} style={{ ...inputStyle, padding: '8px 10px', fontSize: 13 }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowManualForm(false)} style={{
                    flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--border-color)',
                    background: 'var(--surface)', color: 'var(--foreground)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}>
                    ← Back
                  </button>
                  <button onClick={handleAddManual} disabled={!manualName.trim()} style={{
                    flex: 2, padding: '12px', borderRadius: 10, border: 'none',
                    background: manualName.trim() ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--border-color)',
                    color: '#fff', fontWeight: 700, fontSize: 14, cursor: manualName.trim() ? 'pointer' : 'not-allowed',
                  }}>
                    Add Meal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
