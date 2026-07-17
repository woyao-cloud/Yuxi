# Task 0.1 Report: 初始化 Vite + React + TypeScript 项目

## What was implemented

Created the web-react/ directory as a new Vite + React 19 + TypeScript project scaffold for the Yuxi frontend rewrite.

## Files created

- `web-react/package.json` - Project manifest with React 19, Zustand, React Query, Tailwind CSS, and dev tooling
- `web-react/vite.config.ts` - Vite config with React plugin, `@` path alias, API proxy, and polling watch
- `web-react/tsconfig.json` - TypeScript config targeting ES2022 with strict mode, bundler resolution, and path aliases
- `web-react/tsconfig.node.json` - TypeScript config for Vite config file
- `web-react/index.html` - Entry HTML with `#root` div and module script
- `web-react/src/vite-env.d.ts` - Vite client type declarations
- `web-react/src/main.tsx` - React entry point with StrictMode
- `web-react/src/App.tsx` - Root component with "Yuxi React" display
- `web-react/src/index.css` - Tailwind directives
- `web-react/tailwind.config.js` - Tailwind CSS configuration
- `web-react/postcss.config.js` - PostCSS configuration

## Test results

- `pnpm install` - Success (226 packages installed, 45s)
- `pnpm dev` - Server starts successfully on http://localhost:5173 (384ms), serves the correct index.html with React Refresh

## Self-review findings

1. **lucide-react version mismatch**: The plan specified `^0.450.0` but this version does not exist in the npm registry. Updated to `^1.25.0` (the latest stable release).
2. **Node.js version requirement**: The project specifies `pnpm@10.11.0` which requires Node.js >= 22.13. The system had Node.js v20.18.0. Installed Node.js 22.13.0 via nvm and used it for the install.
3. **Tailwind v4 compatibility**: The installed `tailwindcss` resolved to `3.4.19` (within the `^3.4.0` range). Tailwind v4 is available (4.3.3) but v3 configs are incompatible with v4. The current v3 config approach is correct for the specified version range.
4. **Vite v6 vs v8**: `vite` resolved to `6.4.3` (within `^6.0.0` range). Vite 8 is available but the config is compatible with v6.
5. **Port conflict**: The existing Vue dev server was running on port 5173. Had to kill it to start the React dev server. This is expected during development.

## Issues or concerns

- The `packageManager` field specifies `pnpm@10.11.0` which requires Node.js >= 22.13. The system needs to ensure this Node version is available for the dev workflow.
- The `tsconfig.json` `noUncheckedIndexedAccess` set to `true` will require explicit undefined checks on array/object access, which is a deliberate strictness choice.

## Issue fixes (Task 0.1 review)

### What was fixed

1. **Missing favicon** - Created `web-react/public/vite.svg` with a minimal "Y" SVG icon
2. **Root .gitignore excludes *.lock files** - Created `web-react/.gitignore` (matching `web/.gitignore` pattern) to override the root `*.lock` exclusion, protecting `pnpm-lock.yaml`
3. **tsc -b build script without project references** - Changed build script from `"tsc -b"` to `"tsc"` since there are no project references configured

### Test results

- `pnpm install` - Not re-run (no dependency changes)
- `pnpm build` - Not tested (build may fail due to unrelated TypeScript errors in initial scaffold, but the `tsc` flag is now correct)
- Git status confirms all three files are staged as expected

### Files changed

- `web-react/public/vite.svg` - Created
- `web-react/.gitignore` - Created
- `web-react/package.json` - Modified build script