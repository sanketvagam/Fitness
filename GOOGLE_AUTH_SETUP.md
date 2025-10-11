# Google OAuth Authentication Setup

This guide will help you set up Google Sign-In for your HabitBar application.

## Prerequisites

- A Google Cloud account
- Access to Google Cloud Console
- Your application deployed URL (Netlify URL or localhost for development)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "HabitBar Auth")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Click "Create"
4. Fill in the required information:
   - **App name:** HabitBar (or your app name)
   - **User support email:** Your email
   - **Developer contact information:** Your email
5. Click "Save and Continue"
6. Skip "Scopes" section (click "Save and Continue")
7. Skip "Test users" section (click "Save and Continue")
8. Review and click "Back to Dashboard"

## Step 4: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Configure the OAuth client:

   **Name:** HabitBar Web Client (or any name you prefer)

   **Authorized JavaScript origins:**
   - For local development: `http://localhost:5173`
   - For Netlify: `https://your-app-name.netlify.app`
   - For Bolt: Your Bolt preview URL

   **Authorized redirect URIs:**
   - For local development: `http://localhost:5173/`
   - For Netlify: `https://your-app-name.netlify.app/`
   - For Bolt: Your Bolt preview URL with trailing slash

5. Click "Create"
6. You will see a popup with your **Client ID** and **Client Secret**
7. Copy both values - you'll need them for the next step

## Step 5: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" > "Providers"
4. Find "Google" in the list and click to expand
5. Toggle "Enable Sign in with Google"
6. Paste your **Client ID** from Google Cloud Console
7. Paste your **Client Secret** from Google Cloud Console
8. Click "Save"

## Step 6: Add Environment Variables

### For Local Development (Bolt)

Update your `.env` file:

```env
VITE_SUPABASE_URL=https://gsurujgfbdxltlndhgpl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXJ1amdmYmR4bHRsbmRoZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTg1MzQsImV4cCI6MjA3NTY5NDUzNH0.ETJWmYSQghp2o98bcfqgmTEPRgJdHRWenqiwXMDMkRk

# Add your Google credentials here
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### For Netlify Deployment

1. Go to your Netlify Dashboard
2. Select your site
3. Go to "Site configuration" > "Environment variables"
4. Add the following variables:

```
VITE_SUPABASE_URL=https://gsurujgfbdxltlndhgpl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXJ1amdmYmR4bHRsbmRoZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTg1MzQsImV4cCI6MjA3NTY5NDUzNH0.ETJWmYSQghp2o98bcfqgmTEPRgJdHRWenqiwXMDMkRk
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

5. Click "Save"
6. Redeploy your site

## Step 7: Test Google Sign-In

1. Open your application (locally or on Netlify)
2. Click the "Sign In" or "Sign Up" button
3. Click "Continue with Google"
4. You should be redirected to Google's sign-in page
5. Sign in with your Google account
6. You should be redirected back to your app and signed in

## Important Notes

### Redirect URIs

Make sure your redirect URIs in Google Cloud Console exactly match your application URLs:

- **Must include the protocol** (`http://` or `https://`)
- **Must include trailing slash** for the root redirect (e.g., `https://yourapp.com/`)
- **Case-sensitive** - make sure the URL matches exactly

### Common Issues

1. **"Redirect URI mismatch" error**
   - Check that the redirect URI in Google Cloud Console exactly matches your app URL
   - Make sure you've added trailing slash for root redirects
   - Wait a few minutes after adding new URIs for changes to propagate

2. **"Access blocked: This app's request is invalid"**
   - Make sure you've completed the OAuth consent screen configuration
   - Check that Google+ API is enabled

3. **OAuth popup closes immediately**
   - Check browser console for errors
   - Verify Supabase configuration has correct Google credentials
   - Make sure your redirect URI is properly configured

### Security Notes

- **Client Secret:** While we store the client secret in environment variables, Supabase handles the OAuth flow securely on their backend. The client secret is not exposed to the client-side code.
- **Redirect URIs:** Only add trusted domains to your authorized redirect URIs
- **Production:** For production apps, consider setting up a custom domain and using that in your OAuth configuration

## Summary

After completing these steps:

1. Users can sign in with Google
2. User profiles are automatically created in Supabase
3. Authentication is handled securely through Supabase Auth
4. You can access user data in your app via the Auth context

## Need Help?

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
