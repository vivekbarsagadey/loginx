# Legal Compliance Quick Reference

**Quick access guide for developers implementing or maintaining legal compliance
features.**

---

## 🚀 Quick Navigation

```typescript
import { Routes } from "@/constants/routes";

// Navigate to legal screens
router.push(Routes.LEGAL.TERMS); // Terms of Service
router.push(Routes.LEGAL.PRIVACY); // Privacy Policy
router.push(Routes.LEGAL.LICENSE); // License Info
router.push(Routes.LEGAL.DATA_RIGHTS); // GDPR Data Rights
router.push(Routes.LEGAL.COOKIES); // Cookie Policy
```

---

## 📋 Screens at a Glance

| Screen          | Route                | Key Features                   | GDPR | Accessible |
| --------------- | -------------------- | ------------------------------ | ---- | ---------- |
| **Terms**       | `/legal/terms`       | User agreement, legal terms    | ✅   | ✅         |
| **Privacy**     | `/legal/privacy`     | Data collection, usage, rights | ✅   | ✅         |
| **License**     | `/legal/license`     | App & OSS licenses             | ❌   | ✅         |
| **Data Rights** | `/legal/data-rights` | GDPR rights, data actions      | ✅   | ✅         |
| **Cookies**     | `/legal/cookies`     | Cookie types, controls         | ✅   | ✅         |

---

## 🎯 Common Use Cases

### 1. Registration Flow

```tsx
import { TermsCheckbox } from "@/components/ui/terms-checkbox";

function RegisterScreen() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <TermsCheckbox
      checked={acceptedTerms}
      onChange={setAcceptedTerms}
      error={!acceptedTerms ? "You must accept terms to continue" : undefined}
    />
  );
}
// Links automatically to /legal/terms and /legal/privacy
```

### 2. Data Export Request

```typescript
import { Alert } from "react-native";

async function requestUserData(userId: string) {
  Alert.alert(
    "Request Your Data",
    "We will prepare a copy and send it within 30 days.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          await createDataExportRequest(userId);
          Alert.alert("Success", "Request submitted.");
        }
      }
    ]
  );
}
```

### 3. Account Deletion (GDPR Right to Erasure)

```typescript
async function deleteUserAccount(userId: string) {
  Alert.alert(
    "Delete Account",
    "This will permanently delete all your data. Cannot be undone.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete Permanently",
        style: "destructive",
        onPress: async () => {
          await performAccountDeletion(userId);
          await signOut();
          router.replace(Routes.AUTH.WELCOME);
        }
      }
    ]
  );
}
```

### 4. Cookie Preference Management

```typescript
interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  social: boolean;
}

async function saveCookiePreferences(prefs: CookiePreferences) {
  await saveDataLocally("cookie_preferences", prefs);
}
```

---

## 🔧 Adding New Content

### Update Terms/Privacy Content

**File:** `i18n/locales/en/legal.json`

```json
{
  "screens": {
    "legal": {
      "terms": {
        "sections": {
          "newSection": {
            "title": "New Section Title",
            "content": "Section content here..."
          }
        }
      }
    }
  }
}
```

### Add New Legal Screen

1. Create screen file: `app/legal/your-screen.tsx`
2. Add route: `constants/routes.ts` →
   `LEGAL: { YOUR_SCREEN: '/legal/your-screen' }`
3. Register in layout: `app/legal/_layout.tsx` →
   `<Stack.Screen name="your-screen" />`
4. Add translations: `i18n/locales/*/legal.json`

---

## ♿ Accessibility Checklist

```tsx
// ✅ Screen announcement
useEffect(() => {
  AccessibilityInfo.announceForAccessibility('Screen title. Description.');
}, []);

// ✅ Header roles
<ThemedText type="h1" accessibilityRole="header">
  {title}
</ThemedText>

// ✅ Section labels
<ThemedView
  accessible={true}
  accessibilityLabel={`Section ${index + 1}: ${title}`}
>
  {content}
</ThemedView>

// ✅ Action hints
<ThemedButton
  accessibilityHint="What happens when pressed"
  onPress={handleAction}
/>
```

---

## 🌐 Internationalization

### Translation Structure

```
i18n/
└── locales/
    ├── en/
    │   └── legal.json    # English translations
    ├── es/
    │   └── legal.json    # Spanish translations
    └── fr/
        └── legal.json    # French translations
```

### Usage

```typescript
import i18n from "@/i18n";

const title = i18n.t("screens.legal.terms.title");
const sections = i18n.t("screens.legal.terms.sections", {
  returnObjects: true
});
```

---

## 🧪 Testing

### Manual Testing Script

```bash
# Test all legal screens load
✓ Open /legal/terms
✓ Open /legal/privacy
✓ Open /legal/license
✓ Open /legal/data-rights
✓ Open /legal/cookies

# Test accessibility
✓ Enable VoiceOver/TalkBack
✓ Navigate through screens
✓ Verify all sections announced
✓ Test button interactions

# Test actions
✓ Click "Request My Data"
✓ Click "Delete Account"
✓ Click "Contact Support"
✓ Verify confirmations show
```

### Automated Tests

```typescript
describe('Legal Screens', () => {
  it('renders terms screen', () => {
    const { getByText } = render(<TermsScreen />);
    expect(getByText('Terms of Service')).toBeTruthy();
  });

  it('has accessibility labels', () => {
    const { getByLabelText } = render(<DataRightsScreen />);
    expect(getByLabelText(/Right of Access/i)).toBeTruthy();
  });
});
```

---

## 📞 Support Contacts

- **Privacy Requests:** privacy@whizit.co.in
- **Legal Questions:** legal@whizit.co.in
- **General Support:** support@whizit.co.in

---

## 📚 Full Documentation

For complete details, see:

- **`docs/LEGAL_COMPLIANCE_GUIDE.md`** - Complete implementation guide
- **`docs/DESIGN_SYSTEM.md`** - UI/UX guidelines
- **`docs/AUTHENTICATION_GUIDE.md`** - Auth integration

---

**Last Updated:** October 7, 2025
