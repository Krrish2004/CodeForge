# CodeForge - Modern Codeforces Analytics Platform

A sleek, high-performance web application for competitive programmers using the Codeforces API to track progress, analyze performance, and get personalized practice recommendations.

![CodeForge Banner](./screenshots/banner.png)

## Features

- ✅ User profile analytics with interactive visualizations
- 🎯 AI-powered problem recommendations tailored to your skill level
- 📊 Detailed contest performance tracking with insights
- 🥇 Real-time comparison with friends and rivals
- 📆 Smart daily and weekly practice scheduler
- 🧠 Skills gap analyzer based on topic performance
- 🔍 Advanced problem filtering by topics, difficulty, and solved status
- 💻 Detailed submission view with source code and test results

## Tech Stack

- **Frontend**:
  - Next.js 14 (React framework with App Router)
  - TypeScript for type safety
  - Tailwind CSS with shadcn/ui components
  - Framer Motion for smooth animations
  - Recharts for data visualization
  - React Query for server state management
  - React Syntax Highlighter for code display

- **Backend**:
  - Next.js API Routes with Edge Runtime
  - Serverless architecture
  - Codeforces API integration with secure authentication

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Krrish2004/CodeForge.git
cd CodeForge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Codeforces API key and secret to .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## API Integration

This project uses the official Codeforces API. The API key and secret should be configured in your `.env.local` file:

```
NEXT_PUBLIC_CODEFORCES_API_KEY=your_api_key
CODEFORCES_API_SECRET=your_api_secret
```

## New Feature: Submission Details

The latest release includes a detailed submission view:

- View submission details including verdict, time, and memory usage
- See the submitted source code with syntax highlighting
- Review test results with input, output, and expected results comparison
- Direct links to the problem and original submission on Codeforces

For more details on this feature, see [FEATURES.md](./FEATURES.md).

## Screenshots

<div align="center">
  <img src="./screenshots/dashboard.png" alt="Dashboard" width="45%" />
  &nbsp;&nbsp;
  <img src="./screenshots/problem-analytics.png" alt="Problem Analytics" width="45%" />
  <br/><br/>
  <img src="./screenshots/contest-tracker.png" alt="Contest Tracker" width="45%" />
  &nbsp;&nbsp;
  <img src="./screenshots/submission-details.png" alt="Submission Details" width="45%" />
</div>

## Live Demo

You can view the live demo of the application at: [https://code-forge-omega.vercel.app](https://code-forge-omega.vercel.app)

## License

MIT 