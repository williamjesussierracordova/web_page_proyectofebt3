"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, MapPin, Phone, Zap, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  customerName: string
  phone: string
  address: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: "pendiente" | "preparando" | "listo"
  orderTime: string
  estimatedTime: number
  isNew?: boolean
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "María González",
    phone: "+34 666 123 456",
    address: "Calle Mayor 15, 2º A",
    items: [
      { name: "Pizza Margherita", quantity: 2, price: 12.5 },
      { name: "Coca Cola", quantity: 2, price: 2.5 },
    ],
    total: 30.0,
    status: "pendiente",
    orderTime: "14:30",
    estimatedTime: 25,
  },
  {
    id: "ORD-002",
    customerName: "Carlos Ruiz",
    phone: "+34 677 987 654",
    address: "Avenida de la Paz 42",
    items: [
      { name: "Hamburguesa Completa", quantity: 1, price: 8.9 },
      { name: "Patatas Fritas", quantity: 1, price: 3.5 },
    ],
    total: 12.4,
    status: "preparando",
    orderTime: "14:25",
    estimatedTime: 15,
  },
  {
    id: "ORD-003",
    customerName: "Ana Martín",
    phone: "+34 655 444 333",
    address: "Plaza del Sol 8",
    items: [
      { name: "Ensalada César", quantity: 1, price: 7.5 },
      { name: "Agua", quantity: 1, price: 1.5 },
    ],
    total: 9.0,
    status: "listo",
    orderTime: "14:15",
    estimatedTime: 0,
  },
]

const mockNewOrders: Omit<Order, "id" | "orderTime" | "estimatedTime" | "isNew">[] = [
  {
    customerName: "Pedro López",
    phone: "+34 688 555 777",
    address: "Calle de la Rosa 25",
    items: [
      { name: "Pizza Pepperoni", quantity: 1, price: 14.0 },
      { name: "Fanta", quantity: 1, price: 2.5 },
    ],
    total: 16.5,
    status: "pendiente",
  },
  {
    customerName: "Laura Sánchez",
    phone: "+34 699 111 222",
    address: "Avenida Central 88",
    items: [
      { name: "Pasta Carbonara", quantity: 2, price: 11.5 },
      { name: "Pan de Ajo", quantity: 1, price: 3.0 },
    ],
    total: 26.0,
    status: "pendiente",
  },
  {
    customerName: "Miguel Torres",
    phone: "+34 677 333 444",
    address: "Plaza Mayor 12",
    items: [
      { name: "Pollo a la Plancha", quantity: 1, price: 9.5 },
      { name: "Ensalada Mixta", quantity: 1, price: 6.0 },
      { name: "Agua", quantity: 2, price: 1.5 },
    ],
    total: 18.5,
    status: "pendiente",
  },
]

export function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isConnected, setIsConnected] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new orders arriving
      if (Math.random() < 0.3) {
        const newOrderData = mockNewOrders[Math.floor(Math.random() * mockNewOrders.length)]
        const currentTime = new Date()
        const newOrder: Order = {
          ...newOrderData,
          id: `ORD-${Date.now().toString().slice(-3)}`,
          orderTime: currentTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          estimatedTime: Math.floor(Math.random() * 20) + 15,
          isNew: true,
        }

        setOrders((prevOrders) => [newOrder, ...prevOrders])
        setLastUpdate(new Date())

        // Show notification for new order
        toast({
          title: "¡Nuevo Pedido!",
          description: `${newOrder.customerName} - S/.${newOrder.total.toFixed(2)}`,
          duration: 5000,
        })

        // Remove the "new" flag after 5 seconds
        setTimeout(() => {
          setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === newOrder.id ? { ...order, isNew: false } : order)),
          )
        }, 5000)
      }

      // Simulate order status updates
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.estimatedTime > 0) {
            const newEstimatedTime = Math.max(0, order.estimatedTime - 1)
            if (newEstimatedTime === 0 && order.status === "preparando") {
              toast({
                title: "Pedido Listo",
                description: `${order.id} - ${order.customerName}`,
                duration: 3000,
              })
              return { ...order, estimatedTime: newEstimatedTime, status: "listo" as const }
            }
            return { ...order, estimatedTime: newEstimatedTime }
          }
          return order
        }),
      )
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [toast])

  useEffect(() => {
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1) // 90% uptime simulation
    }, 30000)

    return () => clearInterval(connectionInterval)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    setLastUpdate(new Date())

    // Show status update notification
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      toast({
        title: "Estado Actualizado",
        description: `${order.id} - ${getStatusText(newStatus)}`,
        duration: 2000,
      })
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "preparando":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "listo":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pendiente":
        return "Pendiente"
      case "preparando":
        return "En Preparación"
      case "listo":
        return "Listo"
    }
  }

  const refreshOrders = () => {
    setLastUpdate(new Date())
    toast({
      title: "Actualizado",
      description: "Lista de pedidos actualizada",
      duration: 1000,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-muted-foreground">{isConnected ? "Conectado" : "Desconectado"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Última actualización: {lastUpdate.toLocaleTimeString("es-ES")}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={refreshOrders}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pendiente").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preparando</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "preparando").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listos</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "listo").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Órdenes</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card
            key={order.id}
            className={`border-l-4 border-l-primary transition-all duration-300 ${
              order.isNew ? "ring-2 ring-primary/20 shadow-lg" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  {order.isNew && (
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-primary animate-pulse" />
                      <Badge className="bg-primary text-primary-foreground animate-pulse">NUEVO</Badge>
                    </div>
                  )}
                </div>
                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Pedido: {order.orderTime}</span>
                {order.estimatedTime > 0 && (
                  <span className="text-primary font-medium">• {order.estimatedTime} min restantes</span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Customer info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.address}</span>
                </div>
              </div>

              {/* Order items */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Productos:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">S/.{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary">S/.{order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                {order.status === "pendiente" && (
                  <Button onClick={() => updateOrderStatus(order.id, "preparando")} className="flex-1" size="sm">
                    Iniciar Preparación
                  </Button>
                )}
                {order.status === "preparando" && (
                  <Button
                    onClick={() => updateOrderStatus(order.id, "listo")}
                    className="flex-1 bg-accent hover:bg-accent/90"
                    size="sm"
                  >
                    Marcar Listo
                  </Button>
                )}
                {order.status === "listo" && (
                  <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                    Entregado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
