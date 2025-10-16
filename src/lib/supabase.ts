// Supabase Client Configuration
// Real-time database and authentication

import { createClient } from '@supabase/supabase-js';

// Environment variables (from .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'teacher' | 'parent' | 'admin';
          full_name: string | null;
          school: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      classrooms: {
        Row: {
          id: string;
          teacher_id: string;
          name: string;
          code: string;
          school: string;
          grade_level: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['classrooms']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['classrooms']['Insert']>;
      };
      students: {
        Row: {
          id: string;
          classroom_id: string;
          first_name: string;
          last_name: string;
          grade: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['students']['Insert']>;
      };
      student_progress: {
        Row: {
          id: string;
          student_id: string;
          lessons_completed: string[];
          badges_earned: string[];
          macros_identified: number;
          field_observations: number;
          game_scores: Record<string, number>;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['student_progress']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['student_progress']['Insert']>;
      };
      classroom_updates: {
        Row: {
          id: string;
          classroom_id: string;
          teacher_id: string;
          title: string;
          content: string;
          type: 'announcement' | 'photo' | 'video' | 'milestone';
          media_urls: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['classroom_updates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['classroom_updates']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          classroom_id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          volunteers_needed: number;
          volunteers_signed_up: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      parent_students: {
        Row: {
          parent_id: string;
          student_id: string;
          relationship: string;
          created_at: string;
        };
        Insert: Database['public']['Tables']['parent_students']['Row'];
        Update: Partial<Database['public']['Tables']['parent_students']['Insert']>;
      };
    };
  };
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Auth helpers
export async function signUp(email: string, password: string, userData: { 
  full_name: string; 
  role: 'teacher' | 'parent';
  school?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  if (error) throw error;
  
  // Create profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        role: userData.role,
        full_name: userData.full_name,
        school: userData.school || null,
      });
    
    if (profileError) throw profileError;
  }
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

