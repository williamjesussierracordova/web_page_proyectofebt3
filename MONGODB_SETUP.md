# Sistema de Gestión de Restaurante - MongoDB

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
3. [API Endpoints](#api-endpoints)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Sistema de Notificaciones](#sistema-de-notificaciones)
6. [Reportes](#reportes)

---

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

La dependencia de MongoDB ya está instalada:
```bash
npm install mongodb
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Copia este contenido desde .env.local.example
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
MONGODB_DB_NAME=restaurante_db
```

**Pasos para obtener tu MONGODB_URI:**
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo cluster (gratis con M0)
4. Haz clic en "Connect" → "Connect your application"
5. Copia la connection string y reemplaza `<password>` con tu contraseña

### 3. Estructura de Archivos Creada

```
lib/
  ├── mongodb.ts              # Configuración de conexión
  └── types/
      └── mongodb.ts          # Tipos TypeScript para las colecciones

app/
  └── api/
      ├── bots/
      │   └── route.ts        # CRUD para bots
      ├── restaurantes/
      │   └── route.ts        # CRUD para restaurantes
      ├── categorias/
      │   └── route.ts        # CRUD para categorías
      ├── horarios/
      │   └── route.ts        # CRUD para horarios
      ├── productos/
      │   └── route.ts        # CRUD para productos
      ├── clientes/
      │   └── route.ts        # CRUD para clientes
      ├── pedidos/
      │   └── route.ts        # CRUD para pedidos
      ├── ventas/
      │   └── route.ts        # CRUD para ventas
      ├── notificaciones/
      │   └── route.ts        # Sistema de notificaciones
      └── reportes/
          └── ventas/
              └── route.ts    # Reportes de ventas
```

---

## 📊 Estructura de la Base de Datos

### Colecciones

1. **bots** - Bots de Telegram
2. **restaurantes** - Información de restaurantes
3. **categorias** - Categorías de productos
4. **horarios** - Horarios de atención
5. **productos** - Menú de productos
6. **clientes** - Datos de clientes
7. **pedidos** - Pedidos realizados
8. **ventas** - Registro de ventas completadas

### Tipos de Datos Especiales

- **Decimal128**: Usado para precios y montos monetarios (precisión exacta)
- **ObjectId**: Referencias entre colecciones
- **Date**: Timestamps y fechas

---

## 🔌 API Endpoints

### 1. Bots

#### GET `/api/bots`
Obtener todos los bots
```typescript
Response: {
  success: boolean
  data: Bot[]
}
```

#### POST `/api/bots`
Crear un nuevo bot
```typescript
Body: {
  username: string
}

Response: {
  success: boolean
  data: Bot
}
```

---

### 2. Restaurantes

#### GET `/api/restaurantes`
Obtener todos los restaurantes

#### POST `/api/restaurantes`
Crear un nuevo restaurante
```typescript
Body: {
  username_bot: string
  nombre: string
  telefono: string
  direccion: {
    calle: string | null
    ciudad: string | null
    distrito: string | null
  }
}
```

---

### 3. Categorías

#### GET `/api/categorias`
Obtener todas las categorías

#### POST `/api/categorias`
Crear una nueva categoría
```typescript
Body: {
  nombre: string
  descripcion: string
}
```

---

### 4. Horarios

#### GET `/api/horarios?id_restaurant=<ObjectId>`
Obtener horarios (opcionalmente filtrados por restaurante)

#### POST `/api/horarios`
Crear un nuevo horario
```typescript
Body: {
  id_restaurant: string (ObjectId)
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo"
  hora_inicio: string  // "09:00"
  hora_fin: string     // "17:00"
  disponibilidad: boolean
}
```

---

### 5. Productos

#### GET `/api/productos?id_restaurant=<ObjectId>&categoria=<string>`
Obtener productos (con filtros opcionales)

#### POST `/api/productos`
Crear un nuevo producto
```typescript
Body: {
  id_restaurant: string (ObjectId)
  nombre: string
  precio: number
  categoria: string
  descripcion: string
  prep_time_min: number
  disponible: boolean
}
```

#### PATCH `/api/productos`
Actualizar un producto existente
```typescript
Body: {
  id: string (ObjectId)
  nombre?: string
  precio?: number
  categoria?: string
  descripcion?: string
  prep_time_min?: number
  disponible?: boolean
}
```

---

### 6. Clientes

#### GET `/api/clientes?tg_id=<string>`
Obtener clientes (opcionalmente filtrado por tg_id)

#### POST `/api/clientes`
Crear un nuevo cliente
```typescript
Body: {
  tg_id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
}
```

---

### 7. Pedidos

#### GET `/api/pedidos?id_restaurant=<ObjectId>&estado=<EstadoPedido>&id_cliente=<ObjectId>`
Obtener pedidos (con filtros opcionales)

Estados disponibles: `"pendiente"`, `"en_proceso"`, `"listo_para_entrega"`, `"entregado"`, `"cancelado"`

#### POST `/api/pedidos`
Crear un nuevo pedido
```typescript
Body: {
  id_restaurant: string (ObjectId)
  id_cliente: string (ObjectId)
  productos: Array<{
    id_producto: string (ObjectId)
    nombre_producto: string
    cantidad: number
    precio_unitario: number
  }>
  total_pedido: number
  metodo_pago: "tarjeta" | "efectivo" | "transferencia"
  info_notificacion: {
    email: string
    telefono: string
    preferencia_notificacion: "email" | "sms" | "ninguna"
  }
}
```

#### PATCH `/api/pedidos`
Actualizar estado de un pedido
```typescript
Body: {
  id: string (ObjectId)
  estado_pedido: "pendiente" | "en_proceso" | "listo_para_entrega" | "entregado" | "cancelado"
}
```

---

### 8. Ventas

#### GET `/api/ventas?fecha_inicio=<ISO-Date>&fecha_fin=<ISO-Date>&id_cliente=<ObjectId>`
Obtener ventas (con filtros opcionales)

#### POST `/api/ventas`
Crear una nueva venta
```typescript
Body: {
  monto_total: number
  impuestos?: number
  descuentos?: number
  id_cliente: string (ObjectId)
  productos_vendidos: Array<{
    id_producto: string (ObjectId)
    nombre_producto: string
    cantidad: number
    precio_unitario: number
    subtotal: number
  }>
  metodo_pago: "tarjeta" | "efectivo" | "transferencia"
  id_pedido_origen?: string (ObjectId)
  ubicacion_venta?: string
}
```

---

### 9. Notificaciones

#### GET `/api/notificaciones`
Obtener pedidos listos que no han sido notificados
```typescript
Response: {
  success: boolean
  data: Pedido[] // Pedidos con estado "listo_para_entrega" y notificado: false
}
```

#### POST `/api/notificaciones`
Marcar un pedido como notificado
```typescript
Body: {
  id_pedido: string
}

Response: {
  success: boolean
  data: UpdateResult
}
```

---

### 10. Reportes de Ventas

#### GET `/api/reportes/ventas?fecha_inicio=<ISO-Date>&fecha_fin=<ISO-Date>&tipo=<string>`
Generar reporte de ventas

Parámetros:
- `tipo`: "diario" (default), "semanal", "mensual", "anual"
- Si no se proporcionan fechas, se usa el día actual

```typescript
Response: {
  success: boolean
  data: {
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
      _id: number  // hora (0-23)
      cantidad: number
      total: number
    }>
  }
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear un Restaurante con Bot

```typescript
// 1. Crear un bot
const botResponse = await fetch('/api/bots', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'restaurant_bot_1'
  })
})
const bot = await botResponse.json()

