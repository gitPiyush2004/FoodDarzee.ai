'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

const features = [
  { icon: '🧠', title: 'AI-Powered Insights', desc: 'Smart recommendations based on your eating patterns, goals, and health data.' },
  { icon: '🩺', title: 'Health Risk Prediction', desc: 'Detect obesity, diabetes, and fatigue risks before they become problems.' },
  { icon: '📊', title: 'Smart Dashboard', desc: 'Track calories, macros, hydration, and habit scores in a beautiful interface.' },
  { icon: '🍽️', title: 'Meal Intelligence', desc: 'Get personalized meal suggestions based on time of day and nutritional gaps.' },
  { icon: '🔥', title: 'Streak & Gamification', desc: 'Daily streaks, achievement badges, and progress tracking to keep you motivated.' },
  { icon: '💬', title: 'AI Chat Assistant', desc: 'Ask "What should I eat?" and get instant, context-aware suggestions.' },
];

const steps = [
  { num: '01', title: 'Create Your Profile', desc: 'Tell us about your body, goals, and dietary preferences.', icon: '👤' },
  { num: '02', title: 'Log Your Meals', desc: 'Track what you eat from our 100+ food database or add custom entries.', icon: '📝' },
  { num: '03', title: 'Get AI Insights', desc: 'Receive personalized recommendations, risk analysis, and habit scoring.', icon: '🤖' },
  { num: '04', title: 'Improve Daily', desc: 'Follow suggestions and watch your health score improve over time.', icon: '📈' },
];

const stats = [
  { value: '100+', label: 'Foods in Database' },
  { value: '5', label: 'Health Risk Metrics' },
  { value: '20+', label: 'Achievement Badges' },
  { value: '6', label: 'Habit Dimensions' },
];

export default function LandingPage() {
  const { isAuthenticated } = useApp();
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrollY > 50 ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid var(--glass-border)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🥗</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 22, color: 'var(--foreground)' }}>
              Food<span style={{ color: '#f59e0b' }}>Darzee</span> AI
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href={isAuthenticated ? '/dashboard' : '/auth'} style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff', padding: '10px 24px', borderRadius: 12,
              fontWeight: 600, textDecoration: 'none', fontSize: 14,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,158,11,0.3)'; }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        background: 'linear-gradient(180deg, var(--background) 0%, var(--surface-alt) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decorative elements */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', fontSize: 120, opacity: 0.08, transform: `translateY(${scrollY * 0.1}px)` }}>🥦</div>
        <div style={{ position: 'absolute', bottom: '15%', left: '8%', fontSize: 100, opacity: 0.08, transform: `translateY(${-scrollY * 0.05}px)` }}>🍎</div>
        <div style={{ position: 'absolute', top: '30%', left: '15%', fontSize: 80, opacity: 0.06, transform: `translateY(${scrollY * 0.08}px)` }}>🧬</div>

        <div style={{ maxWidth: 800, textAlign: 'center', position: 'relative', zIndex: 1 }} className="animate-fade-in">
          <div style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: 100,
            background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
            fontSize: 13, fontWeight: 600, color: '#d97706', marginBottom: 24,
            letterSpacing: '0.5px',
          }}>
            🔬 AI-POWERED PREVENTIVE HEALTHCARE
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
            color: 'var(--foreground)',
          }}>
            Eat Smart Today,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706, #ea580c)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Avoid Disease
            </span>{' '}
            Tomorrow
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'var(--muted)',
            maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            Your AI-powered nutrition companion that analyzes eating patterns, predicts health risks,
            and recommends corrective food habits — before problems arise.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={isAuthenticated ? '/dashboard' : '/auth'} style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff', padding: '16px 36px', borderRadius: 14,
              fontWeight: 700, fontSize: 16, textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(245,158,11,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.35)'; }}
            >
              Start Your Health Journey →
            </Link>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
            marginTop: 64, padding: '24px 0',
            borderTop: '1px solid var(--border-color)',
          }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)' }}>
              Food as <span style={{ color: '#f59e0b' }}>Preventive Medicine</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 600, margin: '0 auto' }}>
              Our AI analyzes your eating patterns and predicts health risks before they become problems.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card card-interactive" style={{
                padding: 28, cursor: 'default',
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(245, 158, 11, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, marginBottom: 18,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--foreground)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 24px', background: 'var(--background)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 700, marginBottom: 16, color: 'var(--foreground)' }}>
              How It <span style={{ color: '#f59e0b' }}>Works</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--muted)' }}>
              Four simple steps to transform your health
            </p>
          </div>

          <div style={{ display: 'grid', gap: 28 }}>
            {steps.map((s, i) => (
              <div key={i} className="card" style={{
                display: 'flex', alignItems: 'center', gap: 28, padding: '28px 32px',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>
                    STEP {s.num}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, marginBottom: 6, color: 'var(--foreground)' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #f59e0b, #d97706, #ea580c)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Ready to Transform Your Health?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of health-conscious individuals using AI to make smarter food choices every day.
          </p>
          <Link href={isAuthenticated ? '/dashboard' : '/auth'} style={{
            background: '#fff', color: '#d97706',
            padding: '16px 40px', borderRadius: 14,
            fontWeight: 700, fontSize: 16, textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px', background: 'var(--surface)',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>🥗</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: 'var(--foreground)' }}>
            Food<span style={{ color: '#f59e0b' }}>Darzee</span> AI
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          © 2024 FoodDarzee AI. Built with ❤️ for preventive healthcare.
        </p>
      </footer>
    </div>
  );
}
