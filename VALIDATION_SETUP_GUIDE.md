# Validation Key Setup Guide

## Overview
This guide will help you set up and verify your validation key for the Salenus AI application.

## Step 1: Download the Validation File

The validation key file has been created in your project root as `validation-key.txt`. This file contains:
```
e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2
```

## Step 2: Hosting Setup

### Option A: Upload to Your Domain
1. Upload the `validation-key.txt` file to your hosting domain
2. Ensure it's accessible at: `https://salenus.xyz/validation-key.txt`
3. The file should be at the root level of your domain

### Option B: Demo App Setup
For demo applications, add the following to your `.env` file:
```env
PI_VALIDATION_KEY=e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2
PI_VALIDATION_URL=https://salenus.xyz/validation-key.txt
```

## Step 3: Verification

### Using the Built-in Verifier
1. Navigate to `/pi-network` in your application
2. Click on the "Verifier" tab
3. Click "Verify Key" to test your setup
4. The verifier will check:
   - If the file is accessible online
   - If the key matches exactly
   - If the hosting is working correctly

### Manual Verification
You can also manually verify by:
1. Visiting `https://salenus.xyz/validation-key.txt` in your browser
2. Checking that the content matches exactly:
   ```
   e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2
   ```

## Step 4: Testing the Validation System

### In Your Application
1. Go to `/pi-network`
2. Click on the "Validation" tab
3. Enter the validation key: `e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2`
4. Click "Validate Key"
5. The system should return "Valid" if everything is set up correctly

## Troubleshooting

### Common Issues

1. **File Not Found (404)**
   - Ensure the file is uploaded to the correct location
   - Check that the URL is accessible in your browser
   - Verify the file name is exactly `validation-key.txt`

2. **Key Mismatch**
   - Ensure there are no extra spaces or characters
   - Check that the file contains only the key (no extra lines)
   - Verify the key is exactly 64 characters long

3. **CORS Issues**
   - Ensure your hosting allows cross-origin requests
   - Check that the file is served with correct headers

4. **Network Errors**
   - Check your internet connection
   - Verify the domain is accessible
   - Try accessing the URL directly in your browser

### Verification Checklist

- [ ] `validation-key.txt` file is uploaded to your domain
- [ ] File is accessible at `https://salenus.xyz/validation-key.txt`
- [ ] File contains exactly the validation key (no extra characters)
- [ ] Built-in verifier shows "Valid" status
- [ ] Manual browser access shows the correct key
- [ ] For demo apps, `.env` file contains the validation key

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Use the built-in verifier to diagnose problems
3. Verify the hosting setup manually
4. Ensure all requirements are met before testing

## Security Notes

- The validation key is used for verification purposes only
- Keep the key secure and don't share it publicly
- The key should be unique to your application
- Consider rotating the key periodically for security 