// 2. Crear el restaurante
const restauranteResponse = await fetch('/api/restaurantes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username_bot: 'restaurant_bot_1',
    nombre: 'La Pizzería',
    telefono: '+34 912 345 678',
    direccion: {
      calle: 'Calle Mayor 123',
      ciudad: 'Madrid',
      distrito: 'Centro'
    }
  })
})
```

### Ejemplo 2: Crear un Pedido Completo

```typescript
// 1. Crear/obtener cliente
const cliente = await fetch('/api/clientes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tg_id: '123456789',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    telefono: '+34 600 000 000',
    direccion: 'Calle Falsa 123'
  })
})

const clienteData = await cliente.json()

// 2. Crear el pedido
const pedido = await fetch('/api/pedidos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_restaurant: 'RESTAURANT_OBJECT_ID',
    id_cliente: clienteData.data._id,
    productos: [
      {
        id_producto: 'PRODUCTO_OBJECT_ID',
        nombre_producto: 'Pizza Margherita',
        cantidad: 2,
        precio_unitario: 12.50
      }
    ],
    total_pedido: 25.00,
    metodo_pago: 'tarjeta',
    info_notificacion: {
      email: 'juan@example.com',
      telefono: '+34 600 000 000',
      preferencia_notificacion: 'email'
    }
  })
})
```

### Ejemplo 3: Actualizar Estado de Pedido y Crear Venta

```typescript
// 1. Actualizar pedido a "listo_para_entrega"
await fetch('/api/pedidos', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'PEDIDO_OBJECT_ID',
    estado_pedido: 'listo_para_entrega'
  })
})

// 2. Obtener pedidos listos para notificar
const pedidosListos = await fetch('/api/notificaciones')
const pedidosData = await pedidosListos.json()

// 3. Enviar notificación (lógica de envío de email/SMS)
// ... tu código de notificación ...

// 4. Marcar como notificado
await fetch('/api/notificaciones', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_pedido: 'PED-123456789'
  })
})

