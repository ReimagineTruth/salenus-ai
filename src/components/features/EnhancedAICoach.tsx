import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  MessageSquare, 
  Brain, 
  TrendingUp, 
  Target, 
  Calendar,
  Award,
  Lightbulb,
  Mic,
  MicOff,
  Volume2,
  Heart,
  Zap,
  Clock,
  BarChart3,
  Users,
  Trophy,
  Star,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AICoachSession {
  id: string;
  date: string;
  topic: string;
  summary: string;
  actionItems: string[];
  mood: number;
  insights: string[];
  voiceTranscript?: string;
  sentimentScore?: number;
  productivityScore?: number;
  recommendations: string[];
}

interface PredictiveInsights {
  moodPrediction: number;
  productivityForecast: number;
  habitSuccessProbability: number;
  optimalTimeSlots: string[];
  riskFactors: string[];
  recommendations: string[];
}

export const EnhancedAICoach: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<AICoachSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights | null>(null);
  const [coachingHistory, setCoachingHistory] = useState<AICoachSession[]>([]);
  const [selectedMood, setSelectedMood] = useState<number>(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setVoiceTranscript(finalTranscript);
          setUserInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setIsVoiceEnabled(true);
    }
  }, []);

  const startVoiceRecognition = () => {
    if (recognitionRef.current && isVoiceEnabled) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleStartSession = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing with enhanced features
    setTimeout(() => {
      const newSession: AICoachSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        topic: 'Personal Development & Productivity Optimization',
        summary: 'Based on your recent patterns and current mood, I\'ve identified several key areas for growth. Your productivity peaks between 9-11 AM, and you respond well to structured routines.',
        actionItems: [
          'Schedule deep work sessions between 9-11 AM',
          'Implement the 2-minute rule for small tasks',
          'Practice 10-minute meditation before starting work',
          'Reduce social media usage during peak productivity hours'
        ],
        mood: selectedMood || 4,
        insights: [
          'Your productivity increases by 40% when you start with physical exercise',
          'Social interactions significantly boost your mood and motivation',
          'You\'re most creative after taking short breaks every 90 minutes',
          'Your stress levels decrease by 60% when you maintain a consistent sleep schedule'
        ],
        voiceTranscript: voiceTranscript,
        sentimentScore: 0.75,
        productivityScore: 0.82,
        recommendations: [
          'Consider morning workouts to boost productivity',
          'Schedule important meetings in your peak hours',
          'Implement a consistent bedtime routine',
          'Take regular breaks to maintain creativity'
        ]
      };

      setCurrentSession(newSession);
      setCoachingHistory(prev => [newSession, ...prev]);
      setIsProcessing(false);
      
      // Generate predictive insights
      generatePredictiveInsights();
    }, 3000);
  };

  const generatePredictiveInsights = () => {
    const insights: PredictiveInsights = {
      moodPrediction: 0.78,
      productivityForecast: 0.85,
      habitSuccessProbability: 0.72,
      optimalTimeSlots: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM', '7:00 PM - 9:00 PM'],
      riskFactors: ['Inconsistent sleep schedule', 'High social media usage', 'Lack of exercise routine'],
      recommendations: [
        'Maintain consistent 8-hour sleep schedule',
        'Limit social media to 30 minutes per day',
        'Include 30-minute exercise in morning routine',
        'Practice mindfulness during breaks'
      ]
    };
    setPredictiveInsights(insights);
  };

  const handleAskQuestion = async () => {
    if (!userInput.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI response with sentiment analysis
    setTimeout(() => {
      const response = `Based on your question: "${userInput}", here's my analysis:
      
1. **Current State**: Your question indicates a focus on ${userInput.includes('productivity') ? 'productivity optimization' : 'personal development'}.

2. **Recommendations**: 
   - Consider implementing time-blocking techniques
   - Track your energy levels throughout the day
   - Set specific, measurable goals

3. **Next Steps**: Start with small, manageable changes and build consistency.`;
      
      setUserInput('');
      setIsProcessing(false);
    }, 2000);
  };

  const averageMood = coachingHistory.reduce((sum, session) => sum + session.mood, 0) / Math.max(coachingHistory.length, 1);
  const totalSessions = coachingHistory.length;
  const completedActions = coachingHistory.reduce((sum, session) => sum + session.actionItems.length, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced AI Personal Coach</h1>
          <p className="text-gray-600 mt-2">Your intelligent AI coach with voice interaction, sentiment analysis, and predictive insights</p>
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
            <CardDescription>Your enhanced coaching journey overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedActions}</div>
                <div className="text-sm text-gray-600">Action Items</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Mood</span>
                <span className="text-sm font-medium">{averageMood.toFixed(1)}/5</span>
              </div>
              <Progress value={averageMood * 20} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Productivity Score</span>
                <span className="text-sm font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Voice Interaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-blue-500" />
              Voice Interaction
            </CardTitle>
            <CardDescription>Speak to your AI coach naturally</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isVoiceEnabled ? (
              <>
                <Button 
                  onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                  className={`w-full ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Voice Chat
                    </>
                  )}
                </Button>

                {voiceTranscript && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Transcript:</strong> {voiceTranscript}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  {isListening ? 'Listening... Speak now!' : 'Click to start voice interaction'}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <MicOff className="h-8 w-8 mx-auto mb-2" />
                <p>Voice recognition not available in this browser</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Predictive Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Predictive Insights
            </CardTitle>
            <CardDescription>AI-powered future predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictiveInsights ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mood Prediction</span>
                    <span className="text-sm font-medium">{Math.round(predictiveInsights.moodPrediction * 100)}%</span>
                  </div>
                  <Progress value={predictiveInsights.moodPrediction * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Productivity Forecast</span>
                    <span className="text-sm font-medium">{Math.round(predictiveInsights.productivityForecast * 100)}%</span>
                  </div>
                  <Progress value={predictiveInsights.productivityForecast * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Habit Success</span>
                    <span className="text-sm font-medium">{Math.round(predictiveInsights.habitSuccessProbability * 100)}%</span>
                  </div>
                  <Progress value={predictiveInsights.habitSuccessProbability * 100} className="h-2" />
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Optimal Time Slots</h4>
                  <div className="space-y-1">
                    {predictiveInsights.optimalTimeSlots.map((slot, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p>Start a session to see predictions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="mood">Current Mood (1-5)</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood)}
                    className="flex-1"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="question">Ask Your AI Coach</Label>
            <Textarea
              id="question"
              placeholder="What would you like to work on today? (Voice or text input)"
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

      {/* Current Session */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Enhanced Coaching Session
            </CardTitle>
            <CardDescription>Your personalized AI coaching session for {currentSession.date}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Session Summary</h4>
                <p className="text-gray-700">{currentSession.summary}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sentiment Score</span>
                    <span className="text-sm font-medium">{Math.round((currentSession.sentimentScore || 0) * 100)}%</span>
                  </div>
                  <Progress value={(currentSession.sentimentScore || 0) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Productivity Score</span>
                    <span className="text-sm font-medium">{Math.round((currentSession.productivityScore || 0) * 100)}%</span>
                  </div>
                  <Progress value={(currentSession.productivityScore || 0) * 100} className="h-2" />
                </div>
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

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {currentSession.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-green-700 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coaching History */}
      {coachingHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>Your coaching history and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coachingHistory.slice(0, 3).map((session) => (
                <div key={session.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{session.topic}</h4>
                    <span className="text-sm text-gray-500">{session.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{session.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Mood: {session.mood}/5</span>
                    <span>Actions: {session.actionItems.length}</span>
                    {session.sentimentScore && (
                      <span>Sentiment: {Math.round(session.sentimentScore * 100)}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 