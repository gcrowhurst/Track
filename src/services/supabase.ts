import { createClient } from '@supabase/supabase-js';

// Initialize with your Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for common operations
export const supabaseService = {
  // Auth
  auth: {
    signUp: (email: string, password: string) =>
      supabase.auth.signUp({ email, password }),
    signIn: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    getSession: () => supabase.auth.getSession(),
  },

  // Questions
  questions: {
    getAll: () => supabase.from('questions').select('*'),
    getById: (id: string) =>
      supabase.from('questions').select('*').eq('id', id).single(),
    create: (question: any) =>
      supabase.from('questions').insert([question]).select(),
    update: (id: string, question: any) =>
      supabase.from('questions').update(question).eq('id', id).select(),
    delete: (id: string) => supabase.from('questions').delete().eq('id', id),
    searchByTopic: (topic: string) =>
      supabase.from('questions').select('*').eq('topic', topic),
  },

  // Tracks
  tracks: {
    getAll: () => supabase.from('tracks').select('*'),
    getById: (id: string) =>
      supabase.from('tracks').select('*').eq('id', id).single(),
    create: (track: any) =>
      supabase.from('tracks').insert([track]).select(),
    update: (id: string, track: any) =>
      supabase.from('tracks').update(track).eq('id', id).select(),
    delete: (id: string) => supabase.from('tracks').delete().eq('id', id),
  },

  // Sessions
  sessions: {
    getAll: () => supabase.from('sessions').select('*'),
    getById: (id: string) =>
      supabase.from('sessions').select('*').eq('id', id).single(),
    getByCode: (code: string) =>
      supabase.from('sessions').select('*').eq('code', code).single(),
    create: (session: any) =>
      supabase.from('sessions').insert([session]).select(),
    update: (id: string, session: any) =>
      supabase.from('sessions').update(session).eq('id', id).select(),
    delete: (id: string) => supabase.from('sessions').delete().eq('id', id),
  },

  // Participants
  participants: {
    getBySession: (sessionId: string) =>
      supabase.from('session_participants').select('*').eq('session_id', sessionId),
    create: (participant: any) =>
      supabase.from('session_participants').insert([participant]).select(),
    update: (id: string, participant: any) =>
      supabase.from('session_participants').update(participant).eq('id', id).select(),
  },

  // Profiles
  profiles: {
    getById: (id: string) =>
      supabase.from('profiles').select('*').eq('id', id).single(),
    create: (profile: any) =>
      supabase.from('profiles').insert([profile]).select(),
    update: (id: string, profile: any) =>
      supabase.from('profiles').update(profile).eq('id', id).select(),
  },

  // Storage
  storage: {
    uploadImage: (bucket: string, path: string, file: File) =>
      supabase.storage.from(bucket).upload(path, file),
    deleteImage: (bucket: string, path: string) =>
      supabase.storage.from(bucket).remove([path]),
    getPublicUrl: (bucket: string, path: string) =>
      supabase.storage.from(bucket).getPublicUrl(path),
  },

  // Realtime Channels
  realtimeChannels: {
    subscribeToSession: (sessionCode: string, callback: (payload: any) => void) => {
      return supabase.channel(`session:${sessionCode}`).on(
        'broadcast',
        { event: '*' },
        callback
      ).subscribe();
    },
    sendPositionUpdate: (sessionCode: string, userId: string, position: any) => {
      return supabase.channel(`session:${sessionCode}`).send({
        type: 'broadcast',
        event: 'position',
        payload: { user_id: userId, position },
      });
    },
  },
};

export default supabase;
