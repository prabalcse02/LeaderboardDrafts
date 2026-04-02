'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface RadarChartProps {
  subjects: Array<{ id: string; name: string; icon: string }>
  targetData: number[]   // 0-1 for each subject (all 1.0 for ideal)
  actualData: number[]   // 0-1 for each subject (user's accuracy)
  compareData?: number[] // optional: community average (orange polygon)
  size?: number          // default 400
  animated?: boolean     // default true
  showLegend?: boolean   // default true
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleRad: number
): { x: number; y: number } {
  return {
    x: cx + r * Math.sin(angleRad),
    y: cy - r * Math.cos(angleRad),
  }
}

function buildPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  values: number[], // 0-1
  axes: number
): string {
  return values
    .map((v, i) => {
      const angle = (2 * Math.PI * i) / axes
      const pt = polarToCartesian(cx, cy, radius * Math.max(0, Math.min(1, v)), angle)
      return `${pt.x},${pt.y}`
    })
    .join(' ')
}

export default function RadarChart({
  subjects,
  targetData,
  actualData,
  compareData,
  size = 400,
  animated = true,
  showLegend = true,
}: RadarChartProps) {
  const axes = subjects.length
  const [drawn, setDrawn] = useState(!animated)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (animated) {
      animRef.current = setTimeout(() => setDrawn(true), 100)
    }
    return () => {
      if (animRef.current) clearTimeout(animRef.current)
    }
  }, [animated])

  if (axes === 0) return null

  const padding = size * 0.22
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - padding
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  // Axis lines
  const axisLines = subjects.map((_, i) => {
    const angle = (2 * Math.PI * i) / axes
    const end = polarToCartesian(cx, cy, radius, angle)
    return { x2: end.x, y2: end.y }
  })

  // Label positions (slightly outside radius)
  const labelOffset = radius + size * 0.075
  const labelPositions = subjects.map((sub, i) => {
    const angle = (2 * Math.PI * i) / axes
    const pt = polarToCartesian(cx, cy, labelOffset, angle)
    return { ...pt, sub }
  })

  const targetPoints = buildPolygonPoints(cx, cy, radius, targetData, axes)
  const actualPoints = buildPolygonPoints(cx, cy, radius, actualData, axes)
  const comparePoints = compareData
    ? buildPolygonPoints(cx, cy, radius, compareData, axes)
    : null

  const polygonVariants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="w-full h-auto"
        style={{ maxWidth: size }}
      >
        {/* Background */}
        <rect width={size} height={size} rx={16} fill="#0a0f1e" />

        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={cx}
            cy={cy}
            r={radius * level}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}

        {/* Grid level labels */}
        {gridLevels.map((level) => (
          <text
            key={`lbl-${level}`}
            x={cx + 4}
            y={cy - radius * level + 4}
            fill="rgba(255,255,255,0.3)"
            fontSize={size * 0.028}
            fontFamily="Inter, system-ui, sans-serif"
          >
            {level.toFixed(1)}
          </text>
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        ))}

        {/* Target polygon (blue) */}
        <motion.polygon
          points={targetPoints}
          fill="rgba(59,130,246,0.15)"
          stroke="#3b82f6"
          strokeWidth={1.5}
          strokeLinejoin="round"
          initial={animated ? 'hidden' : 'visible'}
          animate={drawn ? 'visible' : 'hidden'}
          variants={polygonVariants}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Compare polygon (orange) — community average */}
        {comparePoints && (
          <motion.polygon
            points={comparePoints}
            fill="rgba(249,115,22,0.15)"
            stroke="#f97316"
            strokeWidth={1.5}
            strokeLinejoin="round"
            strokeDasharray="5,3"
            initial={animated ? 'hidden' : 'visible'}
            animate={drawn ? 'visible' : 'hidden'}
            variants={{
              ...polygonVariants,
              visible: { ...polygonVariants.visible, transition: { duration: 0.7, delay: 0.15, ease: 'easeOut' } },
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        )}

        {/* Actual polygon (red/rose) */}
        <motion.polygon
          points={actualPoints}
          fill="rgba(244,63,94,0.25)"
          stroke="#f43f5e"
          strokeWidth={2}
          strokeLinejoin="round"
          initial={animated ? 'hidden' : 'visible'}
          animate={drawn ? 'visible' : 'hidden'}
          variants={{
            ...polygonVariants,
            visible: { ...polygonVariants.visible, transition: { duration: 0.7, delay: 0.25, ease: 'easeOut' } },
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Actual data dots */}
        {drawn &&
          actualData.map((v, i) => {
            const angle = (2 * Math.PI * i) / axes
            const pt = polarToCartesian(cx, cy, radius * Math.max(0, Math.min(1, v)), angle)
            return (
              <circle
                key={`dot-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={3.5}
                fill="#f43f5e"
                stroke="#fff"
                strokeWidth={1}
              />
            )
          })}

        {/* Subject labels */}
        {labelPositions.map(({ x, y, sub }, i) => {
          // Determine text-anchor based on position
          let textAnchor: 'start' | 'middle' | 'end' = 'middle'
          const angle = (2 * Math.PI * i) / axes
          const sinA = Math.sin(angle)
          if (sinA > 0.2) textAnchor = 'start'
          else if (sinA < -0.2) textAnchor = 'end'

          // Short name for display
          const shortName = sub.name.length > 14 ? sub.name.slice(0, 13) + '…' : sub.name

          return (
            <g key={`label-${i}`}>
              <text
                x={x}
                y={y - size * 0.01}
                textAnchor={textAnchor}
                fill="rgba(255,255,255,0.85)"
                fontSize={size * 0.034}
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight="500"
              >
                {sub.icon}
              </text>
              <text
                x={x}
                y={y + size * 0.042}
                textAnchor={textAnchor}
                fill="rgba(255,255,255,0.6)"
                fontSize={size * 0.028}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {shortName}
              </text>
            </g>
          )
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.3)" />
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 opacity-80" />
            <span className="text-white/60">Target Coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-white/60">Your Coverage</span>
          </div>
          {compareData && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 opacity-80" />
              <span className="text-white/60">Community Avg</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
