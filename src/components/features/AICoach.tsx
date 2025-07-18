import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  MessageSquare, 
  Brain, 
  TrendingUp, 
  Target, 
  Calendar,
  Award,
  Lightbulb,
  CKey,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

interface CoachingSession {
  id: string;
  date: string;
  topic: string;
  summary: string;
  actionItems: string[];
  mood: number;
  insights: string[];
}

export const AICoach: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [coachingHistory] = useState<CoachingSession[]>([
    {
      id: '1',
      date: '2024-01-15',
      topic: 'Productivity Optimization',
      summary: 'Discussed time management strategies and identified key productivity blockers.',
      actionItems: ['Implement Pomodoro technique', 'Set up daily planning routine', 'Reduce social media usage'],
      mood: 4,
      insights: ['You work best in 90-minute focused blocks', 'Morning routine significantly impacts your day', 'Social media is your biggest distraction']
    },
    {
      id: '2',
      date: '2024-01-12',
      topic: 'Goal Achievement',
      summary: 'Reviewed progress on fitness goals and created new milestones.',
      actionItems: ['Increase workout frequency to 4x/week', 'Track nutrition more consistently', 'Set up progress photos'],
      mood: 5,
      insights: ['You respond well to visual progress tracking', 'Consistency is more important than intensity', 'Accountability partners boost your motivation']
    },
    {
      id: '3',
      date: '2024-01-08',
      topic: 'Stress Management',
      summary: 'Explored stress triggers and developed coping mechanisms.',
      actionItems: ['Practice daily meditation', 'Implement work-life boundaries', 'Schedule regular breaks'],
      mood: 3,
      insights: ['Work stress peaks on Tuesdays and Wednesdays', 'Physical exercise is your best stress reliever', 'You need more unstructured time']
    }
  ]);

  const handleStartSession = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      const newSession: CoachingSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        topic: 'Personal Development',
        summary: 'Based on your recent patterns, I\'ve identified several areas for growth and optimization.',
        actionItems: [
          'Review your weekly goals every Sunday',
          'Implement the 2-minute rule for small tasks',
          'Schedule 30 minutes of reflection time daily'
        ],
        mood: 4,
        insights: [
          'Your productivity peaks between 9-11 AM',
          'You\'re most creative after physical exercise',
          'Social interactions significantly boost your mood'
        ]
      };
      setCurrentSession(newSession);
      setIsProcessing(false);
    }, 2000);
  };

  const handleAskQuestion = () => {
    if (!userInput.trim()) return;
    
    setIsProcessing(true);
    // Simulate AI response
    setTimeout(() => {
      // In a real app, this would be an API call to the AI service
      setIsProcessing(false);
      setUserInput('');
    }, 1500);
  };

  const averageMood = coachingHistory.reduce((sum, session) => sum + session.mood, 0) / coachingHistory.length;
  const totalSessions = coachingHistory.length;
  const completedActions = coachingHistory.reduce((sum, session) => sum + session.actionItems.length, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Personal Coach</h1>
          <p className="text-gray-600 mt-2">Your personalized AI coach for life optimization and goal achievement</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">Premium Feature</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Coach Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Coaching Stats
            </CardTitle>
            <CardDescription>Your coaching journey overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Sessions</span>
              <span className="text-2xl font-bold text-purple-600">{totalSessions}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Mood</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {averageMood.toFixed(1)}
                </span>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Action Items</span>
              <span className="text-lg font-bold text-blue-600">{completedActions}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress Score</span>
              <span className="text-lg font-bold text-indigo-600">85%</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>Start a coaching session or ask a question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleStartSession}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start New Session
                </>
              )}
            </Button>

            <div className="space-y-3">
              <Label htmlFor="question">Ask Your AI Coach</Label>
              <Textarea
                id="question"
                placeholder="What would you like to work on today?"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleAskQuestion}
                disabled={!userInput.trim() || isProcessing}
                variant="outline"
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AI Insights
            </CardTitle>
            <CardDescription>Personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Productivity Pattern</h4>
              <p className="text-sm text-blue-700">
                You're most productive between 9-11 AM. Schedule your most important tasks during this window.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Mood Correlation</h4>
              <p className="text-sm text-green-700">
                Your mood improves by 23% on days when you exercise. Consider morning workouts.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Goal Progress</h4>
              <p className="text-sm text-purple-700">
                You're 78% on track with your fitness goals. Focus on consistency over intensity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Session */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Coaching Session
            </CardTitle>
            <CardDescription>Your personalized AI coaching session for {currentSession.date}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Session Summary</h4>
              <p className="text-gray-700">{currentSession.summary}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Action Items</h4>
              <div className="space-y-2">
                {currentSession.actionItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
              <div className="space-y-2">
                {currentSession.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-blue-700 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coaching History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Coaching History
          </CardTitle>
          <CardDescription>Your previous coaching sessions and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coachingHistory.map((session) => (
              <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{session.mood}/5</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant="outline">{session.topic}</Badge>
                </div>
                
                <p className="text-gray-700 mb-3">{session.summary}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{session.actionItems.length} action items</span>
                  <span>{session.insights.length} insights</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
