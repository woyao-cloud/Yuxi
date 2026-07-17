# Task 3.2 Report: Extensions 知识库详情

## What was created

### New directory
- `web-react/src/features/extensions/knowledge-base/`

### New files (18 files)

**Main page:**
- `knowledge-base-detail-page.tsx` - Entry page with Tabs (sources, query, graph, evaluation)

**Tab content components:**
- `knowledge-source-section.tsx` - Document list/tree view with upload and chunk config
- `knowledge-graph-section.tsx` - Graph visualization with zoom controls, includes mind-map toggle
- `query-section.tsx` - Search interface with query input, config panel, and result display
- `rag-evaluation-tab.tsx` - RAG evaluation runner with benchmark selection, results display, and history

**File management components:**
- `file-table.tsx` - Table view of documents with status badges and actions
- `file-tree.tsx` - Tree view navigation for file/folder structure
- `file-detail-modal.tsx` - Document detail modal with metadata, content preview

**Configuration components:**
- `chunk-params-config.tsx` - Chunking strategy configuration dialog
- `search-config-modal.tsx` - Search configuration dialog (top-k, threshold, models, reranking)
- `search-config-panel.tsx` - Inline search parameters panel

**Model selectors:**
- `embedding-model-selector.tsx` - Embedding model dropdown selector
- `rerank-model-selector.tsx` - Rerank model dropdown selector

**Evaluation components:**
- `evaluation-benchmarks.tsx` - Benchmark dataset management (upload, preview, delete)
- `kb-chunk-detail-modal.tsx` - Chunk detail dialog with content, metadata, similarity score

**Result display components:**
- `kb-result-grouped-list.tsx` - Grouped search results by document with expandable chunks
- `web-search-result-list.tsx` - Web search results display

**Visualization:**
- `mind-map-section.tsx` - Mind map visualization with tree hierarchy

### Supporting files (2 files)
- `web-react/src/components/ui/table.tsx` - Missing shadcn/ui Table component
- `web-react/src/components/ui/label.tsx` - Missing shadcn/ui Label component

### Route registration
- `web-react/src/router/routes.ts` - Already had the KnowledgeBaseDetailPage import and route configured

## Test results

| Check | Result |
|-------|--------|
| `pnpm lint` | PASS (no errors) |
| `npx tsc --noEmit` | PASS (no errors) |

## Files changed
```
M web-react/src/components/ui/label.tsx
M web-react/src/components/ui/table.tsx
A web-react/src/features/extensions/knowledge-base/chunk-params-config.tsx
A web-react/src/features/extensions/knowledge-base/embedding-model-selector.tsx
A web-react/src/features/extensions/knowledge-base/evaluation-benchmarks.tsx
A web-react/src/features/extensions/knowledge-base/file-detail-modal.tsx
A web-react/src/features/extensions/knowledge-base/file-table.tsx
A web-react/src/features/extensions/knowledge-base/file-tree.tsx
A web-react/src/features/extensions/knowledge-base/kb-chunk-detail-modal.tsx
A web-react/src/features/extensions/knowledge-base/kb-result-grouped-list.tsx
A web-react/src/features/extensions/knowledge-base/knowledge-base-detail-page.tsx
A web-react/src/features/extensions/knowledge-base/knowledge-graph-section.tsx
A web-react/src/features/extensions/knowledge-base/knowledge-source-section.tsx
A web-react/src/features/extensions/knowledge-base/mind-map-section.tsx
A web-react/src/features/extensions/knowledge-base/query-section.tsx
A web-react/src/features/extensions/knowledge-base/rag-evaluation-tab.tsx
A web-react/src/features/extensions/knowledge-base/rerank-model-selector.tsx
A web-react/src/features/extensions/knowledge-base/search-config-modal.tsx
A web-react/src/features/extensions/knowledge-base/search-config-panel.tsx
A web-react/src/features/extensions/knowledge-base/web-search-result-list.tsx
```