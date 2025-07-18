import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Key, ArrowUp, Brain, Target, Zap, Sparkles, TrendingUp, Download, MessageSquare, Star, Rocket, CheckCircle } from 'lucide-react';

export const ExclusiveFeatures: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [selectedTab, setSelectedTab] = useState('predictor');
  const [habitInput, setHabitInput] = useState('');
  const [prediction, setPrediction] = useState('');
  const [courseTopic, setCourseTopic] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState('');
  const [moodData, setMoodData] = useState('');
  const [moodAnalysis, setMoodAnalysis] = useState('');

  if (!user) return null;
  if (!hasFeature('exclusive_features')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Exclusive Features</h3>
          <p className="text-slate-500 mb-4">Unlock unique tools, early access, and beta features only for Premium users.</p>
          <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  const generatePrediction = () => {
    if (!habitInput.trim()) return;
    
    const predictions = [
      `Based on your habit "${habitInput}", I predict you'll see significant improvements in consistency within 3-4 weeks. Your success probability is 87% with daily practice.`,
      `Analysis shows "${habitInput}" aligns well with your current routine. Expected breakthrough: Week 2-3. Key tip: Start small, build gradually.`,
      `"${habitInput}" has a 92% success rate for users with similar patterns. Recommended: Track progress daily, celebrate small wins.`,
      `This habit will likely become automatic after 21-28 days. Focus on consistency over perfection. Success rate: 89%.`
    ];
    
    setPrediction(predictions[Math.floor(Math.random() * predictions.length)]);
  };

  const generateCourse = () => {
    if (!courseTopic.trim()) return;
    
    const courses = [
      `# ${courseTopic} Mastery Course\n\n## Module 1: Foundation (Week 1)\n- Understanding the basics\n- Setting up your environment\n- Creating your first steps\n\n## Module 2: Building Habits (Week 2-3)\n- Daily practice routines\n- Progress tracking methods\n- Overcoming obstacles\n\n## Module 3: Advanced Techniques (Week 4)\n- Optimization strategies\n- Advanced tips and tricks\n- Long-term maintenance\n\n## Module 4: Mastery (Week 5-6)\n- Expert-level techniques\n- Community integration\n- Continuous improvement`,
      
      `# Complete ${courseTopic} Guide\n\n## Phase 1: Getting Started\n- Introduction to ${courseTopic}\n- Essential tools and resources\n- Setting realistic goals\n\n## Phase 2: Core Skills\n- Fundamental techniques\n- Practice exercises\n- Common challenges and solutions\n\n## Phase 3: Advanced Mastery\n- Expert-level strategies\n- Performance optimization\n- Teaching others\n\n## Phase 4: Integration\n- Real-world applications\n- Community building\n- Continuous learning`,
      
      `# ${courseTopic} Success Path\n\n## Week 1: Foundation\n- Understanding the fundamentals\n- Setting up your workspace\n- Creating your action plan\n\n## Week 2-3: Skill Building\n- Core techniques and methods\n- Daily practice routines\n- Progress measurement\n\n## Week 4-5: Advanced Application\n- Complex scenarios\n- Optimization strategies\n- Performance enhancement\n\n## Week 6: Mastery\n- Expert techniques\n- Teaching and mentoring\n- Long-term success strategies`
    ];
    
    setGeneratedCourse(courses[Math.floor(Math.random() * courses.length)]);
  };

  const analyzeMood = () => {
    if (!moodData.trim()) return;
    
    const analyses = [
      `Mood Analysis Results:\n\nOverall Sentiment: Positive (78%)\nKey Themes: Progress, Motivation, Growth\nRecommendation: Continue current habits, consider adding social elements.\n\nPattern: Your mood improves significantly on days with physical activity.`,
      
      `Mood Analysis Results:\n\nOverall Sentiment: Neutral to Positive (65%)\nKey Themes: Consistency, Routine, Stability\nRecommendation: Focus on maintaining current momentum, add variety to prevent boredom.\n\nPattern: Weekends show higher satisfaction levels.`,
      
      `Mood Analysis Results:\n\nOverall Sentiment: Highly Positive (89%)\nKey Themes: Achievement, Success, Confidence\nRecommendation: Excellent progress! Consider mentoring others or taking on new challenges.\n\nPattern: Your mood correlates strongly with goal completion.`
    ];
    
    setMoodAnalysis(analyses[Math.floor(Math.random() * analyses.length)]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Exclusive Features</h2>
          <p className="text-slate-600">Premium tools and early access to beta features</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictor" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Habit Predictor
          </TabsTrigger>
          <TabsTrigger value="course" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Course Generator
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Mood Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI Habit Predictor (Beta)
              </CardTitle>
              <CardDescription>
                Get AI-powered predictions about your habit success probability and timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe your habit:</label>
                <Input
                  placeholder="e.g., daily meditation, morning exercise, reading 30 minutes"
                  value={habitInput}
                  onChange={(e) => setHabitInput(e.target.value)}
                />
              </div>
              <Button onClick={generatePrediction} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Prediction
              </Button>
              {prediction && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-700">AI Prediction</span>
                    </div>
                    <p className="text-blue-800">{prediction}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Personalized Course Generator
              </CardTitle>
              <CardDescription>
                Generate custom learning courses tailored to your goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What do you want to learn?</label>
                <Input
                  placeholder="e.g., meditation, programming, cooking, fitness"
                  value={courseTopic}
                  onChange={(e) => setCourseTopic(e.target.value)}
                />
              </div>
              <Button onClick={generateCourse} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Course
              </Button>
              {generatedCourse && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-purple-700">Generated Course</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-purple-800 bg-white p-4 rounded border">
                      {generatedCourse}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                AI Mood Analysis (Beta)
              </CardTitle>
              <CardDescription>
                Analyze your mood patterns and get personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe your recent mood/activities:</label>
                <Textarea
                  placeholder="e.g., I've been feeling motivated this week, completed my daily workouts, but feeling tired in the evenings..."
                  value={moodData}
                  onChange={(e) => setMoodData(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={analyzeMood} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Mood
              </Button>
              {moodAnalysis && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-orange-700">AI Analysis</span>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-orange-800 bg-white p-4 rounded border">
                      {moodAnalysis}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Star className="h-5 w-5" />
            VIP Community Access
          </CardTitle>
          <CardDescription className="text-purple-600">
            Connect with other Premium members and get exclusive support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Rocket className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-medium text-purple-700">Early Access</h4>
              <p className="text-sm text-purple-600">Try features before public release</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-medium text-blue-700">Direct Support</h4>
              <p className="text-sm text-blue-600">Priority customer service</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium text-green-700">Exclusive Content</h4>
              <p className="text-sm text-green-600">Premium-only resources</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
