# Task 4.3: 图表库 React 封装

## 创建内容

### 1. 安装依赖
- `echarts` v6.1.0 - ECharts 图表库
- `graphology` v0.26.0 - 图数据结构库
- `sigma` v3.0.3 - graphology 渲染引擎

### 2. 创建的文件

**`src/components/shared/graph-canvas.tsx`**
- `EChartsWrapper` 组件: 封装 ECharts 图表，通过 `option` prop 控制图表配置，支持自定义 className 和 style
- `SigmaGraph` 组件: 封装 graphology/sigma 图可视化，接收 `nodes` 和 `edges` 数组，渲染为交互式图谱

**`src/components/shared/graph-detail-panel.tsx`**
- `GraphDetailPanel` 组件: 图谱节点/边详情面板，展示选中节点的 ID、标签、类型、自定义属性，或选中边的 ID、来源、目标、标签、自定义属性；未选择时显示提示信息

## 测试结果

### Lint
- 命令: `pnpm lint`
- 结果: 通过，新文件无 lint 错误（31 个错误均为已有代码问题）

### TypeScript 类型检查
- 命令: `pnpm tsc --noEmit`
- 结果: 通过，新文件无类型错误（21 个错误均为已有 `src/router/routes.ts` 文件问题）

## 文件变更

| 文件 | 操作 |
|------|------|
| `web-react/package.json` | 修改 - 新增依赖 |
| `web-react/pnpm-lock.yaml` | 修改 - 依赖锁定 |
| `web-react/src/components/shared/graph-canvas.tsx` | 新建 |
| `web-react/src/components/shared/graph-detail-panel.tsx` | 新建 |