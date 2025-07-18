import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestFeatureProps {
  featureName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const TestFeature: React.FC<TestFeatureProps> = ({ 
  featureName, 
  description, 
  icon, 
  color 
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="btn-animate"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{featureName}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 success-checkmark">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      </div>

      {/* Feature Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span>Feature Stats</span>
            </CardTitle>
            <CardDescription>Your activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Usage</span>
                <span className="font-semibold text-gray-900">127 times</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold text-gray-900">23 times</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full btn-animate" variant="outline">
                Start New Session
              </Button>
              <Button className="w-full btn-animate" variant="outline">
                View History
              </Button>
              <Button className="w-full btn-animate" variant="outline">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Session completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Data updated</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Settings changed</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Demo */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Feature Demo</CardTitle>
          <CardDescription>
            This is a demonstration of the {featureName} feature. In a real implementation, 
            this would contain the actual feature functionality with interactive elements, 
            data visualization, and user controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 text-center">
            <Sparkles className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-float" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {featureName} is Active!
            </h3>
            <p className="text-gray-600 mb-4">
              This feature is now fully functional and ready to use. 
              All animations and transitions are working perfectly.
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="btn-animate">
                <Sparkles className="h-4 w-4 mr-2" />
                Try Feature
              </Button>
              <Button variant="outline" className="btn-animate">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
