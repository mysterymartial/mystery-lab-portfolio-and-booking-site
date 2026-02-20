# Deploy Frontend to Vercel

This guide walks you through deploying the Mystery Lab frontend to [Vercel](https://vercel.com/).

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- GitHub repository with your code (frontend in `myPortfolioWeb/frontend/`)
- Backend already deployed on Railway

---

## Step 1: Push Your Code to GitHub

Ensure your project is pushed to GitHub. The frontend lives in `myPortfolioWeb/frontend/`.

---

## Step 2: Import Project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your GitHub repository (or connect GitHub if needed)
3. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** Set to `myPortfolioWeb/frontend`
   - **Build Command:** `npm run build` or `pnpm build`
   - **Output Directory:** *(leave default: `.next`)*
   - **Install Command:** `npm install` or `pnpm install`

---

## Step 3: Set Environment Variables

In the project settings, go to **Settings → Environment Variables** and add:

### Required

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://mystery-lab-portfolio-and-booking-site-production.up.railway.app/api` | Your Railway backend URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `mystery-lab-2c1a6.firebaseapp.com` | Your Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `mystery-lab-2c1a6` | Your Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `mystery-lab-2c1a6.firebasestorage.app` | Your Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `833872254409` | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:833872254409:web:724f086f7c621118a40418` | From Firebase Console |

### Optional

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_GA_ID` | `G-K87TXVZJM7` (Google Analytics) |
| `NEXT_PUBLIC_SENTRY_DSN` | Your Sentry DSN |
| `SENTRY_ORG` | Your Sentry org |
| `SENTRY_PROJECT` | Your Sentry project |

**Tip:** Copy values from your local `.env.local` file.

---

## Step 4: Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 1–3 minutes)
3. Vercel will assign a URL like `your-project.vercel.app`

---

## Step 5: Update Backend CORS (Railway)

Add your Vercel frontend URL to the backend so it accepts requests:

1. Go to your [Railway](https://railway.app/) project → backend service
2. Open **Variables**
3. Add or update:
   - `PRODUCTION_URL` = `https://your-project.vercel.app` (use your actual Vercel URL)

4. Redeploy the backend if needed (Railway may auto-redeploy on variable change)

---

## Step 6: Verify

1. Visit your Vercel URL
2. Test: chat, booking form, reviews
3. Check that API calls succeed (Network tab in DevTools)

---

## Custom Domain (Optional)

1. In Vercel → Project → **Settings** → **Domains**
2. Add your domain (e.g. `mysterylab.com`)
3. Follow DNS instructions
4. Update `PRODUCTION_URL` in Railway if you use a custom domain

---

## Troubleshooting

### Build fails

- Ensure **Root Directory** is `myPortfolioWeb/frontend`
- Check build logs for missing env vars or dependency errors
- Use `pnpm install` if your project uses pnpm (set Install Command)

### CORS errors when using the site

- Add your Vercel URL to `PRODUCTION_URL` in Railway
- No trailing slash: `https://your-project.vercel.app` not `https://your-project.vercel.app/`

### pnpm vs npm

If your frontend uses pnpm, in Vercel project settings:
- **Install Command:** `pnpm install`
- **Build Command:** `pnpm run build`
