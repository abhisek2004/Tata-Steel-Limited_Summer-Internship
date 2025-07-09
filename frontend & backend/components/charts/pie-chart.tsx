"use client"

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"

interface PieChartProps {
  data: { label: string; value: number; fill?: string }[]
  categoryKey: string
  valueKey: string
  title?: string
  description?: string
}

export function PieChart({ data, categoryKey, valueKey, title, description }: PieChartProps) {
  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--destructive))"]

  return (
    <div className="h-full w-full">
      {title && <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground text-center mb-4">{description}</p>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={categoryKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any) => [String(value), String(name)]}
            labelFormatter={(label: any) => String(label)}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