// 5. Cuando se entregue, crear venta
await fetch('/api/ventas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    monto_total: 25.00,
    impuestos: 2.10,
    descuentos: 0,
    id_cliente: 'CLIENTE_OBJECT_ID',
    productos_vendidos: [
      {
        id_producto: 'PRODUCTO_OBJECT_ID',
        nombre_producto: 'Pizza Margherita',
        cantidad: 2,
        precio_unitario: 12.50,
        subtotal: 25.00
      }
    ],
    metodo_pago: 'tarjeta',
    id_pedido_origen: 'PEDIDO_OBJECT_ID',
    ubicacion_venta: 'app_movil'
  })
})
```

### Ejemplo 4: Generar Reporte de Ventas

```typescript
// Reporte del día actual
const reporteHoy = await fetch('/api/reportes/ventas')
const dataHoy = await reporteHoy.json()

console.log('Ventas de hoy:', dataHoy.data.resumen.total_ventas)
console.log('Productos top:', dataHoy.data.productos_top)

// Reporte de un rango de fechas
const fechaInicio = '2025-11-01T00:00:00.000Z'
const fechaFin = '2025-11-30T23:59:59.999Z'

const reporteMes = await fetch(
  `/api/reportes/ventas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&tipo=mensual`
)
const dataMes = await reporteMes.json()
```

---

## 🔔 Sistema de Notificaciones

El sistema de notificaciones funciona automáticamente:

1. Cuando un pedido cambia a estado `"listo_para_entrega"`, se actualiza `fecha_listo`
2. Un proceso puede consultar `/api/notificaciones` para obtener pedidos no notificados
3. Después de enviar la notificación, marcar el pedido como notificado con POST `/api/notificaciones`

### Implementar Worker de Notificaciones

Puedes crear un worker que consulte periódicamente:

```typescript
// worker/notificaciones.ts
async function procesarNotificaciones() {
  // 1. Obtener pedidos listos
  const response = await fetch('/api/notificaciones')
  const { data: pedidos } = await response.json()
  
  // 2. Para cada pedido
  for (const pedido of pedidos) {
    // 3. Enviar notificación según preferencia
    if (pedido.info_notificacion.preferencia_notificacion === 'email') {
      await enviarEmail(pedido.info_notificacion.email, pedido)
    } else if (pedido.info_notificacion.preferencia_notificacion === 'sms') {
      await enviarSMS(pedido.info_notificacion.telefono, pedido)
    }
    
    // 4. Marcar como notificado
    await fetch('/api/notificaciones', {
      method: 'POST',
      body: JSON.stringify({ id_pedido: pedido.id_pedido })
    })
  }
}

// Ejecutar cada minuto
setInterval(procesarNotificaciones, 60000)
```

---

## 📈 Reportes

### Tipos de Reportes Disponibles

#### 1. Resumen de Ventas
- Total de ventas
- Impuestos recaudados
- Descuentos aplicados
- Cantidad de transacciones

#### 2. Productos Top
- Productos más vendidos
- Cantidad total vendida
- Ingresos generados

#### 3. Métodos de Pago
- Distribución por método de pago
- Cantidad y total por método

#### 4. Análisis de Picos
- Ventas por hora del día
- Identificar horas pico

---

## 🔧 Consideraciones Técnicas

### Uso de Decimal128

Para precios y montos monetarios, MongoDB utiliza `Decimal128` para evitar errores de precisión:

```typescript
import { Decimal128 } from 'mongodb'

// Al insertar
const precio = Decimal128.fromString('12.50')

// Al leer, convertir a número si es necesario
const precioNumero = parseFloat(precio.toString())
```

### Índices Recomendados

Para mejorar el rendimiento, crea estos índices en MongoDB:

```javascript
// Pedidos
db.pedidos.createIndex({ "estado_pedido": 1, "notificado": 1 })
db.pedidos.createIndex({ "id_cliente": 1 })
db.pedidos.createIndex({ "created_at": -1 })

// Ventas
db.ventas.createIndex({ "fecha_venta": -1 })
db.ventas.createIndex({ "id_cliente": 1 })

// Productos
db.productos.createIndex({ "id_restaurant": 1, "disponible": 1 })
db.productos.createIndex({ "categoria": 1 })

// Horarios
db.horarios.createIndex({ "id_restaurant": 1, "dia": 1 })
```

---

## 🎯 Próximos Pasos

1. Configura tu `MONGODB_URI` en `.env.local`
2. Prueba los endpoints con herramientas como Postman o Thunder Client
3. Implementa la lógica de notificaciones según tus necesidades
4. Personaliza los reportes según tus métricas de negocio
5. Agrega autenticación a los endpoints (JWT, NextAuth, etc.)

---

## 📞 Soporte

Para más información sobre MongoDB y Next.js:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
