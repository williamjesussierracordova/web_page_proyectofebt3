"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
} from "recharts"
import { TrendingUp, DollarSign, ShoppingBag, Users, Clock } from "lucide-react"

const dailySalesData = [
  { hour: "09:00", ventas: 45, pedidos: 3 },
  { hour: "10:00", ventas: 78, pedidos: 5 },
  { hour: "11:00", ventas: 120, pedidos: 8 },
  { hour: "12:00", ventas: 245, pedidos: 15 },
  { hour: "13:00", ventas: 380, pedidos: 22 },
  { hour: "14:00", ventas: 420, pedidos: 28 },
  { hour: "15:00", ventas: 290, pedidos: 18 },
  { hour: "16:00", ventas: 180, pedidos: 12 },
  { hour: "17:00", ventas: 150, pedidos: 9 },
  { hour: "18:00", ventas: 200, pedidos: 13 },
  { hour: "19:00", ventas: 350, pedidos: 21 },
  { hour: "20:00", ventas: 480, pedidos: 32 },
  { hour: "21:00", ventas: 520, pedidos: 35 },
  { hour: "22:00", ventas: 380, pedidos: 24 },
]

const topProductsData = [
  { name: "Pizza Margherita", ventas: 45, color: "hsl(var(--chart-1))" },
  { name: "Hamburguesa Completa", ventas: 32, color: "hsl(var(--chart-2))" },
  { name: "Ensalada César", ventas: 28, color: "hsl(var(--chart-3))" },
  { name: "Pasta Carbonara", ventas: 24, color: "hsl(var(--chart-4))" },
  { name: "Pollo a la Plancha", ventas: 18, color: "hsl(var(--chart-5))" },
]

const weeklyComparisonData = [
  { day: "Lun", actual: 2400, anterior: 2200 },
  { day: "Mar", actual: 2800, anterior: 2600 },
  { day: "Mié", actual: 3200, anterior: 2900 },
  { day: "Jue", actual: 3600, anterior: 3100 },
  { day: "Vie", actual: 4200, anterior: 3800 },
  { day: "Sáb", actual: 4800, anterior: 4400 },
  { day: "Dom", actual: 3800, anterior: 3500 },
]

export function SalesDashboard() {
  const totalSales = dailySalesData.reduce((sum, item) => sum + item.ventas, 0)
  const totalOrders = dailySalesData.reduce((sum, item) => sum + item.pedidos, 0)
  const averageOrderValue = totalSales / totalOrders
  const peakHour = dailySalesData.reduce((max, item) => (item.ventas > max.ventas ? item : max))

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ingresos del Día</p>
                <p className="text-2xl font-bold text-primary">€{totalSales.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pedidos Totales</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Promedio</p>
                <p className="text-2xl font-bold">€{averageOrderValue.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+3.7%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hora Pico</p>
                <p className="text-2xl font-bold">{peakHour.hour}</p>
                <p className="text-xs text-muted-foreground">€{peakHour.ventas} en ventas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Ventas por Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-accent" />
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="ventas"
                >
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {topProductsData.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }} />
                    <span className="text-sm">{product.name}</span>
                  </div>
                  <Badge variant="secondary">{product.ventas}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Comparison and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Comparison */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              Comparación Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="anterior" fill="hsl(var(--muted))" name="Semana Anterior" radius={[2, 2, 0, 0]} />
                <Bar dataKey="actual" fill="hsl(var(--primary))" name="Semana Actual" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Objetivo Diario</span>
                <span className="font-medium">€{totalSales.toFixed(0)} / €5000</span>
              </div>
              <Progress value={(totalSales / 5000) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{((totalSales / 5000) * 100).toFixed(1)}% completado</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Satisfacción Cliente</span>
                <span className="font-medium">4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Basado en 127 reseñas</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tiempo Promedio</span>
                <span className="font-medium">18 min</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Objetivo: 20 min</p>
            </div>

            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Resumen del Día</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mejor hora:</span>
                  <span className="font-medium">{peakHour.hour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Producto estrella:</span>
                  <span className="font-medium">Pizza Margherita</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crecimiento:</span>
                  <span className="font-medium text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
