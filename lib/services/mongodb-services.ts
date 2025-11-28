/**
 * Servicios para integrar MongoDB con el frontend
 * Usa estos servicios en tus componentes de React/Next.js
 */

import { 
  Bot, 
  Restaurante, 
  Categoria, 
  Horario, 
  Producto, 
  Cliente, 
  Pedido, 
  Venta,
  EstadoPedido 
} from '@/lib/types/mongodb'

// Tipo de respuesta genérica de la API
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// =============================================================================
// BOTS
// =============================================================================

export const botsService = {
  async getAll(): Promise<Bot[]> {
    const response = await fetch('/api/bots')
    const data: ApiResponse<Bot[]> = await response.json()
    return data.data || []
  },

  async create(username: string): Promise<Bot> {
    const response = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    const data: ApiResponse<Bot> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },
}

// =============================================================================
// RESTAURANTES
// =============================================================================

export const restaurantesService = {
  async getAll(): Promise<Restaurante[]> {
    const response = await fetch('/api/restaurantes')
    const data: ApiResponse<Restaurante[]> = await response.json()
    return data.data || []
  },

  async create(restaurante: Omit<Restaurante, '_id'>): Promise<Restaurante> {
    const response = await fetch('/api/restaurantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurante),
    })
    const data: ApiResponse<Restaurante> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },
}

// =============================================================================
// CATEGORÍAS
// =============================================================================

export const categoriasService = {
  async getAll(): Promise<Categoria[]> {
    const response = await fetch('/api/categorias')
    const data: ApiResponse<Categoria[]> = await response.json()
    return data.data || []
  },

  async create(categoria: Omit<Categoria, '_id'>): Promise<Categoria> {
    const response = await fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    })
    const data: ApiResponse<Categoria> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },
}

// =============================================================================
// HORARIOS
// =============================================================================

export const horariosService = {
  async getByRestaurant(id_restaurant: string): Promise<Horario[]> {
    const response = await fetch(`/api/horarios?id_restaurant=${id_restaurant}`)
    const data: ApiResponse<Horario[]> = await response.json()
    return data.data || []
  },

  async create(horario: Omit<Horario, '_id'>): Promise<Horario> {
    const response = await fetch('/api/horarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(horario),
    })
    const data: ApiResponse<Horario> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },
}

// =============================================================================
// PRODUCTOS
// =============================================================================

export const productosService = {
  async getAll(filters?: { id_restaurant?: string; categoria?: string }): Promise<Producto[]> {
    const params = new URLSearchParams()
    if (filters?.id_restaurant) params.append('id_restaurant', filters.id_restaurant)
    if (filters?.categoria) params.append('categoria', filters.categoria)
    
    const response = await fetch(`/api/productos?${params}`)
    const data: ApiResponse<Producto[]> = await response.json()
    return data.data || []
  },

  async create(producto: Omit<Producto, '_id'>): Promise<Producto> {
    const response = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    })
    const data: ApiResponse<Producto> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },

  async update(id: string, updates: Partial<Producto>): Promise<void> {
    const response = await fetch('/api/productos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    const data: ApiResponse<any> = await response.json()
    if (!data.success) throw new Error(data.error)
  },

  async toggleDisponibilidad(id: string, disponible: boolean): Promise<void> {
    await this.update(id, { disponible })
  },
}

// =============================================================================
// CLIENTES
// =============================================================================

export const clientesService = {
  async getAll(): Promise<Cliente[]> {
    const response = await fetch('/api/clientes')
    const data: ApiResponse<Cliente[]> = await response.json()
    return data.data || []
  },

  async getByTelegramId(tg_id: string): Promise<Cliente | null> {
    const response = await fetch(`/api/clientes?tg_id=${tg_id}`)
    const data: ApiResponse<Cliente[]> = await response.json()
    return data.data?.[0] || null
  },

  async create(cliente: Omit<Cliente, '_id' | 'created_at'>): Promise<Cliente> {
    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    })
    const data: ApiResponse<Cliente> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },
}

// =============================================================================
// PEDIDOS
// =============================================================================

export const pedidosService = {
  async getAll(filters?: {
    id_restaurant?: string
    estado?: EstadoPedido
    id_cliente?: string
  }): Promise<Pedido[]> {
    const params = new URLSearchParams()
    if (filters?.id_restaurant) params.append('id_restaurant', filters.id_restaurant)
    if (filters?.estado) params.append('estado', filters.estado)
    if (filters?.id_cliente) params.append('id_cliente', filters.id_cliente)
    
    const response = await fetch(`/api/pedidos?${params}`)
    const data: ApiResponse<Pedido[]> = await response.json()
    return data.data || []
  },

  async create(pedido: Omit<Pedido, '_id' | 'id_pedido' | 'estado_pedido' | 'created_at' | 'fecha_modificacion' | 'notificado'>): Promise<Pedido> {
    const response = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    })
    const data: ApiResponse<Pedido> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },

  async updateEstado(id: string, estado_pedido: EstadoPedido): Promise<void> {
    const response = await fetch('/api/pedidos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado_pedido }),
    })
    const data: ApiResponse<any> = await response.json()
    if (!data.success) throw new Error(data.error)
  },

  // Helpers para estados específicos
  async marcarEnProceso(id: string): Promise<void> {
    await this.updateEstado(id, 'en_proceso')
  },

  async marcarListoParaEntrega(id: string): Promise<void> {
    await this.updateEstado(id, 'listo_para_entrega')
  },

  async marcarEntregado(id: string): Promise<void> {
    await this.updateEstado(id, 'entregado')
  },

  async cancelar(id: string): Promise<void> {
    await this.updateEstado(id, 'cancelado')
  },
}

