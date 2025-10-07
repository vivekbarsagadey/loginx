# Share App / Invite Friends Feature

## Overview

The Share App feature allows users to invite friends to LoginX through various
sharing channels including WhatsApp, SMS, Email, and more. Each user gets a
unique referral link that can be shared easily.

## Quick Start

### For Users

1. Open Settings from the tab bar
2. Scroll to "Help & Feedback" section
3. Tap "Share App"
4. Choose your preferred sharing method:
   - WhatsApp
   - SMS
   - Email
   - More Options (native share)
   - Copy Link

### For Developers

#### Accessing the Share Screen

```typescript
import { useRouter } from "expo-router";
import { Routes } from "@/constants/routes";

const router = useRouter();
router.push(Routes.SETTINGS.SHARE_APP);
```

#### Customizing Referral Links

Update the `generateReferralLink()` function in `app/settings/share-app.tsx`:

```typescript
const generateReferralLink = (): string => {
  // Get user's unique referral code from profile
  const referralCode = user?.referralCode || "LOGINX2025";
  const appUrl = "https://loginx.app"; // Your app URL
  return `${appUrl}/invite?ref=${referralCode}`;
};
```

## Features

### 1. Referral Link Generation

- Unique link per user (customizable)
- Format: `https://loginx.app/invite?ref={code}`
- Displayed prominently with copy button

### 2. Multiple Sharing Options

#### WhatsApp

```typescript
whatsapp://send?text={encodedMessage}
```

#### SMS

```typescript
// iOS
sms:&body={encodedMessage}

// Android
sms:?body={encodedMessage}
```

#### Email

```typescript
mailto:?subject={subject}&body={encodedMessage}
```

#### Native Share

```typescript
await Share.share({
  message: shareMessage,
  url: referralLink, // iOS only
  title: "Invite Friends to LoginX"
});
```

### 3. Error Handling

- Graceful degradation when apps not installed
- User-friendly error messages
- Haptic feedback on all actions

### 4. Internationalization

Fully translated into:

- English (en)
- Spanish (es)
- Hindi (hi)

## Customization

### Change App URL

Edit `generateReferralLink()` in `app/settings/share-app.tsx`:

```typescript
const appUrl = "https://your-app-url.com";
```

### Customize Share Message

Update translation keys in `i18n/locales/*.json`:

```json
{
  "shareApp": {
    "message": "Your custom message here\n\n{link}"
  }
}
```

### Add More Sharing Options

Add new options to the `shareOptions` array:

```typescript
{
  id: 'telegram',
  icon: 'send' as const,
  title: 'Share via Telegram',
  subtitle: 'Share your referral link on Telegram',
  onPress: handleShareTelegram,
  color: '#0088cc',
}
```

### Implement Referral Tracking

1. **Add referralCode field to User model**:

```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  referralCode: string; // Add this
  referredBy?: string; // Who referred this user
  referralCount?: number; // How many users referred
}
```

1. **Generate unique codes on registration**:

```typescript
import { nanoid } from "nanoid";

const referralCode = nanoid(8).toUpperCase();
```

1. **Track referrals**:

```typescript
// When new user signs up with ref parameter
const referrer = await getUserByReferralCode(refCode);
if (referrer) {
  await incrementReferralCount(referrer.uid);
  await setDoc(
    doc(db, "users", newUser.uid),
    {
      referredBy: referrer.uid
    },
    { merge: true }
  );
}
```

## Analytics Integration

Track sharing events:

```typescript
import * as Analytics from "expo-analytics";

const handleShareWhatsApp = async () => {
  // ... existing code

  // Track event
  Analytics.logEvent("share_app", {
    method: "whatsapp",
    content_type: "referral_link"
  });
};
```

## Testing

### Test WhatsApp Share

```bash
# Install WhatsApp on simulator/emulator
# OR test on physical device with WhatsApp installed
```

### Test SMS/Email

```bash
# Configure Mail app on iOS simulator
# OR test on physical device
```

### Test Error Handling

1. Remove WhatsApp from device
2. Tap "Share via WhatsApp"
3. Verify error message displayed

## Accessibility

All share options include:

- `accessibilityRole="button"`
- `accessibilityLabel` with descriptive text
- `accessibilityHint` for context
- Haptic feedback on interaction

Test with:

- VoiceOver (iOS)
- TalkBack (Android)

## Security Considerations

1. **Validate Referral Codes**: Always validate codes server-side
2. **Rate Limiting**: Prevent abuse by limiting referral claims
3. **Fraud Detection**: Monitor for suspicious referral patterns
4. **Privacy**: Don't expose user email in referral links

## Troubleshooting

### WhatsApp Opens But Message Not Pre-filled

- Ensure message is properly URL encoded
- Check for special characters in message
- Verify WhatsApp URL scheme

### SMS Not Working

- Check platform-specific URL format
- Ensure device has SMS capability
- Test on physical device (not simulator)

### Email Not Opening

- Verify email is configured on device
- Check mailto URL encoding
- Test with different email clients

## Future Enhancements

1. **QR Code Generation**: Allow users to share via QR code
2. **Social Media Direct**: Add Twitter, Facebook, Instagram
3. **Referral Rewards**: Gamify with rewards for referrals
4. **Custom Messages**: Let users personalize share message
5. **Analytics Dashboard**: Show user their referral stats

## Related Files

```
app/settings/share-app.tsx     # Main screen
constants/routes.ts            # Route constant
config/settings.ts             # Menu item
i18n/locales/                  # Translations
```

## Support

For issues or questions:

- Check documentation: `/docs/IMPLEMENTATION_STATUS.md`
- Review code comments in `share-app.tsx`
- Contact: vivek@whizit.co.in

---

**Last Updated**: October 7, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
