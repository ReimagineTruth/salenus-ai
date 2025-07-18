import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Check, 
  X, 
  Calendar, 
  CKey, 
  BarChart3, 
  Target,
  Key,
  ArrowUp,
  TrendingUp,
  Award,
  Zap,
  List,
  BookOpen,
  Upload,
  Image,
  Bell,
  Settings,
  Download,
  Share2,
  Edit,
  Trash2,
  Camera,
  FileText,
  Star,
  Trophy,
  Calendar as CalendarIcon,
  Activity,
  Target as TargetIcon,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Circle,
  Flag,
  Tag,
  Folder,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Briefcase,
  User,
  Heart,
  Home,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DataService } from '@/lib/data-service';
import type { Task as SupabaseTask, TaskNote as SupabaseTaskNote } from '@/lib/supabase';
import { DataManagementPanel } from '../DataManagementPanel';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  tags: string[];
  attachments: string[];
  notes: string[];
  assignee?: string;
  reminderTime?: string;
  reminderEnabled: boolean;
  recurring?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  subtasks: { id: string; title: string; completed: boolean }[];
  timeSpent: number; // in minutes
  lastUpdated: Date;
}

interface TaskNote {
  id: string;
  taskId: string;
  content: string;
  date: Date;
  type: 'note' | 'comment' | 'update';
  author?: string;
}

