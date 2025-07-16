import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp, Target, Calendar, CheckCircle, Circle, Plus, Edit, Trash, Star, Award, TrendingUp, Clock } from 'lucide-react';

export const AdvancedGoalSetting: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Learn Spanish',
      description: 'Become conversational in Spanish',
      category: 'Learning',
      deadline: '2024-12-31',
      progress: 65,
      milestones: [
        { id: 1, title: 'Complete basic course', completed: true },
        { id: 2, title: 'Practice with native speakers', completed: true },
        { id: 3, title: 'Read Spanish literature', completed: false },
        { id: 4, title: 'Take proficiency test', completed: false }
      ],
      priority: 'high'
    },
    {
      id: 2,
      title: 'Run a Marathon',
      description: 'Complete a full marathon',
      category: 'Fitness',
      deadline: '2024-06-15',
      progress: 45,
      milestones: [
        { id: 1, title: 'Build base mileage', completed: true },
        { id: 2, title: 'Complete half marathon', completed: true },
        { id: 3, title: 'Follow training plan', completed: false },
        { id: 4, title: 'Race day preparation', completed: false }
      ],
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Start a Business',
      description: 'Launch my own tech startup',
      category: 'Career',
      deadline: '2024-09-30',
      progress: 25,
      milestones: [
        { id: 1, title: 'Market research', completed: true },
        { id: 2, title: 'Business plan', completed: false },
        { id: 3, title: 'MVP development', completed: false },
        { id: 4, title: 'Launch', completed: false }
      ],
      priority: 'high'
    }
  ]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    priority: 'medium'
  });

  if (!user) return null;
  if (!hasFeature('advanced_goals')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Advanced Goal Setting</h3>
          <p className="text-slate-500 mb-4">Set complex goals with sub-milestones and automated progress tracking.</p>
          <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  const addGoal = () => {
    if (newGoal.title && newGoal.description) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        progress: 0,
        milestones: []
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', category: '', deadline: '', priority: 'medium' });
      setShowAddGoal(false);
    }
  };

  const toggleMilestone = (goalId: number, milestoneId: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            milestones: goal.milestones.map(milestone =>
              milestone.id === milestoneId
                ? { ...milestone, completed: !milestone.completed }
                : milestone
            ),
            progress: goal.milestones.filter(m => m.id !== milestoneId).length > 0
              ? Math.round((goal.milestones.filter(m => m.id !== milestoneId).filter(m => m.completed).length + 
                  (goal.milestones.find(m => m.id === milestoneId)?.completed ? 0 : 1)) / 
                  goal.milestones.length * 100)
              : 100
          }
        : goal
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Advanced Goal Setting</h2>
          <p className="text-slate-600">Set complex goals with sub-milestones and automated progress tracking.</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">Pro</Badge>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowAddGoal(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
          <div className="text-sm text-slate-500">
            {goals.length} active goals
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
            <CardDescription>Set a new goal with milestones and deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Goal Title</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="e.g., Learn Spanish"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  placeholder="e.g., Learning, Fitness, Career"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Describe your goal in detail..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addGoal} className="bg-indigo-600 hover:bg-indigo-700">
                Create Goal
              </Button>
              <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold">{goal.title}</h3>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className="text-slate-600 mb-3">{goal.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{goal.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-slate-600">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className={`h-2 ${getProgressColor(goal.progress)}`} />
              </div>

              {/* Milestones */}
              <div>
                <h4 className="font-medium mb-3">Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50">
                      <button
                        onClick={() => toggleMilestone(goal.id, milestone.id)}
                        className="flex items-center space-x-2 text-left flex-1"
                      >
                        {milestone.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-400" />
                        )}
                        <span className={milestone.completed ? 'line-through text-slate-500' : 'text-slate-700'}>
                          {milestone.title}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goal Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Insights</CardTitle>
          <CardDescription>AI-powered insights about your goal progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">On Track</h4>
              <p className="text-2xl font-bold text-blue-700">2</p>
              <p className="text-sm text-blue-600">goals</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Completed</h4>
              <p className="text-2xl font-bold text-green-700">8</p>
              <p className="text-sm text-green-600">milestones</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-orange-900">Due Soon</h4>
              <p className="text-2xl font-bold text-orange-700">1</p>
              <p className="text-sm text-orange-600">goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 