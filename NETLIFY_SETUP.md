# Netlify Deployment Setup

This guide will help you deploy HabitBar to Netlify with the correct environment variables.

## Required Environment Variables

Add these environment variables in your Netlify dashboard:

### 1. Navigate to Site Settings
Go to: **Site configuration → Environment variables**

### 2. Add the following variables:

#### Supabase Configuration (Required)

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | `https://gsurujgfbdxltlndhgpl.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXJ1amdmYmR4bHRsbmRoZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTg1MzQsImV4cCI6MjA3NTY5NDUzNH0.ETJWmYSQghp2o98bcfqgmTEPRgJdHRWenqiwXMDMkRk` |

#### Google OAuth Configuration (Required for Google Sign-In)

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VITE_GOOGLE_CLIENT_ID` | (your client ID) | Get from Google Cloud Console |
| `VITE_GOOGLE_CLIENT_SECRET` | (your client secret) | Get from Google Cloud Console |

#### Optional Integrations

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VITE_GOOGLE_FIT_CLIENT_ID` | (your client ID) | Only if using Google Fit integration |
| `VITE_STRAVA_CLIENT_ID` | (your client ID) | Only if using Strava integration |

## Build Settings

Make sure your Netlify build settings are configured as follows:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 or higher

## Deploy Steps

1. **Connect your repository** to Netlify
2. **Add environment variables** from the table above
3. **Set build settings** (build command and publish directory)
4. **Deploy** your site

## Verify Deployment

After deployment:
1. Visit your Netlify site URL
2. Try signing up/logging in
3. Verify that data is being saved to Supabase

## Troubleshooting

### Environment Variables Not Working
- Make sure all variable names start with `VITE_` prefix
- Redeploy after adding/changing environment variables
- Check the Netlify deploy logs for any errors

### Database Connection Issues
- Verify the Supabase URL and key are correct
- Check that your Supabase project is active
- Ensure RLS policies are properly configured in Supabase

### Build Failures
- Check Node version (should be 18+)
- Clear build cache in Netlify and retry
- Check the build logs for specific errors

## Quick Copy-Paste

For quick setup, copy these environment variables to Netlify:

```
VITE_SUPABASE_URL=https://gsurujgfbdxltlndhgpl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXJ1amdmYmR4bHRsbmRoZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTg1MzQsImV4cCI6MjA3NTY5NDUzNH0.ETJWmYSQghp2o98bcfqgmTEPRgJdHRWenqiwXMDMkRk
```

---

**Note:** The Supabase anon key is safe to expose in client-side code. It's designed to be public and is protected by Row Level Security (RLS) policies.
