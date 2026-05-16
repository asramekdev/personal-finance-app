import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'

export interface ChartDataItem {
  label: string
  value: number
  percentage: number
  color: string
  radiusIndex: number
}

export interface PolarAreaDonutChartProps {
  data: ChartDataItem[]
  width?: number | string
  height?: number | string
  innerRadius?: number
  radiusStep?: number
  className?: string
}

const DEFAULT_WIDTH = '100%'
const DEFAULT_HEIGHT = 360
const DEFAULT_INNER_RADIUS = 60
const DEFAULT_RADIUS_STEP = 16

const RADIAN = Math.PI / 180

function renderSectorLabel(props: any) {
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    payload,
  } = props
  const radius = outerRadius + 18
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const lineEndX = cx + (outerRadius + 8) * Math.cos(-midAngle * RADIAN)
  const lineEndY = cy + (outerRadius + 8) * Math.sin(-midAngle * RADIAN)
  const textAnchor = x > cx ? 'start' : 'end'

  return (
    <g>
      <path
        d={`M ${lineEndX} ${lineEndY} L ${x} ${y}`}
        stroke={payload.color}
        strokeWidth={1}
        fill="none"
        opacity="0.8"
      />
      <circle cx={lineEndX} cy={lineEndY} r={2.5} fill={payload.color} />
      <text x={x} y={y} textAnchor={textAnchor} dy={0} fill="#F8FAFC" fontSize={12} fontWeight={700}>
        {`${payload.percentage.toFixed(0)}%`}
      </text>
    </g>
  )
}

function renderCustomSector(props: any) {
  const {
    cx,
    cy,
    innerRadius,
    startAngle,
    endAngle,
    payload,
    fill,
  } = props
  const outerRadius = payload.outerRadius ?? props.outerRadius
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={10}
        style={{ filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.25))' }}
      />
    </g>
  )
}

export function PolarAreaDonutChart({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  innerRadius = DEFAULT_INNER_RADIUS,
  radiusStep = DEFAULT_RADIUS_STEP,
  className = '',
}: PolarAreaDonutChartProps) {
  const chartData = useMemo(
    () =>
      data.map(item => ({
        ...item,
        outerRadius: innerRadius + item.radiusIndex * radiusStep,
      })),
    [data, innerRadius, radiusStep],
  )

  const maxOuterRadius = useMemo(
    () => Math.max(...chartData.map(item => item.outerRadius), innerRadius + radiusStep),
    [chartData, innerRadius, radiusStep],
  )

  const containerHeight = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`rounded-3xl bg-[#030712] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] ${className}`}
    >

      <div className="w-full" style={{ height: containerHeight }}>
        <ResponsiveContainer width={width} height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={maxOuterRadius}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              label={renderSectorLabel}
              labelLine={false}
              shape={renderCustomSector}
              isAnimationActive={false}
            >
              {chartData.map(item => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#0B132B',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
                borderRadius: '16px',
              }}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              formatter={(value: number) => [value.toLocaleString('cs-CZ'), 'Hodnota']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export const POLAR_AREA_DONUT_MOCK_DATA: ChartDataItem[] = [
  { label: 'Item 01', value: 29550, percentage: 29, color: '#00F29A', radiusIndex: 4 },
  { label: 'Item 02', value: 23550, percentage: 23, color: '#3DD6FF', radiusIndex: 3 },
  { label: 'Item 03', value: 18500, percentage: 18, color: '#3B82F6', radiusIndex: 2 },
  { label: 'Item 04', value: 14500, percentage: 14, color: '#8B5CF6', radiusIndex: 1 },
  { label: 'Item 05', value: 13000, percentage: 13, color: '#F8FAFC', radiusIndex: 2 },
]

export function PolarAreaDonutChartExample() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-[#0B132B] p-6">
      <PolarAreaDonutChart data={POLAR_AREA_DONUT_MOCK_DATA} />
    </div>
  )
}
