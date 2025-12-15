# Complete Project Specification: Quiz Racing Activity Platform

## Project Overview

We're building **"Circuit Challenge"** - a mobile-first, multiplayer educational web application that gamifies learning through competitive racing mechanics. This is NOT a traditional game for entertainment; it's an educational activity where students race vehicles around tracks while answering subject-specific questions at checkpoints. The faster they answer correctly, the faster they race. This creates an engaging, competitive learning environment perfect for classroom use.

**Target Audience**: UK secondary/college students (ages 14-19), specifically for vocational courses like automotive, engineering, construction, but extensible to any subject.

**Primary Use Case**: Teachers host live classroom sessions where students join on their mobile devices, race competitively, and answer curriculum-aligned questions to progress.

---

## Core Philosophy: Learning Through Competition

**The Magic Formula**: 
```
Racing Excitement + Knowledge Assessment + Real-time Competition = Engaged Learning
```

**Key Principles**:
1. **Fun First**: If it's not exciting, students won't engage
2. **Learning Embedded**: Questions aren't interruptions - they're part of the race strategy
3. **Instant Feedback**: Immediate consequences for right/wrong answers
4. **Social Competition**: Racing against classmates creates healthy competition
5. **Teacher Control**: Educators can customize everything to their curriculum
6. **Accessibility**: Works on any mobile device, simple controls, clear interface

---

## Technical Stack

### Frontend Framework
- **React 18+** with **TypeScript** for type safety
- **Vite** for blazing-fast development and builds
- **React Router** for navigation (Teacher Dashboard, Student Join, Track Editor, etc.)

### Styling & UI
- **Tailwind CSS** for mobile-first, responsive design
- **Framer Motion** for smooth animations and transitions
- **Lucide React** for consistent iconography
- **Custom CSS** for canvas/racing elements

### Racing/Graphics Engine (Choose One Approach)

**Option A: Canvas 2D (Recommended for MVP)**
- HTML5 Canvas API for top-down 2D racing
- Simpler physics and collision detection
- Better performance on lower-end devices
- Easier to implement quickly

**Option B: React Three Fiber (For Enhanced Experience)**
- 3D top-down/isometric view
- More visually stunning
- Better for engagement but higher complexity
- Requires WebGL support

**Recommendation**: Start with Canvas 2D, migrate to R3F in Phase 2 if needed.

### Backend & Real-time Infrastructure
- **Supabase** (PostgreSQL + Real-time + Auth)
  - Database for questions, tracks, sessions, users
  - Real-time Channels for multiplayer synchronization
  - Row Level Security (RLS) for data protection
  - Authentication for teacher/student accounts
  - Storage for track thumbnails/images

### Real-time Communication
- **Supabase Realtime Channels** for:
  - Vehicle position updates (30-60 FPS)
  - Lap/checkpoint triggers
  - Question responses
  - Leaderboard updates
  - Session state changes

### State Management
- **Zustand** or **Jotai** for global state (lightweight, TypeScript-friendly)
- Local React state for component-specific needs
- Supabase client state for real-time subscriptions

### Deployment
- **Vercel** or **Netlify** for frontend hosting
- **GitHub Pages** possible for simpler deployments
- **Supabase** cloud for backend infrastructure

---

## Architecture Overview

### Three Main Interfaces

```
┌─────────────────────────────────────────────────────────┐
│                    TEACHER DASHBOARD                     │
│  - Create/manage question banks                          │
│  - Build/edit tracks                                     │
│  - Configure sessions (tracks + questions + rules)       │
│  - Host live sessions with unique codes                  │
│  - Monitor student progress in real-time                 │
│  - View analytics and reports                            │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    SESSION LOBBY                         │
│  - Students enter session code                           │
│  - Customize vehicle (color, name, number)               │
│  - See connected participants                            │
│  - Wait for host to start                                │
│  - Display session rules and track preview               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    RACING ACTIVITY                       │
│  - Real-time multiplayer racing view                     │
│  - Touch controls (mobile-first)                         │
│  - Question modals at checkpoints                        │
│  - Live leaderboard and positions                        │
│  - Power-ups and visual feedback                         │
│  - Session results and achievements                      │
└─────────────────────────────────────────────────────────┘
```

---

## Detailed Feature Specifications

