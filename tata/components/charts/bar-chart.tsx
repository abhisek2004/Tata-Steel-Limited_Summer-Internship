"use client"

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BarChartProps {
  data: { label: string; value: number; fill?: string }[]
  categoryKey: string
  valueKey: string
  title?: string
  description?: string
}

export function BarChart({ data, categoryKey, valueKey, title, description }: BarChartProps) {
  return (
    <div className="h-full w-full">
      {title && <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground text-center mb-4">{description}</p>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <XAxis
            dataKey={categoryKey}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: any) => String(value).slice(0, 10) + (String(value).length > 10 ? "..." : "")}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: any) => String(value)}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            formatter={(value: any, name: any) => [String(value), String(name)]}
            labelFormatter={(label: any) => String(label)}
          />
          <Bar dataKey={valueKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
