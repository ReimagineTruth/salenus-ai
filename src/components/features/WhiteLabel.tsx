import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp, Settings, Globe, Paintbrush, ExternalLink, CheckCircle } from 'lucide-react';

export const WhiteLabel: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  if (!user) return null;
  if (!hasFeature('white_label')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">White-Label Options</h3>
          <p className="text-slate-500 mb-4">Customize branding, domain, and partner options for your organization.</p>
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
          <h2 className="text-2xl font-bold text-slate-800">White-Label Options</h2>
          <p className="text-slate-600">Customize branding, domain, and partner options for your organization.</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Set your logo and color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Paintbrush className="h-5 w-5 text-blue-500" />
            <span>Upload your logo and select brand colors</span>
            <Button size="sm" variant="outline">Upload Logo</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Custom Domain</CardTitle>
          <CardDescription>Use your own domain for the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Globe className="h-5 w-5 text-green-500" />
            <span>Connect your domain (e.g., app.yourcompany.com)</span>
            <Button size="sm" variant="outline">Set Domain</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Partner Options</CardTitle>
          <CardDescription>Access partner resources and support</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Partner Dashboard</span>
            </li>
            <li className="flex items-center gap-3">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              <span>Partner API Access</span>
            </li>
            <li className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-purple-500" />
              <span>Priority Partner Support</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}; 