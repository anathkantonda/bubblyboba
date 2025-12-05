import { useEffect, useState } from 'react'

const App = () => {

  type Boba = {
    id: number
    name: string
    price: number
  }

  type Order = {
    id: number
    boba: Boba
    status: "pending" | "completed"
  }

  const [boba, setBoba] = useState<Boba[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [completed, setCompleted] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [cashInRegister, setCashInRegister] = useState(100)
  const [nextOrderId, setNextOrderId] = useState(1)

  useEffect(() => {
    fetch('/boba.json')
    .then(res => res.json())
    .then(data => {
      setBoba(data)
      setLoading(false)
    })
  }, [])

  if(loading){
    return <p>Loading boba menu...</p>
  }

  const updateOrderQueue = (drink: Boba): void => {
    const newOrder: Order = {
      id: nextOrderId,
      boba: drink,
      status: 'pending'
    }

    setNextOrderId(prev => prev + 1)
    setCashInRegister(prev => prev + drink.price)
    setOrders(prev => [...prev, newOrder])
  }

  const completeOrder = (orderToComplete: Order): void => {
    setOrders(prev => prev.filter(order => order.id !== orderToComplete.id))

    const completedOrder: Order = {
      ...orderToComplete,
      status: 'completed'
    }

    setCompleted(prev => [...prev, completedOrder])
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="phone-scaler">
        <div className="mockup-phone">
          <div className="mockup-phone-camera"></div>
          <div className="mockup-phone-display text-black pt-25 pl-10 pr-10 pb-20 overflow-y-auto">            
            <h1 className="text-3xl font-black">🌸Bubbly Boba🌸</h1>

            <p className="text-center mt-2 font-bold">
              Cash in register: R{cashInRegister}
            </p>

            {/* menu */}
            <div className="drink-section mt-10">
              <h2 className="text-2xl font-bold underline mb-5">
                Boba Menu
              </h2>

              {boba.map(drink => (
                <div
                  key={drink.id}
                  className="flex justify-between items-center mb-3"
                >
                  <strong>
                    {drink.name} - R{drink.price}
                  </strong>

                  <button
                    onClick={() => updateOrderQueue(drink)}
                    className="btn btn-secondary px-3 py-1 rounded"
                  >
                    Order
                  </button>
                </div>
              ))}
            </div>

            {/* pending */}
            <div className="order-section mt-10">
                <h2 className="text-2xl font-bold underline mb-5">
                  Order Queue
                </h2>

                {orders.length === 0 && (
                  <h3>No Pending Orders</h3>
                )}

                {orders.map(order => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center mb-3"
                  >
                    <p>
                      #{order.id} - {order.boba.name}
                    </p>

                    <button
                      onClick={() => completeOrder(order)}
                      className="btn btn-outline btn-success px-3 py-1 rounded"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              </div>

              {/* completed */}
              <div className="order-section mt-10">
                <h2 className="text-2xl font-bold underline mb-5">
                  Completed Orders
                </h2>

                {completed.length === 0 && (
                  <h3>No Completed Orders</h3>
                )}

                {completed.map(order => (
                  <div key={order.id}>
                    <p>
                      #{order.id} - {order.boba.name} 🌷
                    </p>
                  </div>
                ))}
              </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default App