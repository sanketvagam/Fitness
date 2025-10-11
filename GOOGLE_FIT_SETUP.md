# Google Fit Integration Setup Guide

This guide will help you set up the complete Google Fit integration for FitForge, including OAuth authentication and automatic activity syncing.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Access to Supabase dashboard
- Access to your project's environment variables

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Fill in the project details:
   - **Project Name**: FitForge (or your app name)
   - **Organization**: Your organization (optional)
4. Click "Create"
5. Wait for the project to be created and select it

## Step 2: Enable Google Fitness API

1. In Google Cloud Console, navigate to "APIs & Services" → "Library"
2. Search for "Fitness API"
3. Click on "Fitness API"
4. Click "Enable"
5. Wait for the API to be enabled

## Step 3: Configure OAuth Consent Screen

1. Navigate to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in the App information:
   - **App name**: FitForge
   - **User support email**: Your email address
   - **App logo**: Upload your app logo (optional)
   - **App domain**: Your app's domain
   - **Authorized domains**: Add your domain and `supabase.co`
   - **Developer contact information**: Your email address
5. Click "Save and Continue"

6. **Add Scopes**:
   - Click "Add or Remove Scopes"
   - Add the following scopes:
     - `https://www.googleapis.com/auth/fitness.activity.read`
     - `https://www.googleapis.com/auth/fitness.body.read`
     - `https://www.googleapis.com/auth/fitness.location.read`
   - Click "Update" → "Save and Continue"

7. **Test users** (if in testing mode):
   - Add your email addresses as test users
   - Click "Save and Continue"

8. Click "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Fill in the details:
   - **Name**: FitForge OAuth Client
   - **Authorized JavaScript origins**: Add your frontend URL
     - Example: `https://your-app.com`
   - **Authorized redirect URIs**: Add your Supabase function URL
     - Format: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/google-fit-oauth-callback`
     - Example: `https://abcdefgh.supabase.co/functions/v1/google-fit-oauth-callback`
5. Click "Create"
6. Save the following credentials:
   - **Client ID**
   - **Client Secret**

## Step 5: Configure Supabase Environment Variables

### For Supabase Edge Functions

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Project Settings** → **Edge Functions**
4. Add the following secrets:

```bash
GOOGLE_FIT_CLIENT_ID=your_client_id_here
GOOGLE_FIT_CLIENT_SECRET=your_client_secret_here
FRONTEND_URL=https://your-frontend-domain.com
```

### For Frontend Application

Add these to your `.env` file:

```env
VITE_GOOGLE_FIT_CLIENT_ID=your_client_id_here
```

## Step 6: Verify Edge Functions Deployment

The following Edge Functions should already be deployed:

### 1. google-fit-oauth-callback
- **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/google-fit-oauth-callback`
- **Purpose**: Handles OAuth callback from Google
- **Authentication**: No (public endpoint)

### 2. google-fit-sync-activities
- **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/google-fit-sync-activities`
- **Purpose**: Syncs activities from Google Fit to your database
- **Authentication**: Yes (requires user JWT token)

## Step 7: Test the Integration

1. **Start your application**
   ```bash
   npm run dev
   ```

2. **Connect Google Fit**
   - Login to FitForge
   - Click "Connect Devices" in the dashboard
   - Click "Connect" on the Google Fit card
   - You'll be redirected to Google's authorization page
   - Select your Google account
   - Click "Allow" to grant permissions
   - You'll be redirected back to FitForge

3. **Sync Activities**
   - After connection, click "Sync Now" on the Google Fit card
   - Your recent fitness data (past 7 days) will be imported
   - Activities will be automatically matched to your goals

## How It Works

### OAuth Flow

1. User clicks "Connect" on Google Fit
2. Frontend redirects to Google authorization URL with:
   - Client ID
   - Redirect URI (Supabase Edge Function)
   - Requested scopes
   - User ID as state parameter
   - Access type: offline (for refresh token)
   - Prompt: consent (to always get refresh token)

