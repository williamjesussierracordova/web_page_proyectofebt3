'use client'

/**
 * Componente de ejemplo: Panel de Gestión MongoDB
 * 
 * Este componente demuestra cómo usar los servicios de MongoDB
 * en tu aplicación Next.js
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  productosService, 
  pedidosService, 
  reportesService,
  type ReporteVentas 
} from '@/lib/services/mongodb-services'
import type { Producto, Pedido } from '@/lib/types/mongodb'
import { RefreshCw, Package, TrendingUp, AlertCircle } from 'lucide-react'

export function MongoDBDashboard() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [reporte, setReporte] = useState<ReporteVentas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      setLoading(true)
      setError(null)

      // Cargar múltiples recursos en paralelo
      const [productosData, pedidosData, reporteData] = await Promise.all([
        productosService.getAll(),
        pedidosService.getAll({ estado: 'pendiente' }),
        reportesService.getReporteHoy(),
      ])

      setProductos(productosData)
      setPedidos(pedidosData)
      setReporte(reporteData)
    } catch (err) {
      setError('Error al cargar datos. Verifica tu configuración de MongoDB.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function cambiarDisponibilidadProducto(id: string, disponible: boolean) {
    try {
      await productosService.toggleDisponibilidad(id, !disponible)
      await cargarDatos() // Recargar datos
    } catch (err) {
      console.error('Error al cambiar disponibilidad:', err)
    }
  }

  async function cambiarEstadoPedido(id: string, nuevoEstado: 'en_proceso' | 'listo_para_entrega') {
    try {
      await pedidosService.updateEstado(id, nuevoEstado)
      await cargarDatos() // Recargar datos
    } catch (err) {
      console.error('Error al cambiar estado:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <Button onClick={cargarDatos} variant="outline" className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel MongoDB</h2>
          <p className="text-muted-foreground">Gestión en tiempo real con MongoDB</p>
        </div>
        <Button onClick={cargarDatos} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Resumen de Ventas */}
      {reporte && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{reporte.resumen.total_ventas.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {reporte.resumen.cantidad_ventas} transacciones
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Impuestos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{reporte.resumen.total_impuestos.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Descuentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{reporte.resumen.total_descuentos.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pedidos.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Productos Top */}
      {reporte && reporte.productos_top.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reporte.productos_top.slice(0, 5).map((producto, index) => (
                <div key={producto._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{producto._id}</p>
                      <p className="text-sm text-muted-foreground">
                        {producto.cantidad_total} vendidos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{producto.ingresos_total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Lista de Productos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos ({productos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {productos.slice(0, 10).map((producto) => (
                <div
                  key={producto._id?.toString()}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{producto.nombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {producto.categoria}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {producto.prep_time_min} min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      €{producto.precio.toString()}
                    </span>
                    <Button
                      size="sm"
                      variant={producto.disponible ? "default" : "secondary"}
                      onClick={() => cambiarDisponibilidadProducto(
                        producto._id?.toString() || '',
                        producto.disponible
                      )}
                    >
                      {producto.disponible ? 'Disponible' : 'No disponible'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pedidos Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Pendientes ({pedidos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pedidos.map((pedido) => (
                <div
                  key={pedido._id?.toString()}
                  className="p-3 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{pedido.id_pedido}</span>
                    <Badge variant={
                      pedido.estado_pedido === 'pendiente' ? 'secondary' :
                      pedido.estado_pedido === 'en_proceso' ? 'default' :
                      'outline'
                    }>
                      {pedido.estado_pedido}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {pedido.productos.length} productos - €{pedido.total_pedido.toFixed(2)}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {pedido.estado_pedido === 'pendiente' && (
                      <Button
                        size="sm"
                        onClick={() => cambiarEstadoPedido(
                          pedido._id?.toString() || '',
                          'en_proceso'
                        )}
                      >
                        Comenzar
                      </Button>
                    )}
                    {pedido.estado_pedido === 'en_proceso' && (
                      <Button
                        size="sm"
                        onClick={() => cambiarEstadoPedido(
                          pedido._id?.toString() || '',
                          'listo_para_entrega'
                        )}
                      >
                        Marcar Listo
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {pedidos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay pedidos pendientes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