export const TaskManager: React.FC = () => {
  const { user, hasFeature, upgradePlan } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'Medium' as const,
    status: 'Todo' as const,
    category: 'Work',
    dueDate: '',
    estimatedTime: 30,
    tags: [] as string[],
    reminderTime: '09:00',
    reminderEnabled: true,
    recurring: 'None' as const
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('board');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, time: Date}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [timerActive, setTimerActive] = useState<string | null>(null);
  const [timers, setTimers] = useState<{[key: string]: number}>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'Medium' as const,
    status: 'Todo' as const,
    category: 'Work',
    dueDate: '',
    estimatedTime: 30,
    tags: [] as string[],
    reminderTime: '09:00',
    reminderEnabled: true,
    recurring: 'None' as const
  });

  const categories = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Finance', 'Home', 'Social'];
  const statuses = ['All', 'Todo', 'In Progress', 'Review', 'Done'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];
  const recurringOptions = ['None', 'Daily', 'Weekly', 'Monthly'];

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer for active tasks
  useEffect(() => {
    if (timerActive) {
      const interval = setInterval(() => {
        setTimers(prev => ({
          ...prev,
          [timerActive]: (prev[timerActive] || 0) + 1
        }));
      }, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [timerActive]);

  // Load tasks from Supabase
  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user?.id]);

  const loadTasks = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const supabaseTasks = await DataService.getTasks(user.id);
      const transformedTasks: Task[] = supabaseTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        status: task.status,
        category: task.category,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
        estimatedTime: task.estimated_time,
        actualTime: task.actual_time,
        tags: task.tags,
        attachments: task.attachments,
        notes: task.notes,
        assignee: task.assignee,
        reminderTime: task.reminder_time,
        reminderEnabled: task.reminder_enabled,
        recurring: task.recurring,
        subtasks: task.subtasks,
        timeSpent: task.time_spent,
        lastUpdated: new Date(task.last_updated)
      }));
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load notes for a specific task
  const loadTaskNotes = async (taskId: string) => {
    try {
      const supabaseNotes = await DataService.getTaskNotes(taskId);
      const transformedNotes: TaskNote[] = supabaseNotes.map(note => ({
        id: note.id,
        taskId: note.task_id,
        content: note.content,
        date: new Date(note.date),
        type: note.type,
        author: note.author || undefined
      }));
      setNotes(transformedNotes);
    } catch (error) {
      console.error('Error loading task notes:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const subscriptions = DataService.subscribeToUserData(user.id, {
      onTaskChange: (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
          loadTasks(); // Reload tasks when changes occur
        }
      }
    });

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [user?.id]);

  // Check for overdue tasks
  useEffect(() => {
    const checkOverdueTasks = async () => {
      try {
        const overdueTasks = await DataService.checkOverdueTasks();
        overdueTasks.forEach(task => {
          sendNotification('Task Overdue', `"${task.title}" is overdue!`);
        });
      } catch (error) {
        console.error('Error checking overdue tasks:', error);
      }
    };

    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Handle file uploads
  const handleFileUpload = async (taskId: string, files: FileList) => {
    try {
      const newAttachments: string[] = [];
      for (const file of Array.from(files)) {
        const attachmentUrl = await DataService.uploadTaskAttachment(taskId, file);
        if (attachmentUrl) {
          newAttachments.push(attachmentUrl);
        }
      }
      
      if (newAttachments.length > 0) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          await DataService.updateTask(taskId, {
            attachments: [...task.attachments, ...newAttachments]
          });
          await loadTasks(); // Reload to get updated data
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  // Add note to task
  const addNote = async (taskId: string, content: string, type: 'note' | 'comment' | 'update' = 'note') => {
    try {
      await DataService.addTaskNote({
        taskId,
        content,
        type,
        author: user?.name
      });
      await loadTaskNotes(taskId);
    } catch (error) {
      console.error('Error adding task note:', error);
    }
  };

  // Send notification
  const sendNotification = (title: string, message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
    
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      time: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendNotification('Notifications Enabled', 'You will now receive task reminders!');
      }
    }
  };

  const toggleTimer = (taskId: string) => {
    if (timerActive === taskId) {
      setTimerActive(null);
      // Update task with time spent
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const timeSpent = timers[taskId] || 0;
        DataService.updateTask(taskId, {
          time_spent: (task.timeSpent || 0) + timeSpent
        });
      }
    } else {
      setTimerActive(taskId);
    }
  };

  const addTask = async () => {
    if (!user?.id || !newTask.title.trim()) return;

    try {
      setLoading(true);
      const task = await DataService.createTask({
        userId: user.id,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        category: newTask.category,
        dueDate: newTask.dueDate,
        estimatedTime: newTask.estimatedTime,
        tags: newTask.tags,
        reminderTime: newTask.reminderTime,
        reminderEnabled: newTask.reminderEnabled,
        recurring: newTask.recurring
      });

      if (task) {
        setNewTask({ 
          title: '', 
          description: '', 
          priority: 'Medium',
          status: 'Todo',
          category: 'Work',
          dueDate: '',
          estimatedTime: 30,
          tags: [],
          reminderTime: '09:00',
          reminderEnabled: true,
          recurring: 'None'
        });
        setShowAddForm(false);
        await loadTasks(); // Reload tasks
        sendNotification('Task Created', `${newTask.title} has been added to your tasks!`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const completed = !task.completed;
      const updatedTask = await DataService.toggleTaskCompletion(taskId, completed);
      
      if (updatedTask) {
        await loadTasks(); // Reload tasks to get updated data
        
        if (completed) {
          sendNotification('Task Completed!', `Great job completing "${task.title}"! ✅`);
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      await DataService.updateTask(taskId, { status });
      await loadTasks(); // Reload tasks
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const success = await DataService.deleteTask(taskId);
      if (success) {
        await loadTasks(); // Reload tasks
        sendNotification('Task Deleted', 'Task has been removed from your manager.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Edit task functionality
  const editTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const success = await DataService.updateTask(taskId, updates);
      if (success) {
        await loadTasks(); // Reload tasks
        sendNotification('Task Updated', 'Task has been updated successfully.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Open edit modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      estimatedTime: task.estimatedTime || 30,
      tags: task.tags || [],
      reminderTime: task.reminderTime || '09:00',
      reminderEnabled: task.reminderEnabled,
      recurring: task.recurring || 'None'
    });
    setShowEditModal(true);
  };

  // Save edited task
  const saveEditedTask = async () => {
    if (!editingTask) return;

    try {
      const updates = {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        status: editForm.status,
        category: editForm.category,
        due_date: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : null,
        estimated_time: editForm.estimatedTime,
        tags: editForm.tags,
        reminder_time: editForm.reminderTime,
        reminder_enabled: editForm.reminderEnabled,
        recurring: editForm.recurring
      };

      const success = await DataService.updateTask(editingTask.id, updates);
      if (success) {
        await loadTasks(); // Reload tasks
        setShowEditModal(false);
        setEditingTask(null);
        sendNotification('Task Updated', 'Task has been updated successfully.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Add tag to task
  const addTaskTag = (tag: string) => {
    if (tag && !editForm.tags.includes(tag)) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  // Remove tag from task
  const removeTaskTag = (tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Restart task data (reset progress and time tracking)
  const restartTaskData = async (taskId: string) => {
    if (!confirm('Are you sure you want to restart this task? This will reset all progress and time tracking.')) return;

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updates = {
        completed: false,
        status: 'Todo',
        actual_time: 0,
        time_spent: 0,
        completed_at: null,
        last_updated: new Date().toISOString(),
        subtasks: task.subtasks.map(subtask => ({ ...subtask, completed: false }))
      };

      const success = await DataService.updateTask(taskId, updates);
      if (success) {
        await loadTasks(); // Reload tasks
        sendNotification('Task Restarted', 'Task data has been reset successfully.');
      }
    } catch (error) {
      console.error('Error restarting task:', error);
    }
  };

  // Export task data
  const exportTaskData = async (taskId?: string) => {
    try {
      const dataToExport = taskId 
        ? tasks.filter(t => t.id === taskId)
        : tasks;

      const exportData = {
        exportDate: new Date().toISOString(),
        user: user?.email,
        tasks: dataToExport.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          priority: task.priority,
          status: task.status,
          category: task.category,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          estimatedTime: task.estimatedTime,
          actualTime: task.actualTime,
          tags: task.tags,
          attachments: task.attachments,
          notes: task.notes,
          assignee: task.assignee,
          reminderTime: task.reminderTime,
          reminderEnabled: task.reminderEnabled,
          recurring: task.recurring,
          subtasks: task.subtasks,
          timeSpent: task.timeSpent,
          lastUpdated: task.lastUpdated
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `task-data-${taskId || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      sendNotification('Data Exported', 'Task data has been exported successfully.');
    } catch (error) {
      console.error('Error exporting task data:', error);
    }
  };

  // Import task data
  const importTaskData = async (file: File) => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      if (importedData.tasks && Array.isArray(importedData.tasks)) {
        // Process imported tasks
        for (const importedTask of importedData.tasks) {
          const taskData = {
            userId: user!.id,
            title: importedTask.title,
            description: importedTask.description || '',
            priority: importedTask.priority || 'Medium',
            status: importedTask.status || 'Todo',
            category: importedTask.category || 'Work',
            dueDate: importedTask.dueDate,
            estimatedTime: importedTask.estimatedTime || 30,
            tags: importedTask.tags || [],
            reminderTime: importedTask.reminderTime || '09:00',
            reminderEnabled: importedTask.reminderEnabled !== false,
            recurring: importedTask.recurring || 'None'
          };

          await DataService.createTask(taskData);
        }

        await loadTasks(); // Reload tasks
        sendNotification('Data Imported', `${importedData.tasks.length} tasks have been imported successfully.`);
      }
    } catch (error) {
      console.error('Error importing task data:', error);
      sendNotification('Import Error', 'Failed to import task data. Please check the file format.');
    }
  };

  // Clear all task data
  const clearAllTaskData = async () => {
    if (!confirm('Are you sure you want to clear ALL task data? This action cannot be undone.')) return;

    try {
      for (const task of tasks) {
        await DataService.deleteTask(task.id);
      }
      
      setTasks([]);
      sendNotification('Data Cleared', 'All task data has been cleared successfully.');
    } catch (error) {
      console.error('Error clearing task data:', error);
    }
  };

  // Duplicate task
  const duplicateTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const taskData = {
        userId: user!.id,
        title: `${task.title} (Copy)`,
        description: task.description,
        priority: task.priority,
        status: 'Todo', // Reset status for duplicate
        category: task.category,
        dueDate: task.dueDate,
        estimatedTime: task.estimatedTime,
        tags: task.tags,
        reminderTime: task.reminderTime || '09:00',
        reminderEnabled: task.reminderEnabled,
        recurring: task.recurring
      };

      await DataService.createTask(taskData);
      await loadTasks(); // Reload tasks
      sendNotification('Task Duplicated', 'Task has been duplicated successfully.');
    } catch (error) {
      console.error('Error duplicating task:', error);
    }
  };

  // Archive task (soft delete)
  const archiveTask = async (taskId: string) => {
    try {
      const updates = {
        archived: true,
        archived_at: new Date().toISOString()
      };

      const success = await DataService.updateTask(taskId, updates);
      if (success) {
        await loadTasks(); // Reload tasks
        sendNotification('Task Archived', 'Task has been archived successfully.');
      }
    } catch (error) {
      console.error('Error archiving task:', error);
    }
  };

  // Restore archived task
  const restoreTask = async (taskId: string) => {
    try {
      const updates = {
        archived: false,
        archived_at: null
      };

      const success = await DataService.updateTask(taskId, updates);
      if (success) {
        await loadTasks(); // Reload tasks
        sendNotification('Task Restored', 'Task has been restored successfully.');
      }
    } catch (error) {
      console.error('Error restoring task:', error);
    }
  };

  // Share task data
  const shareTaskData = () => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalTimeSpent = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);

    const shareText = `Task Manager Stats:
- Total Tasks: ${totalTasks}
- Completed: ${completedTasks}
- Completion Rate: ${completionRate}%
- Total Time Spent: ${Math.round(totalTimeSpent / 60)} hours
- Active Tasks: ${tasks.filter(t => t.status === 'In Progress').length}`;

    if (navigator.share) {
      navigator.share({
        title: 'Task Manager Stats',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Task stats copied to clipboard!');
    }
  };

  // Backup task data
  const backupTaskData = () => {
    const backupData = {
      backupDate: new Date().toISOString(),
      feature: 'TaskManager',
      data: {
        tasks,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        totalTimeSpent: tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0)
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'dueDate':
        aValue = a.dueDate || new Date('9999-12-31');
        bValue = b.dueDate || new Date('9999-12-31');
        break;
      case 'priority':
        const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'createdAt':
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length;
  const totalTimeSpent = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const maxTasks = user?.plan === 'Basic' ? 20 : user?.plan === 'Pro' ? 100 : 500;

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'High': return <Flag className="h-4 w-4 text-orange-500" />;
      case 'Medium': return <Circle className="h-4 w-4 text-yellow-500" />;
      case 'Low': return <Circle className="h-4 w-4 text-gray-500" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Todo': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Work': return <Briefcase className="h-4 w-4" />;
      case 'Personal': return <User className="h-4 w-4" />;
      case 'Health': return <Heart className="h-4 w-4" />;
      case 'Learning': return <BookOpen className="h-4 w-4" />;
      case 'Finance': return <DollarSign className="h-4 w-4" />;
      case 'Home': return <Home className="h-4 w-4" />;
      case 'Social': return <Users className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
          <CardDescription>Please sign in to access task management</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with real-time clock */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Task Manager</h2>
          <p className="text-slate-600">Organize and track your tasks efficiently</p>
          <p className="text-sm text-gray-500 mt-1">
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={user.plan === 'Premium' ? 'bg-purple-600' : user.plan === 'Pro' ? 'bg-indigo-600' : 'bg-blue-600'}>
            {user.plan} Plan
          </Badge>
          <Button onClick={requestNotificationPermission} variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Enable Notifications
          </Button>
        </div>
      </div>

      {/* Data Management Panel */}
      <DataManagementPanel
        featureName="Task Manager"
        dataCount={tasks.length}
        onExport={() => exportTaskData()}
        onImport={importTaskData}
        onClearAll={clearAllTaskData}
        onRestartData={() => {
          if (tasks.length > 0) {
            restartTaskData(tasks[0].id);
          }
        }}
        onDuplicate={() => {
          if (tasks.length > 0) {
            duplicateTask(tasks[0].id);
          }
        }}
        onArchive={() => {
          if (tasks.length > 0) {
            archiveTask(tasks[0].id);
          }
        }}
        onRestore={() => {
          if (tasks.length > 0) {
            restoreTask(tasks[0].id);
          }
        }}
        onShare={shareTaskData}
        onBackup={backupTaskData}
        hasData={tasks.length > 0}
        canEdit={true}
        canDelete={true}
        canArchive={true}
        canShare={true}
        canBackup={true}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}/{maxTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{overdueTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map(priority => (
                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'board' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('board')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Tasks Board/List */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Todo', 'In Progress', 'Review', 'Done'].map(status => (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className={getStatusColor(status)}>{status}</Badge>
                  <span className="text-sm text-gray-500">
                    ({sortedTasks.filter(task => task.status === status).length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sortedTasks.filter(task => task.status === status).map(task => (
                  <Card key={task.id} className="p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{task.title}</h4>
                          {getPriorityIcon(task.priority)}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getCategoryIcon(task.category)}
                          <span className="text-xs text-gray-500">{task.category}</span>
                          {task.dueDate && (
                            <>
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleTimer(task.id)}
                            className={timerActive === task.id ? 'bg-red-100' : ''}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {timerActive === task.id ? 'Stop' : 'Start'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(task)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map(task => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {getPriorityIcon(task.priority)}
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {task.status}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {getCategoryIcon(task.category)}
                      <span>{task.category}</span>
                      {task.dueDate && (
                        <>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </>
                      )}
                      <Clock className="h-3 w-3" />
                      <span>{Math.round((task.timeSpent || 0) / 60)}h spent</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTimer(task.id)}
                      className={timerActive === task.id ? 'bg-red-100' : ''}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {timerActive === task.id ? 'Stop' : 'Start'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(task)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddForm && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add New Task</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Task Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Describe your task..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'All').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.filter(pri => pri !== 'All').map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Estimated Time (minutes)</Label>
                  <Input
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
              </div>
              <div>
                <Label>Recurring</Label>
                <Select value={newTask.recurring} onValueChange={(value) => setNewTask({...newTask, recurring: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newTask.reminderEnabled}
                  onCheckedChange={(checked) => setNewTask({...newTask, reminderEnabled: checked})}
                />
                <Label>Enable Reminder</Label>
              </div>
              {newTask.reminderEnabled && (
                <div>
                  <Label>Reminder Time</Label>
                  <Input
                    type="time"
                    value={newTask.reminderTime}
                    onChange={(e) => setNewTask({...newTask, reminderTime: e.target.value})}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={addTask} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {notifications.map(notification => (
            <Card key={notification.id} className="w-80">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Task
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label>Task Title</Label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Describe your task..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'All').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.filter(status => status !== 'All').map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Priority and Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={editForm.priority} onValueChange={(value) => setEditForm({...editForm, priority: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.filter(pri => pri !== 'All').map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Estimated Time and Recurring */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Estimated Time (minutes)</Label>
                  <Input
                    type="number"
                    value={editForm.estimatedTime}
                    onChange={(e) => setEditForm({...editForm, estimatedTime: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
                <div>
                  <Label>Recurring</Label>
                  <Select value={editForm.recurring} onValueChange={(value) => setEditForm({...editForm, recurring: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {recurringOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reminder Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editForm.reminderEnabled}
                    onCheckedChange={(checked) => setEditForm({...editForm, reminderEnabled: checked})}
                  />
                  <Label>Enable Reminder</Label>
                </div>
                {editForm.reminderEnabled && (
                  <div>
                    <Label>Reminder Time</Label>
                    <Input
                      type="time"
                      value={editForm.reminderTime}
                      onChange={(e) => setEditForm({...editForm, reminderTime: e.target.value})}
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeTaskTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        addTaskTag(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a tag..."]') as HTMLInputElement;
                      if (input) {
                        addTaskTag(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={saveEditedTask} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}; 