3. User authorizes on Google
4. Google redirects to `google-fit-oauth-callback` edge function
5. Edge function:
   - Exchanges code for access and refresh tokens
   - Fetches user profile from Google
   - Saves integration to database
   - Redirects user back to dashboard

### Activity Syncing

1. User clicks "Sync Now"
2. Frontend calls `google-fit-sync-activities` edge function
3. Edge function:
   - Validates user authentication
   - Checks if token needs refresh
   - Fetches aggregated fitness data from Google Fit API (past 7 days)
   - Matches activities to existing goals
   - Imports new activities to database
   - Records sync history

### Data Type Mapping

Google Fit data types are automatically mapped to FitForge types:

| Google Fit Data Type | FitForge Type | Goal Match |
|---------------------|---------------|------------|
| step_count.delta | steps | daily-steps |
| distance.delta | distance | run-distance |
| weight | weight | weight-loss |
| activity.segment (running, cycling, walking) | workout | gym-frequency |

### Aggregated Data

Google Fit data is fetched using the Aggregation API:
- **Bucket size**: 1 day (86400000 milliseconds)
- **Time range**: Past 7 days
- **Data sources**: All available sources for each data type

### Token Refresh

Access tokens expire after 1 hour. The sync function automatically:
- Checks token expiration
- Refreshes token if needed using refresh token
- Updates database with new access token
- Continues with sync

## Troubleshooting

### "Google Fit credentials not configured"
- Verify environment variables are set in Supabase
- Redeploy edge functions after setting variables

### "Authorization denied"
- User clicked "Cancel" on Google
- Check OAuth consent screen configuration
- Ensure scopes are correctly configured

### "Failed to sync activities"
- Check if integration token is expired
- Verify user has fitness data in Google Fit
- Check Supabase function logs for errors
- Ensure Fitness API is enabled in Google Cloud Console

### Activities not matching goals
- Ensure user has created goals before syncing
- Check goal types match activity types
- Verify goal dates overlap with activity dates

### "Access blocked: Authorization Error"
- OAuth consent screen is in testing mode
- Add your email as a test user
- OR publish the app (requires verification for sensitive scopes)

## API Rate Limits

Google Fit API has the following rate limits:
- **25,000 requests per day per project**
- **5 queries per second per user**

The sync function respects these limits by:
- Using aggregated data queries (fewer requests)
- Fetching only 7 days of data per sync
- Recording sync history to prevent duplicate imports

## Security Considerations

1. **Token Storage**: Access and refresh tokens are stored in the database
   - In production, consider encrypting tokens
   - Use Supabase Vault for additional security

2. **RLS Policies**: Row Level Security ensures:
   - Users can only access their own integrations
   - Tokens are protected by user authentication

3. **OAuth State Parameter**: Uses user ID to prevent CSRF attacks

4. **Refresh Token**: Stored securely for long-term access
   - Obtained using `access_type=offline`
   - Used to refresh access tokens automatically

## Data Privacy

- FitForge only requests READ permissions
- No data is written to Google Fit
- User data is stored securely in Supabase
- Users can disconnect integration anytime
- Disconnecting revokes access tokens

## Next Steps

### Automatic Sync (Optional)

Set up automatic syncing using:
- Supabase Cron jobs (scheduled functions)
- Run sync function daily/hourly

### Additional Features

- Sync historical data beyond 7 days
- Add heart rate and calorie data
- Sync sleep data
- Add activity details (duration, pace)
- Two-way sync (create activities on Google Fit from FitForge)

### Publishing Your App

For public use, you'll need to:
1. Complete OAuth consent screen verification
2. Submit for verification of sensitive scopes
3. Comply with Google API Services User Data Policy
4. Display privacy policy
5. Handle user data responsibly

## Support

For issues with:
- **Google Fit API**: Visit [Google Fit REST API Docs](https://developers.google.com/fit/rest)
- **OAuth 2.0**: Check [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- **Supabase**: Check [Supabase Docs](https://supabase.com/docs)
- **FitForge**: Contact your development team

---

**Note**: This integration is for personal use during development. For production and public distribution, you must complete Google's app verification process and comply with their data policies.
