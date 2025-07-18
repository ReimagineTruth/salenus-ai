import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Key, ArrowUp, Copy, ExternalLink, BarChart3 } from 'lucide-react';

export const APIAccess: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [apiKey, setApiKey] = useState('sk-1234-5678-ABCD');
  const [copied, setCopied] = useState(false);
  if (!user) return null;
  if (!hasFeature('api_access')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">API Access</h3>
          <p className="text-slate-500 mb-4">Integrate Salenus AI with your own apps and tools using our API.</p>
          <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">API Access</h2>
          <p className="text-slate-600">Integrate Salenus AI with your own apps and tools using our API.</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>Manage and use your API key</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-blue-500" />
            <span className="font-mono bg-slate-100 px-2 py-1 rounded">{apiKey}</span>
            <Button size="sm" variant="outline" onClick={handleCopy} className="flex items-center gap-1">
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Usage Stats</CardTitle>
          <CardDescription>Track your API usage</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <span>Requests this month: 1,234</span>
            </li>
            <li className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Requests today: 56</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Learn how to use the API</CardDescription>
        </CardHeader>
        <CardContent>
          <a href="https://docs.salenus.ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
            <ExternalLink className="h-4 w-4" />
            View API Docs
          </a>
        </CardContent>
      </Card>
    </div>
  );
}; 
