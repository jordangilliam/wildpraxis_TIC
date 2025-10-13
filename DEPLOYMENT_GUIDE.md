# 🚀 Deployment Guide - WildPraxis PA TIC App

## Quick Deployment Options

### Option 1: Vercel (Recommended) ⚡
**Fastest and easiest deployment with automatic CI/CD**

#### Steps:
1. **Install Vercel CLI** (optional for local testing)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub Integration** (Recommended)
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"
   - Done! Your app is live in ~2 minutes

3. **Or Deploy via CLI**
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy to production
   vercel --prod
   ```

#### Environment Variables Needed:
- `VITE_MAPBOX_TOKEN` (for maps) - Get from [mapbox.com](https://mapbox.com)
- `VITE_INATURALIST_API_KEY` (optional, for citizen science)
- `VITE_PFBC_API_KEY` (when PFBC API access is granted)

#### Custom Domain:
1. Go to project settings in Vercel
2. Click "Domains"
3. Add your custom domain (e.g., `patrout.wildpraxis.org`)
4. Follow DNS configuration instructions

---

### Option 2: Netlify 🌐
**Alternative with excellent features**

#### Steps:
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click "Deploy site"

#### netlify.toml Configuration:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages 📄
**Free hosting for public repositories**

#### Steps:
1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: GitHub Actions

2. **GitHub Actions workflow is already configured:**
   - See `.github/workflows/deploy.yml`
   - Automatically deploys on push to main/master

3. **Update `vite.config.ts` base path:**
   ```typescript
   export default defineConfig({
     base: '/wildpraxisTIC/', // Replace with your repo name
     plugins: [react()]
   })
   ```

4. **Access your site:**
   - `https://yourusername.github.io/wildpraxisTIC/`

---

### Option 4: Custom VPS/Server 🖥️

#### Requirements:
- Node.js 18+ installed
- Nginx or Apache web server
- SSL certificate (Let's Encrypt recommended)

#### Build Steps:
```bash
# 1. Build the project
npm install
npm run build

# 2. The dist/ folder contains your production files
# 3. Copy dist/ contents to your web server
scp -r dist/* user@yourserver.com:/var/www/patrout/

# 4. Configure Nginx
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name patrout.yourdomain.com;
    
    root /var/www/patrout;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Pre-Deployment Checklist ✅

### 1. **Update Configuration Files**
- [ ] Set correct base URL in `vite.config.ts`
- [ ] Update API endpoints in service files
- [ ] Configure environment variables
- [ ] Test build locally: `npm run build && npm run preview`

### 2. **Environment Variables**
Create `.env.production`:
```env
VITE_APP_NAME=PA Trout in the Classroom
VITE_MAPBOX_TOKEN=your_token_here
VITE_PFBC_API_URL=https://api.pfbc.pa.gov
VITE_INATURALIST_API_URL=https://api.inaturalist.org
```

### 3. **Test Build**
```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

### 4. **Optimize Assets**
- [ ] Compress images in `public/` folder
- [ ] Ensure logos are SVG or optimized PNG
- [ ] Check bundle size: `npm run build -- --report`

### 5. **Performance Check**
- [ ] Run Lighthouse audit
- [ ] Test on mobile devices
- [ ] Check loading time < 3 seconds
- [ ] Verify all animations are smooth

---

## Post-Deployment Steps 🎉

### 1. **Domain Configuration**
- Point your domain DNS to deployment platform
- Enable HTTPS/SSL
- Test domain access

### 2. **Analytics Setup** (Optional)
Add Google Analytics or Plausible:
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>
```

### 3. **Monitoring**
- Set up Vercel Analytics (automatic on Vercel)
- Configure error tracking (Sentry recommended)
- Set up uptime monitoring

### 4. **SEO Optimization**
Update `index.html` meta tags:
```html
<meta name="description" content="PA Trout in the Classroom - Interactive educational platform for youth">
<meta property="og:title" content="PA Trout in the Classroom | WildPraxis">
<meta property="og:image" content="/branding/wildpraxis_logo.svg">
```

---

## Continuous Deployment (CI/CD) 🔄

### Vercel (Automatic)
- Every push to `main` → Auto-deploys to production
- Every PR → Creates preview deployment
- Rollback with one click

### GitHub Actions Workflow
Already configured in `.github/workflows/vercel-deploy.yml`

**Required Secrets** (Add in GitHub Settings → Secrets):
- `VERCEL_TOKEN` - Get from Vercel account settings
- `VERCEL_ORG_ID` - Get from Vercel project settings
- `VERCEL_PROJECT_ID` - Get from Vercel project settings

---

## Troubleshooting 🔧

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### 404 Errors on Refresh
- Ensure SPA routing is configured (see `vercel.json` or `netlify.toml`)
- Check that all routes redirect to `index.html`

### Blank Page After Deploy
- Check browser console for errors
- Verify base path in `vite.config.ts`
- Ensure all assets are loading correctly

### Slow Loading
- Enable compression (Gzip/Brotli)
- Use CDN for static assets
- Lazy load images and components

---

## Production Optimization Tips 🚀

### 1. **Code Splitting**
Already implemented with React lazy loading:
```typescript
const GameComponent = lazy(() => import('./components/Game'));
```

### 2. **Asset Optimization**
```bash
# Install image optimization
npm install --save-dev vite-plugin-imagemin

# Add to vite.config.ts
import viteImagemin from 'vite-plugin-imagemin'
```

### 3. **Caching Strategy**
Set in `vercel.json`:
- Static assets: 1 year
- HTML: No cache
- API responses: 5 minutes

### 4. **Performance Budget**
Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total Bundle Size: < 500KB
- Lighthouse Score: > 90

---

## Scaling for Production 📈

### Expected Traffic:
- **Low:** 100-1,000 users/month → Vercel Free Tier
- **Medium:** 1,000-10,000 users/month → Vercel Pro ($20/month)
- **High:** 10,000+ users/month → Vercel Enterprise or custom CDN

### Database/Backend (Future):
When you need user accounts or data persistence:
1. **Supabase** - Free tier, PostgreSQL backend
2. **Firebase** - Real-time database, authentication
3. **PlanetScale** - Serverless MySQL
4. **MongoDB Atlas** - NoSQL database

---

## Support & Maintenance 🛠️

### Regular Updates:
```bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit

# Test after updates
npm test
```

### Monitoring:
- Check Vercel Analytics dashboard weekly
- Review error logs monthly
- Update content quarterly

---

## Quick Links 🔗

- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **GitHub Repository:** Your repo URL
- **Production URL:** Will be `https://yourproject.vercel.app`
- **Custom Domain:** Configure in Vercel settings

---

## Need Help? 💬

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs:** [vitejs.dev/guide](https://vitejs.dev/guide)
- **React Docs:** [react.dev](https://react.dev)

---

**Your app is production-ready! 🎉**

Choose your deployment platform and launch in minutes!

