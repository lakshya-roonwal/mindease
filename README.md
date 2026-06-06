# MindEase

Your calm companion through exam season. Built specifically for Indian students preparing for high-stakes competitive exams like NEET, JEE, UPSC, and Boards.

## Features

- **Mood Tracking & Analytics**: Log your daily mood and energy levels. View beautiful Recharts visualizations of your emotional trends and identify key stress triggers.
- **AI Wellness Coach**: Powered by Google Gemini, an empathetic, context-aware chatbot designed to provide emotional support and actionable micro-tips without diagnosing or replacing professional help.
- **Guided Reflection Journal**: A private, distraction-free space to document your thoughts, featuring exam-specific guided prompts and auto-save capabilities.
- **Interactive Wellness Toolkit**: Science-backed stress relief exercises including:
  - 4-7-8 Breathing (with SVG animations and Web Audio cues)
  - Box Breathing
  - 5-4-3-2-1 Sensory Grounding
  - Daily Affirmations
- **Privacy First**: Secure authentication with NextAuth.js. Options to export all your personal data (JSON) or permanently delete your account.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma + SQLite (Local Dev)
- **Auth**: NextAuth.js v5 (Auth.js)
- **Styling**: Tailwind CSS v4 + Radix UI Primitives
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI**: Google Generative AI (Gemini) SDK
- **Testing**: Jest (Unit/API) + Playwright (E2E)

## Local Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone <repo-url>
   cd mindease
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables:**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secure-random-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-google-gemini-api-key"
   \`\`\`

4. **Database Setup & Seeding:**
   \`\`\`bash
   npm run db:push
   npm run db:seed
   \`\`\`
   *(The seed script creates a demo user: \`demo@mindease.in\` / \`password123\` with 14 days of pre-populated mood data).*

5. **Run the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Visit [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

The app is pre-configured for Vercel deployment via \`vercel.json\`. Ensure you set the required environment variables in your Vercel project settings before deploying. The build command automatically generates the Prisma client and pushes the schema.

## Accessibility

MindEase is built following WCAG 2.1 AA guidelines:
- Full keyboard navigability (focus traps in modals, logical tab order).
- Comprehensive ARIA attributes (\`aria-label\`, \`aria-live\` regions for dynamic content).
- A visually hidden "Skip to main content" link for screen readers.
- High color contrast ratios (checked against Tailwind's default palette).

## Crisis Support

MindEase is a supportive tool, not a medical device. If you or someone you know is in crisis, please reach out for professional help. 
**iCall Helpline (India): 9152987821**