// =============================================================================
// VENTAS
// =============================================================================

export const ventasService = {
  async getAll(filters?: {
    fecha_inicio?: Date
    fecha_fin?: Date
    id_cliente?: string
  }): Promise<Venta[]> {
    const params = new URLSearchParams()
    if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio.toISOString())
    if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin.toISOString())
    if (filters?.id_cliente) params.append('id_cliente', filters.id_cliente)
    
    const response = await fetch(`/api/ventas?${params}`)
    const data: ApiResponse<Venta[]> = await response.json()
    return data.data || []
  },

  async create(venta: Omit<Venta, '_id' | 'id_venta' | 'fecha_venta'>): Promise<Venta> {
    const response = await fetch('/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta),
    })
    const data: ApiResponse<Venta> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },

  // Helper para crear venta desde un pedido
  async crearDesdePedido(pedido: Pedido): Promise<Venta> {
    return this.create({
      monto_total: pedido.total_pedido,
      impuestos: pedido.total_pedido * 0.105, // 10.5% IVA (ejemplo)
      descuentos: 0,
      id_cliente: pedido.id_cliente,
      productos_vendidos: pedido.productos.map(p => ({
        id_producto: p.id_producto,
        nombre_producto: p.nombre_producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
        subtotal: p.subtotal,
      })),
      metodo_pago: pedido.metodo_pago,
      id_pedido_origen: pedido._id,
      ubicacion_venta: 'app_movil',
    })
  },
}

// =============================================================================
// NOTIFICACIONES
// =============================================================================

export const notificacionesService = {
  async getPedidosParaNotificar(): Promise<Pedido[]> {
    const response = await fetch('/api/notificaciones')
    const data: ApiResponse<Pedido[]> = await response.json()
    return data.data || []
  },

  async marcarComoNotificado(id_pedido: string): Promise<void> {
    const response = await fetch('/api/notificaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_pedido }),
    })
    const data: ApiResponse<any> = await response.json()
    if (!data.success) throw new Error(data.error)
  },
}

// =============================================================================
// REPORTES
// =============================================================================

export interface ReporteVentas {
  periodo: {
    inicio: Date
    fin: Date
    tipo: string
  }
  resumen: {
    total_ventas: number
    total_impuestos: number
    total_descuentos: number
    cantidad_ventas: number
  }
  productos_top: Array<{
    _id: string
    cantidad_total: number
    ingresos_total: number
  }>
  metodos_pago: Array<{
    _id: string
    cantidad: number
    total: number
  }>
  ventas_por_hora: Array<{
    _id: number
    cantidad: number
    total: number
  }>
}

export const reportesService = {
  async getReporteVentas(options?: {
    fecha_inicio?: Date
    fecha_fin?: Date
    tipo?: 'diario' | 'semanal' | 'mensual' | 'anual'
  }): Promise<ReporteVentas> {
    const params = new URLSearchParams()
    if (options?.fecha_inicio) params.append('fecha_inicio', options.fecha_inicio.toISOString())
    if (options?.fecha_fin) params.append('fecha_fin', options.fecha_fin.toISOString())
    if (options?.tipo) params.append('tipo', options.tipo)
    
    const response = await fetch(`/api/reportes/ventas?${params}`)
    const data: ApiResponse<ReporteVentas> = await response.json()
    if (!data.success) throw new Error(data.error)
    return data.data!
  },

  async getReporteHoy(): Promise<ReporteVentas> {
    return this.getReporteVentas({ tipo: 'diario' })
  },

  async getReporteSemanal(): Promise<ReporteVentas> {
    const hoy = new Date()
    const inicioSemana = new Date(hoy)
    inicioSemana.setDate(hoy.getDate() - hoy.getDay())
    inicioSemana.setHours(0, 0, 0, 0)
    
    const finSemana = new Date(inicioSemana)
    finSemana.setDate(inicioSemana.getDate() + 6)
    finSemana.setHours(23, 59, 59, 999)
    
    return this.getReporteVentas({
      fecha_inicio: inicioSemana,
      fecha_fin: finSemana,
      tipo: 'semanal',
    })
  },

  async getReporteMensual(): Promise<ReporteVentas> {
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999)
    
    return this.getReporteVentas({
      fecha_inicio: inicioMes,
      fecha_fin: finMes,
      tipo: 'mensual',
    })
  },
}

// =============================================================================
// EXPORT por defecto con todos los servicios
// =============================================================================

export default {
  bots: botsService,
  restaurantes: restaurantesService,
  categorias: categoriasService,
  horarios: horariosService,
  productos: productosService,
  clientes: clientesService,
  pedidos: pedidosService,
  ventas: ventasService,
  notificaciones: notificacionesService,
  reportes: reportesService,
}
