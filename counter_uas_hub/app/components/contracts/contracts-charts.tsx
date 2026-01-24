'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AgencyData {
  agency: string
  count: number
  totalValue: number
}

interface MonthData {
  month: string
  totalValue: number
}

interface AgencyBarChartProps {
  data: AgencyData[]
}

interface TrendLineChartProps {
  data: MonthData[]
}

function formatValue(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

function formatMonthLabel(month: string): string {
  const [year, m] = month.split('-')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(m, 10) - 1]} '${year.slice(2)}`
}

function shortenAgencyName(agency: string): string {
  // Shorten common agency names for chart display
  const abbreviations: Record<string, string> = {
    'Department of Defense': 'DoD',
    'Department of the Army': 'Army',
    'Department of the Navy': 'Navy',
    'Department of the Air Force': 'Air Force',
    'Department of Homeland Security': 'DHS',
    'Defense Advanced Research Projects Agency': 'DARPA',
    'Missile Defense Agency': 'MDA',
    'Defense Logistics Agency': 'DLA',
  }
  return abbreviations[agency] || (agency.length > 20 ? agency.slice(0, 18) + '...' : agency)
}

export function AgencyBarChart({ data }: AgencyBarChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    shortName: shortenAgencyName(item.agency),
    formattedValue: formatValue(item.totalValue),
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Contract Value by Agency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                tickFormatter={formatValue}
                className="text-xs fill-muted-foreground"
              />
              <YAxis
                type="category"
                dataKey="shortName"
                width={80}
                className="text-xs fill-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) => [formatValue(value), 'Total Value']}
                labelFormatter={(label) => chartData.find((d) => d.shortName === label)?.agency || label}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Bar
                dataKey="totalValue"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function TrendLineChart({ data }: TrendLineChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatMonthLabel(item.month),
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Monthly Contract Value Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={formatValue}
                className="text-xs fill-muted-foreground"
                width={60}
              />
              <Tooltip
                formatter={(value: number) => [formatValue(value), 'Contract Value']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="totalValue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
