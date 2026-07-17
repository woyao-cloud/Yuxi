# React 19 前端重写实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `web/` 目录下的 Vue.js 前端用 React 19 重写，保存至 `web-react/`，实现技术栈统一和性能提升。

**Architecture:** 领域驱动架构，按业务领域（auth/agent/workspace/extensions/dashboard/model-manage）组织代码。API 层纯函数负责 HTTP 通信，TanStack Query 管理服务端状态，Zustand 管理客户端状态，React Router v7 处理路由与鉴权守卫。

**Tech Stack:** React 19, TypeScript, Vite, shadcn/ui + Tailwind CSS, Zustand, TanStack Query, React Router v7, lucide-react, pnpm

**策略：** 一次性重写，`web/` 保留作为参考，新代码在 `web-react/` 下构建。

## Global Constraints

- TypeScript 全覆盖，禁止使用 `any`
- `features/` 模块之间不互相引用
- API 层不做业务逻辑处理
- 服务端状态只通过 TanStack Query 管理，客户端状态只通过 Zustand 管理
- 使用 `lucide-react` 替代 `lucide-vue-next` 和 `@ant-design/icons-vue`
- 包管理器为 pnpm
- 代码风格遵循项目现有规范（Prettier + ESLint）
- 图表库（ECharts/D3/graphology/sigma/@antv/g6）保留，通过 React 封装使用

---

## 文件结构总览

### 脚手架文件
```
web-react/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── components.json        # shadcn/ui 配置
├── .eslintrc.cjs
├── .prettierrc
├── index.html
└── Dockerfile
```

### 源码文件

```
src/
├── main.tsx                                 # 入口
├── App.tsx                                  # 根组件
├── vite-env.d.ts
│
├── apis/
│   ├── client.ts                            # HTTP 客户端
│   ├── agent.ts
│   ├── auth.ts
│   ├── knowledge.ts
│   ├── workspace.ts
│   ├── extensions.ts
│   ├── dashboard.ts
│   ├── system.ts
│   ├── user.ts
│   └── index.ts                             # 统一导出
│
├── stores/
│   ├── auth-store.ts
│   ├── agent-store.ts
│   ├── chat-store.ts
│   ├── theme-store.ts
│   └── ui-store.ts
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-chat-stream.ts
│   ├── use-graph.ts
│   └── use-scroll.ts
│
├── lib/
│   ├── utils.ts                             # cn() 工具等
│   ├── message-processor.ts
│   ├── error-handler.ts
│   ├── file-utils.ts
│   ├── time.ts
│   ├── constants.ts
│   └── agent-config-utils.ts
│
├── components/
│   ├── ui/                                  # shadcn/ui 组件（自动生成）
│   └── shared/
│       ├── page-header.tsx
│       ├── fallback-avatar.tsx
│       ├── file-type-icon.tsx
│       ├── markdown-preview.tsx
│       ├── loading.tsx
│       ├── resource-empty-state.tsx
│       ├── info-card.tsx
│       ├── page-shoulder.tsx
│       ├── status-bar.tsx
│       ├── graph-canvas.tsx
│       └── graph-detail-panel.tsx
│
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── login-page.tsx
│   │   │   ├── home-page.tsx
│   │   │   ├── oidc-callback-page.tsx
│   │   │   ├── cli-auth-authorize-page.tsx
│   │   │   └── not-found-page.tsx
│   │   ├── components/
│   │   │   └── login-form.tsx
│   │   └── hooks/
│   │       └── use-login.ts
│   │
│   ├── agent/
│   │   ├── pages/
│   │   │   └── agent-page.tsx
│   │   ├── components/
│   │   │   ├── agent-chat.tsx
│   │   │   ├── agent-message.tsx
│   │   │   ├── agent-input-area.tsx
│   │   │   ├── agent-selector.tsx
│   │   │   ├── conversation-nav-section.tsx
│   │   │   ├── conversation-search-modal.tsx
│   │   │   ├── thread-message-list.tsx
│   │   │   ├── agent-file-preview.tsx
│   │   │   ├── ai-textarea.tsx
│   │   │   ├── attachment-options.tsx
│   │   │   ├── attachment-tmp-upload-modal.tsx
│   │   │   ├── file-upload-modal.tsx
│   │   │   ├── image-preview.tsx
│   │   │   ├── human-approval-modal.tsx
│   │   │   ├── subagent-thread-modal.tsx
│   │   │   ├── refs-component.tsx
│   │   │   ├── web-search-source-section.tsx
│   │   │   ├── agent-artifacts-card.tsx
│   │   │   ├── agent-runtime-config-form.tsx
│   │   │   ├── user-info-component.tsx
│   │   │   └── task-center-drawer.tsx
│   │   ├── tool-calls/
│   │   │   ├── tool-registry.ts
│   │   │   ├── base-tool-call.tsx
│   │   │   ├── tool-call-renderer.tsx
│   │   │   └── tools/
│   │   │       ├── ask-user-question-tool.tsx
│   │   │       ├── calculator-tool.tsx
│   │   │       ├── chart-tool.tsx
│   │   │       ├── edit-file-tool.tsx
│   │   │       ├── execute-tool.tsx
│   │   │       ├── find-kb-document-tool.tsx
│   │   │       ├── get-mindmap-tool.tsx
│   │   │       ├── glob-tool.tsx
│   │   │       ├── grep-tool.tsx
│   │   │       ├── image-tool.tsx
│   │   │       ├── kb-document-preview.tsx
│   │   │       ├── list-directory-tool.tsx
│   │   │       ├── list-kbs-tool.tsx
│   │   │       ├── mysql-describe-table-tool.tsx
│   │   │       ├── mysql-list-tables-tool.tsx
│   │   │       ├── mysql-query-tool.tsx
│   │   │       ├── ocr-parse-file-tool.tsx
│   │   │       ├── open-kb-document-tool.tsx
│   │   │       ├── query-kb-tool.tsx
│   │   │       ├── read-file-tool.tsx
│   │   │       ├── search-file-content-tool.tsx
│   │   │       ├── search-file-tool.tsx
│   │   │       ├── subagent-lifecycle-tool.tsx
│   │   │       ├── task-tool.tsx
│   │   │       ├── todo-list-tool.tsx
│   │   │       ├── web-search-tool.tsx
│   │   │       └── write-file-tool.tsx
│   │   └── hooks/
│   │       ├── use-chat-stream.ts
│   │       └── use-agent-config.ts
│   │
│   ├── workspace/
│   │   ├── pages/
│   │   │   └── workspace-page.tsx
│   │   └── components/
│   │       ├── workspace-sidebar.tsx
│   │       ├── workspace-file-list.tsx
│   │       └── workspace-preview-pane.tsx
│   │
│   ├── extensions/
│   │   ├── pages/
│   │   │   └── extensions-page.tsx
│   │   ├── components/
│   │   │   ├── extension-card-grid.tsx
│   │   │   ├── extension-detail-layout.tsx
│   │   │   ├── extension-toolbar.tsx
│   │   │   ├── mcp-card-list.tsx
│   │   │   ├── mcp-detail-view.tsx
│   │   │   ├── mcp-form-modal.tsx
│   │   │   ├── mcp-env-editor.tsx
│   │   │   ├── skill-card-list.tsx
│   │   │   ├── skill-detail-view.tsx
│   │   │   └── tools-card-list.tsx
│   │   └── knowledge-base/
│   │       ├── knowledge-base-detail-page.tsx
│   │       ├── knowledge-source-section.tsx
│   │       ├── knowledge-graph-section.tsx
│   │       ├── query-section.tsx
│   │       ├── file-table.tsx
│   │       ├── file-tree.tsx
│   │       ├── file-detail-modal.tsx
│   │       ├── chunk-params-config.tsx
│   │       ├── search-config-modal.tsx
│   │       ├── search-config-panel.tsx
│   │       ├── embedding-model-selector.tsx
│   │       ├── rerank-model-selector.tsx
│   │       ├── evaluation-benchmarks.tsx
│   │       ├── rag-evaluation-tab.tsx
│   │       ├── kb-chunk-detail-modal.tsx
│   │       ├── kb-result-grouped-list.tsx
│   │       ├── web-search-result-list.tsx
│   │       └── mind-map-section.tsx
│   │
│   ├── dashboard/
│   │   ├── pages/
│   │   │   └── dashboard-page.tsx
│   │   └── components/
│   │       ├── stats-overview.tsx
│   │       ├── agent-stats.tsx
│   │       ├── call-stats.tsx
│   │       ├── knowledge-stats.tsx
│   │       ├── tool-stats.tsx
│   │       ├── user-stats.tsx
│   │       └── feedback-modal.tsx
│   │
│   └── model-manage/
│       ├── pages/
│       │   └── model-manage-page.tsx
│       └── components/
│           ├── agent-manage-panel.tsx
│           ├── agent-edit-modal.tsx
│           └── model-provider-manage-panel.tsx
│
├── components/settings/                     # 设置相关（跨领域，归入 shared）
│   ├── settings-modal.tsx
│   ├── account-settings.tsx
│   ├── basic-settings.tsx
│   ├── user-config-settings.tsx
│   ├── api-key-management.tsx
│   ├── agent-env-settings.tsx
│   ├── department-management.tsx
│   ├── user-management.tsx
│   └── share-config-form.tsx
│
├── router/
│   ├── index.tsx                             # 路由定义
│   ├── routes.ts                             # 路由表
│   └── auth-guard.tsx                        # 认证守卫
│
└── layouts/
    ├── app-layout.tsx                        # 主布局（侧边栏+内容区）
    └── blank-layout.tsx                      # 空白布局
```

---

## 实施阶段

### 阶段 0：项目脚手架搭建
### 阶段 1：基础框架
### 阶段 2：核心功能模块
### 阶段 3：二级功能模块
### 阶段 4：集成与部署

---

## 阶段 0：项目脚手架搭建

### Task 0.1：初始化 Vite + React + TypeScript 项目

**Files:**
- Create: `web-react/package.json`
- Create: `web-react/tsconfig.json`
- Create: `web-react/tsconfig.node.json`
- Create: `web-react/vite.config.ts`
- Create: `web-react/index.html`
- Create: `web-react/src/vite-env.d.ts`
- Create: `web-react/src/main.tsx`
- Create: `web-react/src/App.tsx`

