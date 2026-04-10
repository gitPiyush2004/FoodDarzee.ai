'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, MacroTargets, calculateMacroTargets, calculateBMI } from '@/lib/calculations';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  profile: UserProfile | null;
  bmi: number | null;
  targets: MacroTargets | null;
  onboardingComplete: boolean;
  createdAt: number;
}

interface AppState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  darkMode: boolean;
  // Meals
  meals: MealEntry[];
  todayMeals: MealEntry[];
  // Hydration
  hydration: number; // glasses today
  hydrationGoal: number;
  // Streaks
  streak: number;
  longestStreak: number;
  // Achievements
  unlockedAchievements: string[];
  // Points
  totalPoints: number;
}

export interface MealEntry {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  tags: string[];
  timestamp: number;
  date: string; // YYYY-MM-DD
}

interface AppContextType extends AppState {
  // Auth actions
  login: (email: string, name: string) => void;
  logout: () => void;
  // Profile actions
  saveProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  // Meal actions
  addMeal: (meal: Omit<MealEntry, 'id' | 'timestamp' | 'date'>) => void;
  removeMeal: (id: string) => void;
  getMealsByDate: (date: string) => MealEntry[];
  getWeekMeals: () => MealEntry[];
  // Hydration
  addWater: () => void;
  removeWater: () => void;
  // Theme
  toggleDarkMode: () => void;
  // Achievement
  unlockAchievement: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(`fooddarzee_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`fooddarzee_${key}`, JSON.stringify(value));
  } catch {
    // Storage full or disabled
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [hydration, setHydration] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedUser = loadState<UserData | null>('user', null);
    const savedMeals = loadState<MealEntry[]>('meals', []);
    const savedDarkMode = loadState<boolean>('darkMode', false);
    const savedHydration = loadState<{ date: string; glasses: number }>('hydration', { date: getToday(), glasses: 0 });
    const savedStreak = loadState<{ current: number; longest: number; lastDate: string }>('streak', { current: 0, longest: 0, lastDate: '' });
    const savedAchievements = loadState<string[]>('achievements', []);
    const savedPoints = loadState<number>('points', 0);

    setUser(savedUser);
    setMeals(savedMeals);
    setDarkMode(savedDarkMode);
    setUnlockedAchievements(savedAchievements);
    setTotalPoints(savedPoints);

    // Reset hydration if different day
    if (savedHydration.date === getToday()) {
      setHydration(savedHydration.glasses);
    } else {
      setHydration(0);
    }

    // Update streak
    if (savedStreak.lastDate) {
      const lastDate = new Date(savedStreak.lastDate);
      const today = new Date(getToday());
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        setStreak(savedStreak.current);
        setLongestStreak(savedStreak.longest);
      } else {
        // Streak broken
        setStreak(0);
        setLongestStreak(savedStreak.longest);
      }
    }

    setIsLoading(false);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    saveState('darkMode', darkMode);
  }, [darkMode]);

  // Save meals when they change
  useEffect(() => {
    if (!isLoading) saveState('meals', meals);
  }, [meals, isLoading]);

  // Save hydration
  useEffect(() => {
    if (!isLoading) saveState('hydration', { date: getToday(), glasses: hydration });
  }, [hydration, isLoading]);

  // Save streak
  useEffect(() => {
    if (!isLoading) {
      saveState('streak', { current: streak, longest: longestStreak, lastDate: getToday() });
    }
  }, [streak, longestStreak, isLoading]);

  // Save achievements
  useEffect(() => {
    if (!isLoading) {
      saveState('achievements', unlockedAchievements);
      saveState('points', totalPoints);
    }
  }, [unlockedAchievements, totalPoints, isLoading]);

  const todayMeals = meals.filter(m => m.date === getToday());
  const hydrationGoal = user?.targets?.water || 8;

  const login = useCallback((email: string, name: string) => {
    const newUser: UserData = {
      uid: 'local_' + Date.now(),
      email,
      name,
      profile: null,
      bmi: null,
      targets: null,
      onboardingComplete: false,
      createdAt: Date.now(),
    };
    setUser(newUser);
    saveState('user', newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveState('user', null);
  }, []);

  const saveProfile = useCallback((profile: UserProfile) => {
    if (!user) return;
    const bmi = calculateBMI(profile.weight, profile.height);
    const targets = calculateMacroTargets(profile);
    const updated: UserData = {
      ...user,
      profile,
      bmi,
      targets,
      onboardingComplete: true,
    };
    setUser(updated);
    saveState('user', updated);
  }, [user]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!user?.profile) return;
    const newProfile = { ...user.profile, ...updates };
    saveProfile(newProfile);
  }, [user, saveProfile]);

  const addMeal = useCallback((meal: Omit<MealEntry, 'id' | 'timestamp' | 'date'>) => {
    const newMeal: MealEntry = {
      ...meal,
      id: 'meal_' + Date.now() + '_' + Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      date: getToday(),
    };
    setMeals(prev => [...prev, newMeal]);

    // Update streak
    const todayHasMeals = meals.some(m => m.date === getToday());
    if (!todayHasMeals) {
      setStreak(prev => {
        const newStreak = prev + 1;
        setLongestStreak(longest => Math.max(longest, newStreak));
        return newStreak;
      });
    }

    // Check for first meal achievement
    if (meals.length === 0 && !unlockedAchievements.includes('first_meal')) {
      unlockAchievement('first_meal');
    }
  }, [meals, unlockedAchievements]);

  const removeMeal = useCallback((id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  }, []);

  const getMealsByDate = useCallback((date: string) => {
    return meals.filter(m => m.date === date);
  }, [meals]);

  const getWeekMeals = useCallback(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    return meals.filter(m => m.date >= weekAgoStr);
  }, [meals]);

  const addWater = useCallback(() => {
    setHydration(prev => prev + 1);
  }, []);

  const removeWater = useCallback(() => {
    setHydration(prev => Math.max(0, prev - 1));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    // Add points from achievements data
    const { achievements: achievementData } = require('@/data/achievements');
    const achievement = achievementData.find((a: { id: string }) => a.id === id);
    if (achievement) {
      setTotalPoints(prev => prev + achievement.points);
    }
  }, []);

  const value: AppContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    darkMode,
    meals,
    todayMeals,
    hydration,
    hydrationGoal,
    streak,
    longestStreak,
    unlockedAchievements,
    totalPoints,
    login,
    logout,
    saveProfile,
    updateProfile,
    addMeal,
    removeMeal,
    getMealsByDate,
    getWeekMeals,
    addWater,
    removeWater,
    toggleDarkMode,
    unlockAchievement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
