import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import Graph from 'graphology'
import Sigma from 'sigma'

interface EChartsWrapperProps {
  option: echarts.EChartsOption
  className?: string
  style?: React.CSSProperties
}

export function EChartsWrapper({ option, className, style }: EChartsWrapperProps) {
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

interface SigmaNode {
  id: string
  label: string
  x?: number
  y?: number
  size?: number
  color?: string
}

interface SigmaEdge {
  id: string
  source: string
  target: string
  label?: string
}

interface SigmaGraphProps {
  nodes: SigmaNode[]
  edges: SigmaEdge[]
  className?: string
}

export function SigmaGraph({ nodes, edges, className }: SigmaGraphProps) {
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