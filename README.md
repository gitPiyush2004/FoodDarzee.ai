# 🥗 FoodDarzee AI 
*Eat Smart Today, Avoid Disease Tomorrow*

### 🏆 Hack2Skill Hackathon Submission
FoodDarzee AI is a full-stack, AI-powered preventive healthcare web application. Instead of being a standard food delivery platform, FoodDarzee AI acts as a **smart health assistant**. It tracks dietary habits, provides personalized contextual meal recommendations, predicts future health risks (like obesity, diabetes, and fatigue) using a multi-factor logic engine, and incorporates gamification to encourage long-term healthy habits.

The core philosophy of this project is **"Food as Preventive Medicine"**.

---

## 🌟 Key Features

*   **Intelligent Onboarding**: Collects biometrics (automatically calculating BMI & TDEE), goals, and underlying health conditions to tailor the entire experience.
*   **Comprehensive Health Dashboard**: A centralized hub featuring calorie ring charts, macro progress bars, hydration tracking, and a dynamic health risk preview.
*   **AI Recommendations Engine**: Analyzes your tracked foods and identifies nutritional gaps. If you're missing protein or fiber for the day, the AI contextually suggests meals to fix it.
*   **Health Risk Prediction Prediction**: Real-time evaluation engines calculate risk scores (0-100) for Diabetes, Heart Disease, Muscle Loss, and Fatigue based on user metrics and daily inputs.
*   **Habit Radar & Insights**: Weekly reports analyzing eating timestamps (detecting late-night snacking), sugar loads, consistency, and hydration.
*   **Gamification**: Long-term adherence is maintained via daily streak logic, points systems, and 20+ unlockable achievement badges.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend**: Next.js 14/15 (App Router), React 19
*   **Styling**: Tailwind CSS v4, custom glassmorphism components
*   **Backend & DB**: Firebase Authentication & Google Cloud Firestore (GCP)
*   **Deployment**: Dockerized and hosted continuously via Google Cloud Run
*   **Logic & Computation**: TypeScript

### Engines Built from Scratch:
1.  **Calculations Library**: BMI, BMR, TDEE, macro bounds.
2.  **AI Engine**: Nutriton gap analysis rule sets.
3.  **Risk Engine**: 5-category health risk calculations.
4.  **Habit Engine**: Time-series analysis of meal log arrays.

---

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/gitPiyush2004/FoodDarzee.ai.git
   cd FoodDarzee.ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Ensure you have a `.env.local` file with your specific Google Firebase keys to connect to the database.

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

*Designed and engineered with ❤️ for the Hack2Skill Hackathon.*
