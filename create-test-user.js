// Test User Creation Script for Salenus AI
// This script will create a test user account in your Supabase database

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://mdbuzyvhmgjaqjezpafj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYnV6eXZobWdqYXFqZXpwYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODEyMDEsImV4cCI6MjA2ODI1NzIwMX0.zfz0T5prk-By0C352oFDvXQyQ8sXmWEveZ03S0h5Ing';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  try {
    console.log('🔧 Creating test user account...');
    
    // Test user credentials
    const testEmail = 'unlockthegoateway@gmail.com';
    const testPassword = 'testpassword123';
    const testName = 'Test User';
    
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}`);
    console.log(`👤 Name: ${testName}`);
    
    // Step 1: Create user in Supabase Auth
    console.log('\n1️⃣ Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testName
        }
      }
    });
    
    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ User already exists in Auth, proceeding...');
      } else {
        throw authError;
      }
    } else {
      console.log('✅ User created in Auth successfully');
    }
    
    // Step 2: Sign in to get the user ID
    console.log('\n2️⃣ Signing in to get user ID...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      throw signInError;
    }
    
    console.log('✅ Sign in successful');
    const userId = signInData.user.id;
    console.log(`🆔 User ID: ${userId}`);
    
    // Step 3: Create user record in our database
    console.log('\n3️⃣ Creating user record in database...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: testEmail,
        name: testName,
        plan: 'Free',
        plan_expiry: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        has_paid: false,
        avatar_url: null
      })
      .select()
      .single();
    
    if (userError) {
      throw userError;
    }
    
    console.log('✅ User record created in database');
    console.log('📊 User data:', userData);
    
    // Step 4: Test the login
    console.log('\n4️⃣ Testing login...');
    const { data: testLoginData, error: testLoginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (testLoginError) {
      throw testLoginError;
    }
    
    console.log('✅ Login test successful!');
    
    // Summary
    console.log('\n🎉 Test User Setup Complete!');
    console.log('================================');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}`);
    console.log(`👤 Name: ${testName}`);
    console.log(`🆔 User ID: ${userId}`);
    console.log('\n💡 You can now use these credentials to log in to your app!');
    console.log('🌐 Go to: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your Supabase database is set up correctly');
    console.log('2. Check that the users table exists');
    console.log('3. Verify your Supabase credentials are correct');
    console.log('4. Try running the database schema first');
  }
}

// Run the script
createTestUser(); 