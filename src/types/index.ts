// User & Auth
export interface Profile {
  id: string;
  role: 'teacher' | 'student';
  display_name: string;
  avatar_url?: string;
  school_id?: string;
  created_at: string;
}

// Questions
export interface Question {
  id: string;
  question_text: string;
  image_url?: string;
  options: string[]; // Always 4 options
  correct_answer: number; // Index 0-3
  topic: string;
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'expert';
  learning_outcome?: string;
  explanation?: string;
  time_limit?: number; // Seconds, default 30
  created_by: string;
  created_at: string;
  tags: string[];
}

// Tracks
export interface TrackPiece {
  id?: string;
  type: 'straight' | 'corner' | 'start' | 'finish' | 'start_finish' | 'straight_long' | 'straight_medium' | 'straight_short' | 'corner_90' | 'hairpin' | 'chicane';
  x: number;
  y: number;
  rotation: number;
  length?: number;
}

export interface Obstacle {
  id?: string;
  type: 'wall' | 'cone' | 'barrier';
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface CheckpointPosition {
  id: string;
  position?: { x: number; y: number }; // Alternate format
  x?: number; // Direct format
  y?: number; // Direct format
  trigger_radius: number;
  question_set_id?: string;
  is_mandatory: boolean;
}

export interface TrackLayout {
  grid_size: { width: number; height: number };
  pieces: TrackPiece[];
  checkpoints: CheckpointPosition[];
  obstacles: Obstacle[];
}

export interface Track {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  layout_data: TrackLayout;
  thumbnail_url?: string;
  total_checkpoints: number;
  estimated_duration: number;
  created_by: string;
  is_public: boolean;
  created_at: string;
  tags: string[];
}

// Sessions
export interface RewardConfig {
  speed_boost_ms: number;
  nitro_charge?: boolean;
  shortcut_unlock?: boolean;
  points: number;
}

export interface PenaltyConfig {
  time_penalty_ms: number;
  speed_reduction?: number;
  spawn_obstacle?: boolean;
  points_deduction: number;
}

export interface SessionRules {
  laps: number;
  question_frequency: 'every_lap' | 'every_checkpoint' | 'random';
  time_per_question: number;
  correct_reward: RewardConfig;
  incorrect_penalty: PenaltyConfig;
  scoring_mode: 'sprint' | 'knowledge' | 'balanced' | 'team';
  max_participants: number;
}

export interface Participant {
  id: string;
  session_id: string;
  user_id?: string;
  display_name: string;
  vehicle_color: string;
  team_id?: string;
  current_position: number;
  current_lap: number;
  checkpoints_passed: number;
  correct_answers: number;
  total_questions: number;
  total_time_ms: number;
  final_position?: number;
  achievements: string[];
  created_at: string;
}

export interface Session {
  id: string;
  code: string;
  track_id: string;
  question_set_ids: string[];
  host_id: string;
  rules: SessionRules;
  status: 'waiting' | 'countdown' | 'active' | 'paused' | 'finished';
  participants: Participant[];
  created_at: string;
  started_at?: string;
  finished_at?: string;
}

// Racing
export interface VehiclePosition {
  user_id: string;
  x: number;
  y: number;
  rotation: number;
  velocity: number;
}

export interface RacingState {
  session_id: string;
  participant_id: string;
  vehicle_position: VehiclePosition;
  current_lap: number;
  checkpoints_passed: number;
  power_ups: PowerUp[];
  current_time_ms: number;
}

// Gamification
export interface PowerUp {
  id: string;
  type: 'nitro' | 'shield' | 'shortcut' | 'freeze' | 'lifeline';
  active: boolean;
  timestamp?: number;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  session_id?: string;
}

// Analytics
export interface QuestionResponse {
  id: string;
  session_id: string;
  participant_id: string;
  question_id: string;
  answer_index: number;
  is_correct: boolean;
  time_taken_ms: number;
  timestamp: string;
}

export interface SessionAnalytics {
  session_id: string;
  total_participants: number;
  completion_rate: number;
  average_accuracy: number;
  average_time_ms: number;
  most_answered_question: string;
  least_answered_question: string;
  question_performance: Record<string, { correct: number; total: number }>;
}
