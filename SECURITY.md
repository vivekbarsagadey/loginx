# Security Guidelines for LoginX

## 🔒 Overview

This document outlines the security measures implemented in LoginX and best practices for maintaining security.

## Critical Security Setup

### 1. Environment Variables

**NEVER commit the `.env` file to version control!** It's already in `.gitignore`.

#### Required Firebase Variables

All Firebase configuration variables are **required** and the app will fail to start if they're missing:

```bash
API_KEY="your-firebase-api-key"
AUTH_DOMAIN="your-firebase-auth-domain"
PROJECT_ID="your-firebase-project-id"
STORAGE_BUCKET="your-firebase-storage-bucket"
MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
APP_ID="your-firebase-app-id"
```

#### How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Select your web app or click "Add app" if none exists
6. Copy the configuration values to your `.env` file

### 2. Database Encryption Key

If you're using the SQLite database with encryption, generate a secure key:

```bash
# Generate a secure random key
openssl rand -base64 32
```

Add it to your `.env`:

```bash
DB_ENCRYPTION_KEY="your-generated-key-here"
```

### 3. Firestore Security Rules

The project includes comprehensive security rules in `firestore.rules`. Deploy them to Firebase:

```bash
firebase deploy --only firestore:rules
```

**Key Security Features:**

- Users can only read/write their own data
- Input validation on all user profile fields
- Email addresses validated with regex
- String length limits enforced
- Soft delete only (no hard deletes)
- Email changes via Firestore are prevented

### 4. Input Sanitization

All user inputs are automatically sanitized before being stored in Firestore:

- HTML tags removed
- Script tags stripped
- Length limits enforced
- Email addresses validated
- Special characters handled

This is handled by the `utils/sanitize.ts` module.

## Security Best Practices

### For Development

1. **Use different Firebase projects for dev/staging/production**
   - Create separate projects in Firebase Console
   - Use different `.env` files for each environment
   - Never use production credentials in development

2. **Keep dependencies updated**

   ```bash
   pnpm update
   pnpm audit
   ```

3. **Never log sensitive data**
   - Avoid logging user passwords, tokens, or personal information
   - Use `console.error` for errors, not sensitive data

### For Production

1. **Enable App Check** (Recommended)
   - Protects your backend resources from abuse
   - See [Firebase App Check](https://firebase.google.com/docs/app-check)

2. **Enable Firebase Authentication Email Verification**
   - Already implemented in the app
   - Consider requiring verified email for certain actions

3. **Set up monitoring**
   - Configure Sentry for error tracking
   - Monitor authentication attempts
   - Set up alerts for suspicious activity

4. **Use HTTPS only**
   - All API calls should use HTTPS
   - Firebase automatically uses HTTPS

5. **Regular security audits**
   - Review Firestore rules regularly
   - Check for dependency vulnerabilities
   - Review authentication logs

## Authentication Security

### Password Requirements

Passwords must meet these requirements (enforced by Zod validation):

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%\*?&)

### Authentication Persistence

- **Web**: Uses `browserLocalPersistence` (users stay logged in)
- **Mobile**: Uses `inMemoryPersistence` (users must login each session)
  - This is intentional for security
  - Consider implementing secure storage for production if needed

### Session Management

- Firebase Authentication handles session tokens
- Tokens automatically refresh
- Sessions expire based on Firebase settings (default: 1 hour)

## Data Privacy

### User Data Storage

1. **Firestore** - User profiles
   - Encrypted at rest by Google
   - Encrypted in transit (TLS)
   - Access controlled by security rules

2. **SQLite** - App settings (local only)
   - Stored on device
   - Not synced to cloud
   - Can be encrypted with `DB_ENCRYPTION_KEY`

### Data Deletion

- User account deletion is **soft delete**
- Sets `deleted: true` and `deletedAt` timestamp
- Data remains in Firestore for audit/recovery
- Implement hard delete separately if required by GDPR/privacy laws

## Incident Response

If you suspect a security breach:

1. **Immediately revoke compromised credentials**
   - Regenerate Firebase credentials
   - Force all users to re-authenticate
   - Rotate encryption keys

2. **Review Firebase Console logs**
   - Check Authentication logs
   - Review Firestore access patterns
   - Look for unusual activity

3. **Update security rules**
   - Add additional restrictions if needed
   - Deploy immediately

4. **Notify users if required**
   - Follow data breach notification laws
   - Be transparent about what happened

## Security Checklist

Before deploying to production:

- [ ] All environment variables are set correctly
- [ ] `.env` file is in `.gitignore`
- [ ] Firebase security rules are deployed
- [ ] Different Firebase projects for dev/staging/production
- [ ] Strong database encryption key generated
- [ ] Sentry or error monitoring configured
- [ ] Firebase App Check enabled (recommended)
- [ ] SSL/TLS certificates valid
- [ ] Dependencies updated and audited
- [ ] User data privacy policy in place
- [ ] GDPR compliance reviewed (if applicable)

## Reporting Security Issues

If you discover a security vulnerability, please email:
**[your-security-email@example.com]**

Do NOT open a public issue for security vulnerabilities.

## Additional Resources

- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [React Native Security Guide](https://reactnative.dev/docs/security)
- [Expo Security Best Practices](https://docs.expo.dev/guides/security/)

---

**Last Updated:** October 2, 2025