**Interfaces:**
- Consumes: 无
- Produces: 可运行的 Vite dev server，显示空白 React 页面

- [ ] **Step 1: 创建 `web-react/` 目录和 `package.json`**

```json
{
  "name": "yuxi-web-react",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix --cache",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "lucide-react": "^0.450.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "tailwindcss-animate": "^1.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "@eslint/js": "^9.0.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  },
  "packageManager": "pnpm@10.11.0"
}
```

- [ ] **Step 2: 创建 `vite.config.ts`**

```ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '^/api': {
          target: env.VITE_API_URL || 'http://api:5050',
          changeOrigin: true
        }
      },
      watch: {
        usePolling: true,
        ignored: ['**/node_modules/**', '**/dist/**']
      },
      host: '0.0.0.0'
    }
  }
})
```

- [ ] **Step 3: 创建 `tsconfig.json` 和 `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 4: 创建 `index.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Yuxi</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: 创建 `src/main.tsx` 和 `src/App.tsx`**

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

```tsx
// src/App.tsx
export default function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Yuxi React</h1>
    </div>
  )
}
```

- [ ] **Step 6: 安装依赖并验证**

```bash
cd web-react
pnpm install
pnpm dev
```

验证：浏览器打开 `http://localhost:5173`，显示 "Yuxi React" 标题。

- [ ] **Step 7: 提交**

```bash
git add web-react/
git commit -m "feat(web-react): scaffold Vite + React + TypeScript project"
```

---

### Task 0.2：配置 Tailwind CSS + shadcn/ui

**Files:**
- Create: `web-react/tailwind.config.ts`
- Create: `web-react/postcss.config.js`
- Create: `web-react/src/index.css`
- Create: `web-react/components.json`

**Interfaces:**
- Consumes: Task 0.1 的 package.json
- Produces: 可在组件中使用的 Tailwind 类名

- [ ] **Step 1: 创建 `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [animate]
} satisfies Config
```

- [ ] **Step 2: 创建 `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

- [ ] **Step 3: 创建 `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 4: 创建 `src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 5: 创建 `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

- [ ] **Step 6: 安装 shadcn/ui 核心组件并验证**

```bash
cd web-react
pnpm dlx shadcn@latest init -d --force
pnpm dlx shadcn@latest add button -y
```

验证：`src/components/ui/button.tsx` 存在且可正常导入。

- [ ] **Step 7: 提交**

```bash
git add web-react/
git commit -m "feat(web-react): configure Tailwind CSS and shadcn/ui"
```

---

### Task 0.3：安装所有预设 shadcn/ui 组件

**Files:**
- Create: `web-react/src/components/ui/` 下所有选定组件

**Interfaces:**
- Consumes: Task 0.2 的 shadcn 配置
- Produces: 可供业务组件使用的 UI 基座组件

- [ ] **Step 1: 批量安装 shadcn/ui 组件**

```bash
cd web-react
pnpm dlx shadcn@latest add dialog sheet dropdown-menu tooltip badge avatar card tabs select switch popover scroll-area separator skeleton input textarea -y
```

- [ ] **Step 2: 验证所有组件可正常导入**

```tsx
// 快速验证：确保所有组件入口文件存在
ls src/components/ui/ | grep -E '\.tsx$'
```

期待输出包含：`button.tsx`, `dialog.tsx`, `sheet.tsx`, `dropdown-menu.tsx`, `tooltip.tsx`, `badge.tsx`, `avatar.tsx`, `card.tsx`, `tabs.tsx`, `select.tsx`, `switch.tsx`, `popover.tsx`, `scroll-area.tsx`, `separator.tsx`, `skeleton.tsx`, `input.tsx`, `textarea.tsx`

- [ ] **Step 3: 提交**

```bash
git add web-react/
git commit -m "feat(web-react): add all shadcn/ui components"
```

---

### Task 0.4：配置 ESLint + Prettier

**Files:**
- Create: `web-react/.eslintrc.cjs`
- Create: `web-react/.prettierrc`

- [ ] **Step 1: 创建 `.eslintrc.cjs`**

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-explicit-any': 'error'
  }
}
```

- [ ] **Step 2: 创建 `.prettierrc`**

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: 安装依赖并验证**

```bash
cd web-react
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-config-prettier prettier prettier-plugin-tailwindcss
pnpm lint
```

期待输出：无错误或仅警告。

- [ ] **Step 4: 提交**

```bash
git add web-react/
git commit -m "chore(web-react): configure ESLint and Prettier"
```

---

## 阶段 1：基础框架

### Task 1.1：API 客户端

**Files:**
- Create: `web-react/src/apis/client.ts`
- Create: `web-react/src/apis/index.ts`

**Interfaces:**
- Consumes: 无
- Produces: `apiClient` 对象，提供 `get`, `post`, `put`, `delete` 方法，自动注入认证头和处理错误

- [ ] **Step 1: 创建 `src/apis/client.ts`**

```ts
import type { AuthStore } from '@/stores/auth-store'

let authStore: AuthStore | null = null

export function setAuthStore(store: AuthStore) {
  authStore = store
}

interface ApiErrorResponse {
  detail?: string | { message?: string; error?: string }
  message?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiErrorResponse
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {},
  requiresAuth = true,
  responseType: 'json' | 'text' | 'blob' = 'json'
): Promise<T> {
  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>)
  }

  if (requiresAuth && authStore?.isLoggedIn) {
    headers.Authorization = `Bearer ${authStore.token}`
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    let errorMessage = `请求失败: ${response.status}`
    let errorData: ApiErrorResponse | undefined

    try {
      errorData = await response.json()
      const detail = errorData.detail
      if (detail && typeof detail === 'object') {
        errorMessage = detail.message || detail.error || errorMessage
      } else {
        errorMessage = detail || errorData.message || errorMessage
      }
    } catch {}

    const error = new ApiError(errorMessage, response.status, errorData)

    if (response.status === 401 && authStore?.isLoggedIn) {
      authStore.logout()
      setTimeout(() => { window.location.href = '/login' }, 1500)
    }

    throw error
  }

  if (responseType === 'blob') return response as unknown as T
  if (responseType === 'text') return response.text() as Promise<T>

  const contentType = response.headers.get('Content-Type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }
  return response.text() as Promise<T>
}

export const apiClient = {
  get<T>(url: string, options?: RequestInit, requiresAuth?: boolean, responseType?: 'json' | 'text' | 'blob'): Promise<T> {
    return request<T>(url, { method: 'GET', ...options }, requiresAuth, responseType)
  },
  post<T>(url: string, data?: unknown, options?: RequestInit, requiresAuth?: boolean, responseType?: 'json' | 'text' | 'blob'): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return request<T>(url, { method: 'POST', body, ...options }, requiresAuth, responseType)
  },
  put<T>(url: string, data?: unknown, options?: RequestInit, requiresAuth?: boolean, responseType?: 'json' | 'text' | 'blob'): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return request<T>(url, { method: 'PUT', body, ...options }, requiresAuth, responseType)
  },
  delete<T>(url: string, options?: RequestInit, requiresAuth?: boolean): Promise<T> {
    return request<T>(url, { method: 'DELETE', ...options }, requiresAuth)
  }
}
```

- [ ] **Step 2: 创建 `src/apis/index.ts`**

```ts
export { apiClient, setAuthStore, ApiError } from './client'
```

- [ ] **Step 3: 提交**

```bash
git add web-react/src/apis/
git commit -m "feat(web-react): add API client with auth and error handling"
```

---

### Task 1.2：Zustand Stores

**Files:**
- Create: `web-react/src/stores/auth-store.ts`
- Create: `web-react/src/stores/agent-store.ts`
- Create: `web-react/src/stores/chat-store.ts`
- Create: `web-react/src/stores/theme-store.ts`
- Create: `web-react/src/stores/ui-store.ts`

**Interfaces:**
- Consumes: Task 1.1 的 `apiClient`
- Produces: 全局状态 store，供所有组件使用

- [ ] **Step 1: 创建 `src/stores/auth-store.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  uid: string
  phone_number: string
  avatar: string
  role: string
  department_id: string | null
  department_name: string
}

interface LoginCredentials {
  loginId: string
  password: string
}

interface AuthState {
  token: string
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  getCurrentUser: () => Promise<void>
  initialize: (admin: { username: string; password: string }) => Promise<void>
  checkFirstRun: () => Promise<boolean>
  getAuthHeaders: () => Record<string, string>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: '',
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      isSuperAdmin: false,

      login: async (credentials) => {
        const formData = new FormData()
        formData.append('username', credentials.loginId)
        formData.append('password', credentials.password)

        const response = await fetch('/api/auth/token', { method: 'POST', body: formData })
        if (!response.ok) {
          if (response.status === 423) {
            const error = new Error('账号已被锁定') as Error & { status: number; headers: Headers }
            error.status = 423
            error.headers = response.headers
            throw error
          }
          const err = await response.json()
          throw new Error(err.detail || '登录失败')
        }

        const data = await response.json()
        const user = {
          id: data.user_id,
          username: data.username,
          uid: data.uid,
          phone_number: data.phone_number || '',
          avatar: data.avatar || '',
          role: data.role,
          department_id: data.department_id || null,
          department_name: data.department_name || ''
        }

        set({
          token: data.access_token,
          user,
          isLoggedIn: true,
          isAdmin: user.role === 'admin' || user.role === 'superadmin',
          isSuperAdmin: user.role === 'superadmin'
        })
      },

      logout: () => {
        set({
          token: '',
          user: null,
          isLoggedIn: false,
          isAdmin: false,
          isSuperAdmin: false
        })
      },

      getCurrentUser: async () => {
        const { token } = get()
        if (!token) return
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('获取用户信息失败')
        const userData = await response.json()
        const user = {
          id: userData.id,
          username: userData.username,
          uid: userData.uid,
          phone_number: userData.phone_number || '',
          avatar: userData.avatar || '',
          role: userData.role,
          department_id: userData.department_id || null,
          department_name: userData.department_name || ''
        }
        set({
          user,
          isLoggedIn: true,
          isAdmin: user.role === 'admin' || user.role === 'superadmin',
          isSuperAdmin: user.role === 'superadmin'
        })
      },

