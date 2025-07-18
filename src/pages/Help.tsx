import React from 'react';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  Users, 
  BarChart3, 
  ClipboardList, 
  Heart, 
  Sparkles, 
  Star, 
  Camera, 
  Trophy, 
  Flame, 
  Bell, 
  Cloud, 
  Smartphone, 
  Shield, 
  Lightbulb, 
  GraduationCap, 
  Globe, 
  Settings, 
  Crown, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  FileText,
  Video,
  Download,
  Upload,
  Database,
  Key,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock contact form submission
    toast({
      title: "Message Sent! 📧",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const features = [
    {
      name: 'Habit Tracker',
      icon: <BarChart3 className="h-6 w-6" />,
      description: 'Track daily habits and build streaks',
      plan: 'Free',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      name: 'Task Manager',
      icon: <ClipboardList className="h-6 w-6" />,
      description: 'Create and manage tasks with priorities',
      plan: 'Free',
      color: 'bg-green-100 text-green-700'
    },
    {
      name: 'Pi Network Integration',
      icon: <Users className="h-6 w-6" />,
      description: 'Earn Pi cryptocurrency through the ecosystem',
      plan: 'Free',
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      name: 'Community Challenges',
      icon: <Trophy className="h-6 w-6" />,
      description: 'Join community challenges and compete',
      plan: 'Basic',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      name: 'Cross-Platform Sync',
      icon: <Cloud className="h-6 w-6" />,
      description: 'Sync data across all your devices',
      plan: 'Basic',
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      name: 'Mobile App Access',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Access the app on mobile devices',
      plan: 'Basic',
      color: 'bg-pink-100 text-pink-700'
    },
    {
      name: 'Mood Tracker',
      icon: <Heart className="h-6 w-6" />,
      description: 'Track your mood and get insights',
      plan: 'Pro',
      color: 'bg-red-100 text-red-700'
    },
    {
      name: 'Smart Reminders',
      icon: <Bell className="h-6 w-6" />,
      description: 'AI-powered reminders that adapt to your schedule',
      plan: 'Pro',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      name: 'Advanced Goals',
      icon: <Star className="h-6 w-6" />,
      description: 'Set complex goals with sub-milestones',
      plan: 'Pro',
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      name: 'Progress Photos',
      icon: <Camera className="h-6 w-6" />,
      description: 'Document your journey with progress photos',
      plan: 'Pro',
      color: 'bg-teal-100 text-teal-700'
    },
    {
      name: 'AI Personal Coach',
      icon: <Sparkles className="h-6 w-6" />,
      description: 'Get personalized coaching sessions from our AI',
      plan: 'Premium',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      name: 'VIP Support',
      icon: <Shield className="h-6 w-6" />,
      description: '24/7 priority support with dedicated account manager',
      plan: 'Premium',
      color: 'bg-indigo-100 text-indigo-700'
    }
  ];

  const faqs = [
    {
      question: "How do I create my first habit?",
      answer: "Navigate to the Habit Tracker section and click 'Add Habit'. Fill in the habit name, category, and target frequency. You can also set reminders and track your progress daily."
    },
    {
      question: "Can I sync my data across multiple devices?",
      answer: "Yes! With the Basic plan and above, you can sync your data across all your devices. Simply log in with the same account on each device and your data will automatically sync."
    },
    {
      question: "How does Pi Network integration work?",
      answer: "Pi Network integration allows you to earn Pi cryptocurrency by completing habits, participating in challenges, and staying consistent with your goals. Pi rewards are automatically tracked in your Pi Network wallet."
    },
    {
      question: "What's the difference between Free and Premium plans?",
      answer: "Free plan includes basic habit tracking and task management. Premium plan includes AI coaching, advanced analytics, calendar integration, VIP support, and exclusive features."
    },
    {
      question: "How do I export my data?",
      answer: "Go to Settings > Data Management > Export Data. This will download a JSON file containing all your habits, tasks, and Pi rewards data."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from Settings > Billing. You'll continue to have access to premium features until the end of your current billing period."
    },
    {
      question: "How do I reset my progress?",
      answer: "Go to Settings > Data Management > Reset Data. This will permanently delete all your data. Make sure to export your data first if you want to keep a backup."
    },
    {
      question: "What if I forget my password?",
      answer: "Click 'Forgot Password' on the login page. We'll send you a reset link via email. If you're using mock authentication, you can simply log in with any email and password."
    }
  ];

  const troubleshooting = [
    {
      issue: "Menu button not working",
      solution: "Try refreshing the page. If the issue persists, check if you're logged in and try logging out and back in.",
      severity: "Low"
    },
    {
      issue: "Data not syncing",
      solution: "Check your internet connection. If using mock authentication, data is stored locally. For real authentication, ensure you're logged in with the same account.",
      severity: "Medium"
    },
    {
      issue: "Can't create habits or tasks",
      solution: "This might be due to missing database tables. If using Supabase, run the database schema. For mock mode, data is stored in localStorage.",
      severity: "Medium"
    },
    {
      issue: "404 errors on pages",
      solution: "This is likely a routing issue. Try navigating from the dashboard overview instead of direct URLs. Ensure the development server is running properly.",
      severity: "High"
    },
    {
      issue: "Sign out not working",
      solution: "Try refreshing the page or clearing browser cache. The logout function should redirect you to the home page.",
      severity: "Medium"
    },
    {
      issue: "Mobile layout issues",
      solution: "Ensure you're using a responsive browser. The app is optimized for mobile devices with a dedicated mobile layout and footer navigation.",
      severity: "Low"
    }
  ];

  const filteredFeatures = features.filter(feature =>
    feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-6 w-6 text-indigo-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Help & Support</h1>
                <p className="text-xs text-gray-600">Get help with Salenus AI</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.history.back()}
              className="text-xs px-3 py-1"
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help topics, features, or issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-10 text-xs">
            <TabsTrigger value="overview" className="text-xs px-2">Overview</TabsTrigger>
            <TabsTrigger value="features" className="text-xs px-2">Features</TabsTrigger>
            <TabsTrigger value="faq" className="text-xs px-2">FAQ</TabsTrigger>
            <TabsTrigger value="troubleshooting" className="text-xs px-2">Issues</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs px-2">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Getting Started</span>
                  </CardTitle>
                </CardHeader>
                                  <CardContent>
                    <p className="text-gray-600 mb-3 text-sm">
                      New to Salenus AI? Start here to learn the basics and get up and running quickly.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs">Create your first habit</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs">Set up your profile</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs">Explore features</span>
                      </div>
                    </div>
                  </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5" />
                    <span>Plans & Pricing</span>
                  </CardTitle>
                </CardHeader>
                                  <CardContent>
                    <p className="text-gray-600 mb-3 text-sm">
                      Understand the different plans and what features are available at each level.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">Free</Badge>
                      <Badge variant="secondary" className="text-xs">Basic - 5 Pi</Badge>
                      <Badge variant="secondary" className="text-xs">Pro - 10 Pi</Badge>
                      <Badge variant="secondary" className="text-xs">Premium - 15 Pi</Badge>
                    </div>
                  </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Support</span>
                  </CardTitle>
                </CardHeader>
                                  <CardContent>
                    <p className="text-gray-600 mb-3 text-sm">
                      Need help? We're here to support you with any questions or issues.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs">support@salenus.ai</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs">24/7 Support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="text-xs">Community Forum</span>
                      </div>
                    </div>
                  </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription className="text-xs">
                  Common tasks and quick links to get you started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-xs">Habit Tracker</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <ClipboardList className="h-5 w-5" />
                    <span className="text-xs">Task Manager</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <Settings className="h-5 w-5" />
                    <span className="text-xs">Settings</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <Database className="h-5 w-5" />
                    <span className="text-xs">Data Management</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">All Features</CardTitle>
                <CardDescription className="text-xs">
                  Explore all available features and their requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                                      {filteredFeatures.map((feature) => (
                      <Card key={feature.name} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 rounded-lg ${feature.color}`}>
                                {feature.icon}
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-sm">{feature.name}</CardTitle>
                                <p className="text-xs text-gray-600">{feature.description}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs ml-2">{feature.plan}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
                <CardDescription className="text-xs">
                  Find answers to common questions about Salenus AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-sm">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 text-xs">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Troubleshooting Tab */}
          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
                <CardDescription>
                  Quick fixes for common problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {troubleshooting.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{item.issue}</h4>
                        <Badge 
                          variant={item.severity === 'High' ? 'destructive' : 
                                  item.severity === 'Medium' ? 'secondary' : 'outline'}
                        >
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{item.solution}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>System Requirements</CardTitle>
                <CardDescription>
                  Ensure your device meets the requirements for optimal performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Browser Requirements</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Chrome 90+ or Firefox 88+ or Safari 14+</li>
                      <li>• JavaScript enabled</li>
                      <li>• Local storage enabled</li>
                      <li>• Internet connection for sync features</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Mobile Requirements</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• iOS 14+ or Android 8+</li>
                      <li>• 2GB RAM minimum</li>
                      <li>• 100MB free storage</li>
                      <li>• Touch screen support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Send us a message and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@salenus.ai</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-gray-600">Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-gray-600">Premium users only</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-sm text-gray-600">Within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h4 className="font-semibold mb-3">Support Hours</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Emergency support only</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
                <CardDescription>
                  Helpful links and resources to enhance your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">User Guide</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Video className="h-6 w-6" />
                    <span className="text-sm">Video Tutorials</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Community Forum</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 