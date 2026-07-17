# Task 0.4 Report: Configure ESLint + Prettier

## What was created

- **`eslint.config.js`** — ESLint flat config for React + TypeScript project with:
  - `@eslint/js` recommended rules
  - `typescript-eslint` recommended rules
  - `eslint-plugin-react-hooks` recommended rules
  - `eslint-plugin-react-refresh` (only-export-components)
  - `eslint-config-prettier` to disable formatting rules that conflict with Prettier
  - `@typescript-eslint/no-unused-vars` with `argsIgnorePattern: '^_'`

- **`.prettierrc`** — Prettier config with:
  - `semi: false`
  - `singleQuote: true`
  - `tabWidth: 2`
  - `trailingComma: "none"`
  - `printWidth: 100`
  - `plugins: ["prettier-plugin-tailwindcss"]`

## Dependencies installed

### Added
- `eslint-config-prettier` ^10.1.8
- `eslint-plugin-react-hooks` ^7.1.1
- `eslint-plugin-react-refresh` ^0.5.3
- `typescript-eslint` ^8.64.0

### Removed (not needed for flat config)
- `@typescript-eslint/eslint-plugin` ^8.64.0
- `@typescript-eslint/parser` ^8.64.0

### Already present
- `@eslint/js` ^9.0.0
- `eslint` ^9.0.0
- `prettier` ^3.4.0
- `prettier-plugin-tailwindcss` ^0.6.0

## Scripts added to package.json

```json
"lint": "eslint \"src/**/*.{ts,tsx}\""
```

## Test results (`pnpm lint`)

```
> yuxi-react@0.1.0 lint
> eslint "src/**/*.{ts,tsx}"

src/components/ui/badge.tsx
  52:17  warning  Fast refresh only works when a file only exports components...

src/components/ui/button.tsx
  58:18  warning  Fast refresh only works when a file only exports components...

src/components/ui/tabs.tsx
  82:52  warning  Fast refresh only works when a file only exports components...

✖ 3 problems (0 errors, 3 warnings)
```

3 warnings, 0 errors. Warnings are expected for shadcn/ui component files that export non-component constants alongside components.

## Files changed

- `web-react/eslint.config.js` (created)
- `web-react/.prettierrc` (created)
- `web-react/package.json` (modified — added lint script, added/removed deps)
- `web-react/.eslintrc.cjs` (created then removed — legacy format incompatible with ESLint v9 flat config)
- `web-react/pnpm-lock.yaml` (updated)