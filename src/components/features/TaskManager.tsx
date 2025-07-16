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
  Clock, 
  BarChart3, 
  Target,
  Lock,
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
  Home
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${user?.id}`);
    const savedNotes = localStorage.getItem(`taskNotes_${user?.id}`);
    const savedTimers = localStorage.getItem(`taskTimers_${user?.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedTimers) {
      setTimers(JSON.parse(savedTimers));
    }
  }, [user?.id]);

  // Save tasks to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(tasks));
      localStorage.setItem(`taskNotes_${user?.id}`, JSON.stringify(notes));
      localStorage.setItem(`taskTimers_${user?.id}`, JSON.stringify(timers));
    }
  }, [tasks, notes, timers, user?.id]);

  // Check for overdue tasks
  useEffect(() => {
    const checkOverdueTasks = () => {
      const overdueTasks = tasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
      );
      
      overdueTasks.forEach(task => {
        sendNotification('Task Overdue', `"${task.title}" is overdue!`);
      });
    };

    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [tasks]);

  // Handle file uploads
  const handleFileUpload = (taskId: string, files: FileList) => {
    const newAttachments: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newAttachments.push(e.target?.result as string);
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, attachments: [...task.attachments, ...newAttachments] }
            : task
        ));
      };
      reader.readAsDataURL(file);
    });
  };

  // Add note to task
  const addNote = (taskId: string, content: string, type: 'note' | 'comment' | 'update' = 'note') => {
    const note: TaskNote = {
      id: Date.now().toString(),
      taskId,
      content,
      date: new Date(),
      type,
      author: user?.name
    };
    setNotes([...notes, note]);
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

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendNotification('Notifications Enabled', 'You will now receive task reminders!');
      }
    }
  };

  // Start/stop timer for task
  const toggleTimer = (taskId: string) => {
    if (timerActive === taskId) {
      setTimerActive(null);
      // Save time spent
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, timeSpent: (task.timeSpent || 0) + (timers[taskId] || 0) }
          : task
      ));
      setTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[taskId];
        return newTimers;
      });
    } else {
      setTimerActive(taskId);
    }
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      status: newTask.status,
      category: newTask.category,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdAt: new Date(),
      estimatedTime: newTask.estimatedTime,
      tags: newTask.tags,
      attachments: [],
      notes: [],
      assignee: user?.name,
      reminderTime: newTask.reminderTime,
      reminderEnabled: newTask.reminderEnabled,
      recurring: newTask.recurring,
      subtasks: [],
      timeSpent: 0,
      lastUpdated: new Date()
    };

    setTasks([...tasks, task]);
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
    
    sendNotification('Task Created', `"${task.title}" has been added to your tasks!`);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        return {
          ...task,
          completed,
          completedAt: completed ? new Date() : undefined,
          status: completed ? 'Done' : 'Todo',
          lastUpdated: new Date()
        };
      }
      return task;
    }));
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status, lastUpdated: new Date() }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setNotes(notes.filter(note => note.taskId !== taskId));
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
                            onClick={() => {
                              setSelectedTask(task);
                              setShowTaskDetails(true);
                            }}
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
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskDetails(true);
                      }}
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
    </div>
  );
}; 