      initialize: async (admin) => {
        const response = await fetch('/api/auth/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(admin)
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.detail || '初始化管理员失败')
        }
        const data = await response.json()
        const user = {
          id: data.user_id,
          username: data.username,
          uid: data.uid,
          phone_number: data.phone_number || '',
          avatar: data.avatar || '',
          role: data.role,
          department_id: data.department_id || null,
          department_name: data.department_name || ''
        }
        set({
          token: data.access_token,
          user,
          isLoggedIn: true,
          isAdmin: true,
          isSuperAdmin: user.role === 'superadmin'
        })
      },

      checkFirstRun: async () => {
        try {
          const response = await fetch('/api/auth/check-first-run')
          const data = await response.json()
          return data.first_run
        } catch {
          return false
        }
      },

      getAuthHeaders: () => {
        const { token } = get()
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token })
    }
  )
)
```

- [ ] **Step 2: 创建 `src/stores/agent-store.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Agent {
  id: string
  agent_id?: string
  slug?: string
  name: string
  is_builtin?: boolean
  is_subagent?: boolean
  configurable_items?: Record<string, unknown>
  config_json?: { context?: Record<string, unknown> }
}

interface AgentState {
  selectedAgentId: string | null
  agents: Agent[]
  agentConfig: Record<string, unknown>
  originalAgentConfig: Record<string, unknown>
  isInitialized: boolean
  isInitializing: boolean
  setSelectedAgentId: (id: string | null) => void
  setAgents: (agents: Agent[]) => void
  setAgentConfig: (config: Record<string, unknown>) => void
  setInitialized: (val: boolean) => void
  setInitializing: (val: boolean) => void
  reset: () => void
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      selectedAgentId: null,
      agents: [],
      agentConfig: {},
      originalAgentConfig: {},
      isInitialized: false,
      isInitializing: false,

      setSelectedAgentId: (id) => set({ selectedAgentId: id }),
      setAgents: (agents) => set({ agents }),
      setAgentConfig: (config) => set({ agentConfig: config, originalAgentConfig: { ...config } }),
      setInitialized: (val) => set({ isInitialized: val }),
      setInitializing: (val) => set({ isInitializing: val }),
      reset: () => set({
        selectedAgentId: null,
        agents: [],
        agentConfig: {},
        originalAgentConfig: {},
        isInitialized: false,
        isInitializing: false
      })
    }),
    {
      name: 'agent-store',
      partialize: (state) => ({ selectedAgentId: state.selectedAgentId })
    }
  )
)
```

- [ ] **Step 3: 创建 `src/stores/chat-store.ts`**

```ts
import { create } from 'zustand'

interface ChatThread {
  id: string
  title: string
  is_pinned?: boolean
  updated_at?: string
  created_at?: string
}

interface ChatState {
  sidebarCollapsed: boolean
  currentThreadId: string | null
  threads: ChatThread[]
  conversationSearchOpen: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setCurrentThreadId: (id: string | null) => void
  setThreads: (threads: ChatThread[]) => void
  upsertThread: (thread: ChatThread) => void
  deleteThread: (id: string) => void
  setConversationSearchOpen: (open: boolean) => void
}

export const useChatStore = create<ChatState>()((set) => ({
  sidebarCollapsed: false,
  currentThreadId: null,
  threads: [],
  conversationSearchOpen: false,

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCurrentThreadId: (id) => set({ currentThreadId: id }),
  setThreads: (threads) => set({ threads }),
  upsertThread: (thread) =>
    set((s) => {
      const exists = s.threads.find((t) => t.id === thread.id)
      if (exists) {
        return { threads: s.threads.map((t) => (t.id === thread.id ? thread : t)) }
      }
      return { threads: [thread, ...s.threads] }
    }),
  deleteThread: (id) =>
    set((s) => ({ threads: s.threads.filter((t) => t.id !== id) })),
  setConversationSearchOpen: (open) => set({ conversationSearchOpen: open })
}))
```

- [ ] **Step 4: 创建 `src/stores/theme-store.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: () =>
        set((s) => {
          const next = s.mode === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { mode: next }
        }),
      setTheme: (mode) => {
        document.documentElement.classList.toggle('dark', mode === 'dark')
        set({ mode })
      }
    }),
    { name: 'theme-store' }
  )
)
```

- [ ] **Step 5: 创建 `src/stores/ui-store.ts`**

```ts
import { create } from 'zustand'

interface UIState {
  settingsModalOpen: boolean
  settingsInitialTab: string
  showDebugModal: boolean
  openSettingsModal: (tab?: string) => void
  closeSettingsModal: () => void
  setShowDebugModal: (show: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  settingsModalOpen: false,
  settingsInitialTab: '',
  showDebugModal: false,
  openSettingsModal: (tab = '') => set({ settingsModalOpen: true, settingsInitialTab: tab }),
  closeSettingsModal: () => set({ settingsModalOpen: false, settingsInitialTab: '' }),
  setShowDebugModal: (show) => set({ showDebugModal: show })
}))
```

- [ ] **Step 6: 提交**

```bash
git add web-react/src/stores/
git commit -m "feat(web-react): add Zustand stores (auth, agent, chat, theme, ui)"
```

---

### Task 1.3：路由定义与认证守卫

**Files:**
- Create: `web-react/src/router/routes.ts`
- Create: `web-react/src/router/auth-guard.tsx`
- Create: `web-react/src/router/index.tsx`

**Interfaces:**
- Consumes: Task 1.2 的 `useAuthStore`
- Produces: 完整的路由配置，含认证守卫和懒加载

- [ ] **Step 1: 创建 `src/router/routes.ts`**

```ts
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import AppLayout from '@/layouts/app-layout'
import BlankLayout from '@/layouts/blank-layout'
import AuthGuard from './auth-guard'

const HomePage = lazy(() => import('@/features/auth/pages/home-page'))
const LoginPage = lazy(() => import('@/features/auth/pages/login-page'))
const OIDCCallbackPage = lazy(() => import('@/features/auth/pages/oidc-callback-page'))
const CLIAuthAuthorizePage = lazy(() => import('@/features/auth/pages/cli-auth-authorize-page'))
const AgentPage = lazy(() => import('@/features/agent/pages/agent-page'))
const WorkspacePage = lazy(() => import('@/features/workspace/pages/workspace-page'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/dashboard-page'))
const ModelManagePage = lazy(() => import('@/features/model-manage/pages/model-manage-page'))
const ExtensionsPage = lazy(() => import('@/features/extensions/pages/extensions-page'))
const KnowledgeBaseDetailPage = lazy(() => import('@/features/extensions/knowledge-base/knowledge-base-detail-page'))
const McpDetailView = lazy(() => import('@/features/extensions/components/mcp-detail-view'))
const SkillDetailView = lazy(() => import('@/features/extensions/components/skill-detail-view'))
const NotFoundPage = lazy(() => import('@/features/auth/pages/not-found-page'))

export const routes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/agent', element: <AgentPage /> },
          { path: '/agent/:threadId', element: <AgentPage /> },
          { path: '/workspace', element: <WorkspacePage /> },
          { path: '/model-manage', element: <ModelManagePage /> },
          {
            path: '/extensions',
            element: <ExtensionsPage />,
            children: [
              { path: 'knowledge-base/:kbId', element: <KnowledgeBaseDetailPage /> },
              { path: 'mcp/:slug', element: <McpDetailView /> },
              { path: 'skill/:slug', element: <SkillDetailView /> }
            ]
          },
          {
            path: '/dashboard',
            element: <DashboardPage />
          },
          { path: '/auth/cli/authorize', element: <CLIAuthAuthorizePage /> }
        ]
      }
    ]
  },
  {
    element: <BlankLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/auth/oidc/callback', element: <OIDCCallbackPage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]
```

- [ ] **Step 2: 创建 `src/router/auth-guard.tsx`**

```tsx
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export default function AuthGuard() {
  const { isLoggedIn, token, getCurrentUser, user } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (token && !user) {
      getCurrentUser().catch(() => {
        useAuthStore.getState().logout()
      })
    }
  }, [token, user, getCurrentUser])

  if (!isLoggedIn) {
    sessionStorage.setItem('redirect', location.pathname)
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
```

- [ ] **Step 3: 创建 `src/router/index.tsx`**

```tsx
import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import Loading from '@/components/shared/loading'

const router = createBrowserRouter(routes)

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
```

- [ ] **Step 4: 提交**

```bash
git add web-react/src/router/
git commit -m "feat(web-react): add router with auth guards and lazy loading"
```

---

### Task 1.4：布局组件

**Files:**
- Create: `web-react/src/layouts/app-layout.tsx`
- Create: `web-react/src/layouts/blank-layout.tsx`
- Create: `web-react/src/components/shared/loading.tsx`

**Interfaces:**
- Consumes: Task 1.2 的 `useChatStore`, `useAuthStore`, `useUIStore`
- Produces: 应用的布局外壳

- [ ] **Step 1: 创建 `src/components/shared/loading.tsx`**

```tsx
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  fullScreen?: boolean
  text?: string
}

export default function Loading({ fullScreen = true, text = '加载中...' }: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'h-screen w-screen' : 'h-full w-full'}`}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 `src/layouts/blank-layout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'

export default function BlankLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  )
}
```

- [ ] **Step 3: 创建 `src/layouts/app-layout.tsx`（骨架，后续阶段填充细节）**

```tsx
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <aside className="flex h-full w-[230px] flex-col border-r bg-muted/30">
        {/* 侧边栏内容将在 Task 2.2 中实现 */}
        <div className="flex h-full items-center justify-center text-muted-foreground">
          侧边栏
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: 更新 `src/App.tsx` 集成路由和主题**

