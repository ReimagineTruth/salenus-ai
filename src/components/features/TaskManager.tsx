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
  ArrowUp
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
}

export const TaskManager: React.FC = () => {
  const { user, upgradePlan } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'Medium' as const, 
    dueDate: '', 
    category: 'Work' 
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');

  const categories = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Finance'];
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
      createdAt: new Date()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', category: 'Work' });
    setShowAddForm(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks
    .filter(task => filter === 'All' || task.category === filter)
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'High').length;

  const maxTasks = user?.plan === 'Basic' ? 20 : user?.plan === 'Pro' ? 100 : 500;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Task Manager</h2>
          <p className="text-slate-600">Organize and track your tasks efficiently</p>
        </div>
        <Badge className={user.plan === 'Premium' ? 'bg-purple-600' : user.plan === 'Pro' ? 'bg-indigo-600' : 'bg-blue-600'}>
          {user.plan} Plan
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-800">{totalTasks}</div>
            <p className="text-sm text-slate-600">Total Tasks</p>
            <div className="mt-2 text-xs text-slate-500">{totalTasks}/{maxTasks} limit</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-sm text-slate-600">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-sm text-slate-600">Overdue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{highPriorityTasks}</div>
            <p className="text-sm text-slate-600">High Priority</p>
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
                placeholder="Add details about this task..."
                rows={3}
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
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
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
          <span className="text-sm text-slate-600">Sort by:</span>
          <select
            className="px-3 py-1 border border-slate-300 rounded-md text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <Card key={task.id} className={`transition-all duration-200 hover:shadow-lg ${
            task.completed ? 'border-green-200 bg-green-50' : 'border-slate-200'
          } ${!task.completed && new Date(task.dueDate) < new Date() ? 'border-red-200 bg-red-50' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 ${task.completed ? 'text-green-600' : 'text-slate-400'}`}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {task.title}
                      </h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {!task.completed && new Date(task.dueDate) < new Date() && (
                        <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm mb-2 ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <List className="h-3 w-3" />
                        {task.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created: {task.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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