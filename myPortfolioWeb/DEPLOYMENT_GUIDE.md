# Deployment Guide

## Production Deployment Checklist

### 1. Domain & SSL Configuration

#### Custom Domain Setup
1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Point DNS records to your hosting provider:
   - **A Record**: `@` → Your server IP
   - **CNAME**: `www` → Your domain

#### SSL Certificate
- **Vercel/Netlify**: Automatic SSL (Let's Encrypt)
- **Custom Server**: Use Let's Encrypt with Certbot
- **Cloudflare**: Enable SSL/TLS (Full or Full Strict)

### 2. Environment Variables Setup

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mystery-lab
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
ADMIN_EMAIL=admin@yourdomain.com
FRONTEND_URL=https://yourdomain.com
PRODUCTION_URL=https://api.yourdomain.com
SENTRY_DSN=your_sentry_dsn
ENABLE_MONITORING=true
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_GA_ID=your_google_analytics_id
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

### 3. Backend Deployment

#### Option A: Railway/Render/Heroku
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

#### Option B: VPS (DigitalOcean, AWS EC2, etc.)
```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd myPortfolioWeb/backend

# Install dependencies
npm install --production

# Set environment variables
nano .env  # Add all variables

# Build TypeScript
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start dist/server.js --name mystery-lab-api
pm2 save
pm2 startup  # Follow instructions

# Setup Nginx reverse proxy
sudo apt-get install nginx
# Configure /etc/nginx/sites-available/default
```

### 4. Frontend Deployment

#### Vercel (Recommended)
1. Import GitHub repository
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy automatically

#### Netlify
1. Connect repository
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/.next`
4. Add environment variables

### 5. CORS Configuration

Update backend CORS to include production domain:
```typescript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'http://localhost:3000', // For development
];
```

### 6. MongoDB Atlas Configuration

1. **Network Access**: Add your server IP or `0.0.0.0/0` (less secure)
2. **Database User**: Create user with read/write permissions
3. **Connection String**: Get from Atlas dashboard
4. **Indexes**: Already created automatically on connection

### 7. Firebase Configuration

1. **Authentication**: Enable Email/Password provider
2. **Create Admin User**: Add user in Firebase Console
3. **Service Account**: Download JSON key for backend
4. **Client Config**: Get from Firebase Console → Project Settings

### 8. Monitoring Setup

#### Sentry
1. Create account at sentry.io
2. Create new project
3. Get DSN
4. Add to environment variables

#### Google Analytics
1. Create GA4 property
2. Get Measurement ID
3. Add to `NEXT_PUBLIC_GA_ID`

### 9. Performance Optimization

- ✅ Image optimization enabled in Next.js config
- ✅ Compression middleware enabled
- ✅ Database indexes created
- ✅ Query optimization implemented
- ✅ Caching headers configured

### 10. Security Checklist

- ✅ Rate limiting enabled
- ✅ Input sanitization enabled
- ✅ Security headers configured
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ Error logging configured

## Post-Deployment

1. Test all endpoints
2. Verify SSL certificate
3. Check monitoring dashboards
4. Test email notifications
5. Verify admin login
6. Test chat functionality
7. Check mobile responsiveness
