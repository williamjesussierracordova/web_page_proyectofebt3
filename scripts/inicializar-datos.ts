/**
 * Script de inicialización de datos para MongoDB
 * Este script crea datos de ejemplo para probar el sistema
 * 
 * IMPORTANTE: Ejecuta este script solo una vez después de configurar MongoDB
 */

import { getDatabase } from '@/lib/mongodb'
import { COLLECTIONS } from '@/lib/types/mongodb'
import { Decimal128 } from 'mongodb'

async function inicializarDatos() {
  try {
    const db = await getDatabase()
    
    console.log('🚀 Iniciando creación de datos de prueba...')
    
    // 1. Crear Bot
    console.log('📱 Creando bot...')
    const botResult = await db.collection(COLLECTIONS.BOTS).insertOne({
      username: 'restaurant_demo_bot',
      created_at: new Date(),
    })
    console.log('✅ Bot creado:', botResult.insertedId)
    
    // 2. Crear Restaurante
    console.log('🏪 Creando restaurante...')
    const restauranteResult = await db.collection(COLLECTIONS.RESTAURANTES).insertOne({
      username_bot: 'restaurant_demo_bot',
      nombre: 'RestaurantePro Demo',
      telefono: '+34 912 345 678',
      direccion: {
        calle: 'Calle Principal 123',
        ciudad: 'Madrid',
        distrito: 'Centro',
      },
    })
    const restauranteId = restauranteResult.insertedId
    console.log('✅ Restaurante creado:', restauranteId)
    
    // 3. Crear Categorías
    console.log('📂 Creando categorías...')
    const categorias = [
      { nombre: 'Entradas', descripcion: 'Aperitivos y entradas para comenzar' },
      { nombre: 'Platos Fuertes', descripcion: 'Platos principales del menú' },
      { nombre: 'Pizzas', descripcion: 'Pizzas artesanales' },
      { nombre: 'Hamburguesas', descripcion: 'Hamburguesas gourmet' },
      { nombre: 'Ensaladas', descripcion: 'Ensaladas frescas y saludables' },
      { nombre: 'Bebidas', descripcion: 'Bebidas frías y calientes' },
      { nombre: 'Postres', descripcion: 'Postres y dulces' },
    ]
    
    await db.collection(COLLECTIONS.CATEGORIAS).insertMany(categorias)
    console.log('✅ Categorías creadas')
    
    // 4. Crear Horarios
    console.log('🕐 Creando horarios...')
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const horarios = dias.map(dia => ({
      id_restaurant: restauranteId,
      dia,
      hora_inicio: dia === 'Domingo' ? '10:00' : '09:00',
      hora_fin: dia === 'Viernes' || dia === 'Sábado' ? '24:00' : '23:00',
      disponibilidad: dia !== 'Domingo', // Cerrado los domingos
    }))
    
    await db.collection(COLLECTIONS.HORARIOS).insertMany(horarios)
    console.log('✅ Horarios creados')
    
    // 5. Crear Productos
    console.log('🍕 Creando productos...')
    const productos = [
      {
        id_restaurant: restauranteId,
        nombre: 'Pizza Margherita',
        precio: Decimal128.fromString('12.50'),
        categoria: 'Pizzas',
        descripcion: 'Tomate, mozzarella y albahaca fresca',
        prep_time_min: 15,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Pizza Pepperoni',
        precio: Decimal128.fromString('14.50'),
        categoria: 'Pizzas',
        descripcion: 'Salsa de tomate, mozzarella y pepperoni',
        prep_time_min: 15,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Hamburguesa Clásica',
        precio: Decimal128.fromString('10.00'),
        categoria: 'Hamburguesas',
        descripcion: 'Carne de res, lechuga, tomate, cebolla y queso',
        prep_time_min: 12,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Hamburguesa BBQ',
        precio: Decimal128.fromString('12.00'),
        categoria: 'Hamburguesas',
        descripcion: 'Carne de res, bacon, queso cheddar y salsa BBQ',
        prep_time_min: 12,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Ensalada César',
        precio: Decimal128.fromString('8.50'),
        categoria: 'Ensaladas',
        descripcion: 'Lechuga romana, pollo, parmesano, croutons y aderezo César',
        prep_time_min: 8,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Ensalada Mediterránea',
        precio: Decimal128.fromString('9.00'),
        categoria: 'Ensaladas',
        descripcion: 'Lechuga mixta, tomate, pepino, aceitunas, queso feta',
        prep_time_min: 8,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Coca-Cola',
        precio: Decimal128.fromString('2.50'),
        categoria: 'Bebidas',
        descripcion: 'Refresco de cola 330ml',
        prep_time_min: 1,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Agua Mineral',
        precio: Decimal128.fromString('1.50'),
        categoria: 'Bebidas',
        descripcion: 'Agua mineral natural 500ml',
        prep_time_min: 1,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Tiramisu',
        precio: Decimal128.fromString('5.50'),
        categoria: 'Postres',
        descripcion: 'Postre italiano con café y mascarpone',
        prep_time_min: 5,
        disponible: true,
      },
      {
        id_restaurant: restauranteId,
        nombre: 'Brownie con Helado',
        precio: Decimal128.fromString('6.00'),
        categoria: 'Postres',
        descripcion: 'Brownie de chocolate caliente con helado de vainilla',
        prep_time_min: 5,
        disponible: true,
      },
    ]
    
    const productosResult = await db.collection(COLLECTIONS.PRODUCTOS).insertMany(productos)
    console.log('✅ Productos creados:', productosResult.insertedCount)
    
    // 6. Crear Cliente de ejemplo
    console.log('👤 Creando cliente de ejemplo...')
    const clienteResult = await db.collection(COLLECTIONS.CLIENTES).insertOne({
      tg_id: '123456789',
      nombre: 'Juan',
      apellido: 'Pérez García',
      email: 'juan.perez@example.com',
      telefono: '+34 600 123 456',
      direccion: 'Calle Ejemplo 45, 3º B, Madrid',
      created_at: new Date(),
    })
    const clienteId = clienteResult.insertedId
    console.log('✅ Cliente creado:', clienteId)
    
    // 7. Crear Pedido de ejemplo
    console.log('📦 Creando pedido de ejemplo...')
    const productosIds = Object.values(productosResult.insertedIds)
    
    const pedidoResult = await db.collection(COLLECTIONS.PEDIDOS).insertOne({
      id_restaurant: restauranteId,
      id_pedido: `PED-${Date.now()}`,
      id_cliente: clienteId,
      estado_pedido: 'pendiente',
      created_at: new Date(),
      fecha_modificacion: new Date(),
      productos: [
        {
          id_producto: productosIds[0], // Pizza Margherita
          nombre_producto: 'Pizza Margherita',
          cantidad: 2,
          precio_unitario: 12.50,
          subtotal: 25.00,
        },
        {
          id_producto: productosIds[6], // Coca-Cola
          nombre_producto: 'Coca-Cola',
          cantidad: 2,
          precio_unitario: 2.50,
          subtotal: 5.00,
        },
      ],
      total_pedido: 30.00,
      metodo_pago: 'tarjeta',
      info_notificacion: {
        email: 'juan.perez@example.com',
        telefono: '+34 600 123 456',
        preferencia_notificacion: 'email',
      },
      notificado: false,
    })
    console.log('✅ Pedido creado:', pedidoResult.insertedId)
    
    // 8. Crear Venta de ejemplo
    console.log('💰 Creando venta de ejemplo...')
    const ventaResult = await db.collection(COLLECTIONS.VENTAS).insertOne({
      id_venta: `VEN-${Date.now()}`,
      fecha_venta: new Date(Date.now() - 86400000), // Ayer
      monto_total: Decimal128.fromString('30.00'),
      impuestos: Decimal128.fromString('3.15'),
      descuentos: Decimal128.fromString('0.00'),
      id_cliente: clienteId,
      productos_vendidos: [
        {
          id_producto: productosIds[2], // Hamburguesa Clásica
          nombre_producto: 'Hamburguesa Clásica',
          cantidad: 2,
          precio_unitario: Decimal128.fromString('10.00'),
          subtotal: Decimal128.fromString('20.00'),
        },
        {
          id_producto: productosIds[6], // Coca-Cola
          nombre_producto: 'Coca-Cola',
          cantidad: 2,
          precio_unitario: Decimal128.fromString('2.50'),
          subtotal: Decimal128.fromString('5.00'),
        },
        {
          id_producto: productosIds[8], // Tiramisu
          nombre_producto: 'Tiramisu',
          cantidad: 1,
          precio_unitario: Decimal128.fromString('5.50'),
          subtotal: Decimal128.fromString('5.50'),
        },
      ],
      metodo_pago: 'efectivo',
      ubicacion_venta: 'app_movil',
    })
    console.log('✅ Venta creada:', ventaResult.insertedId)
    
    console.log('\n🎉 ¡Datos de prueba creados exitosamente!')
    console.log('\n📝 Resumen:')
    console.log(`   - 1 Bot`)
    console.log(`   - 1 Restaurante`)
    console.log(`   - ${categorias.length} Categorías`)
    console.log(`   - ${dias.length} Horarios`)
    console.log(`   - ${productos.length} Productos`)
    console.log(`   - 1 Cliente`)
    console.log(`   - 1 Pedido`)
    console.log(`   - 1 Venta`)
    
    console.log('\n🔑 IDs importantes:')
    console.log(`   Restaurante ID: ${restauranteId}`)
    console.log(`   Cliente ID: ${clienteId}`)
    
    console.log('\n✨ Ahora puedes probar los endpoints con estos datos')
    
  } catch (error) {
    console.error('❌ Error al inicializar datos:', error)
    throw error
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  inicializarDatos()
    .then(() => {
      console.log('✅ Proceso completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error)
      process.exit(1)
    })
}

export { inicializarDatos }
