/**
 * Supabase Database Schema Migration
 * Run these SQL statements in the Supabase SQL editor to set up the database
 */

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  school_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('foundation', 'intermediate', 'advanced', 'expert')),
  learning_outcome TEXT,
  explanation TEXT,
  time_limit INTEGER DEFAULT 30,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- Create tracks table
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  layout_data JSONB NOT NULL,
  thumbnail_url TEXT,
  total_checkpoints INTEGER DEFAULT 0,
  estimated_duration INTEGER,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rules JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'countdown', 'active', 'paused', 'finished')),
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  finished_at TIMESTAMP
);

-- Create session participants table
CREATE TABLE session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  vehicle_color TEXT NOT NULL,
  team_id TEXT,
  current_position INTEGER DEFAULT 0,
  current_lap INTEGER DEFAULT 0,
  checkpoints_passed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  total_time_ms INTEGER DEFAULT 0,
  final_position INTEGER,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create question responses table
CREATE TABLE question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES session_participants(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_ms INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE user_achievements (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX idx_questions_created_by ON questions(created_by);
CREATE INDEX idx_questions_topic ON questions(topic);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_tracks_created_by ON tracks(created_by);
CREATE INDEX idx_tracks_difficulty ON tracks(difficulty);
CREATE INDEX idx_sessions_host_id ON sessions(host_id);
CREATE INDEX idx_sessions_code ON sessions(code);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_session_participants_session_id ON session_participants(session_id);
CREATE INDEX idx_session_participants_user_id ON session_participants(user_id);
CREATE INDEX idx_question_responses_session_id ON question_responses(session_id);
CREATE INDEX idx_question_responses_participant_id ON question_responses(participant_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are readable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for questions
CREATE POLICY "Questions are readable by authenticated users" ON questions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers can create questions" ON questions
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- RLS Policies for tracks
CREATE POLICY "Tracks are readable by authenticated users" ON tracks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers can create tracks" ON tracks
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- RLS Policies for sessions
CREATE POLICY "Sessions are readable by authenticated users" ON sessions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers can create sessions" ON sessions
  FOR INSERT WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- RLS Policies for session participants
CREATE POLICY "Participants can view their own session" ON session_participants
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT host_id FROM sessions WHERE id = session_id)
  );

CREATE POLICY "Users can join sessions" ON session_participants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert sample achievements
INSERT INTO achievements (code, name, description, icon, rarity) VALUES
  ('perfect_lap', 'Perfect Lap', 'Answer all questions correctly in one lap', '🎯', 'rare'),
  ('speed_demon', 'Speed Demon', 'Complete the fastest lap', '⚡', 'rare'),
  ('knowledge_king', 'Knowledge King', 'Achieve 100% accuracy in a session', '👑', 'epic'),
  ('comeback_champion', 'Comeback Champion', 'Rise from last place to top 3', '🔄', 'epic'),
  ('sharpshooter', '5-Streak', 'Answer 5 questions in a row correctly', '🔫', 'common'),
  ('team_player', 'Team Player', 'Help your team win in Team mode', '🤝', 'rare'),
  ('power_user', 'Power User', 'Use all types of power-ups in one session', '⚡', 'rare'),
  ('subject_expert', 'Subject Expert', 'Master a specific topic category', '📚', 'epic'),
  ('first_race', 'First Race', 'Complete your first racing session', '🏁', 'common'),
  ('ten_races', 'Racing Enthusiast', 'Complete 10 racing sessions', '🏎️', 'rare');
