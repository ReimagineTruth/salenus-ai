import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mdbuzyvhmgjaqjezpafj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYnV6eXZobWdqYXFqZXpwYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODEyMDEsImV4cCI6MjA2ODI1NzIwMX0.zfz0T5prk-By0C352oFDvXQyQ8sXmWEveZ03S0h5Ing';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          plan: 'Free' | 'Basic' | 'Pro' | 'Premium';
          plan_expiry: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          has_paid: boolean;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          plan?: 'Free' | 'Basic' | 'Pro' | 'Premium';
          plan_expiry?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          has_paid?: boolean;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          plan?: 'Free' | 'Basic' | 'Pro' | 'Premium';
          plan_expiry?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          has_paid?: boolean;
          avatar_url?: string | null;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          streak: number;
          total_days: number;
          completed_today: boolean;
          goal: number;
          category: string;
          created_at: string;
          last_completed: string | null;
          best_streak: number;
          weekly_progress: number[];
          monthly_progress: number[];
          yearly_progress: number[];
          images: string[];
          notes: string[];
          reminder_time: string | null;
          reminder_enabled: boolean;
          difficulty: 'Easy' | 'Medium' | 'Hard';
          priority: 'Low' | 'Medium' | 'High';
          tags: string[];
          milestones: any[];
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          streak?: number;
          total_days?: number;
          completed_today?: boolean;
          goal: number;
          category: string;
          created_at?: string;
          last_completed?: string | null;
          best_streak?: number;
          weekly_progress?: number[];
          monthly_progress?: number[];
          yearly_progress?: number[];
          images?: string[];
          notes?: string[];
          reminder_time?: string | null;
          reminder_enabled?: boolean;
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          priority?: 'Low' | 'Medium' | 'High';
          tags?: string[];
          milestones?: any[];
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          streak?: number;
          total_days?: number;
          completed_today?: boolean;
          goal?: number;
          category?: string;
          created_at?: string;
          last_completed?: string | null;
          best_streak?: number;
          weekly_progress?: number[];
          monthly_progress?: number[];
          yearly_progress?: number[];
          images?: string[];
          notes?: string[];
          reminder_time?: string | null;
          reminder_enabled?: boolean;
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          priority?: 'Low' | 'Medium' | 'High';
          tags?: string[];
          milestones?: any[];
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          completed: boolean;
          priority: 'Low' | 'Medium' | 'High' | 'Urgent';
          status: 'Todo' | 'In Progress' | 'Review' | 'Done';
          category: string;
          due_date: string | null;
          created_at: string;
          completed_at: string | null;
          estimated_time: number | null;
          actual_time: number | null;
          tags: string[];
          attachments: string[];
          notes: string[];
          assignee: string | null;
          reminder_time: string | null;
          reminder_enabled: boolean;
          recurring: 'Daily' | 'Weekly' | 'Monthly' | 'None';
          subtasks: any[];
          time_spent: number;
          last_updated: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          completed?: boolean;
          priority: 'Low' | 'Medium' | 'High' | 'Urgent';
          status: 'Todo' | 'In Progress' | 'Review' | 'Done';
          category: string;
          due_date?: string | null;
          created_at?: string;
          completed_at?: string | null;
          estimated_time?: number | null;
          actual_time?: number | null;
          tags?: string[];
          attachments?: string[];
          notes?: string[];
          assignee?: string | null;
          reminder_time?: string | null;
          reminder_enabled?: boolean;
          recurring?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
          subtasks?: any[];
          time_spent?: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          completed?: boolean;
          priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
          status?: 'Todo' | 'In Progress' | 'Review' | 'Done';
          category?: string;
          due_date?: string | null;
          created_at?: string;
          completed_at?: string | null;
          estimated_time?: number | null;
          actual_time?: number | null;
          tags?: string[];
          attachments?: string[];
          notes?: string[];
          assignee?: string | null;
          reminder_time?: string | null;
          reminder_enabled?: boolean;
          recurring?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
          subtasks?: any[];
          time_spent?: number;
          last_updated?: string;
        };
      };
      habit_notes: {
        Row: {
          id: string;
          habit_id: string;
          content: string;
          date: string;
          mood: number | null;
          energy: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          content: string;
          date?: string;
          mood?: number | null;
          energy?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          content?: string;
          date?: string;
          mood?: number | null;
          energy?: number | null;
          created_at?: string;
        };
      };
      task_notes: {
        Row: {
          id: string;
          task_id: string;
          content: string;
          date: string;
          type: 'note' | 'comment' | 'update';
          author: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          content: string;
          date?: string;
          type?: 'note' | 'comment' | 'update';
          author?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          content?: string;
          date?: string;
          type?: 'note' | 'comment' | 'update';
          author?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'habit' | 'task' | 'reminder' | 'system';
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'habit' | 'task' | 'reminder' | 'system';
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'habit' | 'task' | 'reminder' | 'system';
          read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']; 