import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Key, ArrowUp, BookOpen, CheckCircle, Award } from 'lucide-react';

export const PersonalizedCourses: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  if (!user) return null;
  if (!hasFeature('personalized_courses')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Personalized Courses</h3>
          <p className="text-slate-500 mb-4">Get custom course recommendations and track your learning progress.</p>
          <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Personalized Courses</h2>
          <p className="text-slate-600">Get custom course recommendations and track your learning progress.</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recommended Courses</CardTitle>
          <CardDescription>Handpicked for your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span>Building Consistent Habits</span>
              <Progress value={80} className="w-24 ml-2" />
            </li>
            <li className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-green-500" />
              <span>Mindfulness for Productivity</span>
              <Progress value={60} className="w-24 ml-2" />
            </li>
            <li className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <span>Goal Setting Mastery</span>
              <Progress value={40} className="w-24 ml-2" />
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your course certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Building Consistent Habits - Certificate</span>
            </li>
            <li className="flex items-center gap-3">
              <Award className="h-5 w-5 text-blue-500" />
              <span>Mindfulness for Productivity - Certificate</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}; 
