# Supabase Backend Setup for Salenus AI

This document provides a complete guide to setting up and using the Supabase backend for the Salenus AI application.

## 🚀 Quick Start

### 1. Database Schema Setup

Run the SQL commands from `database-schema.sql` in your Supabase SQL editor:

```sql
-- Copy and paste the entire content of database-schema.sql
-- This will create all tables, indexes, triggers, and RLS policies
```

### 2. Environment Variables

The following environment variables are already configured in the application:

```env
SUPABASE_URL=https://mdbuzyvhmgjaqjezpafj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYnV6eXZobWdqYXFqZXpwYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODEyMDEsImV4cCI6MjA2ODI1NzIwMX0.zfz0T5prk-By0C352oFDvXQyQ8sXmWEveZ03S0h5Ing
```

### 3. Storage Buckets

Create the following storage buckets in your Supabase dashboard:

- `habit-images` - For habit progress photos
- `task-attachments` - For task file attachments
- `user-avatars` - For user profile pictures

Set the following policies for each bucket:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to view their own files
CREATE POLICY "Users can view own files" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## 📊 Database Schema Overview

### Core Tables

#### Users Table
- Stores user profiles and subscription information
- Links to Supabase Auth users
- Tracks plan status and payment history

#### Habits Table
- Comprehensive habit tracking with streaks and progress
- Supports images, notes, and milestones
- Real-time progress tracking

#### Tasks Table
- Full task management with time tracking
- Supports attachments, subtasks, and recurring tasks
- Priority and status management

#### Notes Tables
- Separate tables for habit and task notes
- Supports mood and energy tracking for habits
- Comment system for tasks

#### Notifications Table
- In-app notification system
- Supports different notification types
- Read/unread status tracking

### Advanced Features

#### Real-time Subscriptions
- Live updates for habits, tasks, and notifications
- Automatic UI updates across devices
- Optimized for performance

#### Analytics Tracking
- User behavior tracking
- Feature usage analytics
- Performance monitoring

#### File Management
- Secure file uploads
- Image processing for habit photos
- Attachment system for tasks

## 🔧 API Integration

### Authentication Flow

1. **Sign Up**: Creates Supabase Auth user and app user record
2. **Sign In**: Authenticates and loads user data
3. **Session Management**: Automatic session persistence
4. **Sign Out**: Clears session and local data

### Data Operations

#### Habits
```typescript
// Create habit
const habit = await DataService.createHabit({
  userId: user.id,
  name: 'Exercise',
  category: 'Health',
  goal: 1
});

// Toggle completion
await DataService.toggleHabitCompletion(habitId, true);

// Get user habits
const habits = await DataService.getHabits(userId);
```

#### Tasks
```typescript
// Create task
const task = await DataService.createTask({
  userId: user.id,
  title: 'Complete project',
  category: 'Work',
  priority: 'High'
});

// Update status
await DataService.updateTask(taskId, { status: 'In Progress' });

// Get user tasks
const tasks = await DataService.getTasks(userId);
```

#### Real-time Updates
```typescript
// Subscribe to changes
const subscriptions = DataService.subscribeToUserData(userId, {
  onHabitChange: (payload) => {
    // Handle habit updates
  },
  onTaskChange: (payload) => {
    // Handle task updates
  }
});
```

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Automatic data isolation
- Secure by default

### Authentication
- JWT-based authentication
- Session management
- Secure password handling

### File Security
- Authenticated uploads only
- User-specific file access
- Secure file URLs

## 📈 Performance Optimizations

### Database Indexes
- Optimized queries for common operations
- Efficient filtering and sorting
- Fast user data retrieval

### Real-time Optimizations
- Efficient subscription management
- Minimal data transfer
- Connection pooling

### Caching Strategy
- Client-side caching for frequently accessed data
- Optimistic updates for better UX
- Background data synchronization

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://mdbuzyvhmgjaqjezpafj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔍 Monitoring and Analytics

### Built-in Analytics
- User engagement tracking
- Feature usage metrics
- Performance monitoring

### Error Tracking
- Comprehensive error logging
- User-friendly error messages
- Automatic error reporting

## 🛠️ Development

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the app at `http://localhost:5173`

### Database Migrations
- Schema changes should be applied through Supabase dashboard
- Test migrations in development environment first
- Backup production data before major changes

### Testing
- Unit tests for data service functions
- Integration tests for API endpoints
- End-to-end tests for user flows

## 📚 API Reference

### DataService Methods

#### User Management
- `createUser(userData)` - Create new user
- `getUser(userId)` - Get user profile
- `updateUser(userId, updates)` - Update user data

#### Habit Management
- `createHabit(habitData)` - Create new habit
- `getHabits(userId)` - Get user habits
- `updateHabit(habitId, updates)` - Update habit
- `deleteHabit(habitId)` - Delete habit
- `toggleHabitCompletion(habitId, completed)` - Toggle completion

#### Task Management
- `createTask(taskData)` - Create new task
- `getTasks(userId)` - Get user tasks
- `updateTask(taskId, updates)` - Update task
- `deleteTask(taskId)` - Delete task
- `toggleTaskCompletion(taskId, completed)` - Toggle completion

#### File Management
- `uploadHabitImage(habitId, file)` - Upload habit image
- `uploadTaskAttachment(taskId, file)` - Upload task attachment

#### Real-time Features
- `subscribeToUserData(userId, callbacks)` - Subscribe to changes
- `trackEvent(eventData)` - Track analytics events

## 🎯 Best Practices

### Data Consistency
- Always use transactions for related operations
- Implement proper error handling
- Use optimistic updates for better UX

### Performance
- Implement pagination for large datasets
- Use efficient queries with proper indexes
- Minimize real-time subscriptions

### Security
- Validate all user inputs
- Implement proper access controls
- Regular security audits

### User Experience
- Provide loading states
- Implement error boundaries
- Use optimistic updates
- Real-time synchronization

## 🆘 Troubleshooting

### Common Issues

#### Authentication Problems
- Check environment variables
- Verify Supabase project settings
- Clear browser cache and cookies

#### Real-time Issues
- Check network connectivity
- Verify subscription setup
- Monitor browser console for errors

#### File Upload Issues
- Check storage bucket permissions
- Verify file size limits
- Ensure proper file types

### Debug Mode
Enable debug logging by setting:
```typescript
localStorage.setItem('debug', 'true');
```

## 📞 Support

For technical support or questions about the Supabase integration:

1. Check the Supabase documentation
2. Review the application logs
3. Contact the development team

## 🔄 Updates and Maintenance

### Regular Maintenance
- Monitor database performance
- Update dependencies regularly
- Review security policies
- Backup data regularly

### Version Updates
- Test updates in development
- Deploy during low-traffic periods
- Monitor for issues after deployment
- Rollback plan for critical issues 