### 1. Question Bank System

**Teacher Capabilities**:
- Create questions with multiple-choice answers (4 options, 1 correct)
- Add images/diagrams to questions (stored in Supabase Storage)
- Categorize by:
  - Subject/Topic (e.g., "Engine Cooling", "Brake Systems")
  - Difficulty (Foundation, Intermediate, Advanced, Expert)
  - Learning Outcome (e.g., "IMI Level 1 - LO 2.3")
- Bulk import via CSV/JSON
- Question editor with rich text support
- Tag system for flexible organization
- Clone/duplicate questions
- Archive/delete with safeguards

**Question Schema**:
```typescript
interface Question {
  id: string;
  question_text: string;
  image_url?: string;
  options: string[]; // Always 4 options
  correct_answer: number; // Index 0-3
  topic: string;
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'expert';
  learning_outcome?: string;
  explanation?: string; // Shown after answer
  time_limit?: number; // Seconds, default 30
  created_by: string; // Teacher ID
  created_at: timestamp;
  tags: string[];
}
```

**UI Design**: Clean, filterable table with search, quick-add modal, inline editing

---

### 2. Track Builder System

**Track Editor Features**:
- Grid-based canvas (similar to level editor)
- Drag-and-drop track pieces:
  - Straights (short, medium, long)
  - Corners (90°, hairpin, chicane)
  - Start/Finish line
  - Checkpoint markers
- Place obstacles (walls, cones, barriers)
- Define track boundaries (auto-collision)
- Set checkpoint question triggers
- Preview mode (test drive single-player)
- Save custom tracks
- Share track codes with other teachers

