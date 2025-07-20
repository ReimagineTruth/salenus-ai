import { validationService } from './validation-service';

export const testValidation = async () => {
  console.log('🧪 Testing validation system...');
  
  const testKey = 'e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2';
  const wrongKey = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  
  try {
    console.log('Testing with correct key...');
    const result1 = await validationService.validateKey(testKey);
    console.log('✅ Correct key result:', result1);
    
    console.log('Testing with wrong key...');
    const result2 = await validationService.validateKey(wrongKey);
    console.log('❌ Wrong key result:', result2);
    
    console.log('Testing with empty key...');
    const result3 = await validationService.validateKey('');
    console.log('❌ Empty key result:', result3);
    
    console.log('🧪 Validation test completed!');
    return {
      correctKey: result1,
      wrongKey: result2,
      emptyKey: result3
    };
  } catch (error) {
    console.error('❌ Validation test failed:', error);
    throw error;
  }
};

// Test the validation system
if (typeof window !== 'undefined') {
  // Add to window for testing in browser console
  (window as any).testValidation = testValidation;
} 