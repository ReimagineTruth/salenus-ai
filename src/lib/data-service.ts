import { SupabaseService } from './supabase-service';
import type { Habit, Task, HabitNote, TaskNote, Notification } from './supabase';

export class DataService {
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
  }) {
    const habit = await SupabaseService.createHabit(habitData);
    
    if (habit) {
      // Track analytics
      await SupabaseService.trackEvent({
        userId: habitData.userId,
        eventType: 'habit_created',
        eventData: { habitId: habit.id, category: habit.category }
      });

      // Create notification
      await SupabaseService.createNotification({
        userId: habitData.userId,
        title: 'Habit Created',
        message: `"${habit.name}" has been added to your tracker!`,
        type: 'habit'
      });
    }

    return habit;
  }

  static async getHabits(userId: string) {
    return await SupabaseService.getHabits(userId);
  }

  static async updateHabit(habitId: string, updates: Partial<Habit>) {
    const habit = await SupabaseService.updateHabit(habitId, updates);
    
    if (habit) {
      // Track analytics
      await SupabaseService.trackEvent({
        userId: habit.user_id,
        eventType: 'habit_updated',
        eventData: { habitId: habit.id, updates }
      });
    }

    return habit;
  }

  static async deleteHabit(habitId: string) {
    const habit = await SupabaseService.getHabit(habitId);
    const success = await SupabaseService.deleteHabit(habitId);
    
    if (success && habit) {
      // Track analytics
      await SupabaseService.trackEvent({
        userId: habit.user_id,
        eventType: 'habit_deleted',
        eventData: { habitId: habit.id, category: habit.category }
      });
    }

    return success;
  }

  static async toggleHabitCompletion(habitId: string, completed: boolean) {
    const habit = await SupabaseService.toggleHabitCompletion(habitId, completed);
    
    if (habit) {
      // Track analytics
      await SupabaseService.trackEvent({
        userId: habit.user_id,
        eventType: completed ? 'habit_completed' : 'habit_uncompleted',
        eventData: { habitId: habit.id, streak: habit.streak }
      });

      // Create notification for completion
      if (completed) {
        await SupabaseService.createNotification({
          userId: habit.user_id,
          title: 'Habit Completed!',
          message: `Great job completing "${habit.name}"! 🔥`,
          type: 'habit'
        });
      }
    }

    return habit;
  }

  static async addHabitNote(noteData: {
    habitId: string;
    content: string;
    mood?: number;
    energy?: number;
  }) {
    const note = await SupabaseService.createHabitNote(noteData);
    
    if (note) {
      const habit = await SupabaseService.getHabit(noteData.habitId);
      if (habit) {
        await SupabaseService.trackEvent({
          userId: habit.user_id,
          eventType: 'habit_note_added',
          eventData: { habitId: habit.id, noteId: note.id }
        });
      }
    }

    return note;
  }

  static async getHabitNotes(habitId: string) {
    return await SupabaseService.getHabitNotes(habitId);
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
  }) {
    const task = await SupabaseService.createTask(taskData);
    
    if (task) {
      // Track analytics
      await SupabaseService.trackEvent({
        userId: taskData.userId,
        eventType: 'task_created',
        eventData: { taskId: task.id, category: task.category, priority: task.priority }
      });

      // Create notification
      await SupabaseService.createNotification({
        userId: taskData.userId,
        title: 'Task Created',
        message: `"${task.title}" has been added to your tasks!`,
        type: 'task'
      });
    }

    return task;
  }

  static async getTasks(userId: string) {
    return await SupabaseService.getTasks(userId);
  }

  static async updateTask(taskId: string, updates: Partial<Task>) {
    const task = await SupabaseService.updateTask(taskId, updates);
    
    if (task) {
      // Track analytics
      await SupabaseService.trackEvent({
        userId: task.user_id,
        eventType: 'task_updated',
        eventData: { taskId: task.id, updates }
      });
    }

    return task;
  }

  static async deleteTask(taskId: string) {
    const task = await SupabaseService.getTask(taskId);
    const success = await SupabaseService.deleteTask(taskId);
    
    if (success && task) {
      // Track analytics
      await SupabaseService.trackEvent({
        userId: task.user_id,
        eventType: 'task_deleted',
        eventData: { taskId: task.id, category: task.category }
      });
    }

    return success;
  }

  static async toggleTaskCompletion(taskId: string, completed: boolean) {
    const task = await SupabaseService.toggleTaskCompletion(taskId, completed);
    
    if (task) {
      // Track analytics
      await SupabaseService.trackEvent({
        userId: task.user_id,
        eventType: completed ? 'task_completed' : 'task_uncompleted',
        eventData: { taskId: task.id, timeSpent: task.time_spent }
      });

      // Create notification for completion
      if (completed) {
        await SupabaseService.createNotification({
          userId: task.user_id,
          title: 'Task Completed!',
          message: `Great job completing "${task.title}"! ✅`,
          type: 'task'
        });
      }
    }

    return task;
  }

  static async addTaskNote(noteData: {
    taskId: string;
    content: string;
    type?: 'note' | 'comment' | 'update';
    author?: string;
  }) {
    const note = await SupabaseService.createTaskNote(noteData);
    
    if (note) {
      const task = await SupabaseService.getTask(noteData.taskId);
      if (task) {
        await SupabaseService.trackEvent({
          userId: task.user_id,
          eventType: 'task_note_added',
          eventData: { taskId: task.id, noteId: note.id }
        });
      }
    }

    return note;
  }

  static async getTaskNotes(taskId: string) {
    return await SupabaseService.getTaskNotes(taskId);
  }

  // Notification Management
  static async getNotifications(userId: string) {
    return await SupabaseService.getNotifications(userId);
  }

  static async markNotificationAsRead(notificationId: string) {
    return await SupabaseService.markNotificationAsRead(notificationId);
  }

  // Analytics and Insights
  static async getUserStats(userId: string) {
    const habits = await SupabaseService.getHabits(userId);
    const tasks = await SupabaseService.getTasks(userId);

    const totalHabits = habits.length;
    const completedHabitsToday = habits.filter(h => h.completed_today).length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const overdueTasks = tasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && !t.completed
    ).length;

    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
    const totalTimeSpent = tasks.reduce((sum, t) => sum + (t.time_spent || 0), 0);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalHabits,
      completedHabitsToday,
      totalTasks,
      completedTasks,
      overdueTasks,
      averageStreak,
      totalTimeSpent,
      completionRate
    };
  }

  // Real-time subscriptions
  static subscribeToUserData(userId: string, callbacks: {
    onHabitChange?: (payload: any) => void;
    onTaskChange?: (payload: any) => void;
    onNotificationChange?: (payload: any) => void;
  }) {
    const subscriptions = [];

    if (callbacks.onHabitChange) {
      subscriptions.push(
        SupabaseService.subscribeToHabits(userId, callbacks.onHabitChange)
      );
    }

    if (callbacks.onTaskChange) {
      subscriptions.push(
        SupabaseService.subscribeToTasks(userId, callbacks.onTaskChange)
      );
    }

    if (callbacks.onNotificationChange) {
      subscriptions.push(
        SupabaseService.subscribeToNotifications(userId, callbacks.onNotificationChange)
      );
    }

    return subscriptions;
  }

  // File upload
  static async uploadHabitImage(habitId: string, file: File): Promise<string | null> {
    const path = `habits/${habitId}/${Date.now()}-${file.name}`;
    return await SupabaseService.uploadFile('habit-images', path, file);
  }

  static async uploadTaskAttachment(taskId: string, file: File): Promise<string | null> {
    const path = `tasks/${taskId}/${Date.now()}-${file.name}`;
    return await SupabaseService.uploadFile('task-attachments', path, file);
  }

  // Scheduled tasks
  static async checkOverdueTasks() {
    const overdueTasks = await SupabaseService.getOverdueTasks();
    
    for (const task of overdueTasks) {
      await SupabaseService.createNotification({
        userId: task.user_id,
        title: 'Task Overdue',
        message: `"${task.title}" is overdue!`,
        type: 'reminder'
      });
    }

    return overdueTasks;
  }

  static async resetDailyHabits() {
    return await SupabaseService.resetDailyHabits();
  }

  // Search and filtering
  static async searchHabits(userId: string, query: string) {
    const habits = await SupabaseService.getHabits(userId);
    return habits.filter(habit => 
      habit.name.toLowerCase().includes(query.toLowerCase()) ||
      habit.description?.toLowerCase().includes(query.toLowerCase()) ||
      habit.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async searchTasks(userId: string, query: string) {
    const tasks = await SupabaseService.getTasks(userId);
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description?.toLowerCase().includes(query.toLowerCase()) ||
      task.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Export data
  static async exportUserData(userId: string) {
    const habits = await SupabaseService.getHabits(userId);
    const tasks = await SupabaseService.getTasks(userId);
    const notifications = await SupabaseService.getNotifications(userId);

    return {
      habits,
      tasks,
      notifications,
      exportedAt: new Date().toISOString()
    };
  }

  // Import data
  static async importUserData(userId: string, data: any) {
    const results = {
      habits: { created: 0, errors: 0 },
      tasks: { created: 0, errors: 0 }
    };

    // Import habits
    if (data.habits && Array.isArray(data.habits)) {
      for (const habitData of data.habits) {
        try {
          const { user_id, ...habitFields } = habitData;
          await SupabaseService.createHabit({
            userId,
            ...habitFields
          });
          results.habits.created++;
        } catch (error) {
          console.error('Error importing habit:', error);
          results.habits.errors++;
        }
      }
    }

    // Import tasks
    if (data.tasks && Array.isArray(data.tasks)) {
      for (const taskData of data.tasks) {
        try {
          const { user_id, ...taskFields } = taskData;
          await SupabaseService.createTask({
            userId,
            ...taskFields
          });
          results.tasks.created++;
        } catch (error) {
          console.error('Error importing task:', error);
          results.tasks.errors++;
        }
      }
    }

    return results;
  }
} 