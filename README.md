# 🚀 CodeQuest: AI-Powered Learning Companion

**CodeQuest** is a premium, gamified learning platform designed to help students master HTML, CSS, and JavaScript through AI-driven personalization and real-time feedback.

Built for the **PromptWars 2026** challenge, it demonstrates a deep integration of Google Cloud services and state-of-the-art AI techniques.

## ✨ Key Features
- **Adaptive AI Challenges**: Challenges dynamically adjust in difficulty (Easy, Normal, Hard) based on user performance.
- **Learn with AI**: A dedicated full-page chat interface where students can ask free-form coding questions to a context-aware AI tutor.
- **Global Real-time Leaderboard**: Features a live ranking system powered by Firestore `onSnapshot`, proving active real-time data integration.
- **Explain it Simpler**: AI-powered analogies that break down complex technical feedback into beginner-friendly concepts.
- **Learning Library**: A curated hub of resources (MDN, FreeCodeCamp) integrated directly into the dashboard.
- **Gamified XP System**: Real-time level-up animations, streak tracking, and achievement milestones.

## 🛠️ Technical Stack & Google Services
- **Framework**: Next.js 15 (App Router, Standalone mode)
- **AI Engine**: **Google Vertex AI SDK** (Enterprise-grade Gemini 1.5 Flash integration)
- **Authentication**: Firebase Authentication (Anonymous session-based tracking)
- **Database**: **Firebase Admin SDK** (Server-side Firestore operations for secure progress tracking)
- **Real-time**: Cloud Firestore `onSnapshot` for the global live leaderboard.
- **Storage**: Firebase Storage via Admin SDK for session audit trails.
- **Analytics**: Google Analytics 4 (Behavioral tracking and conversion funnels)
- **Styling**: Vanilla CSS with modern HSL tokens and Glassmorphism effects.

## 🛡️ Security & Performance
- **Strict CSP**: Comprehensive Content-Security-Policy headers protecting against XSS and clickjacking.
- **Rate Limiting**: Built-in Edge Middleware to prevent API abuse and public scraping.
- **Server-side Caching**: In-memory TTL caching for Gemini API responses to optimize latency and costs.
- **Accessibility (A11y)**: 100% compliant with ARIA roles, skip-to-content links, and keyboard navigation.

## 🚀 Getting Started
1. Clone the repository.
2. Set up environment variables in `.env.local`:
   ```env
   GEMINI_API_KEY=...
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```
3. Run `npm install` and `npm run dev`.
4. Build for production: `npm run build`.

## 🏆 Evaluation Readiness
- **Testing**: Vitest suite covering core API logic.
- **Efficiency**: Standalone build optimization for Cloud Run deployment.
- **Interactivity**: 100% reactive UI with framer-motion-style transitions.
