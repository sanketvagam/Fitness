# Strava Integration Setup Guide

This guide will help you set up the complete Strava integration for FitForge, including OAuth authentication and automatic activity syncing.

## Prerequisites

- A Strava account (free or premium)
- Access to Supabase dashboard
- Access to your project's environment variables

## Step 1: Create a Strava API Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Click "Create App" or "My API Application"
3. Fill in the application details:
   - **Application Name**: FitForge (or your app name)
   - **Category**: Choose appropriate category (e.g., "Training")
   - **Club**: Leave blank unless you have a specific club
   - **Website**: Your app's website URL
   - **Application Description**: Brief description of your app
   - **Authorization Callback Domain**: `YOUR_SUPABASE_PROJECT.supabase.co`

4. Click "Create"
5. Save the following credentials:
   - **Client ID**
   - **Client Secret**

## Step 2: Configure Supabase Environment Variables

### For Supabase Edge Functions

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Project Settings** → **Edge Functions**
4. Add the following secrets:

```bash
STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=your_client_secret_here
FRONTEND_URL=https://your-frontend-domain.com
```

### For Frontend Application

Add these to your `.env` file:

```env
VITE_STRAVA_CLIENT_ID=your_client_id_here
```

## Step 3: Update Strava Authorization Callback Domain

1. Go back to [Strava API Settings](https://www.strava.com/settings/api)
2. Find your application
3. Set **Authorization Callback Domain** to:
   ```
   YOUR_SUPABASE_PROJECT_REF.supabase.co
   ```
   Example: `abcdefgh.supabase.co`

## Step 4: Verify Edge Functions Deployment

The following Edge Functions should already be deployed:

### 1. strava-oauth-callback
- **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/strava-oauth-callback`
- **Purpose**: Handles OAuth callback from Strava
- **Authentication**: No (public endpoint)

### 2. strava-sync-activities
- **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/strava-sync-activities`
- **Purpose**: Syncs activities from Strava to your database
- **Authentication**: Yes (requires user JWT token)

## Step 5: Test the Integration

1. **Start your application**
   ```bash
   npm run dev
   ```

2. **Connect Strava**
   - Login to FitForge
   - Click "Connect Devices" in the dashboard
   - Click "Connect" on the Strava card
   - You'll be redirected to Strava's authorization page
   - Click "Authorize" to grant permissions
   - You'll be redirected back to FitForge

3. **Sync Activities**
   - After connection, click "Sync Now" on the Strava card
   - Your recent activities (up to 50) will be imported
   - Activities will be automatically matched to your goals

## How It Works

### OAuth Flow

1. User clicks "Connect" on Strava
2. Frontend redirects to Strava authorization URL with:
   - Client ID
   - Redirect URI (Supabase Edge Function)
   - Requested scopes
   - User ID as state parameter

3. User authorizes on Strava
4. Strava redirects to `strava-oauth-callback` edge function
5. Edge function exchanges code for access token
6. Saves integration to database
7. Redirects user back to dashboard

### Activity Syncing

1. User clicks "Sync Now"
2. Frontend calls `strava-sync-activities` edge function
3. Edge function:
   - Validates user authentication
   - Checks if token needs refresh
   - Fetches activities from Strava API
   - Matches activities to existing goals
   - Imports new activities to database
   - Records sync history

### Activity Type Mapping

Strava activities are automatically mapped to FitForge types:

| Strava Activity | FitForge Type | Goal Match |
|----------------|---------------|------------|
| Run | distance | run-distance |
| Ride (Cycling) | distance | run-distance |
| Walk | steps | daily-steps |
| Other workouts | workout | gym-frequency |

### Token Refresh

Access tokens expire after 6 hours. The sync function automatically:
- Checks token expiration
- Refreshes token if needed
- Updates database with new tokens
- Continues with sync

## Troubleshooting

### "Strava credentials not configured"
- Verify environment variables are set in Supabase
- Redeploy edge functions after setting variables

### "Authorization denied"
- User clicked "Cancel" on Strava
- Check Strava authorization callback domain matches

### "Failed to sync activities"
- Check if integration token is expired
- Verify user has activities on Strava
- Check Supabase function logs for errors

### Activities not matching goals
- Ensure user has created goals before syncing
- Check goal types match activity types
- Verify goal dates overlap with activity dates

## API Rate Limits

Strava API has the following rate limits:
- **200 requests per 15 minutes**
- **2,000 requests per day**

The sync function respects these limits by:
- Fetching maximum 50 activities per sync
- Caching tokens to avoid unnecessary refresh calls
- Recording sync history to prevent duplicate imports

## Security Considerations

1. **Token Storage**: Access tokens are stored in the database
   - In production, consider encrypting tokens
   - Use Supabase Vault for additional security

2. **RLS Policies**: Row Level Security ensures:
   - Users can only access their own integrations
   - Tokens are protected by user authentication

3. **OAuth State Parameter**: Uses user ID to prevent CSRF attacks

## Next Steps

### Automatic Sync (Optional)

Set up automatic syncing using:
- Supabase Cron jobs (scheduled functions)
- Strava webhooks for real-time updates

### Additional Features

- Import historical activities beyond 50
- Sync other Strava data (heart rate, power, etc.)
- Add activity photos and routes
- Two-way sync (create activities on Strava from FitForge)

## Support

For issues with:
- **Strava API**: Visit [Strava Developers](https://developers.strava.com/)
- **Supabase**: Check [Supabase Docs](https://supabase.com/docs)
- **FitForge**: Contact your development team

---

**Note**: This integration is for personal use. If you plan to make your app public, you'll need to submit your Strava application for review and comply with [Strava's API Agreement](https://www.strava.com/legal/api).
