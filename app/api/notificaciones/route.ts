import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS, Pedido } from '@/lib/types/mongodb'

// Endpoint para obtener pedidos listos que no han sido notificados
export async function GET() {
  try {
    const db = await getDatabase()
    
    const pedidosListos = await db.collection<Pedido>(COLLECTIONS.PEDIDOS)
      .find({
        estado_pedido: 'listo_para_entrega',
        notificado: false,
      })
      .toArray()
    
    return NextResponse.json({ success: true, data: pedidosListos })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener pedidos para notificar' }, { status: 500 })
  }
}

// Endpoint para marcar un pedido como notificado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    if (!body.id_pedido) {
      return NextResponse.json({ success: false, error: 'ID de pedido requerido' }, { status: 400 })
    }
    
    const result = await db.collection(COLLECTIONS.PEDIDOS).updateOne(
      { id_pedido: body.id_pedido },
      {
        $set: {
          notificado: true,
          fecha_notificacion: new Date(),
        },
      }
    )
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al marcar pedido como notificado' }, { status: 500 })
  }
}
