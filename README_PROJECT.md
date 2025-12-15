# Circuit Challenge - Learning Through Racing 🏎️

A mobile-first, multiplayer educational web application that gamifies learning through competitive racing mechanics. Students race vehicles around tracks while answering curriculum-aligned questions at checkpoints.

## Features

### 🎓 For Teachers
- **Session Management**: Create live sessions with unique join codes
- **Question Bank**: Build comprehensive question libraries with topics and difficulty levels
- **Track Builder**: Design custom racing tracks with checkpoints
- **Real-time Monitoring**: Watch student progress and engagement in real-time
- **Analytics**: Track learning outcomes and generate reports

### 🏎️ For Students
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Real-time Racing**: Compete with classmates in live multiplayer sessions
- **Interactive Learning**: Answer questions at checkpoints to progress
- **Gamification**: Earn achievements, collect power-ups, compete on leaderboards
- **Instant Feedback**: Immediate visual feedback on answers with rewards/penalties

### 🎮 Game Mechanics
- **Racing Tracks**: 10 pre-built themed tracks (Rookie Circuit, Cooling Corners, etc.)
- **Power-ups**: Nitro Boost, Shield, Shortcuts, Time Freeze, Lifelines
- **Achievements**: 8+ unlockable achievements based on performance
- **Scoring Modes**: Sprint, Knowledge Champion, Balanced, Team Relay
- **Live Leaderboard**: Real-time position and knowledge tracking

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Graphics**: HTML5 Canvas 2D (can migrate to Three.js later)
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Real-time**: Supabase Realtime Channels
- **Routing**: React Router
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components (Dashboard, Racing, etc.)
├── store/            # Zustand stores (auth, session, racing, etc.)
├── services/         # Backend services (Supabase, API calls)
├── types/            # TypeScript interfaces
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── assets/           # Images, sounds, etc.
└── App.tsx          # Main app component
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Track
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Deployment

### Frontend Hosting
- **Vercel** (Recommended)
  ```bash
  npm i -g vercel
  vercel
  ```
- **Netlify**
  - Connect GitHub repo and deploy directly
- **GitHub Pages**
  - Set `base` in `vite.config.ts`

### Backend
- Supabase provides free tier with:
  - PostgreSQL database
  - Real-time Channels
  - Authentication
  - Storage for images
  - Row-Level Security

## Development Phases

### Phase 1: Foundation ✅
- [x] Project setup (Vite + React + TypeScript + Tailwind)
- [x] Supabase configuration
- [x] Basic Canvas 2D racing engine
- [x] Mobile-first responsive layout
- [x] Core UI components

### Phase 2: Quiz Integration
- [ ] Question bank CRUD
- [ ] Checkpoint system
- [ ] Question modal UI
- [ ] Answer validation and feedback
- [ ] Scoring system

### Phase 3: Track Builder
- [ ] Track editor canvas
- [ ] Drag-and-drop track pieces
- [ ] Checkpoint placement
- [ ] 10 pre-built tracks

### Phase 4: Multiplayer
- [ ] Supabase Realtime setup
- [ ] Session creation and codes
- [ ] Lobby system
- [ ] Position synchronization
- [ ] Real-time leaderboard

### Phase 5: Teacher Dashboard
- [ ] Session monitoring
- [ ] Question performance tracking
- [ ] Student progress indicators

### Phase 6: Gamification
- [ ] Power-up system
- [ ] Achievement system
- [ ] Visual effects
- [ ] Sound effects

### Phase 7: Analytics
- [ ] Post-session reports
- [ ] Question effectiveness analysis
- [ ] Student progress tracking
- [ ] Export functionality

### Phase 8: Testing & Optimization
- [ ] Cross-device testing
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Bug fixes

## Database Schema

### Tables
- `profiles` - User accounts (teacher/student)
- `questions` - Question bank entries
- `tracks` - Racing track definitions
- `sessions` - Live racing sessions
- `session_participants` - Students in sessions
- `question_responses` - Answer tracking for analytics
- `achievements` - Achievement definitions
- `user_achievements` - Unlocked achievements

## Safety & Network Compliance

Uses education-safe terminology:
- ✅ "Activity", "Challenge", "Exercise" (not "Game")
- ✅ "Participant", "Student", "Learner" (not "Player")
- ✅ "Track/Circuit/Course" (not "Level")
- ✅ No gambling, betting, or real-money mechanics

Designed to pass school network filters and IT approval.

## Success Metrics

**Engagement**
- Session completion rate: >85%
- Average questions answered: >10 per session
- Repeat participation: >70%
- Session duration: 15-20 minutes

**Learning**
- Accuracy improvement: +15% over 5 sessions
- Question retry success rate: >80%
- Knowledge retention: Tested after weeks

**Technical**
- Page load time: <2s
- Racing FPS: 60
- Real-time latency: <100ms
- Crash rate: <0.5%

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly on mobile devices
4. Submit a pull request

## License

[To be determined]

## Support

For issues or questions:
- Open a GitHub issue
- Contact the development team
- Check the documentation

## Future Enhancements

- 🤖 AI question generation
- 🎥 Video replay system
- 👥 Spectator mode
- 🏆 Tournament brackets
- 🎨 Custom vehicle designs
- 🌧️ Weather effects
- 🌍 Cross-school competitions
- 📚 LMS integration
- 🎙️ Voice questions
- 📱 AR mode

---

**The Vision**: Making learning exciting through competitive racing with knowledge-based progression. When students race competitively while answering questions, they stay engaged and actually remember the content.

Built for UK secondary/college students in automotive, engineering, construction, and any other subject. Extensible, scalable, and designed for real classroom use.
