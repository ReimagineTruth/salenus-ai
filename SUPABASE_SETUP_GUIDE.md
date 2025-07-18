# Supabase Setup Guide

## Overview
This guide will help you set up the Supabase database for the Salenus A.I application. The database schema includes all necessary tables for habits, tasks, Pi Network sessions, and user management.

## Prerequisites
- Supabase account (free tier works)
- Access to Supabase dashboard
- Basic SQL knowledge

## Step 1: Create Supabase Project

### 1.1 Create New Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `salenus-ai`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Wait for Setup
- Project creation takes 2-3 minutes
- You'll receive an email when ready

## Step 2: Configure Environment Variables

### 2.1 Get Project Credentials
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL**
   - **Anon public key**
   - **Service role key** (keep this secret)

### 2.2 Update Environment Variables
Create or update your `.env` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Run Database Schema

### 3.1 Access SQL Editor
1. In your Supabase dashboard
2. Go to **SQL Editor**
3. Click **New Query**

### 3.2 Run Schema Script
1. Copy the entire contents of `database-schema.sql`
2. Paste into the SQL editor
3. Click **Run** to execute the script

### 3.3 Verify Tables Created
After running the script, you should see these tables in **Table Editor**:
- `users`
- `habits`
- `habit_completions`
- `tasks`
- `pi_sessions`
- `challenges`
- `user_settings`
- `notifications`
- `user_stats`

## Step 4: Configure Authentication

### 4.1 Enable Email Auth
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - **Enable email confirmations**: Optional
   - **Enable email change confirmations**: Optional

### 4.2 Configure Site URL
1. Go to **Authentication** → **Settings**
2. Add your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: `http://localhost:3000/**`

## Step 5: Test Database Connection

### 5.1 Test with Sample Data
Run this SQL to test the setup:

```sql
-- Insert test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test@salenus.ai',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Check if user was created
SELECT * FROM public.users;
```

## Step 6: Configure Row Level Security (RLS)

### 6.1 Verify RLS Policies
The schema script creates RLS policies automatically. Verify in **Authentication** → **Policies**:

- All tables should have RLS enabled
- Policies should be created for each table
- Users can only access their own data

## Step 7: Update Application Configuration

### 7.1 Update Supabase Client
Make sure your `src/lib/supabase.ts` file has the correct configuration:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 7.2 Test Connection
Add this to your app to test the connection:

```typescript
// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
    } else {
      console.log('Database connected successfully!')
    }
  } catch (error) {
    console.error('Connection test failed:', error)
  }
}

testConnection()
```

## Step 8: Enable Real-time Features

### 8.1 Configure Realtime
1. Go to **Database** → **Replication**
2. Enable realtime for these tables:
   - `habits`
   - `tasks`
   - `pi_sessions`
   - `notifications`

### 8.2 Test Real-time
Add this to test real-time functionality:

```typescript
// Test real-time subscription
const subscription = supabase
  .channel('habits')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'habits' },
    (payload) => {
      console.log('Real-time update:', payload)
    }
  )
  .subscribe()
```

## Step 9: Production Deployment

### 9.1 Update Site URL
When deploying to production:
1. Go to **Authentication** → **Settings**
2. Update **Site URL** to your production domain
3. Add production redirect URLs

### 9.2 Environment Variables
Update your production environment variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## Troubleshooting

### Common Issues

#### 1. "relation does not exist" Error
**Problem**: Tables not created
**Solution**: 
- Run the complete `database-schema.sql` script
- Check for any SQL errors in the console
- Verify tables exist in **Table Editor**

#### 2. Authentication Errors
**Problem**: Users can't sign up/login
**Solution**:
- Check **Authentication** → **Settings**
- Verify site URL and redirect URLs
- Test with a simple signup form

#### 3. RLS Policy Errors
**Problem**: Users can't access their data
**Solution**:
- Verify RLS is enabled on all tables
- Check policies are created correctly
- Test with authenticated user

#### 4. Real-time Not Working
**Problem**: Real-time updates not received
**Solution**:
- Enable real-time in **Database** → **Replication**
- Check subscription code
- Verify channel name matches table name

### Debug Steps

#### 1. Check Database Logs
1. Go to **Logs** → **Database**
2. Look for recent errors
3. Check query performance

#### 2. Test Individual Tables
```sql
-- Test habits table
SELECT * FROM habits LIMIT 1;

-- Test tasks table  
SELECT * FROM tasks LIMIT 1;

-- Test pi_sessions table
SELECT * FROM pi_sessions LIMIT 1;
```

#### 3. Verify User Creation
```sql
-- Check if user profile is created
SELECT * FROM users WHERE email = 'test@salenus.ai';
```

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly

### 2. RLS Policies
- Always enable RLS on user data tables
- Test policies thoroughly
- Use least privilege principle

### 3. API Keys
- Use anon key for client-side code
- Use service role key only for server-side operations
- Never expose service role key in client code

## Performance Optimization

### 1. Indexes
The schema includes performance indexes:
- User ID indexes for fast queries
- Date indexes for time-based queries
- Status indexes for filtering

### 2. Connection Pooling
For production:
- Enable connection pooling
- Monitor connection usage
- Set appropriate pool size

### 3. Query Optimization
- Use `select()` to limit returned columns
- Use `limit()` for large datasets
- Implement pagination for lists

## Monitoring

### 1. Database Metrics
Monitor in Supabase dashboard:
- Query performance
- Connection usage
- Storage usage
- Error rates

### 2. Application Logs
Set up logging for:
- Authentication events
- Database errors
- Real-time subscription issues

## Support

If you encounter issues:
1. Check Supabase documentation
2. Review error logs in dashboard
3. Test with minimal example
4. Contact Supabase support if needed

The database is now ready for the Salenus A.I application! 