import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Key, Clock, ArrowUp, MessageCircle, Phone, Mail, CheckCircle } from 'lucide-react';

export const VIPSupport: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  if (!user) return null;
  if (!hasFeature('vip_support')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">VIP Support</h3>
          <p className="text-slate-500 mb-4">Get priority support with live chat and direct contact options.</p>
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
          <h2 className="text-2xl font-bold text-slate-800">VIP Support</h2>
          <p className="text-slate-600">Get priority support with live chat and direct contact options.</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contact VIP Support</CardTitle>
          <CardDescription>Choose your preferred contact method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </Button>
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call
            </Button>
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Support History</CardTitle>
          <CardDescription>Your recent support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Resolved: "Issue with habit sync" (2 days ago)</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Pending: "Billing question" (1 day ago)</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Resolved: "Feature request: dark mode" (5 days ago)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}; 
