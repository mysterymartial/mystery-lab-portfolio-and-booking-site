# Environment Setup Guide

## How to Get Firebase Keys

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" or select existing project
3. Enter project name: "Mystery Lab" (or your preferred name)
4. Disable Google Analytics (optional) or enable it
5. Click "Create project"

### Step 2: Get Firebase Client Configuration
1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Register app with nickname (e.g., "Mystery Lab Web")
5. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. Use these values in `frontend/.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` = apiKey
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = authDomain
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = projectId
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = storageBucket
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = messagingSenderId
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = appId

### Step 3: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Click "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Step 4: Create Admin User
1. Go to "Authentication" → "Users" tab
2. Click "Add user"
3. Enter admin email and password
4. Click "Add user"
5. **Save these credentials** - you'll use them to login to `/admin`

### Step 5: Get Firebase Admin SDK Credentials (for Backend)
1. In Firebase Console, go to "Project settings" (gear icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Click "Generate key" (downloads JSON file)
5. Open the JSON file and copy:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

**Important**: The private key has `\n` characters - keep them exactly as they are in the JSON file.

---

## How to Get MongoDB Atlas Keys

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign In"
3. Create account or sign in

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "M0 FREE" (free tier) or paid tier
3. Select cloud provider and region (closest to you)
4. Click "Create"
5. Wait for cluster to be created (2-3 minutes)

### Step 3: Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username (e.g., "mystery-lab-admin")
5. Click "Autogenerate Secure Password" or create your own
6. **SAVE THE PASSWORD** - you won't see it again!
7. Set user privileges to "Atlas admin" or "Read and write to any database"
8. Click "Add User"

### Step 4: Configure Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: Less secure, but easier for development
4. For production: Add your server's IP address
5. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select driver: "Node.js" and version: "5.5 or later"
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database username
7. Replace `<password>` with your database password (URL encode special characters)
8. Add database name at the end:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mystery-lab?retryWrites=true&w=majority
   ```
9. Use this as `MONGODB_URI` in `backend/.env`

### Step 6: Test Connection
1. In MongoDB Atlas, click "Browse Collections"
2. Your database should be empty initially
3. Collections will be created automatically when you run the app

---

## Quick Setup Summary

### Firebase Setup (5 minutes)
1. Create Firebase project
2. Enable Email/Password auth
3. Create admin user
4. Get client config → Frontend `.env.local`
5. Get service account key → Backend `.env`

### MongoDB Setup (5 minutes)
1. Create Atlas account
2. Create free cluster
3. Create database user
4. Allow network access
5. Get connection string → Backend `.env`

### Email Setup (Gmail Example)
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to "App passwords"
4. Generate app password for "Mail"
5. Use this password as `SMTP_PASS` in backend `.env`

---

## Testing Your Setup

### Test Firebase
```bash
# In frontend directory
npm run dev
# Visit http://localhost:3000/admin
# Try logging in with admin credentials
```

### Test MongoDB
```bash
# In backend directory
npm run dev
# Check console for "✅ MongoDB Atlas connected successfully"
```

### Test Email
```bash
# Send a test message via /booking page
# Check admin email inbox
```

---

## Troubleshooting

### Firebase Issues
- **"Invalid API key"**: Check that all env vars start with `NEXT_PUBLIC_`
- **"Auth domain not authorized"**: Add domain to Firebase authorized domains
- **"User not found"**: Create admin user in Firebase Console

### MongoDB Issues
- **"Authentication failed"**: Check username/password in connection string
- **"Connection timeout"**: Add your IP to Network Access whitelist
- **"Database not found"**: Database created automatically on first use

### Email Issues
- **"Invalid login"**: Use App Password, not regular password
- **"Connection refused"**: Check SMTP port (587 for Gmail)
- **"Authentication failed"**: Enable "Less secure app access" or use App Password
