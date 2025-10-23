# Firebase Cloud Functions Deployment Guide

**Last Updated:** October 14, 2025  
**Author:** LoginX Development Team  
**Status:** ✅ Ready for Deployment

---

## Overview

This guide covers the deployment and management of Firebase Cloud Functions for server-side rate limiting and authentication security in the LoginX application.

### What's Implemented

- **TASK-009**: Rate limiting middleware for Cloud Functions
- **TASK-010**: Server-side login validation with rate limiting
- **TASK-011**: Server-side registration validation with rate limiting
- **TASK-012**: IP-based rate limit tracking using Firestore
- **TASK-014**: Client-side helper for calling Cloud Functions
- **TASK-015**: Login screen integration with rate limit handling
- **TASK-016**: Firestore Security Rules for rate limiting collections

---

## Prerequisites

### Required Tools

1. **Firebase CLI** (v13.0.0+)

   ```powershell
   npm install -g firebase-tools
   ```

2. **Node.js** (v20.0.0+)
   - Cloud Functions require Node.js 20
   - Check version: `node --version`

3. **Firebase Project**
   - Project must be on Blaze (pay-as-you-go) plan for Cloud Functions
   - Firebase Authentication enabled
   - Firestore Database created

### Firebase Login

```powershell
firebase login
firebase projects:list
firebase use [your-project-id]
```

---

## Project Structure

```
functions/
├── src/
│   ├── index.ts                    # Main Cloud Functions entry point
│   └── middleware/
│       └── rate-limit.ts           # Rate limiting middleware
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── .gitignore                      # Git ignore rules

utils/
└── auth-rate-limiter.ts            # Client-side helper functions

firestore.rules                     # Security rules for Firestore
```

---

## Deployment Steps

### 1. Install Dependencies

```powershell
cd functions
npm install
```

Expected dependencies:

- `firebase-functions@^6.1.0`
- `firebase-admin@^13.0.1`
- `typescript@^5.7.3`

### 2. Build Functions

```powershell
npm run build
```

This compiles TypeScript to JavaScript in the `lib/` directory.

**Expected Output:**

```
Successfully compiled 2 files with TypeScript 5.7.3
```

### 3. Test Locally with Emulator (Recommended)

```powershell
# From project root
firebase emulators:start
```

**What This Does:**

- Starts Firebase Emulator Suite
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Auth: http://localhost:9099
- UI: http://localhost:4000

**Emulator Testing Checklist:**

- [ ] `validateLogin` returns success for valid input
- [ ] Rate limit enforced after max attempts
- [ ] `validateRegistration` rejects existing emails
- [ ] `recordLoginAttempt` writes to Firestore
- [ ] HTTP 429 returned when rate limited
- [ ] Client helper handles errors gracefully

### 4. Deploy Firestore Security Rules

```powershell
firebase deploy --only firestore:rules
```

**What Gets Deployed:**

- User collection rules (existing)
- Rate limiting collection rules (new)
- Login attempt collection rules (new)

**Security Features:**

- Blocks direct client access to rate_limits
- Blocks direct client access to login_attempts
- Only Cloud Functions can read/write these collections

### 5. Deploy Cloud Functions

```powershell
firebase deploy --only functions
```

**What Gets Deployed:**

- `validateLogin` - Login rate limiting
- `validateRegistration` - Registration rate limiting
- `recordLoginAttempt` - Attempt tracking
- `validatePasswordReset` - Password reset rate limiting
- `validateEmailVerification` - Email verification rate limiting
- `scheduledRateLimitCleanup` - Daily cleanup job
- `getRateLimitStatus` - Admin debugging endpoint

**Deployment Time:** ~3-5 minutes

**Expected Output:**

```
✔  functions: Finished running predeploy script.
✔  functions[us-central1-validateLogin]: Successful create operation.
✔  functions[us-central1-validateRegistration]: Successful create operation.
...
Deploy complete!
```

### 6. Verify Deployment

```powershell
firebase functions:list
```

**Expected Functions:**

```
validateLogin (https)
validateRegistration (https)
recordLoginAttempt (https)
validatePasswordReset (https)
validateEmailVerification (https)
scheduledRateLimitCleanup (scheduled)
getRateLimitStatus (https)
```

---

## Rate Limiting Configuration

### Default Limits

#### Login Validation (`validateLogin`)

- **Max Attempts:** 5 per minute
- **Block Duration:** 15 minutes
- **Purpose:** Prevent brute force attacks on login

#### Registration Validation (`validateRegistration`)

- **Max Attempts:** 3 per 5 minutes
- **Block Duration:** 30 minutes
- **Purpose:** Prevent automated account creation

#### Password Reset (`validatePasswordReset`)

- **Max Attempts:** 3 per hour
- **Block Duration:** 1 hour
- **Purpose:** Prevent password reset abuse

