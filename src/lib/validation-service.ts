export interface ValidationResult {
  isValid: boolean;
  message: string;
  timestamp?: string;
}

export class ValidationService {
  private static instance: ValidationService;
  private validationUrl = 'https://salenus.xyz/validation-key.txt';
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
      // Fetch validation keys from external source
      const response = await fetch(this.validationUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const validationData = await response.text();
      const validKeys = this.parseValidationData(validationData);
      
      const isValid = validKeys.includes(key);
      const result: ValidationResult = {
        isValid,
        message: isValid ? 'Key is valid' : 'Key is not valid',
        timestamp: new Date().toISOString()
      };

      // Cache the result
      this.cache.set(key, result);
      
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
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