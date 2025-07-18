#!/usr/bin/env node

/**
 * Real Authentication Setup Script for Salenus A.I
 * This script helps set up the real authentication workflow with Supabase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up Real Authentication for Salenus A.I...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file with your Supabase credentials...');
  
  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://mdbuzyvhmgjaqjezpafj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYnV6eXZobWdqYXFqZXpwYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODEyMDEsImV4cCI6MjA2ODI1NzIwMX0.zfz0T5prk-By0C352oFDvXQyQ8sXmWEveZ03S0h5Ing

# Development Settings
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:3003

# Database Configuration
POSTGRES_URL="postgres://postgres.mdbuzyvhmgjaqjezpafj:Ud4gdiRuFApxSwhS@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_USER="postgres"
POSTGRES_HOST="db.mdbuzyvhmgjaqjezpafj.supabase.co"
SUPABASE_JWT_SECRET="aP2mBpRhfkQ+1czyMiyX2zOW+PdLymm2wVQdI4tI3vvAGO9rucvvDcdIYHHJWM5elKm8WjuKD5/ZwING+XPwxg=="
POSTGRES_PRISMA_URL="postgres://postgres.mdbuzyvhmgjaqjezpafj:Ud4gdiRuFApxSwhS@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
POSTGRES_PASSWORD="Ud4gdiRuFApxSwhS"
POSTGRES_DATABASE="postgres"
SUPABASE_URL="https://mdbuzyvhmgjaqjezpafj.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYnV6eXZobWdqYXFqZXpwYWZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY4MTIwMSwiZXhwIjoyMDY4MjU3MjAxfQ.q6IXGSwLuesCROHhTehzn_NKUqANaFPk_SNmVi9Ad8U"
POSTGRES_URL_NON_POOLING="postgres://postgres.mdbuzyvhmgjaqjezpafj:Ud4gdiRuFApxSwhS@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!\n');
} else {
  console.log('✅ .env file already exists\n');
}

console.log('📋 Real Authentication Setup Complete!\n');

console.log('🎯 Next Steps:');
console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
console.log('2. Navigate to your project: mdbuzyvhmgjaqjezpafj');
console.log('3. Go to SQL Editor and run the database-schema.sql file');
console.log('4. Go to Authentication > Settings and configure:');
console.log('   - Site URL: http://localhost:3003');
console.log('   - Redirect URLs: http://localhost:3003/dashboard');
console.log('5. Start the development server: npm run dev');
console.log('6. Test the real authentication workflow\n');

console.log('🔧 Real Authentication Features:');
console.log('✅ Real user accounts in Supabase');
console.log('✅ Secure password authentication');
console.log('✅ User data persistence');
console.log('✅ Plan management');
console.log('✅ Payment processing');
console.log('✅ Dashboard access control');
console.log('✅ Session management\n');

console.log('🧪 Testing the Real Workflow:');
console.log('1. Create a new account with real email');
console.log('2. Sign in with your credentials');
console.log('3. Choose a plan and complete payment');
console.log('4. Access your personalized dashboard');
console.log('5. Manage habits, tasks, and challenges\n');

console.log('🚀 Ready to launch real authentication!'); 