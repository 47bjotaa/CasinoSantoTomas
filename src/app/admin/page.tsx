'use client';

import { db } from '@/lib/db';
import { Order } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Check, ChefHat, Clock } from 'lucide-react';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Initial load
    setOrders([...db.getOrders()]);
    
    // Subscribe to new orders or changes
    const unsubscribe = db.subscribe(() => {
      setOrders([...db.getOrders()]);
    });
    
    return unsubscribe;
  }, []);

  const updateStatus = (id: string, status: Order['status']) => {
    db.updateOrderStatus(id, status);
  };

  const newOrders = orders.filter(o => o.status === 'Enviado');
  const preppingOrders = orders.filter(o => o.status === 'Preparando');
  const readyOrders = orders.filter(o => o.status === 'Listo');

  const renderOrderCard = (order: Order, nextStatus: Order['status'], nextStatusLabel: string, actionColor: string) => (
    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded inline-block mb-1">
            {order.pickup_time_slot}
          </span>
          <h3 className="font-黑text-gray-900 text-lg">#{order.order_number}</h3>
          <p className="text-xs text-gray-500">{order.user_name}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-50 py-2 my-2">
        {order.items.map(item => (
          <div key={item.product.id} className="text-sm flex justify-between">
            <span className="font-medium">{item.quantity}x</span>
            <span className="text-gray-600 text-right flex-1 ml-2 truncate">{item.product.name}</span>
          </div>
        ))}
      </div>

      {nextStatus && (
        <button
          onClick={() => updateStatus(order.id, nextStatus)}
          className={`w-full py-2 px-4 rounded-lg text-sm font-bold text-white transition-all ${actionColor}`}
        >
          {nextStatusLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChefHat size={24} className="text-primary" />
          <h1 className="text-xl font-bold">Kitchen Dashboard - Casino UST</h1>
        </div>
        <div className="text-sm opacity-80 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Sistema Real-time Activo
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Column: Recibidos */}
        <div className="flex flex-col h-full bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <Clock size={18} /> Nuevos Recibidos
            </h2>
            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{newOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            {newOrders.map(o => renderOrderCard(o, 'Preparando', 'Aceptar & Preparar', 'bg-blue-600 hover:bg-blue-700'))}
            {newOrders.length === 0 && <p className="text-center text-gray-400 mt-10 text-sm">No hay pedidos nuevos</p>}
          </div>
        </div>

        {/* Column: Preparando */}
        <div className="flex flex-col h-full bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-blue-800 flex items-center gap-2">
              <ChefHat size={18} /> Preparando
            </h2>
            <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{preppingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            {preppingOrders.map(o => renderOrderCard(o, 'Listo', 'Marcar como Listo', 'bg-green-600 hover:bg-green-700'))}
            {preppingOrders.length === 0 && <p className="text-center text-blue-400/60 mt-10 text-sm">Nada en preparación</p>}
          </div>
        </div>

        {/* Column: Listos */}
        <div className="flex flex-col h-full bg-green-50/50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-green-800 flex items-center gap-2">
              <Check size={18} /> Listos para Retirar
            </h2>
            <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{readyOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            {readyOrders.map(o => renderOrderCard(o, null as unknown as Order['status'], '', ''))}
            {readyOrders.length === 0 && <p className="text-center text-green-400/60 mt-10 text-sm">No hay pedidos listos</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
