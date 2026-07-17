### Task 4.3：图表库 React 封装


**Files:**
- Create: `web-react/src/components/shared/graph-canvas.tsx`
- Create: `web-react/src/components/shared/graph-detail-panel.tsx`

**Interfaces:**
- Consumes: ECharts, D3, graphology, sigma, @antv/g6
- Produces: 鍙湪 React 涓娇鐢ㄧ殑鍥捐〃缁勪欢

- [ ] **Step 1: 瀹夎鍥捐〃渚濊禆**

```bash
cd web-react
pnpm add echarts d3 graphology sigma @antv/g6
```

- [ ] **Step 2: 鍒涘缓 ECharts React 灏佽**

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

- [ ] **Step 3: 鍒涘缓 graphology/sigma React 灏佽**

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

- [ ] **Step 4: 鎻愪氦**

```bash
git add web-react/src/components/shared/graph-canvas.tsx
git commit -m "feat(web-react): add chart library React wrappers"
```

---

