#!/usr/bin/env ts-node
/**
 * useEffect Audit Script
 * TASK-034: Audit all useEffect hooks for missing cleanup functions
 * Usage: npx ts-node scripts/audit-useeffect.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface Issue {
  file: string;
  line: number;
  severity: 'high' | 'medium' | 'low';
  reason: string;
}

const issues: Issue[] = [];

const CLEANUP_PATTERNS = [
  { pattern: /addEventListener/i, severity: 'high' as const, reason: 'addEventListener requires removeEventListener' },
  { pattern: /\.subscribe\(/i, severity: 'high' as const, reason: 'subscription requires unsubscribe' },
  { pattern: /setInterval\(/i, severity: 'high' as const, reason: 'setInterval requires clearInterval' },
  { pattern: /setTimeout\(/i, severity: 'medium' as const, reason: 'setTimeout should use clearTimeout' },
  { pattern: /\.on\(/i, severity: 'high' as const, reason: 'event listener requires .off() or .remove()' },
  { pattern: /NetInfo\./i, severity: 'high' as const, reason: 'NetInfo subscription requires cleanup' },
];

function hasReturnCleanup(code: string): boolean {
  // Check for return function or return () =>
  return /return\s+(?:function|\(\s*\)\s*=>|\w+)/.test(code) && !/return\s+undefined/.test(code);
}

function scanFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/useEffect\s*\(/.test(line)) {
        // Extract useEffect block
        let block = '';
        let depth = 0;
        let started = false;

        for (let j = i; j < Math.min(i + 50, lines.length); j++) {
          block += lines[j] + '\n';
          for (const char of lines[j]) {
            if (char === '(' || char === '{') {
              depth++;
              started = true;
            }
            if (char === ')' || char === '}') depth--;
            if (started && depth === 0) break;
          }
          if (started && depth === 0) break;
        }

        const hasCleanup = hasReturnCleanup(block);

        // Check for patterns requiring cleanup
        for (const { pattern, severity, reason } of CLEANUP_PATTERNS) {
          if (pattern.test(block) && !hasCleanup) {
            issues.push({
              file: path.relative(process.cwd(), filePath),
              line: i + 1,
              severity,
              reason,
            });
            break;
          }
        }
      }
    }
  } catch (error) {
    // Silently skip unreadable files
  }
}

function scanDir(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
      continue;
    }

    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

// Run scan
const rootDir = process.argv[2] || process.cwd();
console.log(`\n🔍 Scanning ${rootDir} for useEffect cleanup issues...\n`);

scanDir(rootDir);

// Report results
const high = issues.filter((i) => i.severity === 'high');
const medium = issues.filter((i) => i.severity === 'medium');
const low = issues.filter((i) => i.severity === 'low');

console.log(`📊 Results: ${issues.length} issues found\n`);
console.log(`🚨 High:   ${high.length}`);
console.log(`⚠️  Medium: ${medium.length}`);
console.log(`ℹ️  Low:    ${low.length}\n`);

if (high.length > 0) {
  console.log('🚨 HIGH PRIORITY ISSUES:\n');
  high.forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.file}:${issue.line}`);
    console.log(`   ${issue.reason}\n`);
  });
}

if (medium.length > 0 && high.length < 10) {
  console.log('\n⚠️  MEDIUM PRIORITY ISSUES:\n');
  medium.slice(0, 10).forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.file}:${issue.line}`);
    console.log(`   ${issue.reason}\n`);
  });
}

console.log('\n✅ Audit complete. Fix high priority issues first.\n');

process.exit(high.length > 0 ? 1 : 0);
