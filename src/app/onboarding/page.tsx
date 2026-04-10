'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { calculateBMI, getBMICategory, UserProfile } from '@/lib/calculations';

const totalSteps = 6;

export default function OnboardingPage() {
  const { user, isAuthenticated, saveProfile } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [dietaryPref, setDietaryPref] = useState<'veg' | 'non-veg' | 'vegan'>('veg');
  const [goal, setGoal] = useState<'weight_loss' | 'weight_gain' | 'maintain' | 'fitness' | 'medical'>('maintain');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate');
  const [sleepHours, setSleepHours] = useState(7);
  const [conditions, setConditions] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) router.push('/auth');
    if (user?.onboardingComplete) router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated) return null;

  const bmi = calculateBMI(weight, height);
  const bmiInfo = getBMICategory(bmi);
  const progress = (step / totalSteps) * 100;

  const handleComplete = () => {
    const profile: UserProfile = {
      age, gender, height, weight,
      dietaryPref, goal, activityLevel,
      sleepHours, conditions,
    };
    saveProfile(profile);
    router.push('/dashboard');
  };

  const toggleCondition = (c: string) => {
    setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const canProceed = () => {
    if (step === 1) return age > 0 && gender;
    return true;
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1px solid var(--border-color)', background: 'var(--background)',
    fontSize: 15, color: 'var(--foreground)', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  const optionBtnStyle = (selected: boolean): React.CSSProperties => ({
    padding: '12px 20px', borderRadius: 12, border: '2px solid',
    borderColor: selected ? '#f59e0b' : 'var(--border-color)',
    background: selected ? 'rgba(245, 158, 11, 0.08)' : 'var(--surface)',
    color: selected ? '#d97706' : 'var(--foreground)',
    fontWeight: selected ? 700 : 500, fontSize: 14,
    cursor: 'pointer', transition: 'all 0.2s',
    textAlign: 'center' as const,
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      background: 'linear-gradient(180deg, var(--background), var(--surface-alt))',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32, width: '100%', maxWidth: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>🥗</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, color: 'var(--foreground)' }}>
            Food<span style={{ color: '#f59e0b' }}>Darzee</span> AI
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'var(--border-color)', borderRadius: 100, height: 6, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{
            height: '100%', borderRadius: 100,
            background: 'linear-gradient(90deg, #f59e0b, #d97706)',
            width: `${progress}%`, transition: 'width 0.5s ease',
          }} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          Step {step} of {totalSteps}
        </span>
      </div>

      {/* Card */}
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 500, padding: '36px 32px' }} key={step}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
                Personal Information
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
                Help us personalize your experience
              </p>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--foreground)' }}>
                Age
              </label>
              <input type="number" value={age} onChange={e => setAge(+e.target.value)} min={10} max={100}
                style={inputStyle} aria-label="Age"
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
                Gender
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {(['male', 'female', 'other'] as const).map(g => (
                  <button key={g} onClick={() => setGender(g)} style={optionBtnStyle(gender === g)}>
                    {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '🧑 Other'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Body Metrics */}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📏</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
                Body Metrics
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
                We&apos;ll calculate your BMI and calorie needs
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--foreground)' }}>
                  Height (cm)
                </label>
                <input type="number" value={height} onChange={e => setHeight(+e.target.value)} min={100} max={250}
                  style={inputStyle} aria-label="Height in centimeters"
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--foreground)' }}>
                  Weight (kg)
                </label>
                <input type="number" value={weight} onChange={e => setWeight(+e.target.value)} min={20} max={300}
                  style={inputStyle} aria-label="Weight in kilograms"
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </div>

            {/* BMI Display */}
            <div style={{
              padding: '20px', borderRadius: 14,
              background: 'var(--surface-alt)', textAlign: 'center',
              border: `2px solid ${bmiInfo.color}20`,
            }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Your BMI</div>
              <div style={{ fontSize: 36, fontFamily: 'var(--font-heading)', fontWeight: 800, color: bmiInfo.color }}>
                {bmi}
              </div>
              <div style={{
                display: 'inline-block', padding: '4px 14px', borderRadius: 100,
                background: `${bmiInfo.color}15`, color: bmiInfo.color,
                fontSize: 13, fontWeight: 600, marginTop: 6,
              }}>
                {bmiInfo.category}
              </div>
            </div>
          </>
        )}

        {/* Step 3: Dietary Preferences */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🥗</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
                Dietary Preference
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
                This helps us recommend the right foods
              </p>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { val: 'veg', label: '🥬 Vegetarian', desc: 'No meat or fish' },
                { val: 'non-veg', label: '🍗 Non-Vegetarian', desc: 'Includes all food types' },
                { val: 'vegan', label: '🌱 Vegan', desc: 'No animal products' },
              ].map(o => (
                <button key={o.val} onClick={() => setDietaryPref(o.val as typeof dietaryPref)}
                  style={{
                    ...optionBtnStyle(dietaryPref === o.val),
                    display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                    textAlign: 'left' as const,
                  }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{o.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{o.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 4: Health Goal */}
        {step === 4 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
                Your Health Goal
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
                We&apos;ll tailor recommendations to match
              </p>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { val: 'weight_loss', label: '⬇️ Lose Weight', desc: 'Healthy calorie deficit' },
                { val: 'weight_gain', label: '⬆️ Gain Weight', desc: 'Lean muscle building' },
                { val: 'maintain', label: '⚖️ Maintain Weight', desc: 'Stay at current weight' },
                { val: 'fitness', label: '💪 Fitness', desc: 'Build muscle & performance' },
                { val: 'medical', label: '🩺 Medical', desc: 'Manage health condition' },
              ].map(o => (
                <button key={o.val} onClick={() => setGoal(o.val as typeof goal)}
                  style={{ ...optionBtnStyle(goal === o.val), display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' as const, padding: '14px 20px' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{o.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{o.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 5: Activity & Sleep */}
        {step === 5 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏃</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
                Activity & Lifestyle
              </h2>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
                Activity Level
              </label>
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { val: 'sedentary', label: '🪑 Sedentary', desc: 'Little to no exercise' },
                  { val: 'light', label: '🚶 Light', desc: 'Light exercise 1-3 days/week' },
                  { val: 'moderate', label: '🏋️ Moderate', desc: 'Moderate exercise 3-5 days/week' },
                  { val: 'active', label: '🏃 Active', desc: 'Hard exercise 6-7 days/week' },
                  { val: 'very_active', label: '🔥 Very Active', desc: 'Very hard exercise & physical job' },
                ].map(o => (
                  <button key={o.val} onClick={() => setActivityLevel(o.val as typeof activityLevel)}
                    style={{ ...optionBtnStyle(activityLevel === o.val), textAlign: 'left' as const, padding: '12px 16px', fontSize: 13 }}>
                    <span style={{ fontWeight: 700 }}>{o.label}</span>
                    <span style={{ color: 'var(--muted)', marginLeft: 8 }}>— {o.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
                Average Sleep Hours: <span style={{ color: '#f59e0b', fontSize: 16 }}>{sleepHours}h</span>
              </label>
              <input
                type="range" min={3} max={12} step={0.5} value={sleepHours}
                onChange={e => setSleepHours(+e.target.value)}
                aria-label="Sleep hours"
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
                <span>3h</span><span>12h</span>
              </div>
            </div>
          </>
        )}

        {/* Step 6: Medical Conditions */}
        {step === 6 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>
                Existing Conditions
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
                Select any that apply (optional)
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { val: 'diabetes', label: '🩸 Diabetes' },
                { val: 'pre-diabetes', label: '⚠️ Pre-Diabetes' },
                { val: 'bp', label: '💓 High BP' },
                { val: 'cholesterol', label: '🫀 High Cholesterol' },
                { val: 'thyroid', label: '🦋 Thyroid' },
                { val: 'pcod', label: '🔬 PCOD/PCOS' },
                { val: 'gut-issues', label: '🫃 Gut Issues' },
                { val: 'none', label: '✅ None' },
              ].map(o => (
                <button key={o.val}
                  onClick={() => {
                    if (o.val === 'none') setConditions([]);
                    else toggleCondition(o.val);
                  }}
                  style={optionBtnStyle(o.val === 'none' ? conditions.length === 0 : conditions.includes(o.val))}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, padding: '13px', borderRadius: 12,
              border: '1px solid var(--border-color)', background: 'var(--surface)',
              color: 'var(--foreground)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>
              ← Back
            </button>
          )}
          <button
            onClick={() => step === totalSteps ? handleComplete() : setStep(s => s + 1)}
            disabled={!canProceed()}
            style={{
              flex: 2, padding: '13px', borderRadius: 12,
              background: canProceed() ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--border-color)',
              color: '#fff', border: 'none', fontWeight: 700, fontSize: 15,
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              boxShadow: canProceed() ? '0 4px 12px rgba(245,158,11,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {step === totalSteps ? '🚀 Start My Journey' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
