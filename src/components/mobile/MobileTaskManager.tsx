import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
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
  Activity,
  Target as TargetIcon,
  Users,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Circle,
  Flag,
  Tag,
  Folder,
  SortAsc,
  SortDesc,
  Briefcase,
  User,
  Heart,
  Home,
  Timer,
  Play,
  Pause,
  Square,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DataService } from '@/lib/data-service';
import type { Task as SupabaseTask, TaskNote as SupabaseTaskNote } from '@/lib/supabase';

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

export const MobileTaskManager: React.FC = () => {
  const { user, hasFeature, upgradePlan } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('board');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [timerActive, setTimerActive] = useState<string | null>(null);
  const [timers, setTimers] = useState<{[key: string]: number}>({});

  const categories = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Finance', 'Home', 'Social'];
  const statuses = ['All', 'Todo', 'In Progress', 'Review', 'Done'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];

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

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadTasks();
      setIsRefreshing(false);
    }, 1000);
  };

  // Handle swipe gestures
  const handleSwipe = (taskId: string, direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection(null), 300);

    if (direction === 'right') {
      // Mark as completed
      toggleTask(taskId);
    } else if (direction === 'left') {
      // Show details
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setSelectedTask(task);
        setShowTaskDetails(true);
      }
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const completed = !task.completed;
      const updatedTask = await DataService.toggleTaskCompletion(taskId, completed);
      
      if (updatedTask) {
        await loadTasks();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
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

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityIcon = (priority: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Low': <Circle className="h-4 w-4 text-gray-400" />,
      'Medium': <Circle className="h-4 w-4 text-yellow-500" />,
      'High': <Circle className="h-4 w-4 text-orange-500" />,
      'Urgent': <Circle className="h-4 w-4 text-red-500" />
    };
    return icons[priority] || <Circle className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Todo': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Review': 'bg-yellow-100 text-yellow-800',
      'Done': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Work': <Briefcase className="h-4 w-4" />,
      'Personal': <User className="h-4 w-4" />,
      'Health': <Heart className="h-4 w-4" />,
      'Learning': <BookOpen className="h-4 w-4" />,
      'Finance': <DollarSign className="h-4 w-4" />,
      'Home': <Home className="h-4 w-4" />,
      'Social': <Users className="h-4 w-4" />
    };
    return icons[category] || <Folder className="h-4 w-4" />;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isOverdue = (dueDate?: Date) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Header with search and filters */}
      <div className="sticky top-0 bg-white z-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
            <Badge variant="secondary" className="text-xs">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-4 space-y-3">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {getCategoryIcon(category)}
                  <span className="ml-1">{category}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="whitespace-nowrap"
                >
                  {status}
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {priorities.map((priority) => (
                <Button
                  key={priority}
                  variant={selectedPriority === priority ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPriority(priority)}
                  className="whitespace-nowrap"
                >
                  {priority}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* View mode toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
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
          
          <Button
            size="sm"
            onClick={() => {/* Open add task form */}}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading tasks...</span>
        </div>
      )}

      {/* Tasks board view */}
      {!loading && viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Todo', 'In Progress', 'Review', 'Done'].map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{status}</h3>
                <Badge variant="secondary" className="text-xs">
                  {filteredTasks.filter(t => t.status === status).length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {filteredTasks
                  .filter(task => task.status === status)
                  .map((task) => (
                    <Card
                      key={task.id}
                      className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                        swipeDirection === 'left' ? 'transform -translate-x-4' : 
                        swipeDirection === 'right' ? 'transform translate-x-4' : ''
                      } ${isOverdue(task.dueDate) ? 'border-red-200 bg-red-50' : ''}`}
                      onClick={() => handleSwipe(task.id, 'left')}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                              {isOverdue(task.dueDate) && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                            
                            <div className="flex items-center space-x-2 mb-2">
                              {getPriorityIcon(task.priority)}
                              <Badge className={getCategoryColor(task.category)}>
                                {task.category}
                              </Badge>
                              {task.dueDate && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {task.dueDate.toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Progress bar for subtasks */}
                            {task.subtasks.length > 0 && (
                              <div className="mb-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-500">Subtasks</span>
                                  <span className="text-xs font-medium">
                                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                                  </span>
                                </div>
                                <Progress 
                                  value={(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100} 
                                  className="h-1"
                                />
                              </div>
                            )}

                            {/* Time tracking */}
                            {task.timeSpent > 0 && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(task.timeSpent)}</span>
                                {task.estimatedTime && (
                                  <>
                                    <span>/</span>
                                    <span>{formatTime(task.estimatedTime)}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quick action buttons */}
                          <div className="flex flex-col space-y-1 ml-2">
                            <Button
                              variant={task.completed ? "outline" : "default"}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(task.id);
                              }}
                              className={`h-6 w-6 p-0 ${
                                task.completed 
                                  ? 'border-green-500 text-green-600 hover:bg-green-50' 
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTimer(task.id);
                              }}
                              className={`h-6 w-6 p-0 ${
                                timerActive === task.id ? 'text-red-600' : 'text-gray-600'
                              }`}
                            >
                              {timerActive === task.id ? (
                                <Pause className="h-3 w-3" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tasks list view */}
      {!loading && viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Create your first task to get started!'}
                </p>
                <Button onClick={() => {/* Open add task form */}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                  swipeDirection === 'left' ? 'transform -translate-x-4' : 
                  swipeDirection === 'right' ? 'transform translate-x-4' : ''
                } ${isOverdue(task.dueDate) ? 'border-red-200 bg-red-50' : ''}`}
                onClick={() => handleSwipe(task.id, 'left')}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        {task.completed && (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Done
                          </Badge>
                        )}
                        {isOverdue(task.dueDate) && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800">
                          {task.category}
                        </Badge>
                      </div>

                      {/* Due date and time tracking */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {task.dueDate.toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          {task.timeSpent > 0 && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {formatTime(task.timeSpent)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Timer indicator */}
                        {timerActive === task.id && (
                          <div className="flex items-center space-x-1 text-red-600">
                            <Timer className="h-4 w-4 animate-pulse" />
                            <span className="text-sm font-medium">
                              {formatTime(timers[task.id] || 0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick action button */}
                    <Button
                      variant={task.completed ? "outline" : "default"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className={`ml-3 ${
                        task.completed 
                          ? 'border-green-500 text-green-600 hover:bg-green-50' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {task.completed ? <Check className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Swipe instructions */}
      <div className="text-center py-4 text-sm text-gray-500">
        <p>Swipe right to complete • Swipe left for details</p>
      </div>

      {/* Task details modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Task Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTaskDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MobileTaskDetails
                task={selectedTask}
                onClose={() => setShowTaskDetails(false)}
                onUpdate={loadTasks}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Mobile Task Details Component
const MobileTaskDetails: React.FC<{
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ task, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isOverdue = (dueDate?: Date) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
              <p className="text-gray-600 mb-4">{task.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{task.status}</div>
                <div className="text-xs text-gray-500">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{task.priority}</div>
                <div className="text-xs text-gray-500">Priority</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <Badge>{task.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Due Date</span>
                <span className="text-sm font-medium">
                  {task.dueDate ? task.dueDate.toLocaleDateString() : 'No due date'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time Spent</span>
                <span className="text-sm font-medium">
                  {formatTime(task.timeSpent)}
                </span>
              </div>
              {task.estimatedTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estimated Time</span>
                  <span className="text-sm font-medium">
                    {formatTime(task.estimatedTime)}
                  </span>
                </div>
              )}
            </div>

            {isOverdue(task.dueDate) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">This task is overdue</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Subtasks Progress</h4>
            {task.subtasks.length > 0 ? (
              <div className="space-y-3">
                {task.subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox checked={subtask.completed} />
                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <List className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No subtasks yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Task Notes</h4>
            {task.notes.length > 0 ? (
              <div className="space-y-3">
                {task.notes.map((note, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <p className="text-sm text-gray-700">{note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No notes yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Close
        </Button>
        <Button onClick={onUpdate} className="flex-1">
          Update
        </Button>
      </div>
    </div>
  );
}; 