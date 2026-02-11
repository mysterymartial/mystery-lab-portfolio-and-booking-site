# Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### MongoDB Connection Failed
**Error**: `MongoServerError: Authentication failed`

**Solutions**:
1. Check username/password in connection string
2. URL encode special characters in password
3. Verify database user exists in Atlas
4. Check Network Access whitelist includes your IP
5. Verify connection string format is correct

#### Firebase Admin SDK Error
**Error**: `Error: Firebase Admin SDK initialization failed`

**Solutions**:
1. Check `FIREBASE_PRIVATE_KEY` includes `\n` characters
2. Verify private key is wrapped in quotes
3. Check `FIREBASE_CLIENT_EMAIL` matches service account email
4. Verify `FIREBASE_PROJECT_ID` is correct
5. Ensure service account JSON was downloaded correctly

#### Rate Limiting Too Strict
**Error**: `Too many requests`

**Solutions**:
1. Adjust limits in `backend/src/middleware/rateLimiter.ts`
2. Check if behind reverse proxy (set `trust proxy`)
3. Verify rate limit windows are appropriate

#### Email Not Sending
**Error**: `Email sending failed`

**Solutions**:
1. Check SMTP credentials are correct
2. For Gmail: Use App Password, not regular password
3. Verify SMTP port (587 for Gmail)
4. Check firewall allows SMTP connections
5. Test SMTP connection separately

### Frontend Issues

#### Firebase Auth Not Working
**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solutions**:
1. Verify all env vars start with `NEXT_PUBLIC_`
2. Restart dev server after changing env vars
3. Check Firebase project settings
4. Verify API key is correct
5. Clear browser cache

#### API Calls Failing
**Error**: `Failed to fetch` or CORS errors

**Solutions**:
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Verify backend is running
3. Check CORS settings in backend
4. Verify backend URL includes `/api` suffix
5. Check browser console for detailed errors

#### Images Not Loading
**Error**: Images not displaying

**Solutions**:
1. Check image paths are correct
2. Verify images exist in `public/` folder
3. Check Next.js image config includes your domain
4. Verify image file permissions
5. Check browser console for 404 errors

#### Dark Mode Not Working
**Error**: Theme not changing

**Solutions**:
1. Check MongoDB connection
2. Verify settings collection exists
3. Check admin is logged in
4. Verify theme setting is saved in database
5. Check browser console for errors

### Deployment Issues

#### Build Fails
**Error**: `Build failed`

**Solutions**:
1. Check for TypeScript errors: `npm run build`
2. Verify all dependencies installed
3. Check environment variables are set
4. Review build logs for specific errors
5. Ensure Node.js version is 18+

#### Environment Variables Not Working
**Error**: Variables undefined

**Solutions**:
1. Frontend: Must start with `NEXT_PUBLIC_`
2. Restart server after changing env vars
3. Verify `.env` files are in correct location
4. Check hosting platform env var settings
5. Ensure no typos in variable names

#### SSL Certificate Issues
**Error**: `SSL certificate error`

**Solutions**:
1. Vercel/Netlify: Automatic SSL (check DNS)
2. Custom server: Renew Let's Encrypt certificate
3. Cloudflare: Check SSL/TLS mode
4. Verify domain DNS is correct
5. Wait for DNS propagation (up to 48 hours)

### Performance Issues

#### Slow API Responses
**Solutions**:
1. Check database indexes are created
2. Verify query optimization
3. Check MongoDB Atlas cluster tier
4. Review slow query logs
5. Consider adding more indexes

#### Slow Page Loads
**Solutions**:
1. Enable Next.js image optimization
2. Check image sizes
3. Verify compression is enabled
4. Review bundle size
5. Consider code splitting

### Security Issues

#### Rate Limiting Not Working
**Solutions**:
1. Check middleware order in server.ts
2. Verify rate limiter is applied to routes
3. Check if behind reverse proxy
4. Test with different IPs
5. Review rate limit configuration

#### XSS Attacks
**Solutions**:
1. Verify sanitization middleware is applied
2. Check DOMPurify is working
3. Review input validation
4. Test with malicious inputs
5. Check Content Security Policy headers

## Getting Help

### Check Logs
- **Backend**: `backend/logs/` directory
- **Frontend**: Browser console
- **Server**: `pm2 logs` or hosting platform logs

### Debug Mode
Set `NODE_ENV=development` for detailed error messages

### Test Endpoints
Use Postman or curl to test API endpoints directly

### Database Queries
Use MongoDB Compass to inspect database directly
