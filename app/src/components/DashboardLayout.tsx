'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/meals', label: 'Meals', icon: '🍽️' },
  { href: '/recommendations', label: 'AI Recs', icon: '🤖' },
  { href: '/insights', label: 'Insights', icon: '🩺' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, darkMode, toggleDarkMode, logout, streak } = useApp();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Desktop Sidebar */}
      <aside aria-label="Main Sidebar" style={{
        width: 240, flexShrink: 0, background: 'var(--surface)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 40,
        transition: 'transform 0.3s ease',
        transform: typeof window !== 'undefined' && window.innerWidth < 768 && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 24 }}>🥗</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17, color: 'var(--foreground)' }}>
            Food<span style={{ color: '#f59e0b' }}>Darzee</span>
          </span>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 10,
                textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#d97706' : 'var(--foreground)',
                background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom area */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border-color)' }}>
          {/* Streak */}
          {streak > 0 && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(245, 158, 11, 0.08)',
              marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#d97706' }}>{streak} Day Streak</span>
            </div>
          )}

          {/* Dark mode toggle */}
          <button onClick={toggleDarkMode} aria-pressed={darkMode} aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 10, border: 'none',
            background: 'transparent', color: 'var(--foreground)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 16 }}>{darkMode ? '☀️' : '🌙'}</span>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* User info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', marginTop: 4,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 14, fontWeight: 700,
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{user?.email}</div>
            </div>
          </div>

          <button onClick={logout} style={{
            width: '100%', padding: '8px 14px', borderRadius: 10, border: 'none',
            background: 'transparent', color: 'var(--danger)',
            cursor: 'pointer', fontSize: 12, fontWeight: 500, textAlign: 'left',
            marginTop: 4,
          }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} role="button" aria-label="Close Sidebar" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 35,
        }} />
      )}

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh' }}>
        {/* Mobile header */}
        <div style={{
          display: 'none', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', borderBottom: '1px solid var(--border-color)',
          background: 'var(--surface)',
        }}>
          <button onClick={() => setSidebarOpen(true)} aria-label="Open Menu" aria-expanded={sidebarOpen} style={{
            border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--foreground)',
          }}>
            ☰
          </button>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: 'var(--foreground)' }}>
            Food<span style={{ color: '#f59e0b' }}>Darzee</span>
          </span>
          <div style={{ width: 22 }} />
        </div>

        {/* Page content */}
        <div style={{ padding: '28px 28px 40px' }}>
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)', borderTop: '1px solid var(--border-color)',
        display: 'none', zIndex: 30,
        padding: '6px 8px 10px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} aria-label={`Go to ${item.label}`} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                textDecoration: 'none', fontSize: 10, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#d97706' : 'var(--muted)',
                padding: '4px 12px',
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <style jsx global>{`
        @media (max-width: 768px) {
          aside { transform: translateX(-100%) !important; }
          aside[style*="translateX(0)"] { transform: translateX(0) !important; }
          main { margin-left: 0 !important; padding-bottom: 80px !important; }
          main > div:first-child { display: flex !important; }
          nav[style*="display: none"] { display: block !important; }
        }
      `}</style>
    </div>
  );
}