```tsx
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRouter from '@/router'
import { useThemeStore } from '@/stores/theme-store'
import { setAuthStore } from '@/apis/client'
import { useAuthStore } from '@/stores/auth-store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1
    }
  }
})

export default function App() {
  const themeMode = useThemeStore((s) => s.mode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
  }, [themeMode])

  useEffect(() => {
    setAuthStore(useAuthStore)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 5: 提交**

```bash
git add web-react/src/layouts/ web-react/src/components/shared/ web-react/src/App.tsx
git commit -m "feat(web-react): add layouts, loading component, and App.tsx integration"
```

---

### Task 1.5：共享业务组件

**Files:**
- Create: `web-react/src/components/shared/page-header.tsx`
- Create: `web-react/src/components/shared/fallback-avatar.tsx`
- Create: `web-react/src/components/shared/file-type-icon.tsx`
- Create: `web-react/src/components/shared/markdown-preview.tsx`
- Create: `web-react/src/components/shared/resource-empty-state.tsx`
- Create: `web-react/src/components/shared/info-card.tsx`
- Create: `web-react/src/components/shared/status-bar.tsx`

**Interfaces:**
- Consumes: shadcn/ui 组件（ui/avatar, ui/card, ui/badge）
- Produces: 跨领域复用的展示型组件

- [ ] **Step 1: 创建 `fallback-avatar.tsx`**

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface FallbackAvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-10 w-10' }

export default function FallbackAvatar({ src, name, size = 'md', className }: FallbackAvatarProps) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <Avatar className={`${sizeMap[size]} ${className ?? ''}`}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
```

- [ ] **Step 2: 创建 `resource-empty-state.tsx`**

```tsx
import { Inbox } from 'lucide-react'

interface ResourceEmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export default function ResourceEmptyState({
  title = '暂无数据',
  description,
  icon,
  action
}: ResourceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="text-muted-foreground">
        {icon ?? <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  )
}
```

- [ ] **Step 3: 创建 `page-header.tsx`**

```tsx
interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
```

- [ ] **Step 4: 创建 `file-type-icon.tsx`（根据文件扩展名返回对应图标）**

```tsx
import {
  File, FileText, FileImage, FileArchive, FileAudio, FileVideo,
  FileCode, FileSpreadsheet, FilePdf, FileJson, type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  pdf: FilePdf,
  doc: FileText, docx: FileText,
  xls: FileSpreadsheet, xlsx: FileSpreadsheet,
  ppt: FileText, pptx: FileText,
  zip: FileArchive, rar: FileArchive, tar: FileArchive, gz: FileArchive,
  mp3: FileAudio, wav: FileAudio, flac: FileAudio,
  mp4: FileVideo, avi: FileVideo, mov: FileVideo,
  js: FileCode, ts: FileCode, py: FileCode, java: FileCode, go: FileCode,
  rs: FileCode, c: FileCode, cpp: FileCode, h: FileCode,
  json: FileJson, xml: FileJson, yaml: FileJson, yml: FileJson,
  md: FileText,
  png: FileImage, jpg: FileImage, jpeg: FileImage, gif: FileImage, svg: FileImage,
  webp: FileImage
}

interface FileTypeIconProps {
  fileName: string
  className?: string
}

export default function FileTypeIcon({ fileName, className }: FileTypeIconProps) {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  const Icon = iconMap[ext] ?? File
  return <Icon className={`h-4 w-4 ${className ?? ''}`} />
}
```

- [ ] **Step 5: 创建 `markdown-preview.tsx`（骨架，后续集成 markdown-it）**

```tsx
interface MarkdownPreviewProps {
  content: string
  className?: string
}

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  // 后续集成 markdown-it + katex + highlight.js
  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
```

- [ ] **Step 6: 创建 `info-card.tsx` 和 `status-bar.tsx`**

```tsx
// info-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InfoCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
```

- [ ] **Step 7: 提交**

```bash
git add web-react/src/components/shared/
git commit -m "feat(web-react): add shared business components"
```

---

### Task 1.6：API 模块

**Files:**
- Create: `web-react/src/apis/auth.ts`
- Create: `web-react/src/apis/agent.ts`
- Create: `web-react/src/apis/knowledge.ts`
- Create: `web-react/src/apis/workspace.ts`
- Create: `web-react/src/apis/extensions.ts`
- Create: `web-react/src/apis/dashboard.ts`
- Create: `web-react/src/apis/system.ts`
- Create: `web-react/src/apis/user.ts`

**Interfaces:**
- Consumes: Task 1.1 的 `apiClient`
- Produces: 封装所有后端 API 调用的函数

- [ ] **Step 1: 创建 `src/apis/auth.ts`**

```ts
import { apiClient } from './client'

export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    apiClient.post<{ access_token: string; user_id: string; username: string; role: string }>(
      '/api/auth/token',
      new URLSearchParams(credentials).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      false
    ),
  getMe: () => apiClient.get<Record<string, unknown>>('/api/auth/me'),
  getUsers: (params?: { skip?: number; limit?: number }) =>
    apiClient.get<unknown[]>('/api/auth/users', {
      params: new URLSearchParams(params as Record<string, string>)
    }),
  createUser: (data: Record<string, unknown>) =>
    apiClient.post('/api/auth/users', data),
  updateUser: (userId: string, data: Record<string, unknown>) =>
    apiClient.put(`/api/auth/users/${userId}`, data),
  deleteUser: (userId: string) =>
    apiClient.delete(`/api/auth/users/${userId}`),
  updateProfile: (data: Record<string, unknown>) =>
    apiClient.put('/api/auth/profile', data),
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/auth/upload-avatar', formData)
  },
  checkFirstRun: () =>
    apiClient.get<{ first_run: boolean }>('/api/auth/check-first-run', {}, false),
  initialize: (admin: { username: string; password: string }) =>
    apiClient.post('/api/auth/initialize', admin, {}, false),
  validateUsername: (username: string) =>
    apiClient.post('/api/auth/validate-username', { username })
}
```

- [ ] **Step 2: 创建 `src/apis/agent.ts`**

```ts
import { apiClient } from './client'

export const agentApi = {
  getAgents: (params?: { includeSubagents?: boolean }) =>
    apiClient.get<{ agents: unknown[] }>('/api/agents', { params }),
  getAgentDetail: (agentId: string) =>
    apiClient.get<{ agent: unknown }>(`/api/agents/${agentId}`),
  createAgent: (payload: Record<string, unknown>) =>
    apiClient.post<{ agent: unknown }>('/api/agents', payload),
  updateAgent: (agentId: string, payload: Record<string, unknown>) =>
    apiClient.put<{ agent: unknown }>(`/api/agents/${agentId}`, payload),
  deleteAgent: (agentId: string) =>
    apiClient.delete(`/api/agents/${agentId}`)
}
```

- [ ] **Step 3: 创建 `src/apis/knowledge.ts`**

```ts
import { apiClient } from './client'

export const knowledgeApi = {
  getDatabases: () => apiClient.get<{ databases: unknown[] }>('/api/databases'),
  getAccessibleDatabases: () =>
    apiClient.get<{ databases: unknown[] }>('/api/databases/accessible'),
  getDatabaseDetail: (dbId: string) =>
    apiClient.get<{ database: unknown }>(`/api/databases/${dbId}`),
  getDocuments: (dbId: string, params?: Record<string, unknown>) =>
    apiClient.get(`/api/databases/${dbId}/documents`, { params }),
  getDocumentDetail: (dbId: string, docId: string) =>
    apiClient.get(`/api/databases/${dbId}/documents/${docId}`),
  query: (dbId: string, query: Record<string, unknown>) =>
    apiClient.post(`/api/databases/${dbId}/query`, query),
  getGraph: (dbId: string) =>
    apiClient.get(`/api/databases/${dbId}/graph`)
}
```

- [ ] **Step 4: 创建 `src/apis/workspace.ts`**

```ts
import { apiClient } from './client'

export const workspaceApi = {
  listFiles: (path?: string) =>
    apiClient.get<{ files: unknown[] }>('/api/workspace/files', { params: { path } }),
  getFileContent: (path: string) =>
    apiClient.get<string>('/api/workspace/files/content', { params: { path } }, true, 'text'),
  getFilePreview: (path: string) =>
    apiClient.get('/api/workspace/files/preview', { params: { path } }, true, 'blob'),
  uploadFile: (path: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)
    return apiClient.post('/api/workspace/files/upload', formData)
  },
  deleteFile: (path: string) =>
    apiClient.delete('/api/workspace/files', { params: { path } }),
  createDirectory: (path: string) =>
    apiClient.post('/api/workspace/files/directory', { path })
}
```

- [ ] **Step 5: 创建 `src/apis/extensions.ts`**

```ts
import { apiClient } from './client'

export const extensionsApi = {
  // MCP
  getMcpServers: () => apiClient.get<{ data: unknown[] }>('/api/mcp/servers'),
  getMcpServerDetail: (slug: string) => apiClient.get(`/api/mcp/servers/${slug}`),
  createMcpServer: (data: Record<string, unknown>) =>
    apiClient.post('/api/mcp/servers', data),
  updateMcpServer: (slug: string, data: Record<string, unknown>) =>
    apiClient.put(`/api/mcp/servers/${slug}`, data),
  deleteMcpServer: (slug: string) =>
    apiClient.delete(`/api/mcp/servers/${slug}`),

  // Skill
  listSkills: () => apiClient.get<{ data: unknown[] }>('/api/skills'),
  listAccessibleSkills: () => apiClient.get<{ data: unknown[] }>('/api/skills/accessible'),
  getSkillDetail: (slug: string) => apiClient.get(`/api/skills/${slug}`),

  // Tools
  listTools: () => apiClient.get<{ tools: unknown[] }>('/api/tools')
}
```

- [ ] **Step 6: 创建 `src/apis/dashboard.ts`**

```ts
import { apiClient } from './client'

export const dashboardApi = {
  getStats: () => apiClient.get<Record<string, unknown>>('/api/admin/stats'),
  getAgentStats: (params?: Record<string, unknown>) =>
    apiClient.get('/api/admin/stats/agents', { params }),
  getCallStats: (params?: Record<string, unknown>) =>
    apiClient.get('/api/admin/stats/calls', { params }),
  getKnowledgeStats: () => apiClient.get('/api/admin/stats/knowledge'),
  getToolStats: () => apiClient.get('/api/admin/stats/tools'),
  getUserStats: () => apiClient.get('/api/admin/stats/users')
}
```

- [ ] **Step 7: 创建 `src/apis/system.ts`**

