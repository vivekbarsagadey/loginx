# Linting and Formatting Setup

This project uses ESLint for linting and Prettier for code formatting.

## 📦 Installed Tools

- **ESLint** - JavaScript/TypeScript linter with Expo config
- **Prettier** - Code formatter
- **EditorConfig** - Maintains consistent coding styles

## 🚀 Available Scripts

### Linting

```bash
# Run ESLint to check for issues
pnpm lint

# Run ESLint and automatically fix issues
pnpm lint:fix
```

### Formatting

```bash
# Format all files with Prettier
pnpm format

# Check if files are formatted correctly (without fixing)
pnpm format:check
```

### Type Checking

```bash
# Run TypeScript type checking
pnpm type-check
```

### Validation (All checks)

```bash
# Run all checks: lint, format check, and type check
pnpm validate
```

## ⚙️ Configuration Files

### `.prettierrc.json`

Prettier configuration with:

- Print width: 200 characters
- Single quotes for JavaScript/TypeScript
- 2 space indentation
- Trailing commas (ES5)
- LF line endings

### `eslint.config.js`

ESLint configuration with:

- Expo recommended rules
- TypeScript support
- React Hooks rules
- Custom rules for unused vars, console logs, etc.
- Max line length: 200 characters

### `.editorconfig`

Editor configuration for:

- UTF-8 charset
- LF line endings
- 2 space indentation
- Trim trailing whitespace

### `.vscode/settings.json`

VS Code settings for:

- Format on save
- ESLint auto-fix on save
- Organize imports on save
- Prettier as default formatter

## 🎯 ESLint Rules

### TypeScript

- Warns on unused variables (can be prefixed with `_` to ignore)
- Warns on explicit `any` types
- Disabled explicit return types (inferred)

### React

- Enforces React Hooks rules
- Warns on missing hook dependencies
- Prop types disabled (using TypeScript)

### General

- Warns on `console.log` (allows `console.warn` and `console.error`)
- Enforces `===` instead of `==`
- Prefers `const` over `let`
- Disallows `var`

## 📝 VS Code Extensions

Recommended extensions are listed in `.vscode/extensions.json`:

- Prettier - Code formatter
- ESLint
- Expo Tools
- TypeScript
- Code Spell Checker

## 🔧 Manual Setup

If auto-install didn't work, install extensions manually:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search and install:
   - **Prettier - Code formatter** (esbenp.prettier-vscode)
   - **ESLint** (dbaeumer.vscode-eslint)
   - **Expo Tools** (expo.vscode-expo-tools)

## 💡 Usage Tips

### Format on Save

Files will automatically format when you save (Ctrl+S / Cmd+S)

### Format Document

- **Windows/Linux**: Shift+Alt+F
- **macOS**: Shift+Option+F

### Format Selection

Select code and use the format document command

### Organize Imports

Imports will automatically organize on save

### Fix ESLint Issues

Run `pnpm lint:fix` to automatically fix linting issues

## 🚨 Pre-commit Checks

Before committing code, run:

```bash
pnpm validate
```

This ensures:

- ✅ No linting errors
- ✅ All files are formatted
- ✅ TypeScript compiles without errors

## 📚 Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [EditorConfig](https://editorconfig.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)

---

**Last Updated:** October 7, 2025
