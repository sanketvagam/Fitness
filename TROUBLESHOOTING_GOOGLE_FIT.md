# Google Fit Integration Troubleshooting

## Common Issues and Solutions

### Issue: "Google Fit integration not configured" error

**Cause**: The `VITE_GOOGLE_FIT_CLIENT_ID` environment variable is not set or the app hasn't been restarted.

**Solution**:
1. Open your `.env` file
2. Make sure you have this line with your actual Client ID:
   ```
   VITE_GOOGLE_FIT_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
   ```
3. **Important**: Restart your dev server after adding/changing environment variables
   ```bash
   # Stop the dev server (Ctrl+C) and restart
   npm run dev
   ```

**How to verify**:
- Open browser console (F12)
- Click "Connect" on Google Fit
- Check the console logs for "Google Fit OAuth Config"
- It should show `hasClientId: true` and a valid `clientIdLength`

---

### Issue: OAuth redirect doesn't work

**Cause**: Redirect URI is not properly configured in Google Cloud Console.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   ```
   https://gsurujgfbdxltlndhgpl.supabase.co/functions/v1/google-fit-oauth-callback
   ```
4. Click "Save"
5. Wait a few minutes for changes to propagate

**Tip**: The redirect URI format is:
- `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/google-fit-oauth-callback`

---

### Issue: "Authorization Error" or "Access Blocked"

**Cause**: OAuth consent screen is in testing mode and your Google account is not added as a test user.

**Solution**:
1. Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
2. Scroll to "Test users"
3. Click "Add Users"
4. Add your Google email address
5. Click "Save"

**Alternative**: Publish your app (requires verification for sensitive scopes)

---

### Issue: Edge function returns 500 error

**Cause**: Supabase secrets are not configured.

**Solution**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Project Settings** → **Edge Functions**
4. Add these secrets:
   - `GOOGLE_FIT_CLIENT_ID` - Your OAuth Client ID
   - `GOOGLE_FIT_CLIENT_SECRET` - Your OAuth Client Secret
   - `FRONTEND_URL` - Your frontend URL (e.g., `https://your-app.com`)

**Important**: Secrets are separate from frontend environment variables!

---

### Issue: Browser console shows the redirect URI but nothing happens

**Cause**: Check browser console for errors.

**Solution**:
1. Open browser console (F12)
2. Look for the "Google Fit Auth URL" log
3. Copy the full URL
4. Check these components:
   - `client_id` should match your Google Cloud Console credential
   - `redirect_uri` should be properly encoded
   - `state` should be your user ID

**Debug the URL manually**:
- Paste the auth URL in a new tab
- Complete the OAuth flow
- See what error Google returns

---

### Issue: OAuth succeeds but activities don't sync

**Cause 1**: No goals created yet

**Solution**: Create fitness goals first (daily steps, weight loss, etc.) before syncing

**Cause 2**: No recent fitness data in Google Fit

**Solution**: Add some fitness data to your Google Fit app in the past 7 days

**Cause 3**: Token refresh failed

**Solution**: Disconnect and reconnect Google Fit integration

---

### Issue: "Failed to fetch fitness data" error

**Cause**: Fitness API is not enabled in Google Cloud Console.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Library"
4. Search for "Fitness API"
5. Click "Enable"

---

### Issue: Console logs not showing

**Cause**: Console logs are only visible in development mode.

**Solution**:
- Make sure you're running `npm run dev` (not production build)
- Open browser console (F12) → Console tab
- Try connecting again

---

## Checking Environment Variables

Run this in your browser console after the app loads:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Google Fit Client ID:', !!import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID);
console.log('Client ID length:', import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID?.length);
```

**Expected output**:
- Supabase URL should show your Supabase project URL
- Has Google Fit Client ID should be `true`
- Client ID length should be around 70-80 characters

---

## Checking Supabase Edge Functions

Test if the edge function is deployed:

```bash
curl https://gsurujgfbdxltlndhgpl.supabase.co/functions/v1/google-fit-oauth-callback
```

**Expected**: Should return a 400 error (this is normal - it expects OAuth parameters)

---

## Step-by-Step Debug Checklist

Use this checklist to systematically debug:

- [ ] Google Cloud project created
- [ ] Fitness API enabled in Google Cloud Console
- [ ] OAuth consent screen configured
- [ ] OAuth scopes added (fitness.activity.read, fitness.body.read, fitness.location.read)
- [ ] OAuth 2.0 Client ID created (Web application type)
- [ ] Authorized redirect URI added to OAuth client
- [ ] Client ID copied to `.env` file as `VITE_GOOGLE_FIT_CLIENT_ID`
- [ ] Client ID and Secret added to Supabase Edge Functions secrets
- [ ] `FRONTEND_URL` added to Supabase Edge Functions secrets
- [ ] Dev server restarted after changing `.env`
- [ ] Google account added as test user (if in testing mode)
- [ ] Browser console shows "hasClientId: true"
- [ ] Clicking "Connect" redirects to Google authorization page
- [ ] After authorization, redirects back to dashboard
- [ ] Success toast message appears
- [ ] Google Fit card shows "Connected" status

---

## Still Having Issues?

### 1. Check Browser Console
Look for any JavaScript errors or network errors

### 2. Check Supabase Function Logs
- Go to Supabase Dashboard → Edge Functions
- Select `google-fit-oauth-callback`
- Check the logs for errors

### 3. Verify Your Setup
Compare your configuration with the working example in `GOOGLE_FIT_SETUP.md`

### 4. Test with a Fresh Browser Session
Sometimes cached data causes issues:
- Open incognito/private window
- Try the OAuth flow again

### 5. Check Network Tab
- Open browser DevTools → Network tab
- Filter by "google" and "supabase"
- Check if requests are being made
- Look at response codes and bodies

---

## Getting More Help

If you're still stuck, gather this information:

1. **Browser console logs** when clicking "Connect"
2. **Network tab** showing the OAuth redirect
3. **Supabase function logs** from the dashboard
4. **Your redirect URI** (should match what's in Google Cloud Console)
5. **Error messages** you're seeing

Include this information when asking for help!
