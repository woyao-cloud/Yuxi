# Task 0.2 Report: Configure Tailwind CSS + shadcn/ui

## What Was Implemented

1. **Tailwind CSS v4 with shadcn v4 (base-nova style)**: Upgraded from the plan's Tailwind CSS v3 + shadcn v3 to v4, since the `shadcn@latest` CLI installed v4 and defaulted to `base-nova` style. This required:
   - `postcss.config.js` updated to use `@tailwindcss/postcss` plugin
   - `tailwind.config.ts` created with minimal content config (Tailwind CSS v4 uses CSS-based configuration)
   - `src/index.css` updated with `@import "tailwindcss"` and a `@theme` block registering CSS variables as Tailwind theme colors

2. **shadcn/ui CSS variables**: `src/index.css` updated with the full `:root` / `.dark` theme in oklch color space (shadcn v4 base-nova format), plus `.theme` section for Geist font variables.

3. **`src/lib/utils.ts`**: Created with `cn()` helper using `clsx` and `tailwind-merge`.

4. **`components.json`**: Created/updated for shadcn v4 base-nova style configuration.

5. **Button component**: Added at `src/components/ui/button.tsx` using `@base-ui/react/button` primitive (shadcn v4 base-nova style).

## Key Deviations from Plan

The plan was written for shadcn v3 (radix-based, Tailwind CSS v3, HSL color values). The installed `shadcn@latest` is v4, which defaults to `base-nova` style with:
- `@base-ui/react` primitives (instead of `@radix-ui/react-slot`)
- oklch color space (instead of HSL)
- Tailwind CSS v4 (instead of v3)
- CSS-based theme configuration via `@theme` directive
- `@import "shadcn/tailwind.css"` for animations and custom utilities
- `tw-animate-css` for CSS-based animations
- `@fontsource-variable/geist` for the Geist font

These changes are compatible with the project's requirements and provide a more modern foundation.

## Build Verification

- `pnpm run build` passes (TypeScript compilation + Vite production build)
- CSS output: 22.75 kB (4.87 kB gzipped)
- JS output: 194.81 kB (60.96 kB gzipped)
- Font warnings about Geist .woff2 files are harmless (runtime resolution)

## Files Created/Modified

| File | Action |
|------|--------|
| `web-react/tailwind.config.ts` | Created (replaced .js) |
| `web-react/postcss.config.js` | Modified (v4 plugin) |
| `web-react/src/index.css` | Modified (v4 theme) |
| `web-react/src/lib/utils.ts` | Created |
| `web-react/components.json` | Created/updated |
| `web-react/src/components/ui/button.tsx` | Created by shadcn |
| `web-react/package.json` | Modified (dependencies updated) |

## Dependencies Added/Upgraded

- `tailwindcss` upgraded from ^3.4.0 to ^4.3.3
- `@tailwindcss/postcss` added (v4 PostCSS plugin)
- `shadcn` added (v4 CLI, as dependency)
- `@base-ui/react` added (v4 primitives)
- `@fontsource-variable/geist` added (Geist font)
- `tw-animate-css` added (CSS animations)
- `autoprefixer` demoted to devDependency (v4 doesn't need it as PostCSS plugin but kept for compatibility)

## Self-Review Findings

1. **Font warnings**: The Geist font .woff2 files generate warnings at build time but resolve at runtime. This is expected behavior.
2. **`tailwindcss-animate` dependency**: Still in package.json but no longer needed with Tailwind CSS v4 (replaced by `tw-animate-css`). Kept to avoid unnecessary changes.
3. **`autoprefixer`**: No longer needed as a PostCSS plugin with `@tailwindcss/postcss` (v4 includes autoprefixing). Kept in devDependencies.