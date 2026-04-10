'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthPage() {
  const { login, isAuthenticated, user } = useApp();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user?.onboardingComplete) {
      router.push('/dashboard');
    } else if (isAuthenticated && !user?.onboardingComplete) {
      router.push('/onboarding');
    }
  }, [isAuthenticated, user?.onboardingComplete, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Using local auth for now (Firebase can be swapped in)
      login(email, name || email.split('@')[0]);
      setTimeout(() => {
        router.push('/onboarding');
      }, 500);
    } catch {
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    login('user@gmail.com', 'Health Enthusiast');
    setTimeout(() => router.push('/onboarding'), 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--background) 0%, var(--surface-alt) 50%, var(--background) 100%)',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: '5%', right: '10%', fontSize: 100, opacity: 0.05 }}>🥗</div>
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', fontSize: 80, opacity: 0.05 }}>🍎</div>

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Image src="/logo.png" alt="FoodDarzee" width={280} height={70} style={{ objectFit: 'contain' }} priority />
          </Link>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '36px 32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700,
            textAlign: 'center', marginBottom: 8, color: 'var(--foreground)',
          }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', marginBottom: 28 }}>
            {isSignUp ? 'Start your preventive health journey' : 'Continue your health journey'}
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              border: '1px solid var(--border-color)', background: 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--foreground)',
              transition: 'all 0.2s',
              marginBottom: 20,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--foreground)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  aria-label="Full name"
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: '1px solid var(--border-color)', background: 'var(--background)',
                    fontSize: 14, color: 'var(--foreground)', outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--foreground)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: '1px solid var(--border-color)', background: 'var(--background)',
                  fontSize: 14, color: 'var(--foreground)', outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--foreground)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-label="Password"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: '1px solid var(--border-color)', background: 'var(--background)',
                  fontSize: 14, color: 'var(--foreground)', outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 12,
                background: loading ? 'var(--muted)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 15, fontWeight: 700,
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              style={{
                background: 'none', border: 'none', color: '#f59e0b',
                fontWeight: 600, cursor: 'pointer', fontSize: 13,
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
