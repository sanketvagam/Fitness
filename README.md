# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0325b70e-f957-4e28-ae22-03a927a18b28

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0325b70e-f957-4e28-ae22-03a927a18b28) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure environment variables.
# Copy .env.example to .env and fill in your credentials
cp .env.example .env

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Google Fit Integration Setup

To enable Google Fit integration, follow these steps:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Fitness API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Fitness API" and enable it

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Fill in required information
   - Add scopes:
     - `https://www.googleapis.com/auth/fitness.activity.read`
     - `https://www.googleapis.com/auth/fitness.body.read`
     - `https://www.googleapis.com/auth/fitness.location.read`

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URI: `https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/google-fit-oauth-callback`
   - Copy the Client ID

5. **Add to Environment Variables**
   - Open `.env` file
   - Add: `VITE_GOOGLE_FIT_CLIENT_ID=your_client_id_here`
   - Restart dev server

6. **Configure Supabase Secrets**
   - Go to your Supabase Dashboard → Project Settings → Edge Functions
   - Add these secrets:
     - `GOOGLE_FIT_CLIENT_ID`
     - `GOOGLE_FIT_CLIENT_SECRET`
     - `FRONTEND_URL`

For detailed instructions, see [GOOGLE_FIT_SETUP.md](./GOOGLE_FIT_SETUP.md)

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0325b70e-f957-4e28-ae22-03a927a18b28) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
