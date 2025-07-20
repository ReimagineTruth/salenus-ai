export interface ValidationResult {
  isValid: boolean;
  message: string;
  timestamp?: string;
}

export class ValidationService {
  private static instance: ValidationService;
  private validationUrl = 'http://localhost:3000/validation-key.txt';
  private fallbackKey = 'e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2';
  private cache: Map<string, ValidationResult> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  public async validateKey(key: string): Promise<ValidationResult> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && cached.timestamp) {
      const age = Date.now() - new Date(cached.timestamp).getTime();
      if (age < this.cacheTimeout) {
        return cached;
      }
    }

    try {
      // First try to fetch from external source
      const response = await fetch(this.validationUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const validationData = await response.text();
        const validKeys = this.parseValidationData(validationData);
        
        const isValid = validKeys.includes(key);
        const result: ValidationResult = {
          isValid,
          message: isValid ? 'Key is valid (from hosted file)' : 'Key is not valid',
          timestamp: new Date().toISOString()
        };

        // Cache the result
        this.cache.set(key, result);
        
        return result;
      } else {
        // Fallback to local validation if external file is not accessible
        console.log('External validation file not accessible, using fallback validation');
        return this.validateWithFallback(key);
      }
    } catch (error) {
      console.error('Validation error:', error);
      console.log('Using fallback validation due to network error');
      return this.validateWithFallback(key);
    }
  }

  private validateWithFallback(key: string): ValidationResult {
    const isValid = key === this.fallbackKey;
    const result: ValidationResult = {
      isValid,
      message: isValid ? 'Key is valid (fallback validation)' : 'Key is not valid',
      timestamp: new Date().toISOString()
    };

    // Cache the result
    this.cache.set(key, result);
    
    return result;
  }

  private parseValidationData(data: string): string[] {
    // Parse the validation data - assuming it's a list of valid keys
    // You may need to adjust this based on the actual format of your validation file
    return data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'))
      .filter(line => /^[a-f0-9]{64}$/.test(line)); // Basic hex validation for 64-char keys
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCachedResults(): Map<string, ValidationResult> {
    return new Map(this.cache);
  }
}

export const validationService = ValidationService.getInstance(); 