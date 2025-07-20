# Pi Network Integration Setup Guide

## Overview

This guide will help you set up Pi Network authentication, payments, and ad network integration for your Salenus AI application.

## Prerequisites

1. **Pi Network Account**: You need a Pi Network account to access the developer portal
2. **Pi Browser**: Install the Pi Browser app to access the developer portal
3. **API Key**: You'll get this from the Pi Developer Portal

## Step 1: Access Pi Developer Portal

1. Open the Pi Browser app
2. Navigate to `pi://develop.pi`
3. Sign in with your Pi Network account

## Step 2: Register Your App

1. Click "New App" button
2. Fill in the required fields:
   - **App Name**: Salenus AI
   - **App Network**: Choose Pi Testnet for development, Pi Mainnet for production
   - **Description**: AI-powered productivity and habit building app
   - **Category**: Productivity
   - **Website URL**: Your app's URL
   - **App Icon**: Upload your app icon

## Step 3: Get Your API Key

1. After registering your app, go to the app dashboard
2. Scroll down to the "API Keys" section
3. Copy your API key (keep it secure!)

## Step 4: Configure Environment Variables

Create a `.env` file in your project root and add:

```env
# Pi Network Configuration
VITE_PI_API_KEY=your_pi_api_key_here

# Other existing variables...
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 5: Complete Developer Portal Checklist

In your app dashboard, complete the required steps:

1. **App Information**: Fill in all required fields
2. **Payment Integration**: Set up your payment endpoints
3. **Ad Network**: Configure ad network settings
4. **Testing**: Test your integration

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/pi-network` in your app
3. Test the following features:
   - Pi Network authentication
   - Payment processing
   - Ad network rewards

## Features Implemented

### 1. Pi Authentication (`/src/components/PiAuth.tsx`)
- Secure blockchain-based authentication following official SDK patterns
- User identity verification with proper scopes
- Session management with access tokens

### 2. Pi Payments (`/src/components/PiPayment.tsx`)
- Cryptocurrency payments for subscriptions
- Real-time payment processing with official callback signatures
- Transaction verification using Pi Platform APIs

### 3. Pi Ad Network (`/src/components/PiAdNetwork.tsx`)
- Watch ads to earn Pi rewards
- Video and banner ad support
- Reward tracking and analytics

### 4. Integration Dashboard (`/src/components/PiIntegrationDashboard.tsx`)
- Complete overview of Pi Network features
- User-friendly interface with tabbed navigation
- Statistics and analytics

### 5. SDK Test Component (`/src/components/PiSDKTest.tsx`)
- Official documentation compliance testing
- All scope combinations: [], ['username'], ['payments']
- Exact callback signatures from Pi Network documentation
- Real-time testing of authentication and payments

### 6. Pi Ads Component (`/src/components/PiAds.tsx`)
- Official Pi Network Ads SDK integration
- Interstitial and Rewarded ads following documentation
- Advanced ad flows with verification
- Support detection via nativeFeaturesList
- Ad readiness checking and manual requesting
- Comprehensive error handling and statistics

## API Endpoints

Your server needs to handle these Pi Network API endpoints:

### Payment Approval
```
POST /payments/approve
{
  "paymentId": "payment_id_here"
}
```

### Payment Completion
```
POST /payments/complete
{
  "paymentId": "payment_id_here",
  "txid": "transaction_id_here"
}
```

## Security Considerations

1. **API Key Security**: Never expose your API key in client-side code
2. **Server-Side Validation**: Always validate payments on your server
3. **HTTPS**: Use HTTPS in production for secure communication
4. **Error Handling**: Implement proper error handling for all Pi Network operations

## Testing

### Sandbox Mode
For development, the Pi SDK is configured in sandbox mode:
```javascript
Pi.init({ version: "2.0", sandbox: true })
```

### Production Mode
For production, remove the sandbox flag:
```javascript
Pi.init({ version: "2.0" })
```

## Troubleshooting

### Common Issues

1. **SDK Not Loading**: Ensure the Pi SDK script is loaded in your HTML
2. **Authentication Fails**: Check that your app is properly registered
3. **Payments Not Working**: Verify your API key and server endpoints
4. **Ads Not Loading**: Check ad network configuration

### Debug Mode

Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('pi-debug', 'true');
```

## Next Steps

1. **Complete Developer Portal Checklist**: Finish all required steps
2. **Test Thoroughly**: Test all features in sandbox mode
3. **Deploy**: Deploy to production with proper configuration
4. **Monitor**: Monitor payments and ad performance

## Support

- **Pi Network Documentation**: https://developers.minepi.com
- **Developer Portal**: https://develop.pi
- **Community**: Join Pi Network developer communities

## Files Created

- `src/lib/pi-network.ts` - Pi Network service
- `src/components/PiAuth.tsx` - Authentication component
- `src/components/PiPayment.tsx` - Payment component
- `src/components/PiAdNetwork.tsx` - Ad network component
- `src/components/PiIntegrationDashboard.tsx` - Main dashboard
- `src/components/PiSDKTest.tsx` - Official SDK test component
- `src/components/PiAds.tsx` - Official Pi Ads SDK component

## Route Added

- `/pi-network` - Pi Network integration dashboard

Access the Pi Network integration at: `http://localhost:3000/pi-network` 