```ts
import { apiClient } from './client'

export const systemApi = {
  getConfig: () => apiClient.get<Record<string, unknown>>('/api/system/config'),
  updateConfig: (key: string, value: unknown) =>
    apiClient.put('/api/system/config', { key, value }),
  updateConfigBatch: (config: Record<string, unknown>) =>
    apiClient.put('/api/system/config/batch', config),
  getInfo: () => apiClient.get<Record<string, unknown>>('/api/system/info'),
  healthCheck: () => apiClient.get<{ status: string }>('/api/health', {}, false)
}
```

- [ ] **Step 8: 创建 `src/apis/user.ts`**

```ts
import { apiClient } from './client'

export const userApi = {
  getUserConfig: () => apiClient.get<Record<string, unknown>>('/api/user/config'),
  updateUserConfig: (config: Record<string, unknown>) =>
    apiClient.put('/api/user/config', config),
  getDepartments: () => apiClient.get<{ departments: unknown[] }>('/api/departments'),
  createDepartment: (data: Record<string, unknown>) =>
    apiClient.post('/api/departments', data),
  updateDepartment: (deptId: string, data: Record<string, unknown>) =>
    apiClient.put(`/api/departments/${deptId}`, data),
  deleteDepartment: (deptId: string) =>
    apiClient.delete(`/api/departments/${deptId}`)
}
```

- [ ] **Step 9: 更新 `src/apis/index.ts` 导出所有模块**

```ts
export { apiClient, setAuthStore, ApiError } from './client'
export { authApi } from './auth'
export { agentApi } from './agent'
export { knowledgeApi } from './knowledge'
export { workspaceApi } from './workspace'
export { extensionsApi } from './extensions'
export { dashboardApi } from './dashboard'
export { systemApi } from './system'
export { userApi } from './user'
```

- [ ] **Step 10: 提交**

```bash
git add web-react/src/apis/
git commit -m "feat(web-react): add all API modules"
```

---

## 阶段 2：核心功能模块

### Task 2.1：Auth 功能模块（登录页 + 首页 + 认证回调）

**Files:**
- Create: `web-react/src/features/auth/pages/login-page.tsx`
- Create: `web-react/src/features/auth/pages/home-page.tsx`
- Create: `web-react/src/features/auth/pages/oidc-callback-page.tsx`
- Create: `web-react/src/features/auth/pages/cli-auth-authorize-page.tsx`
- Create: `web-react/src/features/auth/pages/not-found-page.tsx`
- Create: `web-react/src/features/auth/components/login-form.tsx`
- Create: `web-react/src/features/auth/hooks/use-login.ts`

**Interfaces:**
- Consumes: `useAuthStore`, `apiClient`, shadcn/ui 组件
- Produces: 完整的登录流程和公开页面

- [ ] **Step 1: 创建 `login-form.tsx` 组件**

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export default function LoginForm() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ loginId, password })
      const redirect = sessionStorage.getItem('redirect') || searchParams.get('redirect') || '/agent'
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle className="text-center text-2xl">登录 Yuxi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">账号 / 手机号</label>
            <Input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="请输入账号或手机号" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">密码</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            登录
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: 创建 `login-page.tsx`**

```tsx
import { useAuthStore } from '@/stores/auth-store'
import { Navigate } from 'react-router-dom'
import LoginForm from '../components/login-form'

export default function LoginPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (isLoggedIn) return <Navigate to="/agent" replace />
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <LoginForm />
    </div>
  )
}
```

- [ ] **Step 3: 创建 `home-page.tsx`**（简单首页或重定向）

```tsx
import { useAuthStore } from '@/stores/auth-store'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const navigate = useNavigate()

  if (isLoggedIn) return <Navigate to="/agent" replace />

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Yuxi</h1>
      <p className="text-muted-foreground">智能知识库与知识图谱智能体开发平台</p>
      <Button onClick={() => navigate('/login')}>开始使用</Button>
    </div>
  )
}
```

- [ ] **Step 4: 创建 `oidc-callback-page.tsx` 和 `cli-auth-authorize-page.tsx`**（骨架）

```tsx
// oidc-callback-page.tsx
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import Loading from '@/components/shared/loading'

export default function OIDCCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      // OIDC 登录成功后存储 token
      useAuthStore.setState({ token, isLoggedIn: true })
      navigate('/agent', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate, login])

  return <Loading text="处理 OIDC 回调..." />
}
```

- [ ] **Step 5: 创建 `not-found-page.tsx`**

```tsx
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-lg text-muted-foreground">页面未找到</p>
      <Button onClick={() => navigate('/')}>返回首页</Button>
    </div>
  )
}
```

- [ ] **Step 6: 提交**

```bash
git add web-react/src/features/auth/
git commit -m "feat(web-react): add auth module (login, home, OIDC, CLI auth, 404)"
```

---

### Task 2.2：AppLayout 侧边栏完整实现

**Files:**
- Modify: `web-react/src/layouts/app-layout.tsx`
- Create: `web-react/src/features/agent/components/user-info-component.tsx`
- Create: `web-react/src/features/agent/components/task-center-drawer.tsx`
- Create: `web-react/src/features/agent/components/conversation-nav-section.tsx`
- Create: `web-react/src/features/agent/components/conversation-search-modal.tsx`

**Interfaces:**
- Consumes: `useChatStore`, `useAuthStore`, `useAgentStore`, `useUIStore`
- Produces: 完整的主布局侧边栏

- [ ] **Step 1: 实现完整 `app-layout.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  MessageCirclePlus, FolderKanban, LibraryBig, Box, BarChart3,
  PanelLeftClose, PanelLeftOpen, Search, Github, ClipboardList
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useChatStore } from '@/stores/chat-store'
import { useUIStore } from '@/stores/ui-store'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import ConversationNavSection from '@/features/agent/components/conversation-nav-section'
import ConversationSearchModal from '@/features/agent/components/conversation-search-modal'
import UserInfoComponent from '@/features/agent/components/user-info-component'
import TaskCenterDrawer from '@/features/agent/components/task-center-drawer'

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  activePaths?: string[]
  exactActive?: boolean
  hidden?: boolean
}

export default function AppLayout() {
  const { sidebarCollapsed, toggleSidebar, setConversationSearchOpen } = useChatStore()
  const { user, isSuperAdmin, isAdmin } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [githubStars, setGithubStars] = useState(0)

  useEffect(() => {
    fetch('https://api.github.com/repos/xerrors/Yuxi')
      .then((r) => r.json())
      .then((d) => setGithubStars(d.stargazers_count))
      .catch(() => {})
  }, [])

  const mainList: NavItem[] = [
    { name: '创建新对话', path: '/agent', icon: MessageCirclePlus, exactActive: true },
    { name: '工作区', path: '/workspace', icon: FolderKanban },
    { name: '智能体扩展', path: '/extensions', icon: LibraryBig, activePaths: ['/extensions'] },
    { name: '智能体管理', path: '/model-manage', icon: Box },
    ...(isSuperAdmin ? [{ name: '数据总览', path: '/dashboard', icon: BarChart3 }] : [])
  ]

  const isActive = (item: NavItem) => {
    const paths = item.activePaths ?? [item.path]
    if (item.exactActive) return paths.some((p) => location.pathname === p)
    return paths.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`))
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen">
        <aside
          className={`flex h-full flex-col border-r bg-muted/30 transition-all duration-200 ${
            sidebarCollapsed ? 'w-[56px]' : 'w-[230px]'
          }`}
        >
          {/* Brand */}
          <div className="flex h-9 items-center justify-between px-2 py-1.5">
            {sidebarCollapsed ? (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => useChatStore.getState().setSidebarCollapsed(false)}>
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <span className="truncate text-sm font-semibold">Yuxi</span>
                <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={toggleSidebar}>
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-2">
            {mainList.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive(item) ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`justify-start ${sidebarCollapsed ? 'w-9 px-0' : 'w-full'}`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span className="ml-2 truncate">{item.name}</span>}
                  </Button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
              </Tooltip>
            ))}

            {/* Search */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className={`justify-start ${sidebarCollapsed ? 'w-9 px-0' : 'w-full'}`}
                  onClick={() => setConversationSearchOpen(true)}>
                  <Search className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="ml-2 truncate">搜索对话</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && <TooltipContent side="right">搜索对话</TooltipContent>}
            </Tooltip>
          </nav>

          {/* Conversation list */}
          <div className="flex-1 overflow-hidden px-2">
            {!sidebarCollapsed && <ConversationNavSection />}
          </div>

          {/* Bottom */}
          <div className="border-t px-2 py-2">
            {/* GitHub */}
            <div className="mb-2 flex items-center justify-between rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent">
              <a href="https://github.com/xerrors/Yuxi" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-inherit no-underline">
                <Github className="h-4 w-4" />
                {!sidebarCollapsed && <span>GitHub</span>}
              </a>
              {!sidebarCollapsed && githubStars > 0 && (
                <Badge variant="secondary" className="text-xs">{(githubStars / 1000).toFixed(1)}k</Badge>
              )}
            </div>
            {/* User */}
            <UserInfoComponent />
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Modals */}
        <ConversationSearchModal />
        {isAdmin && <TaskCenterDrawer />}
      </div>
    </TooltipProvider>
  )
}
```

- [ ] **Step 2: 创建 `user-info-component.tsx`**（骨架）

```tsx
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import { useChatStore } from '@/stores/chat-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Settings, LogOut, User } from 'lucide-react'

export default function UserInfoComponent() {
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed } = useChatStore()
  const openSettings = useUIStore((s) => s.openSettingsModal)

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex-1 truncate text-left">
              <p className="truncate text-sm font-medium">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user.role}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => openSettings('account')}>
          <User className="mr-2 h-4 w-4" /> 个人设置
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSettings()}>
          <Settings className="mr-2 h-4 w-4" /> 系统设置
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> 退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 3: 创建 `conversation-nav-section.tsx` 和 `conversation-search-modal.tsx`**（骨架，详细实现含后续阶段）

