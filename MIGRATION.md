# Migration Guide - Security Updates

## Overview

This guide helps you migrate from the previous version to the new security-enhanced version of LoginX.

## Breaking Changes

### 1. Environment Variables Now Required

**Previous behavior:** Firebase credentials had fallback values  
**New behavior:** App will fail to start if credentials are missing

### 2. What You Need to Do

#### Step 1: Check Your .env File

Make sure your `.env` file contains all required Firebase credentials:

```bash
API_KEY="your-actual-firebase-api-key"
AUTH_DOMAIN="your-actual-auth-domain"
PROJECT_ID="your-actual-project-id"
STORAGE_BUCKET="your-actual-storage-bucket"
MESSAGING_SENDER_ID="your-actual-sender-id"
APP_ID="your-actual-app-id"
```

If you don't have a `.env` file, copy from the example:
```bash
cp .env.example .env
```

Then fill in your actual Firebase credentials.

#### Step 2: Update Firestore Security Rules

Deploy the new enhanced security rules:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the new rules
firebase deploy --only firestore:rules
```

#### Step 3: Test the Application

```bash
# Clear cache and restart
pnpm start --clear
```

If you see an error about missing environment variables, review Step 1.

## New Features Added

### 1. Input Sanitization

All user inputs are now automatically sanitized:
- HTML tags removed
- XSS protection
- Length limits enforced

No code changes needed - it works automatically!

### 2. Improved Cache Management

Cache now has better error handling and invalidation:
- `cache.invalidate(key)` - Invalidate specific entry
- `cache.clear()` - Clear all cache
- Better error handling

### 3. Database Error Handling

SQLite database now initializes asynchronously with proper error handling.

### 4. Enhanced Firestore Security Rules

New rules include:
- Field-level validation
- Email format validation
- Soft delete enforcement
- Prevention of direct deletions

## Common Issues

### Issue: "Missing required environment variables"

**Solution:** Your `.env` file is missing or incomplete. See Step 1 above.

### Issue: Firestore permission denied

**Solution:** Deploy the new security rules. See Step 2 above.

### Issue: TypeScript errors about sanitize module

**Solution:** Restart your TypeScript server or editor. The new `utils/sanitize.ts` file should be recognized.

### Issue: App crashes on startup

**Solution:** 
1. Check the console for specific errors
2. Verify all environment variables are set
3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

## Testing Your Migration

Run through these test cases:

1. **Registration**
   - Try to register with a new account
   - Verify input sanitization works (try entering HTML)
   - Check that profile is created in Firestore

2. **Login**
   - Login with existing credentials
   - Verify session persists (on web)

3. **Profile Update**
   - Update profile information
   - Try entering very long text
   - Try entering special characters

4. **Cache**
   - Update profile multiple times
   - Verify cache is properly invalidated

## Rollback Instructions

If you need to rollback to the previous version:

```bash
git log --oneline  # Find the commit before security updates
git checkout <commit-hash>
pnpm install
```

**Note:** Rolling back is NOT recommended as it removes important security fixes.

## Need Help?

If you encounter issues:

1. Check the [SECURITY.md](./SECURITY.md) file
2. Review the [README.md](./README.md)
3. Open an issue on GitHub

## Next Steps

After successfully migrating:

1. Review [SECURITY.md](./SECURITY.md) for best practices
2. Set up different environments (dev/staging/production)
3. Enable Firebase App Check
4. Configure monitoring (Sentry)

---

**Migration Date:** October 2, 2025
