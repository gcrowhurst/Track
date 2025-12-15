# Circuit Challenge - Setup & Configuration Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Database Schema](#database-schema)
5. [Local Development](#local-development)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: For version control
- **Supabase Account**: Free tier available at https://supabase.com
- **Code Editor**: VS Code recommended
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

---

## Environment Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - Project name: `circuit-challenge`
   - Database password: Create a secure password
   - Region: Choose closest to your location
5. Wait for provisioning (2-3 minutes)

### 2. Get Your Credentials

1. In Supabase dashboard, go to "Settings" → "API"
2. Copy:
   - **Project URL** (appears as `https://xxxxx.supabase.co`)
   - **Anon Key** (public key for frontend)
   - **Service Role Key** (keep secret, for backend only)

### 3. Configure Environment Variables

```bash
# Copy example to local config
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Fill in your values:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Supabase Configuration

### 1. Run Database Schema

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy contents of `DATABASE_SCHEMA.sql`
4. Paste into the SQL editor
5. Click "Run"
6. Wait for all tables to be created

### 2. Enable Authentication

1. Go to "Authentication" → "Providers"
2. Enable "Email" provider
3. Configure email templates if needed
4. Go to "URL Configuration"
5. Add your frontend URL:
   - Development: `http://localhost:5173`
   - Production: `https://your-domain.com`

### 3. Create Storage Buckets

1. Go to "Storage" → "New Bucket"
2. Create bucket: `question-images`
   - Set as Public
3. Create bucket: `track-thumbnails`
   - Set as Public
4. Create bucket: `user-avatars`
   - Set as Public

### 4. Set Up Realtime Subscriptions

1. Go to "Database" → "Replication"
2. Enable replication for tables:
   - `sessions`
   - `session_participants`
   - `question_responses`
   - `user_achievements`

---

## Database Schema

### Table Relationships

```
profiles (users)
├── questions (created_by)
├── tracks (created_by)
├── sessions (host_id)
└── user_achievements

sessions
├── session_participants
│   └── question_responses
└── tracks
    └── checkpoints

achievements
└── user_achievements
```

### Key Tables

**profiles**: User accounts (teacher/student)
**questions**: Question bank entries with multiple choice options
**tracks**: Racing track definitions with layout data
**sessions**: Live racing sessions with rules and status
**session_participants**: Students in each session with progress
**question_responses**: Answer tracking for analytics
**achievements**: Achievement definitions
**user_achievements**: Unlocked achievements per user

---

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:5173`

### 3. Development Commands

```bash
# Start with debug mode
VITE_ENABLE_DEBUG=true npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
tsc

# Lint (if configured)
npm run lint
```

### 4. Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── Notification.tsx
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── TeacherDashboard.tsx
│   ├── StudentJoin.tsx
│   ├── SessionLobby.tsx
│   ├── RacingActivity.tsx
│   ├── TrackBuilder.tsx
│   └── QuestionBank.tsx
├── store/              # Zustand state management
│   └── index.ts
├── services/           # Backend API services
│   └── supabase.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   ├── helpers.ts
│   └── racingEngine.ts
├── App.tsx             # Main app component
├── App.css             # Global styles (now using Tailwind)
└── index.css           # Tailwind directives
```

### 5. Hot Module Replacement (HMR)

Changes are automatically reflected in the browser:
- React component edits reload instantly
- CSS changes apply without reload
- State persists during HMR

---

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

### Option 2: Netlify

1. Push code to GitHub
2. Go to netlify.com
3. Click "New site from Git"
4. Select your repository
5. Configure build:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy

### Option 3: GitHub Pages

1. Update `vite.config.ts`:
```typescript
export default {
  base: '/Track/', // Your repo name
}
```

2. Deploy:
```bash
npm run build
# Push dist/ to gh-pages branch
```

### Production Supabase Configuration

1. Create production Supabase project (optional)
2. Update environment variables in deployment platform
3. Enable CORS for your domain:
   - Supabase → Settings → CORS
   - Add your production domain

---

## Troubleshooting

### Cannot connect to Supabase

**Problem**: `Error: Failed to connect to Supabase`

**Solution**:
1. Check `.env.local` has correct URL and key
2. Verify Supabase project is running
3. Check network connectivity
4. Ensure credentials are not expired

### CSS not loading (Tailwind)

**Problem**: No styles appear on page

**Solution**:
1. Verify `@tailwind` directives in `src/index.css`
2. Check `tailwind.config.js` includes correct content paths
3. Restart dev server: `npm run dev`
4. Clear cache: `rm -rf node_modules && npm install`

### Build fails with TypeScript errors

**Problem**: `error TS...` during build

**Solution**:
1. Check error message for specific issue
2. Run `npm run build` to see full error
3. Verify all imports use correct paths
4. Use type-only imports for types: `import type { Type }`

### Database schema errors

**Problem**: Cannot create tables in Supabase

**Solution**:
1. Check all SQL statements in `DATABASE_SCHEMA.sql`
2. Verify user has appropriate roles
3. Run one statement at a time to identify error
4. Check Supabase status page for outages

### Realtime subscriptions not working

**Problem**: Updates don't reflect in real-time

**Solution**:
1. Verify replication is enabled in Supabase
2. Check browser console for errors
3. Ensure Realtime channels are subscribed correctly
4. Verify Row Level Security policies allow access

### Port 5173 already in use

**Problem**: `Error: Port 5173 is in use`

**Solution**:
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

### Memory/Performance Issues

**Problem**: App runs slowly or crashes

**Solution**:
1. Check browser console for errors
2. Use React DevTools to profile components
3. Clear browser cache
4. Reduce number of vehicles in racing (for testing)
5. Disable animations for lower-end devices

---

## Next Steps

1. **Set up authentication**: Implement teacher and student login
2. **Create sample data**: Add questions, tracks, achievements
3. **Test multiplayer**: Create demo session with multiple clients
4. **Customize branding**: Update colors, logos, institution info
5. **Performance testing**: Test with realistic number of concurrent users
6. **Accessibility audit**: Ensure WCAG compliance for school use

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **Vite Guide**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Issue Tracker**: GitHub Issues

---

**Last Updated**: December 15, 2025
**Version**: 1.0.0 (MVP)
