-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(20) DEFAULT 'Free' CHECK (plan IN ('Free', 'Basic', 'Pro', 'Premium')),
    plan_expiry TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    has_paid BOOLEAN DEFAULT false,
    avatar_url TEXT,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    streak INTEGER DEFAULT 0,
    total_days INTEGER DEFAULT 0,
    completed_today BOOLEAN DEFAULT false,
    goal INTEGER DEFAULT 1,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_completed TIMESTAMP WITH TIME ZONE,
    best_streak INTEGER DEFAULT 0,
    weekly_progress INTEGER[] DEFAULT ARRAY[0,0,0,0,0,0,0],
    monthly_progress INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    yearly_progress INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT[] DEFAULT ARRAY[]::TEXT[],
    reminder_time TIME,
    reminder_enabled BOOLEAN DEFAULT true,
    difficulty VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    milestones JSONB DEFAULT '[]'::jsonb
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(20) DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Review', 'Done')),
    category VARCHAR(50) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_time INTEGER, -- in minutes
    actual_time INTEGER, -- in minutes
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    attachments TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT[] DEFAULT ARRAY[]::TEXT[],
    assignee VARCHAR(255),
    reminder_time TIME,
    reminder_enabled BOOLEAN DEFAULT true,
    recurring VARCHAR(20) DEFAULT 'None' CHECK (recurring IN ('Daily', 'Weekly', 'Monthly', 'None')),
    subtasks JSONB DEFAULT '[]'::jsonb,
    time_spent INTEGER DEFAULT 0, -- in minutes
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit notes table
CREATE TABLE IF NOT EXISTS habit_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    mood INTEGER CHECK (mood >= 1 AND mood <= 10),
    energy INTEGER CHECK (energy >= 1 AND energy <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task notes table
CREATE TABLE IF NOT EXISTS task_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type VARCHAR(20) DEFAULT 'note' CHECK (type IN ('note', 'comment', 'update')),
    author VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'system' CHECK (type IN ('habit', 'task', 'reminder', 'system')),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table for tracking user behavior
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category);
CREATE INDEX IF NOT EXISTS idx_habits_completed_today ON habits(completed_today);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

CREATE INDEX IF NOT EXISTS idx_habit_notes_habit_id ON habit_notes(habit_id);
CREATE INDEX IF NOT EXISTS idx_task_notes_task_id ON task_notes(task_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_last_updated BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to reset daily habit completion
CREATE OR REPLACE FUNCTION reset_daily_habits()
RETURNS void AS $$
BEGIN
    UPDATE habits 
    SET completed_today = false 
    WHERE DATE(created_at) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create function to check for overdue tasks
CREATE OR REPLACE FUNCTION check_overdue_tasks()
RETURNS TABLE(task_id UUID, user_id UUID, title VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.user_id, t.title
    FROM tasks t
    WHERE t.due_date < NOW() 
    AND t.completed = false 
    AND t.status != 'Done';
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Habits policies
CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own habits" ON habits FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid()::text = user_id::text);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid()::text = user_id::text);

-- Habit notes policies
CREATE POLICY "Users can view own habit notes" ON habit_notes FOR SELECT USING (
    EXISTS (SELECT 1 FROM habits h WHERE h.id = habit_notes.habit_id AND h.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can insert own habit notes" ON habit_notes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM habits h WHERE h.id = habit_notes.habit_id AND h.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can update own habit notes" ON habit_notes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM habits h WHERE h.id = habit_notes.habit_id AND h.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can delete own habit notes" ON habit_notes FOR DELETE USING (
    EXISTS (SELECT 1 FROM habits h WHERE h.id = habit_notes.habit_id AND h.user_id::text = auth.uid()::text)
);

-- Task notes policies
CREATE POLICY "Users can view own task notes" ON task_notes FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_notes.task_id AND t.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can insert own task notes" ON task_notes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_notes.task_id AND t.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can update own task notes" ON task_notes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_notes.task_id AND t.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can delete own task notes" ON task_notes FOR DELETE USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_notes.task_id AND t.user_id::text = auth.uid()::text)
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid()::text = user_id::text);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own sessions" ON user_sessions FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own sessions" ON user_sessions FOR DELETE USING (auth.uid()::text = user_id::text);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON analytics FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own analytics" ON analytics FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create realtime subscriptions
-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE habits;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE habit_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE task_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications; 