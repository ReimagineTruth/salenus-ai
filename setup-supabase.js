#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * 
 * This script helps set up the database schema for Salenus AI.
 * Run this script after creating your Supabase project.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://mdbuzyvhmgjaqjezpafj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYnV6eXZobWdqYXFqZXpwYWZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY4MTIwMSwiZXhwIjoyMDY4MjU3MjAxfQ.q6IXGSwLuesCROHhTehzn_NKUqANaFPk_SNmVi9Ad8U';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupDatabase() {
  console.log('🚀 Setting up Salenus AI database...\n');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Executing database schema...');
    
    // Execute the schema
    const { error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('❌ Error executing schema:', error);
      return;
    }

    console.log('✅ Database schema executed successfully!');

    // Create storage buckets
    console.log('\n📦 Creating storage buckets...');
    
    const buckets = ['habit-images', 'task-attachments', 'user-avatars'];
    
    for (const bucketName of buckets) {
      const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
        fileSizeLimit: 52428800 // 50MB
      });

      if (bucketError) {
        console.log(`⚠️  Bucket ${bucketName} might already exist:`, bucketError.message);
      } else {
        console.log(`✅ Created bucket: ${bucketName}`);
      }
    }

    // Set up storage policies
    console.log('\n🔒 Setting up storage policies...');
    
    const storagePolicies = [
      {
        name: 'Users can upload files',
        policy: `CREATE POLICY "Users can upload files" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');`
      },
      {
        name: 'Users can view own files',
        policy: `CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);`
      },
      {
        name: 'Users can update own files',
        policy: `CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);`
      },
      {
        name: 'Users can delete own files',
        policy: `CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);`
      }
    ];

    for (const policy of storagePolicies) {
      try {
        await supabase.rpc('exec_sql', { sql: policy.policy });
        console.log(`✅ Created policy: ${policy.name}`);
      } catch (error) {
        console.log(`⚠️  Policy ${policy.name} might already exist`);
      }
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Test user registration and login');
    console.log('3. Verify habit and task creation');
    console.log('4. Check real-time updates');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n💡 Manual setup instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL editor');
    console.log('3. Copy and paste the contents of database-schema.sql');
    console.log('4. Execute the SQL commands');
    console.log('5. Create storage buckets manually');
  }
}

// Run the setup
setupDatabase(); 