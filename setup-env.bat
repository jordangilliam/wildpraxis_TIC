@echo off
echo Creating .env.local file for Supabase configuration...
echo.

(
echo # Supabase Configuration
echo VITE_SUPABASE_URL=https://cajsonvvyokirylprdqr.supabase.co
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanNvbnZ2eW9raXJ5bHByZHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NzgwNzQsImV4cCI6MjA3NjE1NDA3NH0.-LYW3xfI3gO6Ro3mbhyeoQKP2fk22sJHs-o5b-pdKXI
echo.
echo # Optional: Google Cloud Vision API ^(for AI Macro Identifier^)
echo # VITE_GOOGLE_VISION_API_KEY=your_google_vision_api_key
) > .env.local

echo.
echo ✓ .env.local file created successfully!
echo.
echo Your Supabase configuration:
echo   Project URL: https://cajsonvvyokirylprdqr.supabase.co
echo   API Key: Configured
echo.
echo Next steps:
echo   1. Run the database schema in Supabase
echo   2. Start dev server: npm run dev
echo   3. Test authentication in Parent Portal tab
echo.
pause

