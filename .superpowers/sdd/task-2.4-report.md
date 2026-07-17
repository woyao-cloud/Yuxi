# Task 2.4: Agent Message ToolCall Rendering

## What was created/modified

### Created: Tool Call Registry System
- `src/features/agent/tool-calls/tool-registry.ts` - Central registry (Map-based) for tool components with `registerTool()` and `getToolComponent()` functions
- `src/features/agent/tool-calls/base-tool-call.tsx` - Base card component wrapping tool call UI with title, icon, loading spinner
- `src/features/agent/tool-calls/tool-call-renderer.tsx` - Renderer that looks up tool components from registry and renders them, with fallback for unknown tools
- `src/features/agent/tool-calls/index.ts` - Barrel export and side-effect imports for all tool registrations

### Created: 27 Tool Component Files
- `src/features/agent/tool-calls/tools/ask-user-question-tool.tsx`
- `src/features/agent/tool-calls/tools/calculator-tool.tsx`
- `src/features/agent/tool-calls/tools/chart-tool.tsx`
- `src/features/agent/tool-calls/tools/edit-file-tool.tsx`
- `src/features/agent/tool-calls/tools/execute-tool.tsx`
- `src/features/agent/tool-calls/tools/find-kb-document-tool.tsx`
- `src/features/agent/tool-calls/tools/get-mindmap-tool.tsx`
- `src/features/agent/tool-calls/tools/glob-tool.tsx`
- `src/features/agent/tool-calls/tools/grep-tool.tsx`
- `src/features/agent/tool-calls/tools/image-tool.tsx`
- `src/features/agent/tool-calls/tools/kb-document-preview-tool.tsx`
- `src/features/agent/tool-calls/tools/list-directory-tool.tsx`
- `src/features/agent/tool-calls/tools/list-kbs-tool.tsx`
- `src/features/agent/tool-calls/tools/mysql-describe-table-tool.tsx`
- `src/features/agent/tool-calls/tools/mysql-list-tables-tool.tsx`
- `src/features/agent/tool-calls/tools/mysql-query-tool.tsx`
- `src/features/agent/tool-calls/tools/ocr-parse-file-tool.tsx`
- `src/features/agent/tool-calls/tools/open-kb-document-tool.tsx`
- `src/features/agent/tool-calls/tools/query-kb-tool.tsx`
- `src/features/agent/tool-calls/tools/read-file-tool.tsx`
- `src/features/agent/tool-calls/tools/search-file-content-tool.tsx`
- `src/features/agent/tool-calls/tools/search-file-tool.tsx`
- `src/features/agent/tool-calls/tools/subagent-lifecycle-tool.tsx`
- `src/features/agent/tool-calls/tools/task-tool.tsx`
- `src/features/agent/tool-calls/tools/todo-list-tool.tsx`
- `src/features/agent/tool-calls/tools/web-search-tool.tsx`
- `src/features/agent/tool-calls/tools/write-file-tool.tsx`

Each tool component registers itself with both snake_case and PascalCase names for flexible lookup.

### Modified
- `src/features/agent/components/agent-message.tsx` - Updated to handle `tool_call` and `tool_result` message types, routing them to `ToolCallRenderer`

## Test Results
- **TypeScript (tsc --noEmit):** PASS (no errors)
- **ESLint:** PASS (no errors)

## Files Changed
- 30 files created (core + 27 tools + index + registry + base + renderer)
- 1 file modified (agent-message.tsx)