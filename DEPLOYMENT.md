# Deployment Guide - PA TIC Enhanced Platform

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended)

**Automatic deployment on every push to main:**

1. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: GitHub Actions
   - The `.github/workflows/deploy.yml` workflow will handle builds

2. **Push changes:**
   ```bash
   git add .
   git commit -m "Deploy enhanced TIC platform"
   git push origin main
   ```

3. **Access your site:**
   - URL: `https://[username].github.io/wildpraxisTIC/`
   - Custom domain: Configure in Settings → Pages

### Option 2: Vercel (WildPraxis host)

**One-click deployment:**

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Framework Preset: Vite
4. Deploy!

**CLI deployment:**
```bash
npm install -g vercel
vercel
```

### Option 3: Netlify

**Drag & drop or Git:**

1. Build locally:
   ```bash
   npm run build
   ```

2. Deploy `dist/` folder at [netlify.com/drop](https://app.netlify.com/drop)

**Or connect Git:**
- Build command: `npm run build`
- Publish directory: `dist`

### Option 4: Self-Hosted

**Any static file server works:**

```bash
# Build
npm run build

# Serve dist/ folder with:
# - Apache
# - Nginx
# - Python: python -m http.server --directory dist 8080
# - Node: npx serve dist
```

## ⚙️ Configuration

### Environment Variables

Create `.env` for local development:

```bash
# Mapbox (optional - for watershed maps)
VITE_MAPBOX_TOKEN=pk.your_token_here

# Base URL (for GitHub Pages subdirectory)
VITE_BASE_URL=/wildpraxisTIC/

# Analytics (optional)
VITE_ANALYTICS_ID=your_id_here
```

### Build Settings

**vite.config.ts:**
```typescript
export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

## 🔄 Auto-Sync Features

### Weekly Opportunities Update

`.github/workflows/sync-opportunities.yml` runs every Monday:
- Fetches latest opportunities from PA organizations
- Updates `public/data/opportunities.json`
- Commits changes automatically

**Manual sync:**
```bash
npm run sync:opportunities
```

### Data Sources (configure in `public/data/opportunity_sources.json`):
- PFBC events API
- WLA opportunities feed
- Trout Unlimited calendar
- DCNR programs
- Library systems

## 📊 Analytics (Optional)

### Google Analytics 4

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Privacy-Friendly Alternative: Plausible

```html
<script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
```

## 🔒 Security & Privacy

- **No backend required** - Pure static site
- **No user data collection** - All data stored locally
- **No cookies** - Unless analytics added
- **Content Security Policy** - Configure in deployment platform

### Recommended Headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 🧪 Testing Before Deployment

### Local Preview

```bash
# Development mode
npm run dev

# Production preview
npm run build
npm run preview
```

### Test Checklist

- [ ] All lessons load correctly
- [ ] Brook AI responds to questions
- [ ] Water quality tracker saves data
- [ ] Habitat builder calculates scores
- [ ] Watershed map loads (with token)
- [ ] Opportunities sync and display
- [ ] Resource hub links work
- [ ] Data persists in localStorage
- [ ] Mobile responsive design
- [ ] Accessibility (keyboard navigation)

### Browser Testing

Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## 📱 Progressive Web App (Future)

To make installable:

1. Add `manifest.json`:
   ```json
   {
     "name": "PA Trout in the Classroom",
     "short_name": "PA TIC",
     "description": "Conservation education platform",
     "start_url": "/",
     "display": "standalone",
     "theme_color": "#0ea5e9",
     "background_color": "#f8fafc",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. Add service worker for offline support

3. Add install prompt

## 🌐 Custom Domain

### GitHub Pages

1. Add `CNAME` file to `public/` folder:
   ```
   tic.yourschool.edu
   ```

2. Configure DNS:
   ```
   CNAME  @    username.github.io
   ```

3. Enable HTTPS in GitHub settings

### Vercel/Netlify

- Add domain in dashboard
- Follow DNS instructions
- SSL auto-configured

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Map Not Loading

- Check Mapbox token in settings
- Verify token has right permissions
- Check browser console for errors

### Opportunities Not Syncing

- Check GitHub Actions logs
- Verify `opportunities.json` format
- Test manual sync locally

### Mobile Issues

- Test on actual devices, not just emulators
- Check viewport meta tag
- Verify touch targets (44x44px minimum)

## 📈 Monitoring

### GitHub Actions

- Monitor workflow runs in Actions tab
- Set up notifications for failed builds
- Review deploy logs

### Error Tracking (Optional)

**Sentry for production errors:**

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## 📞 Support

- **Deployment issues**: Check GitHub Actions logs
- **Content issues**: Contact PFBC Education
- **WLA integration**: Visit https://wla-app.vercel.app/
- **Technical questions**: Open GitHub issue

---

**Ready to deploy?** Follow Option 1 (GitHub Pages) for easiest setup! 🚀

