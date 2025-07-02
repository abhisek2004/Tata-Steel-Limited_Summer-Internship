"use client"

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface LineChartProps {
  data: { [key: string]: any }[]
  categoryKey: string
  valueKey: string
  title?: string
  description?: string
}

export function LineChart({ data, categoryKey, valueKey, title, description }: LineChartProps) {
  return (
    <div className="h-full w-full">
      {title && <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground text-center mb-4">{description}</p>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <XAxis
            dataKey={categoryKey}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: any) => String(value)}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: any) => String(value)}
          />
          <Tooltip
            formatter={(value: any, name: any) => [String(value), String(name)]}
            labelFormatter={(label: any) => String(label)}
          />
          <Line type="monotone" dataKey={valueKey} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
