import { supabase } from './supabase';
import type { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];
type Habit = Database['public']['Tables']['habits']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type HabitNote = Database['public']['Tables']['habit_notes']['Row'];
type TaskNote = Database['public']['Tables']['task_notes']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

export class SupabaseService {
  // User Management
  static async createUser(userData: {
    email: string;
    name: string;
    plan?: 'Free' | 'Basic' | 'Pro' | 'Premium';
    authUserId: string;
  }): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userData.authUserId, // Use authUserId as the primary key
        email: userData.email,
        name: userData.name,
        plan: userData.plan || 'Free',
        has_paid: false,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data;
  }

  static async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return data;
  }

  // Habit Management
  static async createHabit(habitData: {
    userId: string;
    name: string;
    description?: string;
    goal?: number;
    category: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    priority?: 'Low' | 'Medium' | 'High';
    reminderTime?: string;
    reminderEnabled?: boolean;
  }): Promise<Habit | null> {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: habitData.userId,
        name: habitData.name,
        description: habitData.description || '',
        goal: habitData.goal || 1,
        category: habitData.category,
        difficulty: habitData.difficulty || 'Medium',
        priority: habitData.priority || 'Medium',
        reminder_time: habitData.reminderTime,
        reminder_enabled: habitData.reminderEnabled ?? true,
        streak: 0,
        total_days: 0,
        completed_today: false,
        best_streak: 0,
        weekly_progress: [0, 0, 0, 0, 0, 0, 0],
        monthly_progress: [],
        yearly_progress: [],
        images: [],
        notes: [],
        tags: [],
        milestones: []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating habit:', error);
      return null;
    }

    return data;
  }

  static async getHabits(userId: string): Promise<Habit[]> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching habits:', error);
        // Return empty array instead of throwing error
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching habits:', error);
      // Return empty array as fallback
      return [];
    }
  }

  static async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit | null> {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', habitId)
      .select()
      .single();

    if (error) {
      console.error('Error updating habit:', error);
      return null;
    }

    return data;
  }

  static async deleteHabit(habitId: string): Promise<boolean> {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);

    if (error) {
      console.error('Error deleting habit:', error);
      return false;
    }

    return true;
  }

  static async toggleHabitCompletion(habitId: string, completed: boolean): Promise<Habit | null> {
    const habit = await this.getHabit(habitId);
    if (!habit) return null;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate() - 1;
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

    const newStreak = completed ? habit.streak + 1 : Math.max(0, habit.streak - 1);
    const newBestStreak = Math.max(habit.best_streak, newStreak);
    const newTotalDays = completed ? habit.total_days + 1 : habit.total_days;

    // Update weekly progress
    const weeklyProgress = [...habit.weekly_progress];
    if (completed) {
      weeklyProgress[dayOfWeek] = (weeklyProgress[dayOfWeek] || 0) + 1;
    }

    // Update monthly progress
    const monthlyProgress = [...habit.monthly_progress];
    if (monthlyProgress.length <= dayOfMonth) {
      monthlyProgress.length = 31; // Ensure array has 31 elements
    }
    if (completed) {
      monthlyProgress[dayOfMonth] = (monthlyProgress[dayOfMonth] || 0) + 1;
    }

    // Update yearly progress
    const yearlyProgress = [...habit.yearly_progress];
    if (yearlyProgress.length <= dayOfYear) {
      yearlyProgress.length = 365; // Ensure array has 365 elements
    }
    if (completed) {
      yearlyProgress[dayOfYear] = (yearlyProgress[dayOfYear] || 0) + 1;
    }

    return this.updateHabit(habitId, {
      completed_today: completed,
      streak: newStreak,
      best_streak: newBestStreak,
      total_days: newTotalDays,
      last_completed: completed ? today.toISOString() : habit.last_completed,
      weekly_progress: weeklyProgress,
      monthly_progress: monthlyProgress,
      yearly_progress: yearlyProgress
    });
  }

  static async getHabit(habitId: string): Promise<Habit | null> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .single();

    if (error) {
      console.error('Error fetching habit:', error);
      return null;
    }

    return data;
  }

  // Task Management
  static async createTask(taskData: {
    userId: string;
    title: string;
    description?: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
    status?: 'Todo' | 'In Progress' | 'Review' | 'Done';
    category: string;
    dueDate?: string;
    estimatedTime?: number;
    tags?: string[];
    reminderTime?: string;
    reminderEnabled?: boolean;
    recurring?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  }): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: taskData.userId,
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'Medium',
        status: taskData.status || 'Todo',
        category: taskData.category,
        due_date: taskData.dueDate,
        estimated_time: taskData.estimatedTime,
        tags: taskData.tags || [],
        reminder_time: taskData.reminderTime,
        reminder_enabled: taskData.reminderEnabled ?? true,
        recurring: taskData.recurring || 'None',
        completed: false,
        time_spent: 0,
        attachments: [],
        notes: [],
        subtasks: []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return null;
    }

    return data;
  }

  static async getTasks(userId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        // Return empty array instead of throwing error
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching tasks:', error);
      // Return empty array as fallback
      return [];
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        last_updated: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return null;
    }

    return data;
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }

    return true;
  }

  static async toggleTaskCompletion(taskId: string, completed: boolean): Promise<Task | null> {
    return this.updateTask(taskId, {
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      status: completed ? 'Done' : 'Todo'
    });
  }

  static async getTask(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return null;
    }

    return data;
  }

  // Habit Notes Management
  static async createHabitNote(noteData: {
    habitId: string;
    content: string;
    mood?: number;
    energy?: number;
  }): Promise<HabitNote | null> {
    const { data, error } = await supabase
      .from('habit_notes')
      .insert({
        habit_id: noteData.habitId,
        content: noteData.content,
        mood: noteData.mood,
        energy: noteData.energy,
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating habit note:', error);
      return null;
    }

    return data;
  }

  static async getHabitNotes(habitId: string): Promise<HabitNote[]> {
    const { data, error } = await supabase
      .from('habit_notes')
      .select('*')
      .eq('habit_id', habitId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching habit notes:', error);
      return [];
    }

    return data || [];
  }

  // Task Notes Management
  static async createTaskNote(noteData: {
    taskId: string;
    content: string;
    type?: 'note' | 'comment' | 'update';
    author?: string;
  }): Promise<TaskNote | null> {
    const { data, error } = await supabase
      .from('task_notes')
      .insert({
        task_id: noteData.taskId,
        content: noteData.content,
        type: noteData.type || 'note',
        author: noteData.author,
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task note:', error);
      return null;
    }

    return data;
  }

  static async getTaskNotes(taskId: string): Promise<TaskNote[]> {
    const { data, error } = await supabase
      .from('task_notes')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching task notes:', error);
      return [];
    }

    return data || [];
  }

  // Notifications Management
  static async createNotification(notificationData: {
    userId: string;
    title: string;
    message: string;
    type?: 'habit' | 'task' | 'reminder' | 'system';
  }): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: notificationData.userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || 'system',
        read: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    return data;
  }

  static async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  }

  // Analytics
  static async trackEvent(eventData: {
    userId: string;
    eventType: string;
    eventData?: any;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('analytics')
      .insert({
        user_id: eventData.userId,
        event_type: eventData.eventType,
        event_data: eventData.eventData
      });

    if (error) {
      console.error('Error tracking event:', error);
      return false;
    }

    return true;
  }

  // Real-time subscriptions
  static subscribeToHabits(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`habits:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habits',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  static subscribeToTasks(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`tasks:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  static subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  // Utility functions
  static async resetDailyHabits(): Promise<boolean> {
    const { error } = await supabase.rpc('reset_daily_habits');
    
    if (error) {
      console.error('Error resetting daily habits:', error);
      return false;
    }

    return true;
  }

  static async getOverdueTasks(): Promise<{ task_id: string; user_id: string; title: string }[]> {
    const { data, error } = await supabase.rpc('check_overdue_tasks');
    
    if (error) {
      console.error('Error checking overdue tasks:', error);
      return [];
    }

    return data || [];
  }

  // File upload helper
  static async uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  }
} 