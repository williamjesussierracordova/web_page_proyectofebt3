import { ObjectId } from 'mongodb'

// Colección: bots
export interface Bot {
  _id?: ObjectId
  username: string
  created_at: Date
}

// Colección: restaurantes
export interface Direccion {
  calle: string | null
  ciudad: string | null
  distrito: string | null
}

export interface Restaurante {
  _id?: ObjectId
  username_bot: string
  nombre: string
  telefono: string
  direccion: Direccion
}

// Colección: categorias
export interface Categoria {
  _id?: ObjectId
  nombre: string
  descripcion: string
}

// Colección: horarios
export interface Horario {
  _id?: ObjectId
  id_restaurant: ObjectId
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'
  hora_inicio: string
  hora_fin: string
  disponibilidad: boolean
}

// Colección: productos
export interface Producto {
  _id?: ObjectId
  id_restaurant: ObjectId
  nombre: string
  precio: number // Se almacenará como Decimal128 en MongoDB
  categoria: string
  descripcion: string
  prep_time_min: number
  disponible: boolean
}

// Colección: clientes
export interface Cliente {
  _id?: ObjectId
  tg_id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  created_at: Date
}

// Colección: pedidos
export interface ProductoPedido {
  id_producto: ObjectId
  nombre_producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface InfoNotificacion {
  email: string
  telefono: string
  preferencia_notificacion: 'email' | 'sms' | 'ninguna'
}

export type EstadoPedido = 'pendiente' | 'en_proceso' | 'listo_para_entrega' | 'entregado' | 'cancelado'

export interface Pedido {
  _id?: ObjectId
  id_restaurant: ObjectId
  id_pedido: string
  id_cliente: ObjectId
  estado_pedido: EstadoPedido
  created_at: Date
  fecha_modificacion: Date
  fecha_listo?: Date
  productos: ProductoPedido[]
  total_pedido: number
  metodo_pago: 'tarjeta' | 'efectivo' | 'transferencia'
  info_notificacion: InfoNotificacion
  notificado: boolean
  fecha_notificacion?: Date
}

// Colección: ventas
export interface ProductoVendido {
  id_producto: ObjectId
  nombre_producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface Venta {
  _id?: ObjectId
  id_venta: string
  fecha_venta: Date
  monto_total: number
  impuestos: number
  descuentos: number
  id_cliente: ObjectId
  productos_vendidos: ProductoVendido[]
  metodo_pago: 'tarjeta' | 'efectivo' | 'transferencia'
  id_pedido_origen?: ObjectId
  ubicacion_venta: string
}

// Nombres de las colecciones
export const COLLECTIONS = {
  BOTS: 'bots',
  RESTAURANTES: 'restaurantes',
  CATEGORIAS: 'categorias',
  HORARIOS: 'horarios',
  PRODUCTOS: 'productos',
  CLIENTES: 'clientes',
  PEDIDOS: 'pedidos',
  VENTAS: 'ventas',
} as const
