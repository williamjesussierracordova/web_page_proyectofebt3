import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS } from '@/lib/types/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const fecha_inicio = searchParams.get('fecha_inicio')
    const fecha_fin = searchParams.get('fecha_fin')
    const tipo = searchParams.get('tipo') || 'diario'
    
    let startDate: Date
    let endDate: Date = new Date()
    
    if (fecha_inicio && fecha_fin) {
      startDate = new Date(fecha_inicio)
      endDate = new Date(fecha_fin)
    } else {
      // Por defecto, reporte del día actual
      startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
    }
    
    // Ventas totales
    const ventasPipeline = [
      {
        $match: {
          fecha_venta: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total_ventas: { $sum: { $toDouble: '$monto_total' } },
          total_impuestos: { $sum: { $toDouble: '$impuestos' } },
          total_descuentos: { $sum: { $toDouble: '$descuentos' } },
          cantidad_ventas: { $sum: 1 },
        },
      },
    ]
    
    const ventasResult = await db.collection(COLLECTIONS.VENTAS).aggregate(ventasPipeline).toArray()
    
    // Productos más vendidos
    const productosPipeline = [
      {
        $match: {
          fecha_venta: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      { $unwind: '$productos_vendidos' },
      {
        $group: {
          _id: '$productos_vendidos.nombre_producto',
          cantidad_total: { $sum: '$productos_vendidos.cantidad' },
          ingresos_total: { $sum: { $toDouble: '$productos_vendidos.subtotal' } },
        },
      },
      { $sort: { cantidad_total: -1 } },
      { $limit: 10 },
    ]
    
    const productosTop = await db.collection(COLLECTIONS.VENTAS).aggregate(productosPipeline).toArray()
    
    // Métodos de pago
    const metodosPagoPipeline = [
      {
        $match: {
          fecha_venta: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$metodo_pago',
          cantidad: { $sum: 1 },
          total: { $sum: { $toDouble: '$monto_total' } },
        },
      },
    ]
    
    const metodosPago = await db.collection(COLLECTIONS.VENTAS).aggregate(metodosPagoPipeline).toArray()
    
    // Ventas por hora (para análisis de picos)
    const ventasHoraPipeline = [
      {
        $match: {
          fecha_venta: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $hour: '$fecha_venta' },
          cantidad: { $sum: 1 },
          total: { $sum: { $toDouble: '$monto_total' } },
        },
      },
      { $sort: { _id: 1 } },
    ]
    
    const ventasPorHora = await db.collection(COLLECTIONS.VENTAS).aggregate(ventasHoraPipeline).toArray()
    
    const reporte = {
      periodo: {
        inicio: startDate,
        fin: endDate,
        tipo,
      },
      resumen: ventasResult[0] || {
        total_ventas: 0,
        total_impuestos: 0,
        total_descuentos: 0,
        cantidad_ventas: 0,
      },
      productos_top: productosTop,
      metodos_pago: metodosPago,
      ventas_por_hora: ventasPorHora,
    }
    
    return NextResponse.json({ success: true, data: reporte })
  } catch (error) {
    console.error('Error en reporte:', error)
    return NextResponse.json({ success: false, error: 'Error al generar reporte' }, { status: 500 })
  }
}