```tsx
// conversation-nav-section.tsx
import { useChatStore } from '@/stores/chat-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare } from 'lucide-react'

export default function ConversationNavSection() {
  const { threads, currentThreadId, setCurrentThreadId } = useChatStore()

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 py-2">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => {
              setCurrentThreadId(thread.id)
              window.location.href = `/agent/${thread.id}`
            }}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
              currentThreadId === thread.id ? 'bg-accent font-medium' : ''
            }`}
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{thread.title || '新对话'}</span>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
```

- [ ] **Step 4: 提交**

```bash
git add web-react/src/layouts/app-layout.tsx web-react/src/features/agent/components/
git commit -m "feat(web-react): implement AppLayout sidebar with navigation"
```

---

### Task 2.3：Agent 对话页（核心功能）

**Files:**
- Create: `web-react/src/features/agent/pages/agent-page.tsx`
- Create: `web-react/src/features/agent/components/agent-chat.tsx`
- Create: `web-react/src/features/agent/components/agent-message.tsx`
- Create: `web-react/src/features/agent/components/agent-input-area.tsx`
- Create: `web-react/src/features/agent/components/agent-selector.tsx`
- Create: `web-react/src/features/agent/components/thread-message-list.tsx`
- Create: `web-react/src/features/agent/components/ai-textarea.tsx`
- Create: `web-react/src/features/agent/hooks/use-chat-stream.ts`
- Create: `web-react/src/features/agent/hooks/use-agent-config.ts`

**Interfaces:**
- Consumes: `useAuthStore`, `useAgentStore`, `useChatStore`, `useChatStream` hook, `agentApi`, `knowledgeApi`
- Produces: 完整的 Agent 对话页面

- [ ] **Step 1: 创建 `use-chat-stream.ts` hook**（SSE 流式处理）

```ts
import { useState, useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'

interface StreamChunk {
  type: 'text' | 'tool_call' | 'tool_result' | 'error' | 'done'
  content: string
  toolCallId?: string
  toolName?: string
  toolArgs?: Record<string, unknown>
}

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [messages, setMessages] = useState<StreamChunk[]>([])
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (threadId: string | null, content: string) => {
    const abortController = new AbortController()
    abortRef.current = abortController
    setIsStreaming(true)
    setMessages([])

    const token = useAuthStore.getState().token
    const url = threadId
      ? `/api/agents/chat/${threadId}`
      : '/api/agents/chat'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: content }),
        signal: abortController.signal
      })

      if (!response.ok) throw new Error('请求失败')

      const reader = response.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter((l) => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          try {
            const parsed = JSON.parse(data)
            setMessages((prev) => [...prev, parsed])
          } catch {
            setMessages((prev) => [...prev, { type: 'text', content: data }])
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((prev) => [...prev, { type: 'error', content: (err as Error).message }])
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [])

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { isStreaming, messages, sendMessage, stopStreaming, setMessages }
}
```

- [ ] **Step 2: 创建 `agent-page.tsx`**

```tsx
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useChatStore } from '@/stores/chat-store'
import { useAgentStore } from '@/stores/agent-store'
import AgentChat from '../components/agent-chat'
import AgentSelector from '../components/agent-selector'
import PageHeader from '@/components/shared/page-header'

export default function AgentPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const setCurrentThreadId = useChatStore((s) => s.setCurrentThreadId)
  const { selectedAgentId, agents, isInitialized, initialize } = useAgentStore()

  useEffect(() => {
    if (threadId) setCurrentThreadId(threadId)
    else setCurrentThreadId(null)
  }, [threadId, setCurrentThreadId])

  useEffect(() => {
    if (!isInitialized) initialize()
  }, [isInitialized, initialize])

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Agent 对话"
        actions={<AgentSelector agents={agents} selectedId={selectedAgentId} />}
      />
      <div className="flex-1">
        <AgentChat threadId={threadId ?? null} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 创建 `agent-chat.tsx`**（消息列表 + 输入区容器）

```tsx
import { useChatStream } from '../hooks/use-chat-stream'
import AgentInputArea from './agent-input-area'
import ThreadMessageList from './thread-message-list'

interface AgentChatProps {
  threadId: string | null
}

export default function AgentChat({ threadId }: AgentChatProps) {
  const { messages, isStreaming, sendMessage, stopStreaming } = useChatStream()

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <ThreadMessageList messages={messages} />
      </div>
      <AgentInputArea
        onSend={(content) => sendMessage(threadId, content)}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </div>
  )
}
```

- [ ] **Step 4: 创建 `agent-input-area.tsx`**

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Square } from 'lucide-react'

interface AgentInputAreaProps {
  onSend: (content: string) => void
  onStop: () => void
  isStreaming: boolean
}

