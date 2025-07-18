import { supabase } from './supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase test failed:', error);
    return false;
  }
};

export const testAuthFlow = async () => {
  try {
    console.log('Testing authentication flow...');
    
    // Test sign up
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    const testName = 'Test User';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testName
        }
      }
    });
    
    if (signUpError) {
      console.error('Sign up test failed:', signUpError);
      return false;
    }
    
    console.log('Sign up test successful:', signUpData);
    
    // Test sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.error('Sign in test failed:', signInError);
      return false;
    }
    
    console.log('Sign in test successful:', signInData);
    
    // Test sign out
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('Sign out test failed:', signOutError);
      return false;
    }
    
    console.log('Sign out test successful');
    return true;
  } catch (error) {
    console.error('Auth flow test failed:', error);
    return false;
  }
}; 