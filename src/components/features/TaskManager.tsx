import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  Flag,
  List,
  Lock,
  ArrowUp,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  CalendarDays,
  Filter,
  SortAsc,
  SortDesc,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  category: string;
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
}

export const TaskManager: React.FC = () => {
  const { user, upgradePlan } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'Medium' as const, 
    dueDate: '', 
    category: 'Work',
    tags: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const categories = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Finance', 'Home'];
  const priorities = ['Low', 'Medium', 'High'];

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${user?.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [user?.id]);

  // Save tasks to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user?.id]);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      category: newTask.category,
      createdAt: new Date(),
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', category: 'Work', tags: '' });
    setShowAddForm(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : undefined
        };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks
    .filter(task => filter === 'All' || task.category === filter)
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'High').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const maxTasks = user?.plan === 'Basic' ? 20 : user?.plan === 'Pro' ? 100 : 500;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work': return 'bg-blue-100 text-blue-800';
      case 'Personal': return 'bg-purple-100 text-purple-800';
      case 'Health': return 'bg-green-100 text-green-800';
      case 'Learning': return 'bg-indigo-100 text-indigo-800';
      case 'Finance': return 'bg-emerald-100 text-emerald-800';
      case 'Home': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Task Manager</h2>
          <p className="text-slate-600">Organize and track your tasks efficiently</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={user.plan === 'Premium' ? 'bg-purple-600' : user.plan === 'Pro' ? 'bg-indigo-600' : 'bg-blue-600'}>
            {user.plan} Plan
          </Badge>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">{totalTasks}</div>
                <p className="text-sm text-slate-600">Total Tasks</p>
              </div>
              <List className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-xs text-slate-500">{totalTasks}/{maxTasks} limit</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <div className="text-xs text-slate-500">{completionRate}% completion rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
                <p className="text-sm text-slate-600">Overdue</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Tasks past due date</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{highPriorityTasks}</div>
                <p className="text-sm text-slate-600">High Priority</p>
              </div>
              <Flag className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Urgent tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Task */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>
                {user.plan === 'Basic' && totalTasks >= 20 && (
                  <span className="text-red-600">Upgrade to Pro to add more tasks</span>
                )}
                {user.plan === 'Pro' && totalTasks >= 100 && (
                  <span className="text-red-600">Upgrade to Premium for unlimited tasks</span>
                )}
              </CardDescription>
            </div>
            {totalTasks < maxTasks && (
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </CardHeader>
        
        {showAddForm && totalTasks < maxTasks && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="e.g., Complete project report"
                />
              </div>
              <div>
                <Label htmlFor="task-category">Category</Label>
                <select
                  id="task-category"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <select
                  id="task-priority"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Add details about your task..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="task-tags">Tags (Optional)</Label>
              <Input
                id="task-tags"
                value={newTask.tags}
                onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                placeholder="e.g., urgent, project, meeting (comma separated)"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={addTask}>
                Add Task
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="sort-by" className="text-sm">Sort by:</Label>
          <select
            id="sort-by"
            className="px-2 py-1 border border-slate-300 rounded text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <Card key={task.id} className={`${task.completed ? 'border-green-200 bg-green-50' : ''} ${isOverdue(task.dueDate) && !task.completed ? 'border-red-200 bg-red-50' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      onClick={() => toggleTask(task.id)}
                      variant={task.completed ? "outline" : "default"}
                      size="sm"
                      className={task.completed ? 'border-green-500 text-green-700' : ''}
                    >
                      {task.completed ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm text-slate-600 ${task.completed ? 'line-through' : ''}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority}
                        </Badge>
                        <Badge className={getCategoryColor(task.category)}>
                          {task.category}
                        </Badge>
                        {task.tags.length > 0 && task.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className={`text-sm font-medium ${isOverdue(task.dueDate) && !task.completed ? 'text-red-600' : ''}`}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </span>
                      </div>
                      {task.dueDate && (
                        <span className={`text-xs ${isOverdue(task.dueDate) && !task.completed ? 'text-red-600' : 'text-slate-500'}`}>
                          {isOverdue(task.dueDate) 
                            ? `${Math.abs(getDaysUntilDue(task.dueDate))} days overdue`
                            : getDaysUntilDue(task.dueDate) === 0 
                              ? 'Due today'
                              : `${getDaysUntilDue(task.dueDate)} days left`
                          }
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <Card key={task.id} className={`${task.completed ? 'border-green-200 bg-green-50' : ''} ${isOverdue(task.dueDate) && !task.completed ? 'border-red-200 bg-red-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className={`text-lg ${task.completed ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </CardTitle>
                    {task.description && (
                      <CardDescription className={`mt-1 ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    <Flag className="h-3 w-3 mr-1" />
                    {task.priority}
                  </Badge>
                  <Badge className={getCategoryColor(task.category)}>
                    {task.category}
                  </Badge>
                  {task.completed && (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Due Date</span>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${isOverdue(task.dueDate) && !task.completed ? 'text-red-600' : ''}`}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </span>
                      {task.dueDate && (
                        <div className={`text-xs ${isOverdue(task.dueDate) && !task.completed ? 'text-red-600' : 'text-slate-500'}`}>
                          {isOverdue(task.dueDate) 
                            ? `${Math.abs(getDaysUntilDue(task.dueDate))} days overdue`
                            : getDaysUntilDue(task.dueDate) === 0 
                              ? 'Due today'
                              : `${getDaysUntilDue(task.dueDate)} days left`
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => toggleTask(task.id)}
                    variant={task.completed ? "outline" : "default"}
                    className={`w-full ${task.completed ? 'border-green-500 text-green-700' : ''}`}
                  >
                    {task.completed ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upgrade Prompt */}
      {totalTasks >= maxTasks && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">Task Limit Reached</h3>
                <p className="text-orange-700">
                  You've reached the maximum number of tasks for your {user.plan} plan.
                  {user.plan === 'Basic' && ' Upgrade to Pro for 100 tasks.'}
                  {user.plan === 'Pro' && ' Upgrade to Premium for unlimited tasks.'}
                </p>
              </div>
              <Button 
                onClick={() => upgradePlan(user.plan === 'Basic' ? 'Pro' : 'Premium')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <List className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No tasks yet</h3>
            <p className="text-slate-500 mb-4">
              Start organizing your work by adding your first task above.
            </p>
            {totalTasks < maxTasks && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 