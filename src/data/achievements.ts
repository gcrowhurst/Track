import type { Achievement } from '../types';

/**
 * Predefined Achievements for Circuit Challenge
 * These are inserted into the database on setup
 */

export const ACHIEVEMENTS: Omit<Achievement, 'id'>[] = [
  {
    code: 'perfect_lap',
    name: 'Perfect Lap',
    description: 'Answer all questions correctly in a single lap',
    icon: '🏆',
    rarity: 'epic',
  },
  {
    code: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete the fastest single lap in a session',
    icon: '🚀',
    rarity: 'rare',
  },
  {
    code: 'knowledge_king',
    name: 'Knowledge Champion',
    description: 'Achieve the highest accuracy score in a session',
    icon: '🧠',
    rarity: 'epic',
  },
  {
    code: 'comeback_champion',
    name: 'Comeback Champion',
    description: 'Recover from last place to finish in top 3',
    icon: '💪',
    rarity: 'legendary',
  },
  {
    code: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Answer 5 questions correctly in a row',
    icon: '🎯',
    rarity: 'rare',
  },
  {
    code: 'team_player',
    name: 'Team Player',
    description: 'Help your team win in Team Relay mode',
    icon: '🤝',
    rarity: 'common',
  },
  {
    code: 'power_user',
    name: 'Power User',
    description: 'Use all available power-up types in a single session',
    icon: '⚡',
    rarity: 'rare',
  },
  {
    code: 'subject_expert_engine',
    name: 'Engine Expert',
    description: 'Achieve 100% accuracy on engine-related questions',
    icon: '🔧',
    rarity: 'epic',
  },
  {
    code: 'subject_expert_brakes',
    name: 'Brake Specialist',
    description: 'Achieve 100% accuracy on brake system questions',
    icon: '🛑',
    rarity: 'epic',
  },
  {
    code: 'subject_expert_electrical',
    name: 'Electrical Wizard',
    description: 'Achieve 100% accuracy on electrical system questions',
    icon: '⚡',
    rarity: 'epic',
  },
  {
    code: 'first_place',
    name: 'Champion',
    description: 'Finish in first place',
    icon: '🥇',
    rarity: 'common',
  },
  {
    code: 'podium_finish',
    name: 'Podium Finisher',
    description: 'Finish in the top 3',
    icon: '🏅',
    rarity: 'common',
  },
  {
    code: 'participation',
    name: 'Participant',
    description: 'Complete your first race',
    icon: '🎖️',
    rarity: 'common',
  },
  {
    code: 'veteran',
    name: 'Veteran Racer',
    description: 'Complete 10 races',
    icon: '🏁',
    rarity: 'rare',
  },
  {
    code: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Complete 50 races',
    icon: '🎖️',
    rarity: 'epic',
  },
  {
    code: 'legend',
    name: 'Racing Legend',
    description: 'Complete 100 races',
    icon: '👑',
    rarity: 'legendary',
  },
  {
    code: 'quick_thinker',
    name: 'Quick Thinker',
    description: 'Answer a question in under 5 seconds',
    icon: '⚡',
    rarity: 'common',
  },
  {
    code: 'no_mistakes',
    name: 'Flawless Victory',
    description: 'Complete an entire session without a single wrong answer',
    icon: '💎',
    rarity: 'legendary',
  },
  {
    code: 'overtake_master',
    name: 'Overtake Master',
    description: 'Overtake 5 opponents in a single race',
    icon: '🏎️',
    rarity: 'rare',
  },
  {
    code: 'consistent_performer',
    name: 'Consistent Performer',
    description: 'Maintain the same position for 3 consecutive laps',
    icon: '📊',
    rarity: 'common',
  },
];

export default ACHIEVEMENTS;
