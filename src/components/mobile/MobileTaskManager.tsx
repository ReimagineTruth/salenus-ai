import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  ListTodo, 
  Calendar, 
  BarChart3, 
  Filter, 
  Search, 
  CheckCircle, 
  Circle, 
  Clock, 
  Star, 
  Camera, 
  MessageSquare, 
  MoreVertical,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Award,
  Zap,
  Heart,
  BookOpen,
  Settings,
  Share2,
  Download,
  Upload,
  Timer,
  AlertCircle,
  CheckSquare,
  Square
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  category: string;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
  estimatedTime: number | null;
  actualTime: number | null;
  tags: string[];
  notes: string[];
  assignee: string | null;
  reminderTime: string | null;
  reminderEnabled: boolean;
  recurring: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  subtasks: any[];
  timeSpent: number;
  lastUpdated: string;
}

interface TaskNote {
  id: string;
  taskId: string;
  content: string;
  date: string;
  type: 'note' | 'comment' | 'update';
  author: string | null;
}

export const MobileTaskManager: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullToRefreshY, setPullToRefreshY] = useState(0);

  // Touch gesture refs
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  const categories = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Finance', 'Home', 'Social'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['Todo', 'In Progress', 'Review', 'Done'];

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load tasks from Supabase
  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user?.id]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Simulate loading tasks
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Complete Project Review',
          description: 'Review and finalize the quarterly project report',
          completed: false,
          priority: 'High',
          status: 'In Progress',
          category: 'Work',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          completedAt: null,
          estimatedTime: 120,
          actualTime: 45,
          tags: ['work', 'review', 'project'],
          notes: [],
          assignee: 'John Doe',
          reminderTime: '09:00',
          reminderEnabled: true,
          recurring: 'None',
          subtasks: [],
          timeSpent: 45,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Morning Exercise',
          description: '30 minutes of cardio or strength training',
          completed: true,
          priority: 'Medium',
          status: 'Done',
          category: 'Health',
          dueDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          estimatedTime: 30,
          actualTime: 35,
          tags: ['health', 'exercise', 'morning'],
          notes: [],
          assignee: null,
          reminderTime: '07:00',
          reminderEnabled: true,
          recurring: 'Daily',
          subtasks: [],
          timeSpent: 35,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Read Chapter 5',
          description: 'Read and take notes on chapter 5 of the book',
          completed: false,
          priority: 'Low',
          status: 'Todo',
          category: 'Learning',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          completedAt: null,
          estimatedTime: 60,
          actualTime: null,
          tags: ['learning', 'reading', 'education'],
          notes: [],
          assignee: null,
          reminderTime: '20:00',
          reminderEnabled: false,
          recurring: 'None',
          subtasks: [],
          timeSpent: 0,
          lastUpdated: new Date().toISOString()
        }
      ];
      
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const startY = touchStartRef.current.y;
    const deltaY = currentY - startY;
    
    // Only allow pull-to-refresh if at top of page
    if (window.scrollY === 0 && deltaY > 0) {
      setPullToRefreshY(Math.min(deltaY * 0.5, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullToRefreshY > 50) {
      handleRefresh();
    }
    setPullToRefreshY(0);
    touchStartRef.current = null;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadTasks().finally(() => {
      setIsRefreshing(false);
    });
  };

  // Handle swipe gestures for tasks
  const handleTaskSwipe = (taskId: string, direction: 'left' | 'right') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (direction === 'right') {
      // Complete task
      completeTask(taskId);
    } else if (direction === 'left') {
      // View details
      setSelectedTask(task);
      setShowTaskDetails(true);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed: true, 
              status: 'Done',
              completedAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            }
          : task
      ));

      toast({
        title: "Task Completed! ✅",
        description: "Great job! Task marked as done.",
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addTask = async (taskData: Partial<Task>) => {
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description || '',
        completed: false,
        priority: taskData.priority || 'Medium',
        status: 'Todo',
        category: taskData.category || 'Work',
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString(),
        completedAt: null,
        estimatedTime: taskData.estimatedTime || null,
        actualTime: null,
        tags: taskData.tags || [],
        notes: [],
        assignee: taskData.assignee || null,
        reminderTime: null,
        reminderEnabled: false,
        recurring: 'None',
        subtasks: [],
        timeSpent: 0,
        lastUpdated: new Date().toISOString()
      };

      setTasks(prev => [...prev, newTask]);
      setShowAddForm(false);

      toast({
        title: "Task Created! 📝",
        description: "Your new task has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-purple-100 text-purple-800';
      case 'Todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTasksByStatus = () => {
    const grouped = {
      'Todo': filteredTasks.filter(t => t.status === 'Todo'),
      'In Progress': filteredTasks.filter(t => t.status === 'In Progress'),
      'Review': filteredTasks.filter(t => t.status === 'Review'),
      'Done': filteredTasks.filter(t => t.status === 'Done')
    };
    return grouped;
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      {pullToRefreshY > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-blue-500 text-white py-2"
          style={{ transform: `translateY(${pullToRefreshY}px)` }}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ListTodo className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Task Manager</h1>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleTimeString()} • {filteredTasks.length} tasks
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2"
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="p-2"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-3 flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Completed Today</p>
                  <p className="text-2xl font-bold">
                    {tasks.filter(t => t.completed && t.completedAt && 
                      new Date(t.completedAt).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Due Today</p>
                  <p className="text-2xl font-bold">
                    {tasks.filter(t => t.dueDate && 
                      new Date(t.dueDate).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <Clock className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
          <div className="flex space-x-1">
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <ListTodo className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'board' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('board')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'calendar' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tasks List/Board */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try adjusting your search terms.' : 'Create your first task to get started!'}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'board' ? (
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(getTasksByStatus()).map(([status, statusTasks]) => (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{status}</h3>
                  <Badge variant="secondary">{statusTasks.length}</Badge>
                </div>
                <div className="space-y-2">
                  {statusTasks.map((task) => (
                    <Card 
                      key={task.id}
                      className={`transition-all duration-200 ${
                        task.completed ? 'bg-green-50 border-green-200' : ''
                      }`}
                      onTouchStart={(e) => {
                        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                      }}
                      onTouchEnd={(e) => {
                        if (!touchStartRef.current) return;
                        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
                        if (Math.abs(deltaX) > 50) {
                          handleTaskSwipe(task.id, deltaX > 0 ? 'right' : 'left');
                        }
                        touchStartRef.current = null;
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{task.title}</h3>
                              {task.completed && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                            
                            <div className="flex items-center space-x-2 mb-3">
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge variant="outline">
                                {task.category}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {task.dueDate && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                {task.estimatedTime && (
                                  <div className="flex items-center space-x-1">
                                    <Timer className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {task.estimatedTime}m
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <Button
                                variant={task.completed ? "outline" : "default"}
                                size="sm"
                                onClick={() => completeTask(task.id)}
                                disabled={task.completed}
                              >
                                {task.completed ? 'Completed' : 'Complete'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Card 
                key={task.id}
                className={`transition-all duration-200 ${
                  task.completed ? 'bg-green-50 border-green-200' : ''
                }`}
                onTouchStart={(e) => {
                  touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }}
                onTouchEnd={(e) => {
                  if (!touchStartRef.current) return;
                  const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
                  if (Math.abs(deltaX) > 50) {
                    handleTaskSwipe(task.id, deltaX > 0 ? 'right' : 'left');
                  }
                  touchStartRef.current = null;
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        {task.completed && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge variant="outline">
                          {task.category}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {task.estimatedTime && (
                            <div className="flex items-center space-x-1">
                              <Timer className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {task.estimatedTime}m
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant={task.completed ? "outline" : "default"}
                          size="sm"
                          onClick={() => completeTask(task.id)}
                          disabled={task.completed}
                        >
                          {task.completed ? 'Completed' : 'Complete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task Title</label>
              <Input placeholder="e.g., Complete project review" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your task..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                addTask({
                  title: 'New Task',
                  description: 'Description',
                  category: 'Work',
                  priority: 'Medium',
                  estimatedTime: 60
                });
              }}>
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedTask.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedTask.estimatedTime || 0}m
                  </p>
                  <p className="text-sm text-blue-600">Estimated</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedTask.timeSpent || 0}m
                  </p>
                  <p className="text-sm text-green-600">Time Spent</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(selectedTask.status)}>
                    {selectedTask.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Priority</span>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                {selectedTask.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Due Date</span>
                    <span className="text-sm font-medium">
                      {new Date(selectedTask.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Note
                </Button>
                <Button variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 