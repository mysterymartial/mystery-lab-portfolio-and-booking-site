# Deploy Backend to Railway

This guide walks you through deploying the Mystery Lab backend API to [Railway](https://railway.app/).

## Prerequisites

- [Railway account](https://railway.app/)
- GitHub repository with your code
- MongoDB Atlas database (or use MongoDB elsewhere)
- Firebase project for admin auth
- SMTP credentials for email

---

## Step 1: Push Your Code to GitHub

Ensure your project is pushed to GitHub. The backend lives in `myPortfolioWeb/backend/`.

---

## Step 2: Create a New Railway Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub repo"**
3. Select your repository
4. When prompted for **Root Directory**, set it to: `myPortfolioWeb/backend`
5. Railway will detect the Node.js app automatically

---

## Step 3: Set Environment Variables

In your Railway service, go to **Variables** and add these:

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Set by Railway automatically | *(do not set manually)* |
| `NODE_ENV` | Environment | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/mystery-lab?retryWrites=true&w=majority` |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | `my-project-123` |
| `FIREBASE_PRIVATE_KEY` | Service account private key (include `\n` for newlines) | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` |
| `FIREBASE_CLIENT_EMAIL` | Service account email | `firebase-adminsdk-xxx@my-project.iam.gserviceaccount.com` |
| `ADMIN_EMAIL` | Email to receive notifications | `admin@example.com` |

### Email (SMTP)

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | e.g. `587` |
| `SMTP_USER` | Your email |
| `SMTP_PASS` | App password (for Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833)) |
| `SMTP_FROM` | From address |

### CORS (Important for frontend)

| Variable | Description | Example |
|----------|-------------|---------|
| `FRONTEND_URL` | Local dev frontend | `http://localhost:3000` |
| `PRODUCTION_URL` | Production frontend URL | `https://your-portfolio.vercel.app` |

Add both URLs so the API accepts requests from dev and production.

### Optional

| Variable | Description |
|----------|-------------|
| `SENTRY_DSN` | Sentry error tracking |
| `ENABLE_MONITORING` | `true` or `false` |

---

## Step 4: Generate a Public Domain

1. In your Railway service, go to **Settings** → **Networking**
2. Click **Generate Domain**
3. Railway will assign a URL like `your-app.up.railway.app`
4. Copy this URL – you’ll use it as `NEXT_PUBLIC_API_URL` in your frontend

---

## Step 5: Update Frontend

Set your frontend API base URL to the Railway domain:

In your frontend `.env.local` or Vercel env vars:

```
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api
```

(The URL must include `/api` – the frontend uses it as the base for all API routes.)

---

## Step 6: MongoDB Atlas (if needed)

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist Railway IPs or use `0.0.0.0/0` for “allow from anywhere”
4. Copy the connection string and set it as `MONGODB_URI`

---

## Step 7: Deploy

1. Railway will deploy automatically when you connect the repo and add variables
2. Check **Deployments** → **View Logs** for build and runtime logs
3. Visit `https://your-app.up.railway.app/health` to confirm the API is up

---

## Health Check

After deployment, open:

```
https://your-app.up.railway.app/health
```

You should see:

```json
{
  "status": "OK",
  "message": "Mystery Lab Backend API is running",
  "timestamp": "...",
  "environment": "production"
}
```

---

## Troubleshooting

### Build fails

- Ensure **Root Directory** is `myPortfolioWeb/backend`
- Check logs for TypeScript or dependency errors

### CORS errors

- Add your frontend origin to `PRODUCTION_URL` and `FRONTEND_URL`
- Ensure there are no trailing slashes

### MongoDB connection fails

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (IP whitelist)

### Firebase auth fails

- Ensure `FIREBASE_PRIVATE_KEY` keeps `\n` for newlines (or use actual newlines if your platform supports it)
- Confirm the service account has the right permissions

---

## CLI Deployment (Alternative)

```bash
cd myPortfolioWeb/backend
npx @railway/cli login
npx @railway/cli init
# Add variables via dashboard or: railway variables set KEY=value
npx @railway/cli up
npx @railway/cli domain
```
