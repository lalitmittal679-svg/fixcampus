import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { STATUS_STYLES } from '../../data/constants'
import type { Status } from '../../types'

export const PALETTE = ['#174C40', '#416FAD', '#E9A66B', '#D66A62', '#6BA38F', '#A9B8D3', '#7C8490']
const axis = { fontSize: 12, fill: '#7C8490' }
const tip = { borderRadius: 10, border: '1px solid #E9EAE7', fontSize: 12 }

export function CategoryDonut({ data, height = 220 }: { data: { name: string; value: number }[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative w-full max-w-[220px] shrink-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="95%" paddingAngle={2} stroke="none">
              {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Pie>
            <Tooltip contentStyle={tip} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold">{total}</span><span className="text-xs text-muted">Total</span></div>
      </div>
      <ul className="w-full space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} /><span className="flex-1 truncate">{d.name}</span><span className="font-semibold">{d.value}</span><span className="w-10 text-right text-xs text-muted">{total ? Math.round((d.value / total) * 100) : 0}%</span></li>
        ))}
      </ul>
    </div>
  )
}

export function TrendChart({ data, height = 240 }: { data: { label: string; reported: number; resolved: number }[]; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#E9EAE7" vertical={false} />
          <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
          <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tip} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="reported" name="Reported" stroke="#416FAD" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#174C40" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StatusBars({ data, height = 220 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#E9EAE7" vertical={false} />
          <XAxis dataKey="name" tick={axis} tickLine={false} axisLine={false} />
          <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tip} cursor={{ fill: '#F7F7F4' }} />
          <Bar dataKey="value" name="Issues" radius={[6, 6, 0, 0]}>
            {data.map((d) => <Cell key={d.name} fill={STATUS_STYLES[d.name as Status].hex} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DepartmentBars({ data, height = 260 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="#E9EAE7" horizontal={false} />
          <XAxis type="number" tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={axis} tickLine={false} axisLine={false} width={130} />
          <Tooltip contentStyle={tip} cursor={{ fill: '#F7F7F4' }} />
          <Bar dataKey="value" name="Issues" fill="#174C40" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