**10 Pre-built Tracks** (We'll Create):
1. **"Rookie Circuit"** - Simple oval, 3 laps, Foundation questions
2. **"Piston Valley"** - Figure-8, engine-themed questions
3. **"Torque Turn"** - Technical hairpins, Intermediate difficulty
4. **"Cooling Corners"** - Water-themed, cooling system questions
5. **"Brake Point Boulevard"** - Heavy braking zones, brake questions
6. **"Transmission Track"** - Complex layout, gearbox questions
7. **"Suspension Sprint"** - Bumpy visual, chassis questions
8. **"Electrical Circuit"** - Lightning theme, electrical questions
9. **"Champion's Challenge"** - Longest track, mixed Advanced questions
10. **"Grand Prix Gauntlet"** - Ultimate challenge, Expert level

**Track Schema**:
```typescript
interface Track {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  layout_data: {
    grid_size: { width: number; height: number };
    pieces: TrackPiece[];
    checkpoints: CheckpointPosition[];
    obstacles: Obstacle[];
  };
  thumbnail_url?: string;
  total_checkpoints: number;
  estimated_duration: number; // minutes
  created_by: string;
  is_public: boolean;
  created_at: timestamp;
  tags: string[];
}

interface CheckpointPosition {
  id: string;
  position: { x: number; y: number };
  trigger_radius: number;
  question_set_id?: string; // Link to specific questions
  is_mandatory: boolean;
}
```

---

### 3. Session Configuration System

**Teacher Session Setup**:
- Select track (pre-built or custom)
- Select question bank/set
- Configure rules:
  - Number of laps (1-10)
  - Question frequency (every lap, every checkpoint, random)
  - Time limit per question (10s - 60s)
  - Penalty/reward magnitudes
  - Scoring mode (speed-focused, knowledge-focused, balanced)
- Choose session mode:
  - **Sprint**: First to finish wins (speed emphasis)
  - **Knowledge Champion**: Most correct answers wins (accuracy emphasis)
  - **Balanced Challenge**: Points for both speed and accuracy
  - **Team Relay**: Students work in teams
- Set max participants (2-30 students)
- Enable/disable features:
  - Power-ups
  - Chat/reactions
  - Adaptive difficulty
  - Live leaderboard visibility

**Session Schema**:
```typescript
interface Session {
  id: string;
  code: string; // 6-digit join code
  track_id: string;
  question_set_ids: string[];
  host_id: string; // Teacher
  rules: {
    laps: number;
    question_frequency: 'every_lap' | 'every_checkpoint' | 'random';
    time_per_question: number;
    correct_reward: RewardConfig;
    incorrect_penalty: PenaltyConfig;
    scoring_mode: 'sprint' | 'knowledge' | 'balanced' | 'team';
    max_participants: number;
  };
  status: 'waiting' | 'countdown' | 'active' | 'paused' | 'finished';
  participants: Participant[];
  created_at: timestamp;
  started_at?: timestamp;
  finished_at?: timestamp;
}

interface RewardConfig {
  speed_boost_ms: number; // e.g., 2000 = 2 second boost
  nitro_charge?: boolean;
  shortcut_unlock?: boolean;
  points: number;
}

interface PenaltyConfig {
  time_penalty_ms: number; // e.g., 5000 = 5 second penalty
  speed_reduction?: number; // percentage
  spawn_obstacle?: boolean;
  points_deduction: number;
}
```

---

### 4. Student Racing Experience

**Join Flow**:
1. Navigate to app (QR code or URL)
2. Enter 6-digit session code
3. Enter name
4. Choose vehicle color (color picker)
5. Optional: Choose team (if team mode)
6. See lobby with other participants
7. Ready indicator
8. Wait for teacher to start

**Racing Interface** (Mobile-First Canvas Layout):

```
┌─────────────────────────────────────┐
│ LAP 2/3    TIME 2:34    P2/12  🔴   │ ← Status bar
├─────────────────────────────────────┤
│                                     │
│          [RACING CANVAS]            │
│       ┌─────────┐                   │
│       │Mini-map │                   │
│       │ • You   │                   │
│       │ • P1    │                   │
│       └─────────┘                   │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  ⚡Nitro   🛡️Shield   ⭐15pts       │ ← Power-up bar
├─────────────────────────────────────┤
│     [◀️ Steer]      [▶️ Steer]      │ ← Touch controls
│         [🚀 Accelerate]             │
│          [🛑 Brake]                 │
└─────────────────────────────────────┘
```

**Question Modal** (Overlay when hitting checkpoint):
```
┌─────────────────────────────────────┐
│         CHECKPOINT QUESTION          │
│              ⏱️ 15s                  │
├─────────────────────────────────────┤
│ What component regulates coolant    │
│ flow based on temperature?          │
│                                     │
│ [A] Thermostat      ✓               │ ← Tappable options
│ [B] Radiator                        │
│ [C] Water pump                      │
│ [D] Coolant reservoir               │
│                                     │
│         [SKIP -10 PTS] ←Optional    │
└─────────────────────────────────────┘
```

**Feedback Animations**:
- ✅ **CORRECT**: Green flash, "+10 POINTS! ⚡BOOST!", vehicle speeds up visually
- ❌ **WRONG**: Red flash, "-5 SEC PENALTY!", vehicle slows/obstacle appears, show correct answer
- **Power-up collected**: Particle effect, icon fills in power-up bar
- **Lap completed**: Lap counter updates, checkpoint progress resets
- **Position changed**: "+2 POSITIONS!" or "Overtaken by Player3!"

**Controls**:
- **Touch**: Virtual joystick or left/right tap zones
- **Tilt**: Accelerometer (optional, toggle in settings)
- **Desktop**: Arrow keys (for testing)

---

### 5. Real-time Multiplayer Synchronization

**Critical Data to Sync**:
- Vehicle positions (x, y, rotation) - every 50ms
- Lap count and checkpoint progress
- Question responses (immediate)
- Power-up usage
- Collision events
- Race status (countdown, active, paused, finished)

**Supabase Realtime Channel Structure**:
```typescript
// Join session channel
const channel = supabase.channel(`session:${sessionCode}`)

// Position updates (broadcast, no persistence)
channel.on('broadcast', { event: 'position' }, (payload) => {
  updatePlayerPosition(payload.user_id, payload.position);
});

// Question responses (stored in DB, broadcast for instant feedback)
channel.on('broadcast', { event: 'answer_submitted' }, (payload) => {
  showAnswerFeedback(payload.user_id, payload.is_correct);
});

// Session state changes (countdown, start, pause, end)
channel.on('broadcast', { event: 'session_state' }, (payload) => {
  updateSessionState(payload.status);
});
```

**Conflict Resolution**:
- Server is source of truth for lap counts, checkpoints
- Client predicts own movement, server validates
- Optimistic UI for answer submission
- Rollback on server rejection (rare)

---

### 6. Gamification & Engagement Mechanics

**Power-ups** (Earned through correct answers):
- **⚡ Nitro Boost**: 3-second speed increase
- **🛡️ Shield**: Blocks next penalty
- **🔓 Shortcut**: Unlocks alternate route on track
- **⏱️ Time Freeze**: Freezes opponents for 2 seconds (Advanced mode)
- **❓ Lifeline**: 50/50 on next question (removes 2 wrong answers)

**Achievement System** (Unlocked during/after session):
- 🏆 **Perfect Lap**: All questions correct in one lap
- 🚀 **Speed Demon**: Fastest single lap
- 🧠 **Knowledge King/Queen**: Most correct answers overall
- 💪 **Comeback Champion**: Recovered from last to top 3
- 🎯 **Sharpshooter**: 5 correct answers in a row
- 🤝 **Team Player**: Helped team win in Team mode
- ⚡ **Power User**: Used all power-up types
- 📚 **Subject Expert**: 100% accuracy in specific topic

**Leaderboard Types**:
- **Live Race Position**: Current race placement
- **Knowledge Score**: Total correct answers
- **Combined Score**: Weighted speed + accuracy
- **Team Standings**: Combined team performance

**Visual Feedback & Juice**:
- Screen shake on collision
- Particle effects on boost/power-up
- Vehicle trail colors (green = doing well, red = struggling)
- Confetti on race finish
- Sound effects (can be muted for classroom)
- Haptic feedback on mobile (optional)

---

### 7. Teacher Monitoring Dashboard

**Live Session View** (During Active Session):
```
┌─────────────────────────────────────────────────────────┐
│  SESSION: Cooling Circuit Challenge  [⏸️ PAUSE] [⏹️ END] │
│  Track: Cooling Corners | Lap 2/3 | 12 Participants     │
├─────────────────────────────────────────────────────────┤
│  📊 LIVE LEADERBOARD              📈 KNOWLEDGE STATS    │
│  1. Sarah (+2) 🟢 100%            Avg Accuracy: 78%     │
│  2. James (-1) 🟡 87%             Questions: 36/48      │
│  3. Emma (+1) 🟢 92%              Top Topic: Cooling    │
│  4. Ryan (→) 🔴 65%               Weak: Thermostats     │
│  ...                                                    │
│                                                         │
│  🎯 QUESTION PERFORMANCE          ⚠️ ALERTS             │
│  Q5: Thermostat function          Ryan - 3 wrong       │
│  ✅ 8/12 correct                  Emma - needs help?    │
│  ❌ Common wrong: "Radiator"                           │
│                                                         │
│  [VIEW INDIVIDUAL PROGRESS] [SEND MESSAGE] [ADJUST]    │
└─────────────────────────────────────────────────────────┘
```

**Real-time Insights**:
- Which questions students are getting wrong
- Students who may be struggling (low accuracy)
- Questions that are too easy/hard (adjust for next session)
- Time spent per question
- Engagement metrics (participation rate)

**Teacher Controls**:
- Pause/resume session
- Send messages/announcements to all
- Remove disruptive participant
- Adjust question difficulty mid-session (adaptive)
- Extend time on current question
- Skip to next lap/checkpoint

---

### 8. Post-Session Analytics

**For Teachers**:
- Overall session summary (duration, participation, completion rate)
- Individual student reports:
  - Questions answered correctly/incorrectly
  - Topics mastered/struggled with
  - Time spent, final position
  - Achievements earned
- Question effectiveness analysis
- Exportable reports (PDF, CSV)
- Progress tracking over multiple sessions

**For Students**:
- Final position and time
- Accuracy percentage
- Achievements unlocked
- Personal bests
- Areas to improve
- Next recommended topics

---

## Safe Network Terminology

**AVOID** these terms (may trigger college filters):
- "Game", "Gaming", "Gameplay"
- "Player", "Multiplayer game"
- "Battle", "Fight", "Shoot"
- "Bet", "Gamble", "Win money"

**USE** these alternatives:
- **Activity**, **Learning Session**, **Challenge**, **Exercise**
- **Participant**, **Student**, **Learner**
- **Session Host**, **Facilitator** (instead of game master)
- **Track/Circuit/Course** (instead of game level)
- **Performance Metrics**, **Progress** (instead of score)
- **Knowledge Checkpoint** (instead of game mechanic)
- **Racing Activity**, **Circuit Challenge** (instead of racing game)

**In Code**:
```typescript
// ❌ Avoid
class Game { }
interface PlayerState { }
const gameLoop = () => {}

// ✅ Use
class Session { }
interface ParticipantState { }
const activityLoop = () => {}
```

---

## Database Schema (Supabase)

```sql
-- Users (Supabase Auth handles core auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT CHECK (role IN ('teacher', 'student')),
  display_name TEXT,
  avatar_url TEXT,
  school_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Question Bank
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL, -- Array of 4 strings
  correct_answer INTEGER CHECK (correct_answer >= 0 AND correct_answer <= 3),
  topic TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('foundation', 'intermediate', 'advanced', 'expert')),
  learning_outcome TEXT,
  explanation TEXT,
  time_limit INTEGER DEFAULT 30,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  tags TEXT[]
);

-- Tracks
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  layout_data JSONB NOT NULL,
  thumbnail_url TEXT,
  total_checkpoints INTEGER,
  estimated_duration INTEGER,
  created_by UUID REFERENCES profiles(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  tags TEXT[]
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- 6-digit join code
  track_id UUID REFERENCES tracks(id),
  host_id UUID REFERENCES profiles(id),
  rules JSONB NOT NULL,
  status TEXT CHECK (status IN ('waiting', 'countdown', 'active', 'paused', 'finished')),
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  finished_at TIMESTAMP
);

-- Session Participants
CREATE TABLE session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  display_name TEXT NOT NULL,
  vehicle_color TEXT NOT NULL,
  team_id TEXT,
  current_position INTEGER,
  current_lap INTEGER DEFAULT 0,
  checkpoints_passed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  total_time_ms INTEGER DEFAULT 0,
  final_position INTEGER,
  achievements TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Question Responses (for analytics)
CREATE TABLE question_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES session_participants(id),
  question_id UUID REFERENCES questions(id),
  answer_index INTEGER,
  is_correct BOOLEAN,
  time_taken_ms INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Achievements (predefined list)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g., 'perfect_lap'
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'))
);

-- User Achievements (unlock tracking)
CREATE TABLE user_achievements (
  user_id UUID REFERENCES profiles(id),
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  session_id UUID REFERENCES sessions(id),
  PRIMARY KEY (user_id, achievement_id)
);
```

---

## Development Phases & Timeline

### Phase 1: Foundation (Week 1)
**Goal**: Single-player racing prototype with basic UI

- [ ] Project setup (Vite + React + TypeScript + Tailwind)
- [ ] Supabase project setup (database, auth, storage)
- [ ] Basic Canvas 2D racing engine
  - Vehicle movement and controls
  - Track rendering (simple predefined track)
  - Collision detection
  - Lap counting
- [ ] Mobile-first responsive layout
- [ ] Basic UI components (buttons, modals, inputs)

**Deliverable**: Single vehicle can race around one track on mobile

---

### Phase 2: Quiz Integration (Week 1-2)
**Goal**: Working checkpoint + question system

- [ ] Question bank CRUD (teacher creates questions)
- [ ] Database schema implementation
- [ ] Checkpoint system in racing engine
- [ ] Question modal UI (mobile-optimized)
- [ ] Answer validation and feedback
- [ ] Penalty/reward mechanics (speed boost, time penalty)
- [ ] Basic scoring system

**Deliverable**: Single-player can race, answer questions at checkpoints, see feedback

---

### Phase 3: Track Builder (Week 2)
**Goal**: Teachers can create custom tracks

- [ ] Track editor canvas UI
- [ ] Drag-and-drop track pieces
- [ ] Checkpoint placement tool
- [ ] Track save/load functionality
- [ ] Track preview mode
- [ ] Create 10 pre-built tracks
- [ ] Track selection UI

**Deliverable**: Teachers can build and test custom tracks

---

### Phase 4: Multiplayer Infrastructure (Week 2-3)
**Goal**: Real-time multiplayer racing

- [ ] Supabase Realtime channels setup
- [ ] Session creation flow (generate codes)
- [ ] Lobby system (join, ready up, participant list)
- [ ] Position synchronization (all vehicles visible)
- [ ] Real-time leaderboard updates
- [ ] Session state management (countdown, start, pause, end)
- [ ] Handle disconnections gracefully

**Deliverable**: 2-10 students can race together in real-time

---

### Phase 5: Teacher Dashboard (Week 3)
**Goal**: Complete teacher experience

- [ ] Session configuration UI (track + questions + rules)
- [ ] Live monitoring dashboard
- [ ] Real-time question performance tracking
- [ ] Student progress indicators
- [ ] Session controls (pause, resume, end)
- [ ] Basic analytics view

**Deliverable**: Teachers can create, configure, monitor, and control live sessions

---

### Phase 6: Gamification & Polish (Week 3-4)
**Goal**: Engaging, polished experience

- [ ] Power-up system implementation
- [ ] Achievement system (define, award, display)
- [ ] Visual effects (particles, screen shake, trails)
- [ ] Sound effects (with mute option)
- [ ] Haptic feedback (mobile)
- [ ] Improved graphics (vehicle sprites, track details)
- [ ] Animations and transitions (Framer Motion)
- [ ] Team mode functionality

**Deliverable**: Fully engaging, game-like experience

---

### Phase 7: Analytics & Reporting (Week 4)
**Goal**: Complete the learning loop

- [ ] Post-session student reports
- [ ] Teacher analytics dashboard
- [ ] Question effectiveness analysis
- [ ] Individual student progress tracking
- [ ] Export functionality (PDF/CSV reports)
- [ ] Historical session comparison
- [ ] Adaptive difficulty system

**Deliverable**: Teachers can track learning outcomes over time

---

### Phase 8: Testing & Optimization (Week 4-5)
**Goal**: Classroom-ready product

- [ ] Cross-device testing (iOS, Android, tablets)
- [ ] Network performance optimization
- [ ] Database query optimization
- [ ] Loading state improvements
- [ ] Error handling and user feedback
- [ ] Accessibility improvements (color contrast, screen readers)
- [ ] Real classroom pilot testing
- [ ] Bug fixes and refinements

**Deliverable**: Stable, performant app ready for daily classroom use

---

## Fun & Engagement Strategies

### 1. **Immediate Gratification**
- Instant visual feedback on every action
- Satisfying sound effects (engine revs, boosts)
- Rapid question-answer-consequence loop
- No waiting - always something happening

### 2. **Social Dynamics**
- See everyone racing together
- Friendly competition with classmates
- Team modes for collaboration
- In-session reactions/emojis (optional)
- Post-race banter and comparisons

### 3. **Variable Rewards**
- Random power-up drops
- Surprise achievements
- Unexpected shortcuts unlocked
- Bonus questions with mega-rewards
- "Lucky lap" mechanic (random boost)

### 4. **Progression & Mastery**
- Unlock harder tracks as accuracy improves
- Personal best tracking
- Level system based on sessions completed
- "Subject badges" for topic mastery
- Visible skill improvement over time

### 5. **Storytelling & Theming**
- Each track has a "story" (e.g., "Race through Piston Valley!")
- Thematic questions matching track theme
- Character/vehicle customization
- Seasonal events (e.g., "Winter Championship")
- Themed achievement names

### 6. **Low Floor, High Ceiling**
- Easy to start (anyone can race)
- Simple controls, clear UI
- But deep strategy (when to risk wrong answer for speed?)
- Advanced tactics (shortcut management, power-up timing)
- Reward both speed AND knowledge

### 7. **Spectacle & Polish**
- Smooth animations everywhere
- Particle effects on every action
- Dynamic music/sound (ramps up with speed)
- Photo finish celebrations
- Highlight reel of best moments

### 8. **Novelty & Variety**
- 10 different tracks with unique layouts
- Rotating track selection
- Special challenge modes (time attack, endurance)
- Seasonal/weekly challenges
- Guest tracks from other teachers

---

## Mobile-First Design Principles

1. **Touch-Optimized Controls**
   - Large tap zones (min 44x44px)
   - No complex gestures
   - Clear visual feedback on press

2. **Portrait & Landscape Support**
   - Racing works in both orientations
   - UI adapts intelligently
   - Teacher dashboard desktop-optimized

3. **Performance**
   - 60 FPS target for racing
   - Lazy loading for heavy assets
   - Optimized images (WebP)
   - Minimal bundle size

4. **Connectivity**
   - Graceful handling of spotty WiFi
   - Offline question caching
   - Reconnection logic
   - Low bandwidth mode

5. **Battery Efficiency**
   - Throttle updates when in background
   - Reduce particle effects on low battery
   - Option to disable animations

---

## Success Metrics

**Engagement**:
- Session completion rate (target: >85%)
- Average questions answered per session (target: >10)
- Repeat participation rate (target: >70%)
- Time spent in activity (target: 15-20 min)

**Learning**:
- Average accuracy improvement over time (target: +15% after 5 sessions)
- Topic mastery progression
- Question retry success rate
- Knowledge retention (retested after weeks)

**Technical**:
- Page load time (target: <2s)
- Racing FPS (target: 60 FPS)
- Real-time latency (target: <100ms)
- Crash rate (target: <0.5%)

**Teacher Satisfaction**:
- Setup time per session (target: <5 min)
- Question bank creation time (target: <2 min per question)
- Would recommend to colleague (target: >90%)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Real-time sync lag causes unfair racing | Implement client-side prediction, server reconciliation, lag compensation |
| Students cheat by looking at each other's screens | Question randomization per student, time pressure, teacher monitoring |
| Network filters block app | Use safe terminology, avoid flagged keywords, document for IT approval |
| Low engagement after novelty wears off | Regular content updates, seasonal events, achievement system, varied modes |
| Teachers lack time to create questions | Provide extensive pre-built question library, CSV import, question sharing |
| Mobile devices overheat during racing | Optimize rendering, throttle updates, reduce particle effects, battery mode |
| Accessibility concerns | High contrast mode, larger text options, screen reader support, simple controls |
| Supabase costs scale unexpectedly | Monitor usage, implement row-level caching, connection pooling, rate limiting |

---

## Future Enhancements (Post-MVP)

- **AI Question Generation**: Teachers describe topic, AI generates questions
- **Video Replay**: Rewatch your best races
- **Spectator Mode**: Students can watch without racing
- **Tournament Mode**: Multi-round elimination brackets
- **Custom Vehicle Designs**: Student-created vehicle sprites
- **Physics Customization**: Change vehicle handling per track
- **Weather Effects**: Rain makes track slippery, affects strategy
- **Cross-School Competitions**: Race against students from other schools
- **Integration with LMS**: Gradebook sync, automatic reporting
- **Voice Questions**: Text-to-speech for accessibility
- **AR Mode**: Race on physical surfaces (advanced)

---

## Getting Started Checklist

Before development:
- [ ] Set up Supabase project
- [ ] Design database schema
- [ ] Create wireframes for key screens
- [ ] Define question format standard
- [ ] Plan 10 pre-built tracks (themes, layouts)
- [ ] Set up Git repository
- [ ] Configure Vercel/Netlify deployment
- [ ] Create project board (GitHub Projects/Trello)
- [ ] Set up TypeScript + ESLint + Prettier
- [ ] Install core dependencies

---

## The Vision

**Imagine a Monday morning classroom**. The teacher displays a QR code on the board. Students grab their phones, scan, enter the session code, and pick their vehicle colors. The teacher selects "Cooling Circuit Challenge" - today's lesson on engine cooling systems.

The countdown begins: 3... 2... 1... GO!

Twelve vehicles rocket around the track. Sarah hits the first checkpoint. Her screen shows: "What maintains engine temperature?" She taps "Thermostat" - CORRECT! Her vehicle surges forward with a speed boost. James behind her panics, guesses wrong, and hits a time penalty. Emma uses her shortcut power-up to take the inside line.

The classroom is ALIVE. Students are racing, learning, competing. The teacher watches the dashboard: "75% got question 3 correct - good! But only 40% know what a thermostat does - we need to review that tomorrow."

After 15 minutes, the race ends. Sarah wins, but Ryan had the highest accuracy. Achievements pop up. Students compare results. The teacher exports the data and notes which topics need reinforcement.

**That's Circuit Challenge. Racing + Learning + Fun.**

---

**Now let's build it!** 🏎️💨📚