# Supabase Setup Instructions for String Theory Solutions

## Your Project Details
- **Project ID:** cajsonvvyokirylprdqr
- **Project URL:** https://cajsonvvyokirylprdqr.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/cajsonvvyokirylprdqr

---

## Step 1: Get Your API Key

1. Go to: https://supabase.com/dashboard/project/cajsonvvyokirylprdqr/settings/api
2. Find the **Project API keys** section
3. Copy the **`anon` `public`** key (it starts with `eyJhbGc...`)
4. **DO NOT** use the `service_role` key (that's for server-side only)

---

## Step 2: Create `.env.local` File

1. In your project root (`C:\Users\JerrelTGilliam\.cursor\wildpraxisTIC`), create a file named `.env.local`
2. Add this content (replace `YOUR_ANON_KEY` with the key from Step 1):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://cajsonvvyokirylprdqr.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# Optional: Google Cloud Vision API (for AI Macro Identifier)
# VITE_GOOGLE_VISION_API_KEY=your_google_vision_api_key
```

**Important:** `.env.local` is already in `.gitignore` - it will NOT be committed to git (this is good for security!)

---

## Step 3: Run Database Schema

1. Go to: https://supabase.com/dashboard/project/cajsonvvyokirylprdqr/editor
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase-schema.sql` from your project
5. Copy the ENTIRE contents (all ~300 lines)
6. Paste into the SQL editor
7. Click **Run** (bottom right)
8. Wait for "Success. No rows returned" message

**What this creates:**
- `profiles` table (user accounts with roles)
- `classrooms` table (teacher classrooms)
- `students` table (student records)
- `student_progress` table (badges, lessons, scores)
- `parent_students` table (parent-child links)
- `classroom_updates` table (announcements, photos)
- `events` table (release day, field trips)
- Row Level Security policies (data privacy)
- Automatic triggers and indexes

---

## Step 4: Verify Setup

Run this command in your terminal:
```bash
npm run dev
```

Then:
1. Open http://localhost:5173
2. Click on the **Parent Portal** tab
3. Click **Sign In**
4. You should see the login modal (NOT the "Backend Not Configured" message)
5. Try creating an account!

---

## Step 5: Add to Vercel (for Production)

1. Go to: https://vercel.com/jordangilliam/wildpraxis-tic/settings/environment-variables
2. Add these environment variables:
   - **Name:** `VITE_SUPABASE_URL`
     **Value:** `https://cajsonvvyokirylprdqr.supabase.co`
   - **Name:** `VITE_SUPABASE_ANON_KEY`
     **Value:** [Your anon public key]
3. Click **Save**
4. Redeploy your app (or just push to GitHub - it auto-deploys)

---

## Test Your Setup

### Create Test Teacher Account:
1. Click **Parent Portal** tab
2. Click **Sign In**
3. Click **Sign up**
4. Fill in:
   - Full Name: `Test Teacher`
   - Role: **Teacher**
   - School: `Your School Name`
   - Email: `teacher@test.com`
   - Password: `test1234`
5. Click **Create Account**
6. Check your email for verification (if enabled)

### Create Test Parent Account:
1. Sign out (if signed in)
2. Click **Sign up**
3. Fill in:
   - Full Name: `Test Parent`
   - Role: **Parent**
   - Email: `parent@test.com`
   - Password: `test1234`
4. Click **Create Account**

### Verify in Database:
1. Go to: https://supabase.com/dashboard/project/cajsonvvyokirylprdqr/editor
2. Click **Table Editor**
3. Select `profiles` table
4. You should see your test accounts!

---

## Troubleshooting

### Issue: "Backend Not Configured" message
**Fix:** 
- Check that `.env.local` exists in project root
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server (`npm run dev`)

### Issue: "Invalid API key"
**Fix:**
- Make sure you copied the **`anon`** key, not the **`service_role`** key
- Check for extra spaces or line breaks in `.env.local`

### Issue: SQL schema fails to run
**Fix:**
- Make sure you copied the ENTIRE file
- Run in a fresh SQL query (New Query button)
- Check that you're in the correct project

### Issue: Can't create account
**Fix:**
- Check browser console for errors (F12)
- Verify SQL schema ran successfully
- Check that Row Level Security is enabled

---

## Next Steps After Setup

1. **Create Real Accounts:**
   - Create your teacher account with real email
   - Invite other teachers
   - Set up classrooms

2. **Configure Email (Optional):**
   - Supabase Settings > Auth > SMTP Settings
   - Use SendGrid, AWS SES, or Resend.com
   - Enable email verification

3. **Customize Auth (Optional):**
   - Change password requirements
   - Enable social login (Google, Apple)
   - Set up magic links (passwordless)

4. **Backup Strategy:**
   - Supabase Pro ($25/mo) includes automatic backups
   - Free tier: export data regularly
   - Keep SQL schema in version control (already done!)

---

## Security Notes

✅ **Safe to share (frontend):**
- `anon` public key
- Project URL
- Project ID

❌ **NEVER share (backend only):**
- `service_role` key
- Database password
- JWT secret

✅ **Already secured:**
- `.env.local` is gitignored
- Row Level Security (RLS) protects all data
- Anon key is rate-limited by Supabase

---

## Support

**Supabase Issues:**
- Dashboard: https://supabase.com/dashboard/project/cajsonvvyokirylprdqr
- Docs: https://supabase.com/docs
- Support: https://supabase.com/dashboard/support

**App Issues:**
- See `BACKEND_SETUP_GUIDE.md` for detailed troubleshooting
- Check browser console (F12) for errors
- Verify environment variables are loaded

---

**Ready to proceed? Just paste your `anon` key and we'll create the `.env.local` file!** 🚀