#### Email Verification (`validateEmailVerification`)

- **Max Attempts:** 10 per hour
- **Block Duration:** 15 minutes
- **Purpose:** Prevent verification code abuse

### Modifying Rate Limits

Edit `functions/src/middleware/rate-limit.ts`:

```typescript
export const authRateLimit = createRateLimiter({
  maxAttempts: 5, // Change max attempts
  windowMs: 60 * 1000, // Change time window (ms)
  blockDurationMs: 15 * 60 * 1000, // Change block duration (ms)
  collection: "rate_limits"
});
```

After modification:

```powershell
cd functions
npm run build
firebase deploy --only functions
```

---

## Client Integration

### Existing Integration

The following screens are already integrated:

#### Login Screen (`app/(auth)/login.tsx`)

```typescript
// Check rate limit before authentication
const validation = await validateLogin(email);
if (!validation.success) {
  if (validation.rateLimited) {
    // Show rate limit error with retry time
    showAlert("Too Many Attempts", formatRateLimitMessage(validation));
    return;
  }
}

// Proceed with authentication
await signInWithEmailAndPassword(auth, email, password);

// Record attempt for analytics
await recordLoginAttempt(email, success);
```

**User Experience:**

- Instant feedback on rate limit
- Clear message with retry time
- Graceful degradation on Cloud Function errors

### Future Integration (TODO)

#### Registration Screen (`app/(auth)/register/step-2.tsx`)

```typescript
const validation = await validateRegistration(email, displayName);
if (!validation.success) {
  // Handle rate limit or validation errors
}
```

#### Password Reset (`app/(auth)/forgot-password.tsx`)

```typescript
const validation = await validatePasswordReset(email);
if (!validation.success) {
  // Handle rate limit
}
```

#### Email Verification (`app/(auth)/verify-email.tsx`)

```typescript
const validation = await validateEmailVerification(code);
if (!validation.success) {
  // Handle rate limit
}
```

---

## Monitoring & Debugging

### Firebase Console

1. **Functions Dashboard**
   - Navigate to: Firebase Console → Functions
   - Monitor: Invocations, execution time, errors

2. **Firestore Dashboard**
   - Navigate to: Firebase Console → Firestore Database
   - Collections:
     - `rate_limits/{ip}` - Rate limit tracking
     - `login_attempts/{attemptId}` - Login attempt logs

### Logs

#### Real-time Logs

```powershell
firebase functions:log --only validateLogin
```

#### Last 100 Logs

```powershell
firebase functions:log --limit 100
```

#### Filter by Severity

```powershell
firebase functions:log --only validateLogin --severity ERROR
```

### Common Issues

#### Issue: "Rate limit exceeded" shown too frequently

**Solution:**

- Check `rate_limits` collection for stuck records
- Verify cleanup job is running: `firebase functions:log --only scheduledRateLimitCleanup`
- Manually clean up: Delete documents in `rate_limits` older than 24 hours

#### Issue: Cloud Functions timing out

**Solution:**

- Check Firestore indexes: Firebase Console → Firestore → Indexes
- Increase timeout in `functions/src/index.ts`:
  ```typescript
  export const validateLogin = onCall({ timeoutSeconds: 60 }, async (request) => {
    // ...
  });
  ```

#### Issue: HTTP 429 errors not handled properly

**Solution:**

- Verify client-side error handling in `auth-rate-limiter.ts`
- Check if `isRateLimitError` correctly detects `functions/resource-exhausted`
- Ensure `formatRateLimitMessage` extracts retry time

---

## Cost Estimation

### Cloud Functions Pricing (Pay-as-you-go)

**Invocations:**

- First 2 million/month: Free
- Additional: $0.40 per million

**Compute Time:**

- First 400,000 GB-seconds/month: Free
- Additional: $0.0000025 per GB-second

**Estimated Monthly Cost:**

- 100,000 users
- 10 auth operations per user per month = 1M function calls
- Average execution time: 200ms
- **Cost: $0** (within free tier)

**Firestore Pricing:**

**Document Writes:**

- Rate limit tracking: ~2 writes per auth attempt
- 1M auth attempts = 2M writes = $3.60

**Document Reads:**

- Rate limit checks: ~1 read per auth attempt
- 1M auth attempts = 1M reads = $0.36

**Storage:**

- Rate limit records: ~1KB per record
- 10,000 active rate limits = 10MB = $0.002

**Estimated Monthly Cost for 1M auth attempts:**

- **Cloud Functions:** $0 (free tier)
- **Firestore:** ~$4
- **Total:** ~$4/month

---

## Security Best Practices

### 1. App Check Integration (TODO - TASK-013)

Add Firebase App Check to verify requests are from your app:

