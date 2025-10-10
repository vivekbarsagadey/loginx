#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * Migration script to update screens to use new UI consistency system
 * Run with: node scripts/migrate-to-ui-system.js
 */

const fs = require('fs');
const path = require('path');

const screensToMigrate = [
  'app/(auth)/forgot-password.tsx',
  'app/(auth)/verify-email.tsx',
  'app/(auth)/verify-phone.tsx',
  'app/(auth)/verify-2fa.tsx',
  'app/(tabs)/index.tsx',
  'app/(tabs)/items.tsx',
  'app/settings/notifications.tsx',
];

const replacements = [
  // Import replacements
  {
    from: /import.*SafeAreaView.*from 'react-native-safe-area-context';?\n?/g,
    to: '',
  },
  {
    from: /import.*ThemedView.*from '@\/components\/themed-view';/g,
    to: "import { ScreenContainer } from '@/components/screen-container';",
  },
  {
    from: /import.*ThemedScrollView.*from '@\/components\/themed-scroll-view';/g,
    to: "import { ScreenContainer } from '@/components/screen-container';",
  },

  // Add layout imports if not present
  {
    from: /(import.*from 'react-native';)/,
    to: "$1\nimport { Spacing, BorderRadius, TouchTarget } from '@/constants/layout';",
  },

  // Component replacements
  {
    from: /<SafeAreaView([^>]*)>/g,
    to: '<ScreenContainer$1>',
  },
  {
    from: /<\/SafeAreaView>/g,
    to: '</ScreenContainer>',
  },
  {
    from: /<ThemedView([^>]*?)style=\{\{[^}]*flex:\s*1[^}]*\}\}([^>]*)>/g,
    to: '<ScreenContainer$1$2>',
  },
  {
    from: /<ThemedScrollView([^>]*)>/g,
    to: '<ScreenContainer scrollable$1>',
  },
  {
    from: /<\/ThemedScrollView>/g,
    to: '</ScreenContainer>',
  },

  // Style replacements - spacing
  {
    from: /padding:\s*16,/g,
    to: 'padding: Spacing.md,',
  },
  {
    from: /padding:\s*24,/g,
    to: 'padding: Spacing.lg,',
  },
  {
    from: /padding:\s*8,/g,
    to: 'padding: Spacing.sm,',
  },
  {
    from: /marginTop:\s*16,/g,
    to: 'marginTop: Spacing.md,',
  },
  {
    from: /marginTop:\s*24,/g,
    to: 'marginTop: Spacing.lg,',
  },
  {
    from: /marginTop:\s*32,/g,
    to: 'marginTop: Spacing.xl,',
  },
  {
    from: /marginBottom:\s*16,/g,
    to: 'marginBottom: Spacing.md,',
  },
  {
    from: /marginBottom:\s*24,/g,
    to: 'marginBottom: Spacing.lg,',
  },
  {
    from: /marginBottom:\s*32,/g,
    to: 'marginBottom: Spacing.xl,',
  },
  {
    from: /marginVertical:\s*8,/g,
    to: 'marginVertical: Spacing.sm,',
  },
  {
    from: /marginHorizontal:\s*16,/g,
    to: 'marginHorizontal: Spacing.md,',
  },
  {
    from: /paddingHorizontal:\s*16,/g,
    to: 'paddingHorizontal: Spacing.md,',
  },
  {
    from: /paddingVertical:\s*16,/g,
    to: 'paddingVertical: Spacing.md,',
  },

  // Style replacements - border radius
  {
    from: /borderRadius:\s*12,/g,
    to: 'borderRadius: BorderRadius.md,',
  },
  {
    from: /borderRadius:\s*8,/g,
    to: 'borderRadius: BorderRadius.sm,',
  },
  {
    from: /borderRadius:\s*16,/g,
    to: 'borderRadius: BorderRadius.lg,',
  },

  // Style replacements - heights
  {
    from: /height:\s*48,/g,
    to: 'height: TouchTarget.comfortable,',
  },
  {
    from: /height:\s*44,/g,
    to: 'height: TouchTarget.minimum,',
  },
  {
    from: /minHeight:\s*48,/g,
    to: 'minHeight: TouchTarget.comfortable,',
  },
  {
    from: /minHeight:\s*44,/g,
    to: 'minHeight: TouchTarget.minimum,',
  },
];

function migrateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  replacements.forEach(({ from, to }) => {
    const newContent = content.replace(from, to);
    if (newContent !== content) {
      changed = true;
      content = newContent;
    }
  });

  if (changed) {
    // Create backup
    fs.writeFileSync(`${fullPath}.backup`, fs.readFileSync(fullPath));

    // Write updated content
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Migrated: ${filePath}`);
    console.log(`   Backup created: ${filePath}.backup`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

console.log('🚀 Starting UI Consistency System Migration\n');

screensToMigrate.forEach(migrateFile);

console.log('\n✨ Migration complete!');
console.log('\n📋 Next steps:');
console.log('1. Review the changes in each file');
console.log('2. Test each migrated screen on both iOS and Android');
console.log('3. Remove .backup files after verification');
console.log('4. Run: npm run lint:fix to clean up formatting');
console.log('5. Commit the changes\n');
