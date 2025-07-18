import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Key, Clock, MessageSquare, CheckCircle, Star, Phone, Mail, ArrowUp, Calendar, User, Zap } from 'lucide-react';

export const PrioritySupport: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Habit sync issue',
      description: 'My habits are not syncing across devices',
      priority: 'high',
      status: 'open',
      category: 'technical',
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-15',
      agent: 'Sarah M.',
      responseTime: '2 hours'
    },
    {
      id: 2,
      title: 'Billing question',
      description: 'Need help with subscription upgrade',
      priority: 'medium',
      status: 'in_progress',
      category: 'billing',
      createdAt: '2024-01-14',
      lastUpdated: '2024-01-15',
      agent: 'Mike R.',
      responseTime: '4 hours'
    },
    {
      id: 3,
      title: 'Feature request',
      description: 'Would like to see dark mode option',
      priority: 'low',
      status: 'resolved',
      category: 'feature',
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-12',
      agent: 'Lisa K.',
      responseTime: '6 hours'
    }
  ]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });

  if (!user) return null;
  if (!hasFeature('priority_support')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Priority Support</h3>
          <p className="text-slate-500 mb-4">Get faster response times and dedicated support agents.</p>
          <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  const createTicket = () => {
    if (newTicket.title && newTicket.description) {
      const ticket = {
        id: Date.now(),
        ...newTicket,
        status: 'open',
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        agent: null,
        responseTime: 'Pending'
      };
      setTickets([ticket, ...tickets]);
      setNewTicket({ title: '', description: '', priority: 'medium', category: 'general' });
      setShowNewTicket(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-orange-100 text-orange-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const categories = ['general', 'technical', 'billing', 'feature', 'bug'];
  const priorities = ['low', 'medium', 'high'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Priority Support</h2>
          <p className="text-slate-600">Get faster response times and dedicated support agents.</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">Pro</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Open Tickets</p>
                <p className="text-2xl font-bold text-slate-900">{tickets.filter(t => t.status === 'open').length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Response</p>
                <p className="text-2xl font-bold text-slate-900">3.2h</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Resolved</p>
                <p className="text-2xl font-bold text-slate-900">{tickets.filter(t => t.status === 'resolved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Satisfaction</p>
                <p className="text-2xl font-bold text-slate-900">4.8/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-slate-600 mb-4">Get instant help from our support team</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-slate-600 mb-4">Call us for immediate assistance</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Call Now
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-slate-600 mb-4">Send us a detailed message</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create Ticket Button */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowNewTicket(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <MessageSquare className="h-4 w-4 mr-2" />
          Create Support Ticket
        </Button>
      </div>

      {/* Create Ticket Modal */}
      {showNewTicket && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
            <CardDescription>Submit a new support request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                placeholder="Please provide detailed information about your issue..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={createTicket} className="bg-indigo-600 hover:bg-indigo-700">
                Submit Ticket
              </Button>
              <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tickets List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="border-l-4 border-l-indigo-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold">{ticket.title}</h3>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-3">{ticket.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Response: {ticket.responseTime}</span>
                        </div>
                        {ticket.agent && (
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Agent: {ticket.agent}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          <div className="space-y-4">
            {tickets.filter(t => t.status === 'open').map((ticket) => (
              <Card key={ticket.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{ticket.title}</h3>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-slate-600">{ticket.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          <div className="space-y-4">
            {tickets.filter(t => t.status === 'in_progress').map((ticket) => (
              <Card key={ticket.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageSquare className="h-5 w-5 text-orange-600" />
                        <h3 className="text-lg font-semibold">{ticket.title}</h3>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-slate-600">{ticket.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <div className="space-y-4">
            {tickets.filter(t => t.status === 'resolved').map((ticket) => (
              <Card key={ticket.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold">{ticket.title}</h3>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-slate-600">{ticket.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Support Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Support Insights</CardTitle>
          <CardDescription>Your support history and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Priority Queue</h4>
              <p className="text-2xl font-bold text-blue-700">#2</p>
              <p className="text-sm text-blue-600">in queue</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Avg Response</h4>
              <p className="text-2xl font-bold text-green-700">3.2h</p>
              <p className="text-sm text-green-600">faster than standard</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900">Satisfaction</h4>
              <p className="text-2xl font-bold text-purple-700">4.8/5</p>
              <p className="text-sm text-purple-600">rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
