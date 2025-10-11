/**
 * Complete Dark Mode Testing Script
 *
 * This comprehensive script validates:
 * 1. Color contrast ratios meet WCAG AA/AAA standards
 * 2. All color tokens are properly defined
 * 3. Theme consistency across all themes
 * 4. No hardcoded colors in components
 * 5. AAA compliance status for all themes
 *
 * Run with: npx ts-node --project tsconfig.scripts.json scripts/test-dark-mode-complete.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { THEMES } from '../constants/themes';

interface ThemeColors {
  bg: string;
  'bg-elevated': string;
  surface: string;
  'surface-variant': string;
  text: string;
  'text-muted': string;
  'inverse-text': string;
  primary: string;
  'on-primary': string;
  border: string;
  'border-strong': string;
  success: string;
  warning: string;
  error: string;
  info: string;
  shadow: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

interface TestResult {
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

// =============================================================================
// WCAG Contrast Calculation
// =============================================================================

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// =============================================================================
// Test Functions
// =============================================================================

function testContrastRatios(colors: ThemeColors, themeName: string, mode: 'light' | 'dark'): TestResult[] {
  const results: TestResult[] = [];

  // Test text on background - WCAG AA: 4.5:1, AAA: 7.0:1
  const textBgRatio = getContrastRatio(colors.text, colors.bg);
  const textBgPassAA = textBgRatio >= 4.5;
  const textBgPassAAA = textBgRatio >= 7.0;
  results.push({
    passed: textBgPassAA,
    message: `${themeName} ${mode}: text on bg = ${textBgRatio.toFixed(2)}:1 ${textBgPassAAA ? '(AAA ✓)' : textBgPassAA ? '(AA ✓)' : '(FAIL)'}`,
    severity: textBgPassAA ? 'info' : 'error',
  });

  // Test text on surface
  const textSurfaceRatio = getContrastRatio(colors.text, colors.surface);
  const textSurfacePassAA = textSurfaceRatio >= 4.5;
  const textSurfacePassAAA = textSurfaceRatio >= 7.0;
  results.push({
    passed: textSurfacePassAA,
    message: `${themeName} ${mode}: text on surface = ${textSurfaceRatio.toFixed(2)}:1 ${textSurfacePassAAA ? '(AAA ✓)' : textSurfacePassAA ? '(AA ✓)' : '(FAIL)'}`,
    severity: textSurfacePassAA ? 'info' : 'error',
  });

  // Test on-primary text on primary button - WCAG AA: 4.5:1, AAA: 7.0:1
  const primaryTextRatio = getContrastRatio(colors['on-primary'], colors.primary);
  const primaryTextPassAA = primaryTextRatio >= 4.5;
  const primaryTextPassAAA = primaryTextRatio >= 7.0;
  results.push({
    passed: primaryTextPassAA,
    message: `${themeName} ${mode}: on-primary on primary = ${primaryTextRatio.toFixed(2)}:1 ${primaryTextPassAAA ? '(AAA ✓)' : primaryTextPassAA ? '(AA ✓)' : '(FAIL)'}`,
    severity: primaryTextPassAA ? 'info' : 'error',
  });

  // Test border contrast - WCAG AA: 3.0:1 for UI components
  const borderRatio = getContrastRatio(colors.border, colors.bg);
  const borderPass = borderRatio >= 3.0;
  results.push({
    passed: borderPass,
    message: `${themeName} ${mode}: border on bg = ${borderRatio.toFixed(2)}:1 ${borderPass ? '(✓)' : '(FAIL)'}`,
    severity: borderPass ? 'info' : 'warning',
  });

  // Test error contrast
  const errorRatio = getContrastRatio(colors.error, colors.bg);
  const errorPass = errorRatio >= 4.5;
  results.push({
    passed: errorPass,
    message: `${themeName} ${mode}: error on bg = ${errorRatio.toFixed(2)}:1 ${errorPass ? '(✓)' : '(FAIL)'}`,
    severity: errorPass ? 'info' : 'warning',
  });

  // Test layered surfaces (elevation)
  const bgElevatedRatio = getContrastRatio(colors['bg-elevated'], colors.bg);
  const surfaceRatio = getContrastRatio(colors.surface, colors.bg);
  const hasProperElevation = bgElevatedRatio >= 1.1 && surfaceRatio >= 1.1;
  results.push({
    passed: hasProperElevation,
    message: `${themeName} ${mode}: layered surfaces ${hasProperElevation ? 'properly elevated (✓)' : 'need more contrast (!)'}`,
    severity: hasProperElevation ? 'info' : 'warning',
  });

  return results;
}

function testTokenCompleteness(colors: ThemeColors, themeName: string, mode: 'light' | 'dark'): TestResult[] {
  const requiredTokens: (keyof ThemeColors)[] = [
    'bg',
    'bg-elevated',
    'surface',
    'surface-variant',
    'text',
    'text-muted',
    'inverse-text',
    'primary',
    'on-primary',
    'border',
    'border-strong',
    'success',
    'warning',
    'error',
    'info',
    'shadow',
  ];

  const results: TestResult[] = [];

  for (const token of requiredTokens) {
    const value = colors[token];
    const isDefined = value !== undefined && value !== '';
    results.push({
      passed: isDefined,
      message: `${themeName} ${mode}: ${token} ${isDefined ? 'defined (✓)' : 'MISSING (!)'}`,
      severity: isDefined ? 'info' : 'error',
    });
  }

  return results;
}

function testHardcodedColors(): TestResult[] {
  const results: TestResult[] = [];
  const componentsDir = path.join(process.cwd(), 'components');
  const appDir = path.join(process.cwd(), 'app');

  const hardcodedColorPattern = /(backgroundColor|color|borderColor|shadowColor)\s*:\s*['"`](#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|[a-z]+)['"`]/g;
  const allowedHardcodedColors = ['transparent', 'inherit', 'currentColor'];

  function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const matches = content.matchAll(hardcodedColorPattern);

        for (const match of matches) {
          const color = match[1];
          if (!allowedHardcodedColors.includes(color) && !color.startsWith('colors.')) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            results.push({
              passed: false,
              message: `Hardcoded color in ${path.relative(process.cwd(), filePath)}:${lineNumber} - ${match[0]}`,
              severity: 'warning',
            });
          }
        }
      }
    }
  }

  scanDirectory(componentsDir);
  scanDirectory(appDir);

  if (results.length === 0) {
    results.push({
      passed: true,
      message: 'No hardcoded colors found (✓)',
      severity: 'info',
    });
  }

  return results;
}

// =============================================================================
// AAA Compliance Check
// =============================================================================

interface AAAResult {
  theme: string;
  mode: string;
  primary: string;
  onPrimary: string;
  contrast: number;
  meetsAAA: boolean;
  meetsAA: boolean;
}

function checkAAACompliance(): AAAResult[] {
  const results: AAAResult[] = [];

  for (const [, theme] of Object.entries(THEMES)) {
    for (const mode of ['light', 'dark'] as const) {
      const colors = theme[mode];
      const contrast = getContrastRatio(colors.primary, colors['on-primary']);
      const meetsAAA = contrast >= 7.0;
      const meetsAA = contrast >= 4.5;

      results.push({
        theme: theme.displayName,
        mode,
        primary: colors.primary,
        onPrimary: colors['on-primary'],
        contrast,
        meetsAAA,
        meetsAA,
      });
    }
  }

  return results;
}

// =============================================================================
// Main Test Runner
// =============================================================================

function runTests() {
  console.log('\n🧪 COMPLETE DARK MODE TESTING\n');
  console.log('================================================================================\n');

  const allResults: TestResult[] = [];

  // Test all themes
  for (const [, theme] of Object.entries(THEMES)) {
    for (const mode of ['light', 'dark'] as const) {
      const colors = theme[mode];
      const contrastResults = testContrastRatios(colors, theme.displayName, mode);
      const tokenResults = testTokenCompleteness(colors, theme.displayName, mode);

      allResults.push(...contrastResults, ...tokenResults);
    }
  }

  // Test for hardcoded colors
  const hardcodedResults = testHardcodedColors();
  allResults.push(...hardcodedResults);

  // Count results
  const passed = allResults.filter((r) => r.passed && r.severity === 'info').length;
  const warnings = allResults.filter((r) => !r.passed && r.severity === 'warning').length;
  const errors = allResults.filter((r) => !r.passed && r.severity === 'error').length;

  // Print errors first
  if (errors > 0) {
    console.log('❌ ERRORS:\n');
    allResults.filter((r) => !r.passed && r.severity === 'error').forEach((r) => console.log(`   ${r.message}`));
    console.log('');
  }

  // Print warnings
  if (warnings > 0) {
    console.log('⚠️  WARNINGS:\n');
    allResults.filter((r) => !r.passed && r.severity === 'warning').forEach((r) => console.log(`   ${r.message}`));
    console.log('');
  }

  // Print summary
  console.log('📊 TEST RESULTS');
  console.log('================================================================================\n');
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📝 Total Tests: ${allResults.length}\n`);

  if (errors === 0 && warnings === 0) {
    console.log('✅ All dark mode tests PASSED!\n');
  }

  // Run AAA compliance check
  console.log('================================================================================\n');
  console.log('🎯 WCAG AAA COMPLIANCE CHECK\n');
  console.log('================================================================================\n');

  const aaaResults = checkAAACompliance();

  aaaResults.forEach((result) => {
    if (result.meetsAAA) {
      console.log(`✅ ${result.theme} ${result.mode}`);
      console.log(`   Button: ${result.primary} on ${result.onPrimary}`);
      console.log(`   Contrast: ${result.contrast.toFixed(2)}:1 - AAA ⭐\n`);
    } else if (result.meetsAA) {
      console.log(`⚠️  ${result.theme} ${result.mode}`);
      console.log(`   Button: ${result.primary} on ${result.onPrimary}`);
      console.log(`   Contrast: ${result.contrast.toFixed(2)}:1 - AA only (needs ${(7.0 - result.contrast).toFixed(2)} more)\n`);
    } else {
      console.log(`❌ ${result.theme} ${result.mode}`);
      console.log(`   Button: ${result.primary} on ${result.onPrimary}`);
      console.log(`   Contrast: ${result.contrast.toFixed(2)}:1 - FAILS AA\n`);
    }
  });

  // AAA Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 AAA COMPLIANCE SUMMARY\n');

  const aaaCount = aaaResults.filter((r) => r.meetsAAA).length;
  const aaCount = aaaResults.filter((r) => r.meetsAA && !r.meetsAAA).length;
  const failCount = aaaResults.filter((r) => !r.meetsAA).length;
  const total = aaaResults.length;

  console.log(`Total Tested: ${total} (6 themes × 2 modes)`);
  console.log(`AAA Compliant (7.0:1+): ${aaaCount}/${total} (${Math.round((aaaCount / total) * 100)}%)`);
  console.log(`AA Only (4.5-7.0:1): ${aaCount}/${total} (${Math.round((aaCount / total) * 100)}%)`);
  console.log(`Failing (<4.5:1): ${failCount}/${total} (${Math.round((failCount / total) * 100)}%)\n`);

  if (aaaCount === total) {
    console.log('🌟 ✅ ALL THEMES ACHIEVE WCAG AAA COMPLIANCE! 🌟\n');
  } else if (aaaCount + aaCount === total) {
    console.log('✅ All themes meet minimum WCAG AA standards\n');
    console.log(`💡 ${aaCount} theme(s) can be improved to AAA by darkening primary colors\n`);
  } else {
    console.log('❌ Some themes need improvement to meet WCAG standards\n');
  }

  console.log('================================================================================\n');

  // Exit with error code if there are errors
  if (errors > 0) {
    process.exit(1);
  }
}

// Run tests
runTests();