```typescript
// firebase-config.ts
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY!),
  isTokenAutoRefreshEnabled: true
});
```

### 2. Secret Management

Never commit sensitive data:

- Use `.env.local` for development
- Use Firebase Secret Manager for production:
  ```powershell
  firebase functions:secrets:set API_KEY
  ```

### 3. Input Validation

All Cloud Functions validate input:

```typescript
if (!email || typeof email !== "string") {
  throw new HttpsError("invalid-argument", "Email is required");
}
```

### 4. Error Sanitization

Never expose internal errors to clients:

```typescript
catch (error) {
  console.error('[Internal]', _error); // Log full error
  throw new HttpsError('internal', 'Operation failed'); // Generic message
}
```

---

## Maintenance

### Daily Cleanup Job

The `scheduledRateLimitCleanup` function runs daily at 2 AM UTC:

- Deletes rate limit records older than 24 hours
- Prevents unbounded collection growth
- Logs cleanup summary

**Manual Cleanup:**

```powershell
# Trigger cleanup manually
firebase functions:call scheduledRateLimitCleanup
```

### Monitoring Alerts

Set up Cloud Monitoring alerts:

1. Navigate to: Firebase Console → Functions → Metrics
2. Create alert for:
   - Error rate > 5%
   - Execution time > 10 seconds
   - Invocation count spikes

---

## Rollback Procedure

### Rollback Functions

```powershell
# List previous deployments
firebase functions:list --only validateLogin

# Rollback to previous version
firebase functions:delete validateLogin
firebase deploy --only functions:validateLogin
```

### Rollback Firestore Rules

```powershell
# Download current rules
firebase firestore:rules:get > firestore.rules.backup

# Restore previous rules
firebase deploy --only firestore:rules
```

---

## Testing Checklist

### Pre-Deployment Testing

- [ ] All TypeScript compiles without errors
- [ ] Unit tests pass (if applicable)
- [ ] Emulator testing complete
- [ ] Rate limits enforce correctly
- [ ] Error messages are user-friendly
- [ ] Firestore rules block direct client access

### Post-Deployment Testing

- [ ] Functions deployed successfully
- [ ] Login rate limiting works end-to-end
- [ ] Registration rate limiting works
- [ ] HTTP 429 errors handled gracefully
- [ ] Firestore collections populate correctly
- [ ] Cleanup job scheduled and running
- [ ] Logs show no unexpected errors

### Load Testing (Optional)

```typescript
// Test script (run with Node.js)
const { httpsCallable } = require("firebase/functions");
const { functions } = require("../firebase-config");

async function loadTest() {
  const validateLogin = httpsCallable(functions, "validateLogin");

  for (let i = 0; i < 10; i++) {
    try {
      const result = await validateLogin({ email: "test@example.com" });
      console.log(`Attempt ${i + 1}: Success`);
    } catch (error) {
      console.log(`Attempt ${i + 1}: ${error.code}`);
    }
  }
}

loadTest();
```

---

## Troubleshooting

### Common Errors

#### Error: "Firebase CLI not found"

```powershell
npm install -g firebase-tools
```

#### Error: "Project not on Blaze plan"

- Upgrade in Firebase Console → Spark → Upgrade

#### Error: "Node version mismatch"

```powershell
nvm install 20
nvm use 20
```

#### Error: "Module not found"

```powershell
cd functions
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

1. **Firebase Status:** https://status.firebase.google.com/
2. **Firebase Support:** https://firebase.google.com/support
3. **Stack Overflow:** Tag `firebase-functions`
4. **GitHub Issues:** [Your repo]/issues

---

## Next Steps

1. **Deploy to Production:**

   ```powershell
   firebase deploy
   ```

2. **Enable App Check (TASK-013):**
   - Set up reCAPTCHA v3 for web
   - Set up DeviceCheck for iOS
   - Set up Play Integrity for Android

3. **Add Monitoring:**
   - Set up Cloud Monitoring alerts
   - Integrate with logging service (e.g., Sentry)

4. **Optimize Performance:**
   - Add Firestore indexes if needed
   - Consider Redis for high-traffic scenarios

5. **Complete Integration:**
   - Add rate limiting to registration screen
   - Add rate limiting to password reset
   - Add rate limiting to email verification

---

## Appendix

### Environment Variables

Required in `.env.local`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Firebase CLI Commands Reference

```powershell
# Login
firebase login

# Initialize Functions
firebase init functions

# Test locally
firebase emulators:start

# Deploy all
firebase deploy

# Deploy functions only
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:validateLogin

# Deploy Firestore rules
firebase deploy --only firestore:rules

# View logs
firebase functions:log

# Delete function
firebase functions:delete validateLogin

# List functions
firebase functions:list
```

---

**End of Deployment Guide**
