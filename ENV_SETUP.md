# Environment Variables Setup

Create a `.env.local` file in the root directory with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Cloud Vision API (for AI Macro Identifier)
VITE_GOOGLE_VISION_API_KEY=your_google_vision_api_key

# Optional: Email Service (Resend.com)
VITE_RESEND_API_KEY=your_resend_api_key
```

## Getting Your Supabase Credentials

1. Go to https://supabase.com
2. Create a new project (free tier available)
3. Go to Settings > API
4. Copy your `Project URL` and `anon/public` key
5. Paste into `.env.local`

