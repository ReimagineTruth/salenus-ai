// Pi Network Integration Service
import axios from 'axios';

// Types for Pi Network
declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (scopes: string[], onIncompletePaymentFound?: (payment: any) => void) => Promise<any>;
      createPayment: (paymentData: any, callbacks: any) => Promise<any>;
      currentUser?: (() => any) | any;
      logout: () => void;
      nativeFeaturesList: () => Promise<string[]>;
      Ads: {
        showAd: (adType: 'interstitial' | 'rewarded') => Promise<{
          result: 'AD_CLOSED' | 'AD_REWARDED' | 'AD_ERROR' | 'ADS_NOT_SUPPORTED';
          adId?: string;
        }>;
        requestAd: (adType: 'interstitial' | 'rewarded') => Promise<{
          result: 'AD_LOADED' | 'AD_ERROR' | 'ADS_NOT_SUPPORTED';
        }>;
        isAdReady: (adType: 'interstitial' | 'rewarded') => Promise<{
          ready: boolean;
        }>;
      };
    };
  }
}

export interface PiAuth {
  accessToken: string;
  user: {
    uid: string;
    username: string;
    roles: string[];
    m?: any; // Additional properties that might be returned by Pi SDK
  };
}

export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: any;
  to_address: string;
  created_at: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  transaction?: {
    txid: string;
    verified: boolean;
  };
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata?: any;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: any, payment: any) => void;
}

export class PiNetworkService {
  private static instance: PiNetworkService;
  private apiKey: string = '';
  private baseUrl: string = 'https://api.minepi.com';
  private isAuthenticated: boolean = false;
  private currentAuth: PiAuth | null = null;

  private constructor() {
    // Initialize with your API key from environment or config
    this.apiKey = import.meta.env.VITE_PI_API_KEY || 'giynqmyzwzxpgks0xoevamcbpwfonpjq0fmzxb1vye0itgiuv0sxoqkbd0qtpx79';
  }

  public static getInstance(): PiNetworkService {
    if (!PiNetworkService.instance) {
      PiNetworkService.instance = new PiNetworkService();
    }
    return PiNetworkService.instance;
  }

  // Initialize Pi SDK
  public init(): void {
    if (typeof window !== 'undefined' && window.Pi) {
      console.log('Initializing Pi SDK in sandbox mode...');
      window.Pi.init({ version: "2.0", sandbox: true });
      console.log('Pi SDK initialized successfully');
    } else {
      console.warn('Pi SDK not available for initialization');
    }
  }

  // Authenticate user with Pi Network
  public async authenticate(): Promise<PiAuth> {
    if (typeof window === 'undefined' || !window.Pi) {
      throw new Error('Pi SDK not available');
    }

    try {
      const Pi = window.Pi;
      const scopes = ['payments', 'username'];
      
      // Empty function that will log an incomplete payment if found
      // Developer needs to implement this callback function
      function onIncompletePaymentFound(payment: any) {
        console.log('Incomplete payment found:', payment);
        // You can implement your own logic here to handle incomplete payments
      }
      
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      
      this.currentAuth = auth;
      this.isAuthenticated = true;
      
      console.log('Pi authentication successful:', auth);
      return auth;
    } catch (error) {
      console.error('Pi authentication failed:', error);
      throw error;
    }
  }

  // Get current authenticated user
  public getCurrentUser(): any {
    if (typeof window !== 'undefined' && window.Pi) {
      // Check if currentUser is a function or property
      if (typeof window.Pi.currentUser === 'function') {
        return window.Pi.currentUser();
      } else if (window.Pi.currentUser) {
        return window.Pi.currentUser;
      }
    }
    return null;
  }

  // Logout from Pi Network
  public logout(): void {
    if (typeof window !== 'undefined' && window.Pi) {
      window.Pi.logout();
    }
    this.isAuthenticated = false;
    this.currentAuth = null;
  }

  // Create a payment
  public async createPayment(paymentData: PiPaymentData, callbacks: PiPaymentCallbacks): Promise<any> {
    if (typeof window === 'undefined' || !window.Pi) {
      throw new Error('Pi SDK not available');
    }

    try {
      const Pi = window.Pi;
      
      const payment = await Pi.createPayment(paymentData, callbacks);
      console.log('Payment created:', payment);
      return payment;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw error;
    }
  }

  // Handle incomplete payments
  private async handleIncompletePayment(payment: PiPayment): Promise<void> {
    try {
      // You can implement your own logic here
      // For example, complete the payment or cancel it
      console.log('Handling incomplete payment:', payment);
      
      // Example: Complete the payment
      await this.completePayment(payment.identifier, payment.transaction?.txid || '');
    } catch (error) {
      console.error('Error handling incomplete payment:', error);
    }
  }

