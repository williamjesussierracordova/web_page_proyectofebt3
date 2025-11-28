import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Venta } from '@/lib/types/mongodb'
import { ObjectId, Decimal128 } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const fecha_inicio = searchParams.get('fecha_inicio')
    const fecha_fin = searchParams.get('fecha_fin')
    const id_cliente = searchParams.get('id_cliente')
    
    let filter: any = {}
    
    if (fecha_inicio && fecha_fin) {
      filter.fecha_venta = {
        $gte: new Date(fecha_inicio),
        $lte: new Date(fecha_fin),
      }
    }
    
    if (id_cliente) {
      filter.id_cliente = new ObjectId(id_cliente)
    }
    
    const ventas = await db.collection<Venta>(COLLECTIONS.VENTAS)
      .find(filter)
      .sort({ fecha_venta: -1 })
      .toArray()
    
    return NextResponse.json({ success: true, data: ventas })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener ventas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newVenta: any = {
      id_venta: body.id_venta || `VEN-${Date.now()}`,
      fecha_venta: new Date(),
      monto_total: Decimal128.fromString(body.monto_total.toString()),
      impuestos: Decimal128.fromString(body.impuestos?.toString() || '0'),
      descuentos: Decimal128.fromString(body.descuentos?.toString() || '0'),
      id_cliente: new ObjectId(body.id_cliente),
      productos_vendidos: body.productos_vendidos.map((p: any) => ({
        id_producto: new ObjectId(p.id_producto),
        nombre_producto: p.nombre_producto,
        cantidad: p.cantidad,
        precio_unitario: Decimal128.fromString(p.precio_unitario.toString()),
        subtotal: Decimal128.fromString(p.subtotal.toString()),
      })),
      metodo_pago: body.metodo_pago,
      ubicacion_venta: body.ubicacion_venta || 'tienda_online',
    }
    
    if (body.id_pedido_origen) {
      newVenta.id_pedido_origen = new ObjectId(body.id_pedido_origen)
    }
    
    const result = await db.collection(COLLECTIONS.VENTAS).insertOne(newVenta)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newVenta } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear venta' }, { status: 500 })
  }
}
