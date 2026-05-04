'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'

interface ChartsProps {
  articlesBySource: { name: string; count: number }[]
  articlesByCategory: { name: string; count: number }[]
  topTags: { name: string; count: number }[]
  articlesOverTime: { date: string; articles: number }[]
  confidenceDistribution: { high: number; medium: number; low: number }
  subscriberGrowth: { week: string; subscribers: number }[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#6366f1']
const CONFIDENCE_COLORS = ['#10b981', '#f59e0b', '#ef4444']

export default function Charts({
  articlesBySource,
  articlesByCategory,
  topTags,
  articlesOverTime,
  confidenceDistribution,
  subscriberGrowth,
}: ChartsProps) {
  const confidenceData = [
    { name: 'High (≥80%)', value: confidenceDistribution.high },
    { name: 'Medium (50-79%)', value: confidenceDistribution.medium },
    { name: 'Low (<50%)', value: confidenceDistribution.low },
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Articles Over Time */}
      <Card className="military-card">
        <CardHeader>
          <CardTitle className="text-lg">Articles Over Time (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={articlesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelFormatter={formatDate}
                />
                <Line
                  type="monotone"
                  dataKey="articles"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Articles by Source */}
      <Card className="military-card">
        <CardHeader>
          <CardTitle className="text-lg">Articles by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={articlesBySource} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  stroke="#9ca3af"
                  fontSize={11}
                  tickFormatter={(value) =>
                    value.length > 15 ? `${value.substring(0, 15)}...` : value
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Score Distribution */}
      <Card className="military-card">
        <CardHeader>
          <CardTitle className="text-lg">AI Confidence Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {confidenceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Articles by Category */}
      <Card className="military-card">
        <CardHeader>
          <CardTitle className="text-lg">Articles by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={articlesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, count }) => `${name}: ${count}`}
                  labelLine={false}
                >
                  {articlesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Tags */}
      <Card className="military-card">
        <CardHeader>
          <CardTitle className="text-lg">Top Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTags}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickFormatter={(value) =>
                    value.length > 12 ? `${value.substring(0, 12)}...` : value
                  }
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subscriber Growth */}
      <Card className="military-card">
        <CardHeader>
          <CardTitle className="text-lg">Subscriber Growth (Last 4 Weeks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriberGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="subscribers" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