  // Server-side payment approval
  public async approvePayment(paymentId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/payments/approve`, {
        paymentId
      }, {
        headers: {
          'Authorization': `Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Payment approved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Payment approval failed:', error);
      throw error;
    }
  }

  // Server-side payment completion
  public async completePayment(paymentId: string, txid: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/payments/complete`, {
        paymentId,
        txid
      }, {
        headers: {
          'Authorization': `Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Payment completed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Payment completion failed:', error);
      throw error;
    }
  }

  // Get payment details
  public async getPayment(paymentId: string): Promise<PiPayment> {
    try {
      const response = await axios.get(`${this.baseUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Key ${this.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get payment failed:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  public isUserAuthenticated(): boolean {
    return this.isAuthenticated && this.currentAuth !== null;
  }

  // Get current auth data
  public getCurrentAuth(): PiAuth | null {
    return this.currentAuth;
  }

  // Set current auth data
  public setCurrentAuth(auth: PiAuth): void {
    try {
      console.log('Setting Pi auth data:', auth);
      this.currentAuth = auth;
      this.isAuthenticated = true;
      console.log('Pi auth data set successfully');
    } catch (error) {
      console.error('Error setting Pi auth data:', error);
      throw error;
    }
  }

  // Clear auth data
  public clearAuth(): void {
    this.currentAuth = null;
    this.isAuthenticated = false;
    console.log('Pi auth data cleared');
  }

  // Set API key
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Check if Ads are supported
  public async checkAdsSupport(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.Pi) {
      return false;
    }

    try {
      const Pi = window.Pi;
      const nativeFeaturesList = await Pi.nativeFeaturesList();
      const adNetworkSupported = nativeFeaturesList.includes("ad_network");
      return adNetworkSupported;
    } catch (error) {
      console.error('Error checking ads support:', error);
      return false;
    }
  }

  // Show Interstitial Ad
  public async showInterstitialAd(): Promise<{
    result: 'AD_CLOSED' | 'AD_REWARDED' | 'AD_ERROR' | 'ADS_NOT_SUPPORTED';
    adId?: string;
  }> {
    if (typeof window === 'undefined' || !window.Pi) {
      throw new Error('Pi SDK not available');
    }

    try {
      const Pi = window.Pi;
      return await Pi.Ads.showAd("interstitial");
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      throw error;
    }
  }

  // Show Rewarded Ad
  public async showRewardedAd(): Promise<{
    result: 'AD_CLOSED' | 'AD_REWARDED' | 'AD_ERROR' | 'ADS_NOT_SUPPORTED';
    adId?: string;
  }> {
    if (typeof window === 'undefined' || !window.Pi) {
      throw new Error('Pi SDK not available');
    }

    try {
      const Pi = window.Pi;
      return await Pi.Ads.showAd("rewarded");
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      throw error;
    }
  }

  // Request Ad
  public async requestAd(adType: 'interstitial' | 'rewarded'): Promise<{
    result: 'AD_LOADED' | 'AD_ERROR' | 'ADS_NOT_SUPPORTED';
  }> {
    if (typeof window === 'undefined' || !window.Pi) {
      throw new Error('Pi SDK not available');
    }

    try {
      const Pi = window.Pi;
      return await Pi.Ads.requestAd(adType);
    } catch (error) {
      console.error('Error requesting ad:', error);
      throw error;
    }
  }

  // Check if Ad is Ready
  public async isAdReady(adType: 'interstitial' | 'rewarded'): Promise<{
    ready: boolean;
  }> {
    if (typeof window === 'undefined' || !window.Pi) {
      throw new Error('Pi SDK not available');
    }

    try {
      const Pi = window.Pi;
      return await Pi.Ads.isAdReady(adType);
    } catch (error) {
      console.error('Error checking ad readiness:', error);
      throw error;
    }
  }

  // Advanced Interstitial Ad Flow
  public async showInterstitialAdAdvanced(): Promise<boolean> {
    try {
      const isAdReadyResponse = await this.isAdReady("interstitial");

      if (isAdReadyResponse.ready === true) {
        const showAdResponse = await this.showInterstitialAd();
        return showAdResponse.result === "AD_CLOSED";
      }

      const requestAdResponse = await this.requestAd("interstitial");

      if (requestAdResponse.result !== "AD_LOADED") {
        console.log('Ad could not be loaded');
        return false;
      }

      const showAdResponse = await this.showInterstitialAd();
      return showAdResponse.result === "AD_CLOSED";
    } catch (error) {
      console.error('Error in advanced interstitial ad flow:', error);
      return false;
    }
  }

  // Advanced Rewarded Ad Flow with Verification
  public async showRewardedAdAdvanced(): Promise<{
    success: boolean;
    adId?: string;
    reward?: any;
  }> {
    try {
      const isAdReadyResponse = await this.isAdReady("rewarded");

      if (isAdReadyResponse.ready === false) {
        const requestAdResponse = await this.requestAd("rewarded");

        if (requestAdResponse.result === "ADS_NOT_SUPPORTED") {
          return { success: false, reward: { error: 'ADS_NOT_SUPPORTED' } };
        }

        if (requestAdResponse.result !== "AD_LOADED") {
          return { success: false, reward: { error: 'AD_UNAVAILABLE' } };
        }
      }

      const showAdResponse = await this.showRewardedAd();

      if (showAdResponse.result === "AD_REWARDED" && showAdResponse.adId) {
        // In a real app, you would verify the adId with Pi Platform API here
        // For now, we'll simulate the verification
        const reward = await this.verifyRewardedAd(showAdResponse.adId);
        return { success: true, adId: showAdResponse.adId, reward };
      } else {
        return { success: false, reward: { error: 'AD_NOT_REWARDED' } };
      }
    } catch (error) {
      console.error('Error in advanced rewarded ad flow:', error);
      return { success: false, reward: { error: 'AD_ERROR' } };
    }
  }

  // Verify Rewarded Ad (simulated - in real app, call Pi Platform API)
  private async verifyRewardedAd(adId: string): Promise<any> {
    // In a real implementation, you would call Pi Platform API here
    // to verify that mediator_ack_status is "granted"
    console.log('Verifying rewarded ad with ID:', adId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful verification
    return {
      verified: true,
      reward: {
        type: 'pi_coins',
        amount: 0.1,
        description: 'Pi reward for watching ad'
      }
    };
  }
}

// Export singleton instance
export const piNetworkService = PiNetworkService.getInstance(); 