export default function AgentInputArea({ onSend, onStop, isStreaming }: AgentInputAreaProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          rows={3}
          className="resize-none"
        />
        {isStreaming ? (
          <Button variant="destructive" size="icon" onClick={onStop}>
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 `agent-selector.tsx`**

```tsx
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { useAgentStore } from '@/stores/agent-store'

interface Agent {
  id: string
  name: string
}

interface AgentSelectorProps {
  agents: Agent[]
  selectedId: string | null
}

export default function AgentSelector({ agents, selectedId }: AgentSelectorProps) {
  const setSelectedAgentId = useAgentStore((s) => s.setSelectedAgentId)

  const chatAgents = agents.filter((a) => !('is_subagent' in a))

  return (
    <Select
      value={selectedId ?? undefined}
      onValueChange={(val) => setSelectedAgentId(val)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="选择 Agent" />
      </SelectTrigger>
      <SelectContent>
        {chatAgents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

- [ ] **Step 6: 创建 `thread-message-list.tsx`**（骨架，详细渲染在后续 task 中）

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'
import AgentMessage from './agent-message'

interface StreamChunk {
  type: string
  content: string
}

interface ThreadMessageListProps {
  messages: StreamChunk[]
}

export default function ThreadMessageList({ messages }: ThreadMessageListProps) {
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        {messages.map((msg, i) => (
          <AgentMessage key={i} message={msg} />
        ))}
      </div>
    </ScrollArea>
  )
}
```

- [ ] **Step 7: 创建 `agent-message.tsx`**（骨架，支持 Markdown 渲染）

```tsx
import { cn } from '@/lib/utils'
import MarkdownPreview from '@/components/shared/markdown-preview'

interface StreamChunk {
  type: string
  content: string
}

interface AgentMessageProps {
  message: StreamChunk
}

export default function AgentMessage({ message }: AgentMessageProps) {
  const isUser = message.type === 'text' && !message.content.startsWith('{')

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <MarkdownPreview content={message.content} />
      </div>
    </div>
  )
}
```

- [ ] **Step 8: 提交**

```bash
git add web-react/src/features/agent/
git commit -m "feat(web-react): add agent chat page with streaming SSE"
```

---

### Task 2.4：Agent 消息完整渲染（ToolCall + 引用 + 附件）

**Files:**
- Create: `web-react/src/features/agent/tool-calls/tool-registry.ts`
- Create: `web-react/src/features/agent/tool-calls/base-tool-call.tsx`
- Create: `web-react/src/features/agent/tool-calls/tool-call-renderer.tsx`
- Create: 所有 tool 渲染组件（20+ 个）
- Modify: `web-react/src/features/agent/components/agent-message.tsx`

**Interfaces:**
- Consumes: 各 tool 渲染组件
- Produces: 完整的消息渲染管线

- [ ] **Step 1: 创建 `tool-registry.ts`**

```ts
import type { ComponentType } from 'react'

interface ToolCallProps {
  args: Record<string, unknown>
  result?: unknown
  isLoading?: boolean
}

type ToolComponent = ComponentType<ToolCallProps>

const toolMap = new Map<string, ToolComponent>()

export function registerTool(name: string, component: ToolComponent) {
  toolMap.set(name, component)
}

export function getToolComponent(name: string): ToolComponent | undefined {
  return toolMap.get(name)
}

export { type ToolCallProps }
```

- [ ] **Step 2: 创建 `base-tool-call.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface BaseToolCallProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  isLoading?: boolean
}

export default function BaseToolCall({ title, icon, children, isLoading }: BaseToolCallProps) {
  return (
    <Card className="my-2">
      <CardHeader className="py-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">{children}</CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: 创建 `tool-call-renderer.tsx`**

```tsx
import { getToolComponent } from './tool-registry'

interface ToolCallData {
  name: string
  args: Record<string, unknown>
  result?: unknown
  id?: string
}

interface ToolCallRendererProps {
  toolCall: ToolCallData
  isLoading?: boolean
}

export default function ToolCallRenderer({ toolCall, isLoading }: ToolCallRendererProps) {
  const ToolComponent = getToolComponent(toolCall.name)

  if (!ToolComponent) {
    return (
      <div className="rounded-md border p-2 text-sm text-muted-foreground">
        工具调用：{toolCall.name}
        <pre className="mt-1 text-xs">{JSON.stringify(toolCall.args, null, 2)}</pre>
      </div>
    )
  }

  return <ToolComponent args={toolCall.args} result={toolCall.result} isLoading={isLoading} />
}
```

- [ ] **Step 4: 注册常用工具组件**（每个工具单独文件，这里列出核心的几个）

```tsx
// tools/calculator-tool.tsx
import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Calculator } from 'lucide-react'

function CalculatorTool({ args, result }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="计算器" icon={<Calculator className="h-4 w-4" />}>
      <p className="text-sm">表达式: {String(args.expression ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm font-medium">结果: {String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('calculator', CalculatorTool)
registerTool('CalculatorTool', CalculatorTool)

// 同理注册其他工具...
```

为每个工具渲染组件创建一个文件并注册。工具列表（20+ 个）：
- AskUserQuestion, Calculator, Chart, EditFile, Execute, FindKbDocument, GetMindmap, Glob, Grep, Image, KbDocumentPreview, ListDirectory, ListKbs, MysqlDescribeTable, MysqlListTables, MysqlQuery, OcrParseFile, OpenKbDocument, QueryKb, ReadFile, SearchFileContent, SearchFile, SubagentLifecycle, Task, TodoList, WebSearch, WriteFile

- [ ] **Step 5: 更新 `agent-message.tsx` 集成 ToolCall 渲染**

```tsx
import { cn } from '@/lib/utils'
import MarkdownPreview from '@/components/shared/markdown-preview'
import ToolCallRenderer from '../tool-calls/tool-call-renderer'

interface StreamChunk {
  type: string
  content: string
  toolCallId?: string
  toolName?: string
  toolArgs?: string | Record<string, unknown>
  toolResult?: unknown
}

interface AgentMessageProps {
  message: StreamChunk
}

export default function AgentMessage({ message }: AgentMessageProps) {
  if (message.type === 'tool_call' || message.type === 'tool_result') {
    return (
      <div className="flex justify-start px-4">
        <ToolCallRenderer
          toolCall={{
            name: message.toolName ?? 'unknown',
            args: typeof message.toolArgs === 'string' ? JSON.parse(message.toolArgs) : (message.toolArgs ?? {}),
            result: message.toolResult
          }}
        />
      </div>
    )
  }

  const isUser = message.type === 'text'

  return (
    <div className={cn('flex px-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <MarkdownPreview content={message.content} />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: 提交**

```bash
git add web-react/src/features/agent/tool-calls/
git commit -m "feat(web-react): add tool call registry and renderers"
```

---

### Task 2.5：Workspace 工作区

**Files:**
- Create: `web-react/src/features/workspace/pages/workspace-page.tsx`
- Create: `web-react/src/features/workspace/components/workspace-sidebar.tsx`
- Create: `web-react/src/features/workspace/components/workspace-file-list.tsx`
- Create: `web-react/src/features/workspace/components/workspace-preview-pane.tsx`

**Interfaces:**
- Consumes: `workspaceApi`, shadcn/ui 组件
- Produces: 文件浏览和预览的工作区页面

- [ ] **Step 1: 创建 `workspace-page.tsx`**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { workspaceApi } from '@/apis/workspace'
import WorkspaceSidebar from '../components/workspace-sidebar'
import WorkspaceFileList from '../components/workspace-file-list'
import WorkspacePreviewPane from '../components/workspace-preview-pane'
import PageHeader from '@/components/shared/page-header'

export default function WorkspacePage() {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const { data: files, isLoading } = useQuery({
    queryKey: ['workspace-files', currentPath],
    queryFn: () => workspaceApi.listFiles(currentPath)
  })

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="工作区" />
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar currentPath={currentPath} onNavigate={setCurrentPath} />
        <WorkspaceFileList
          files={(files as { files: unknown[] })?.files ?? []}
          isLoading={isLoading}
          currentPath={currentPath}
          onFileSelect={setSelectedFile}
          onNavigate={setCurrentPath}
        />
        {selectedFile && <WorkspacePreviewPane filePath={selectedFile} />}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 `workspace-sidebar.tsx`**

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Folder, Home } from 'lucide-react'

interface WorkspaceSidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export default function WorkspaceSidebar({ currentPath, onNavigate }: WorkspaceSidebarProps) {
  const segments = currentPath.split('/').filter(Boolean)

  return (
    <aside className="w-64 border-r">
      <ScrollArea className="h-full p-2">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onNavigate('/')}>
          <Home className="mr-2 h-4 w-4" /> 根目录
        </Button>
        {segments.map((seg, i) => {
          const path = '/' + segments.slice(0, i + 1).join('/')
          return (
            <Button key={path} variant="ghost" size="sm" className="ml-4 w-[calc(100%-16px)] justify-start"
              onClick={() => onNavigate(path)}>
              <Folder className="mr-2 h-4 w-4" /> {seg}
            </Button>
          )
        })}
      </ScrollArea>
    </aside>
  )
}
```

- [ ] **Step 3: 创建 `workspace-file-list.tsx`** 和 `workspace-preview-pane.tsx`

```tsx
// workspace-file-list.tsx
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import FileTypeIcon from '@/components/shared/file-type-icon'
import ResourceEmptyState from '@/components/shared/resource-empty-state'
import { Folder, ArrowUp, Loader2 } from 'lucide-react'

interface FileItem {
  name: string
  type: 'file' | 'directory'
  path: string
}

interface WorkspaceFileListProps {
  files: FileItem[]
  isLoading: boolean
  currentPath: string
  onFileSelect: (path: string) => void
  onNavigate: (path: string) => void
}

export default function WorkspaceFileList({ files, isLoading, currentPath, onFileSelect, onNavigate }: WorkspaceFileListProps) {
  if (isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!files.length) return <ResourceEmptyState title="此目录为空" />

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="grid gap-1">
        {currentPath !== '/' && (
          <Button variant="ghost" className="justify-start" onClick={() => onNavigate(currentPath.split('/').slice(0, -1).join('/') || '/')}>
            <ArrowUp className="mr-2 h-4 w-4" /> 上级目录
          </Button>
        )}
        {files.map((file) => (
          <Button
            key={file.path}
            variant="ghost"
            className="justify-start"
            onClick={() => file.type === 'directory' ? onNavigate(file.path) : onFileSelect(file.path)}
          >
            {file.type === 'directory' ? <Folder className="mr-2 h-4 w-4" /> : <FileTypeIcon fileName={file.name} />}
            {file.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
```

- [ ] **Step 4: 提交**

```bash
git add web-react/src/features/workspace/
git commit -m "feat(web-react): add workspace module"
```

---

## 阶段 3：二级功能模块

### Task 3.1：Extensions 扩展中心

**Files:**
- Create: `web-react/src/features/extensions/pages/extensions-page.tsx`
- Create: `web-react/src/features/extensions/components/extension-card-grid.tsx`
- Create: `web-react/src/features/extensions/components/extension-detail-layout.tsx`
- Create: `web-react/src/features/extensions/components/extension-toolbar.tsx`
- Create: `web-react/src/features/extensions/components/mcp-card-list.tsx`
- Create: `web-react/src/features/extensions/components/mcp-detail-view.tsx`
- Create: `web-react/src/features/extensions/components/mcp-form-modal.tsx`
- Create: `web-react/src/features/extensions/components/mcp-env-editor.tsx`
- Create: `web-react/src/features/extensions/components/skill-card-list.tsx`
- Create: `web-react/src/features/extensions/components/skill-detail-view.tsx`
- Create: `web-react/src/features/extensions/components/tools-card-list.tsx`

**Interfaces:**
- Consumes: `extensionsApi`, shadcn/ui 组件
- Produces: 扩展中心页面（MCP/Skill/Tool 的列表和详情）

- [ ] **Step 1: 创建 `extensions-page.tsx`**（主页面 + 子路由）

```tsx
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shared/page-header'
import ExtensionCardGrid from '../components/extension-card-grid'

export default function ExtensionsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isDetail = location.pathname.includes('/extensions/')

  if (isDetail) return <Outlet />

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="智能体扩展" />
      <div className="flex-1 p-6">
        <Tabs defaultValue="knowledge">
          <TabsList>
            <TabsTrigger value="knowledge" onClick={() => navigate('/extensions')}>知识库</TabsTrigger>
            <TabsTrigger value="mcp" onClick={() => {}}>MCP 服务</TabsTrigger>
            <TabsTrigger value="skills" onClick={() => {}}>技能</TabsTrigger>
            <TabsTrigger value="tools" onClick={() => {}}>工具</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 MCP 相关组件、Skill 组件、Tool 组件**

（每个组件实现对应的列表/详情/表单功能，参考 Vue 版本的对应组件逻辑）

- [ ] **Step 3: 提交**

```bash
git add web-react/src/features/extensions/
git commit -m "feat(web-react): add extensions module"
```

---

### Task 3.2：Extensions 知识库详情

**Files:**
- Create: `web-react/src/features/extensions/knowledge-base/knowledge-base-detail-page.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/knowledge-source-section.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/knowledge-graph-section.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/query-section.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/file-table.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/file-tree.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/file-detail-modal.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/chunk-params-config.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/search-config-modal.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/search-config-panel.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/embedding-model-selector.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/rerank-model-selector.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/evaluation-benchmarks.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/rag-evaluation-tab.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/kb-chunk-detail-modal.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/kb-result-grouped-list.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/web-search-result-list.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/mind-map-section.tsx`

**Interfaces:**
- Consumes: `knowledgeApi`, `extensionsApi`, shadcn/ui 组件, ECharts/D3/graphology React 封装
- Produces: 完整的知识库详情页面

- [ ] **Step 1: 创建 `knowledge-base-detail-page.tsx`** 作为入口

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { knowledgeApi } from '@/apis/knowledge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shared/page-header'
import Loading from '@/components/shared/loading'
import KnowledgeSourceSection from './knowledge-source-section'
import KnowledgeGraphSection from './knowledge-graph-section'
import QuerySection from './query-section'
import RAGEvaluationTab from './rag-evaluation-tab'

export default function KnowledgeBaseDetailPage() {
  const { kbId } = useParams<{ kbId: string }>()
  const { data: db, isLoading } = useQuery({
    queryKey: ['knowledge-base', kbId],
    queryFn: () => knowledgeApi.getDatabaseDetail(kbId!),
    enabled: !!kbId
  })

  if (isLoading) return <Loading />
  if (!db) return <div className="p-6 text-muted-foreground">知识库未找到</div>

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={(db as { database: { name: string } }).database?.name ?? '知识库详情'} />
      <div className="flex-1 p-6">
        <Tabs defaultValue="sources">
          <TabsList>
            <TabsTrigger value="sources">知识来源</TabsTrigger>
            <TabsTrigger value="query">查询</TabsTrigger>
            <TabsTrigger value="graph">知识图谱</TabsTrigger>
            <TabsTrigger value="evaluation">评估</TabsTrigger>
          </TabsList>
          <TabsContent value="sources"><KnowledgeSourceSection kbId={kbId!} /></TabsContent>
          <TabsContent value="query"><QuerySection kbId={kbId!} /></TabsContent>
          <TabsContent value="graph"><KnowledgeGraphSection kbId={kbId!} /></TabsContent>
          <TabsContent value="evaluation"><RAGEvaluationTab kbId={kbId!} /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

- [ ] **Step 2-4: 创建各个子组件**

（每个子组件对应 Vue 版本的实现，功能包括：文件列表/树、文档上传、分块配置、搜索配置、查询、RAG 评估、知识图谱可视化、思维导图等）

- [ ] **Step 5: 提交**

```bash
git add web-react/src/features/extensions/knowledge-base/
git commit -m "feat(web-react): add knowledge base detail module"
```

---

### Task 3.3：Model Manage 模型管理

**Files:**
- Create: `web-react/src/features/model-manage/pages/model-manage-page.tsx`
- Create: `web-react/src/features/model-manage/components/agent-manage-panel.tsx`
- Create: `web-react/src/features/model-manage/components/agent-edit-modal.tsx`
- Create: `web-react/src/features/model-manage/components/model-provider-manage-panel.tsx`

**Interfaces:**
- Consumes: `agentApi`, `systemApi`, shadcn/ui 组件
- Produces: Agent 和模型提供商管理页面

- [ ] **Step 1-3: 创建页面和组件**

```tsx
// model-manage-page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shared/page-header'
import AgentManagePanel from '../components/agent-manage-panel'
import ModelProviderManagePanel from '../components/model-provider-manage-panel'

export default function ModelManagePage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="智能体管理" />
      <div className="flex-1 p-6">
        <Tabs defaultValue="agents">
          <TabsList>
            <TabsTrigger value="agents">Agent 管理</TabsTrigger>
            <TabsTrigger value="providers">模型提供商</TabsTrigger>
          </TabsList>
          <TabsContent value="agents"><AgentManagePanel /></TabsContent>
          <TabsContent value="providers"><ModelProviderManagePanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 提交**

```bash
git add web-react/src/features/model-manage/
git commit -m "feat(web-react): add model management module"
```

---

### Task 3.4：Dashboard 数据总览

**Files:**
- Create: `web-react/src/features/dashboard/pages/dashboard-page.tsx`
- Create: `web-react/src/features/dashboard/components/stats-overview.tsx`
- Create: `web-react/src/features/dashboard/components/agent-stats.tsx`
- Create: `web-react/src/features/dashboard/components/call-stats.tsx`
- Create: `web-react/src/features/dashboard/components/knowledge-stats.tsx`
- Create: `web-react/src/features/dashboard/components/tool-stats.tsx`
- Create: `web-react/src/features/dashboard/components/user-stats.tsx`
- Create: `web-react/src/features/dashboard/components/feedback-modal.tsx`

**Interfaces:**
- Consumes: `dashboardApi`, ECharts React 封装
- Produces: 数据总览仪表盘页面

- [ ] **Step 1: 创建 `dashboard-page.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard'
import PageHeader from '@/components/shared/page-header'
import StatsOverview from '../components/stats-overview'
import AgentStats from '../components/agent-stats'
import CallStats from '../components/call-stats'

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats()
  })

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="数据总览" />
      <div className="flex-1 space-y-6 overflow-auto p-6">
        <StatsOverview stats={stats as Record<string, unknown>} />
        <div className="grid gap-6 md:grid-cols-2">
          <AgentStats />
          <CallStats />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2-3: 创建各统计组件**

- [ ] **Step 4: 提交**

```bash
git add web-react/src/features/dashboard/
git commit -m "feat(web-react): add dashboard module"
```

---

## 阶段 4：集成与部署

### Task 4.1：Settings 设置模态框

**Files:**
- Create: `web-react/src/components/settings/settings-modal.tsx`
- Create: `web-react/src/components/settings/account-settings.tsx`
- Create: `web-react/src/components/settings/basic-settings.tsx`
- Create: `web-react/src/components/settings/user-config-settings.tsx`
- Create: `web-react/src/components/settings/api-key-management.tsx`
- Create: `web-react/src/components/settings/agent-env-settings.tsx`
- Create: `web-react/src/components/settings/department-management.tsx`
- Create: `web-react/src/components/settings/user-management.tsx`
- Create: `web-react/src/components/settings/share-config-form.tsx`

**Interfaces:**
- Consumes: `useUIStore`, `authApi`, `userApi`, `systemApi`
- Produces: 完整的设置面板

- [ ] **Step 1: 创建 `settings-modal.tsx`**

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import AccountSettings from './account-settings'
import BasicSettings from './basic-settings'
import UserConfigSettings from './user-config-settings'
import ApiKeyManagement from './api-key-management'
import AgentEnvSettings from './agent-env-settings'
import DepartmentManagement from './department-management'
import UserManagement from './user-management'

export default function SettingsModal() {
  const { settingsModalOpen, closeSettingsModal, settingsInitialTab } = useUIStore()
  const { isAdmin, isSuperAdmin } = useAuthStore()

  return (
    <Sheet open={settingsModalOpen} onOpenChange={closeSettingsModal}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>设置</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue={settingsInitialTab || 'account'} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">账户</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">管理</TabsTrigger>}
          </TabsList>
          <TabsContent value="account">
            <AccountSettings />
            <UserConfigSettings />
            <ApiKeyManagement />
            <AgentEnvSettings />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="admin">
              <BasicSettings />
              {isSuperAdmin && <DepartmentManagement />}
              {isSuperAdmin && <UserManagement />}
            </TabsContent>
          )}
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 2-3: 创建各设置子组件**

- [ ] **Step 4: 提交**

```bash
git add web-react/src/components/settings/
git commit -m "feat(web-react): add settings modal with all panels"
```

---

### Task 4.2：工具函数迁移

**Files:**
- Create: `web-react/src/lib/error-handler.ts`
- Create: `web-react/src/lib/file-preview.ts`
- Create: `web-react/src/lib/html-preview-renderer.ts`
- Create: `web-react/src/lib/agent-config-utils.ts`
- Modify: `web-react/src/lib/message-processor.ts`
- Modify: `web-react/src/lib/file-utils.ts`
- Modify: `web-react/src/lib/time.ts`

**Interfaces:**
- Consumes: 无
- Produces: 从 Vue 项目迁移过来的工具函数

- [ ] **Step 1: 逐文件迁移工具函数**

迁移 `web/src/utils/` 中的核心工具函数到 TypeScript 版本，保持逻辑一致。

- [ ] **Step 2: 提交**

```bash
git add web-react/src/lib/
git commit -m "feat(web-react): migrate utility functions from Vue project"
```

---

### Task 4.3：图表库 React 封装

**Files:**
- Create: `web-react/src/components/shared/graph-canvas.tsx`
- Create: `web-react/src/components/shared/graph-detail-panel.tsx`

**Interfaces:**
- Consumes: ECharts, D3, graphology, sigma, @antv/g6
- Produces: 可在 React 中使用的图表组件

- [ ] **Step 1: 安装图表依赖**

```bash
cd web-react
pnpm add echarts d3 graphology sigma @antv/g6
```

- [ ] **Step 2: 创建 ECharts React 封装**

```tsx
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface EChartsWrapperProps {
  option: echarts.EChartsOption
  className?: string
  style?: React.CSSProperties
}

export default function EChartsWrapper({ option, className, style }: EChartsWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current)
    }
    instanceRef.current.setOption(option)

    return () => {
      instanceRef.current?.dispose()
      instanceRef.current = null
    }
  }, [option])

  return <div ref={chartRef} className={className} style={{ ...style, minHeight: 300 }} />
}
```

- [ ] **Step 3: 创建 graphology/sigma React 封装**

```tsx
import { useEffect, useRef } from 'react'
import Graph from 'graphology'
import Sigma from 'sigma'

interface SigmaGraphProps {
  nodes: Array<{ id: string; label: string; x?: number; y?: number; size?: number; color?: string }>
  edges: Array<{ id: string; source: string; target: string; label?: string }>
  className?: string
}

export default function SigmaGraph({ nodes, edges, className }: SigmaGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sigmaRef = useRef<Sigma | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph()
    nodes.forEach((n) => graph.addNode(n.id, n))
    edges.forEach((e) => graph.addEdge(e.source, e.target, e))

    sigmaRef.current = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: true,
      enableEdgeEvents: true
    })

    return () => {
      sigmaRef.current?.kill()
      sigmaRef.current = null
    }
  }, [nodes, edges])

  return <div ref={containerRef} className={className} style={{ height: 400 }} />
}
```

- [ ] **Step 4: 提交**

```bash
git add web-react/src/components/shared/graph-canvas.tsx
git commit -m "feat(web-react): add chart library React wrappers"
```

---

### Task 4.4：Docker 配置

**Files:**
- Create: `web-react/Dockerfile`
- Modify: `docker-compose.yml`（添加 web-react 服务）

**Interfaces:**
- Consumes: 阶段 0 的脚手架
- Produces: 可在 Docker 中热重载运行的 React 前端

- [ ] **Step 1: 创建 `Dockerfile`**

```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS dev
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
```

- [ ] **Step 2: 更新 `docker-compose.yml` 添加 web-react 服务**

参考现有 `web` 服务配置，添加 `web-react` 服务，挂载 `web-react/` 目录到容器。

- [ ] **Step 3: 提交**

```bash
git add web-react/Dockerfile docker-compose.yml
git commit -m "feat(web-react): add Docker configuration"
```

---

### Task 4.5：最终集成测试

**Files:**
- 无新建文件，但需要验证所有功能

**Interfaces:**
- Consumes: 所有已完成的任务

- [ ] **Step 1: 验证路由完整性**

启动 dev server，确认所有页面可正常访问：
- `/` - 首页
- `/login` - 登录页
- 登录后：`/agent`, `/workspace`, `/extensions`, `/model-manage`
- 管理员登录后：`/dashboard`

- [ ] **Step 2: 验证核心功能**

- 登录/登出流程
- Agent 对话创建和消息发送
- 工作区文件浏览
- 知识库列表查看
- 设置面板打开和切换

- [ ] **Step 3: 验证 TypeScript 编译无错误**

```bash
cd web-react
pnpm tsc --noEmit
```

- [ ] **Step 4: 提交**

```bash
git commit -m "chore: final integration testing"
```

---

## 实施顺序建议

建议按以下顺序执行，每个阶段完成后可独立验证：

| 序号 | 任务 | 预计工作量 | 独立可验证 |
|------|------|-----------|-----------|
| 0.1-0.4 | 脚手架搭建 | 小 | ✅ 空页面可运行 |
| 1.1-1.6 | 基础框架 | 中 | ✅ 路由/布局/API 可用 |
| 2.1-2.2 | Auth + 侧边栏 | 中 | ✅ 登录/导航可用 |
| 2.3-2.5 | Agent + Workspace | 大 | ✅ 核心功能可用 |
| 3.1-3.4 | 二级功能模块 | 大 | ✅ 各模块独立可用 |
| 4.1-4.5 | 集成与部署 | 中 | ✅ 完整应用 |

**推荐执行方式：** 使用 `superpowers:subagent-driven-development`，每个 task 由独立子 agent 执行，通过验收后进入下一个。