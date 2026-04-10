# FoodDarzee AI — "Eat Smart Today, Avoid Disease Tomorrow"

An AI-powered preventive healthcare assistant that tracks food habits, recommends personalized meals based on health goals, predicts future health risks, and suggests improvements via behavioral tracking.

## Overview

Unlike standard food delivery or simple calorie-counting apps, FoodDarzee AI operates on the concept of **"Food as Preventive Medicine."** 

It acts as a proactive health companion:
- **Analyzes** your daily eating habits and nutritional intake.
- **Predicts** hidden health risks (obesity, diabetes, heart disease, muscle loss, fatigue).
- **Recommends** corrective food habits via an AI rules engine *before* disease occurs.
- **Gamifies** your journey with a daily streak system, health score, and achievements.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS v4, Framer Motion
- **Architecture**: State-managed context (Meals, User, Settings) + Browser LocalStorage for persistence.
- **Backend/Deployment**: Designed to be integrated seamlessly with Firebase (Auth, Firestore, Hosting).
- **UI/UX**: Custom Glassmorphism, Micro-animations, Golden/Amber Health color palette, Dark/Light mode support.

## Key Features
1. **Multi-Step Onboarding**: Collects age, metrics, dietary preferences, sleep hours, activity level, and existing conditions to calculate BMI, BMR, TDEE, and precise macro targets.
2. **Smart Dashboard**: Visual representation of daily calorie budget, macronutrient splits, hydration, active streak, and overall health score.
3. **AI Recommendation Engine**: Rule-based intelligence proposing personalized meals contextually (e.g., handles skipped breakfast, protein deficiency, sugar spikes, or fitness goals conditionally).
4. **Health Risk Prediction Engine**: Scores the user's risks out of 100 on Obesity, Diabetes, Heart Disease, Muscle Loss, and Fatigue. Provides actionable insights based on these markers.
5. **Habit Intelligence**: "Week In Review" showing consistency in tracking, junk food control, late-night eating, hydration, and more.
6. **AI Chat Assistant**: A context-aware chatbot helping users with goals, meal ideas, sleep habits, and streak encouragement.
7. **Gamification Engine**: Progress levels, 20+ unlockable achievement badges (e.g., "Night Owl Reformed", "Protein Champion"), and total pointing system.

## Setup Instructions

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Design Aesthetics
The platform is designed to invoke the warmth and energy of health (yellow/amber + green), creating a dynamic and visually premium interface. Interactions incorporate smooth hover-states, Framer Motion page transitions, responsive modals, tabular numeric font-displays, and detailed progress charts.

---
*Built for the Advanced Agentic Coding Hackathon / Showcase.*
