import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Pedido, EstadoPedido } from '@/lib/types/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const id_restaurant = searchParams.get('id_restaurant')
    const estado = searchParams.get('estado') as EstadoPedido | null
    const id_cliente = searchParams.get('id_cliente')
    
    let filter: any = {}
    if (id_restaurant) filter.id_restaurant = new ObjectId(id_restaurant)
    if (estado) filter.estado_pedido = estado
    if (id_cliente) filter.id_cliente = new ObjectId(id_cliente)
    
    const pedidos = await db.collection<Pedido>(COLLECTIONS.PEDIDOS)
      .find(filter)
      .sort({ created_at: -1 })
      .toArray()
    
    return NextResponse.json({ success: true, data: pedidos })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener pedidos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newPedido: Pedido = {
      id_restaurant: new ObjectId(body.id_restaurant),
      id_pedido: body.id_pedido || `PED-${Date.now()}`,
      id_cliente: new ObjectId(body.id_cliente),
      estado_pedido: 'pendiente',
      created_at: new Date(),
      fecha_modificacion: new Date(),
      productos: body.productos.map((p: any) => ({
        id_producto: new ObjectId(p.id_producto),
        nombre_producto: p.nombre_producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
        subtotal: p.cantidad * p.precio_unitario,
      })),
      total_pedido: body.total_pedido,
      metodo_pago: body.metodo_pago,
      info_notificacion: body.info_notificacion,
      notificado: false,
    }
    
    const result = await db.collection<Pedido>(COLLECTIONS.PEDIDOS).insertOne(newPedido)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newPedido } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear pedido' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID de pedido requerido' }, { status: 400 })
    }
    
    const updateData: any = {
      fecha_modificacion: new Date(),
    }
    
    if (body.estado_pedido) {
      updateData.estado_pedido = body.estado_pedido
      
      // Si el estado es "listo_para_entrega", actualizar fecha_listo
      if (body.estado_pedido === 'listo_para_entrega') {
        updateData.fecha_listo = new Date()
      }
    }
    
    const result = await db.collection(COLLECTIONS.PEDIDOS).updateOne(
      { _id: new ObjectId(body.id) },
      { $set: updateData }
    )
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al actualizar pedido' }, { status: 500 })
  }
}
