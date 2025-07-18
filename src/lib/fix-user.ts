import { supabase } from './supabase';
import { SupabaseService } from './supabase-service';

export const fixMissingUser = async (authUserId: string) => {
  try {
    console.log('fixMissingUser: Attempting to fix missing user for authUserId:', authUserId);
    
    // Get the auth user details
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      console.error('fixMissingUser: Error getting auth user:', authError);
      return null;
    }
    
    console.log('fixMissingUser: Auth user found:', authUser.email);
    
    // Try to get the user from our database
    let appUser = await SupabaseService.getUser(authUserId);
    
    if (!appUser) {
      console.log('fixMissingUser: User not found in database, creating...');
      
      // Create the user record
      appUser = await SupabaseService.createUser({
        email: authUser.email!,
        name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
        plan: 'Free',
        authUserId: authUserId
      });
      
      if (appUser) {
        console.log('fixMissingUser: Successfully created user:', appUser);
        return appUser;
      } else {
        console.error('fixMissingUser: Failed to create user');
        return null;
      }
    } else {
      console.log('fixMissingUser: User already exists:', appUser);
      return appUser;
    }
  } catch (error) {
    console.error('fixMissingUser: Error fixing user:', error);
    return null;
  }
}; 