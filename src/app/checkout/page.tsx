'use client';

import { useCart } from '@/context/CartContext';
import { db } from '@/lib/db';
import { generateOrderNumber, Order, TimeSlot } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Clock, ShoppingBag } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Make sure we have the latest slots data with polling or initial load (in real app, this would be a real-time subscription)
    setTimeSlots(db.getTimeSlots());
    
    // Subscribe to DB changes to disable slots if they get full while user is in checkout
    const unsubscribe = db.subscribe(() => {
      setTimeSlots([...db.getTimeSlots()]);
    });
    return unsubscribe;
  }, []);

  const handleCheckout = () => {
    if (!userName.trim()) {
      setError('Por favor, ingresa tu nombre.');
      return;
    }
    if (!selectedSlot) {
      setError('Por favor, selecciona un horario de retiro.');
      return;
    }

    try {
      const orderId = uuidv4();
      const newOrder: Order = {
        id: orderId,
        order_number: generateOrderNumber(),
        user_name: userName,
        status: 'Enviado',
        total_price: totalPrice,
        pickup_time_slot: selectedSlot,
        items: items,
        created_at: new Date().toISOString(),
      };

      db.createOrder(newOrder); // This enforces the capacity limit throwing error if full
      clearCart();
      router.push(`/order/${orderId}`);
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
        <ShoppingBag size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
        <button
          onClick={() => router.push('/')}
          className="text-primary font-medium hover:underline"
        >
          Volver al menú
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-5 py-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Finalizar Pedido</h1>
      </header>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
        {/* User Info */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">Tus Datos</h2>
          <input
            type="text"
            placeholder="Ingresa tu nombre..."
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (error) setError('');
            }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50"
          />
        </section>

        {/* Time Slots Area (Capacity Logic) */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3 cursor-default">
            <Clock size={20} className="text-primary" />
            <h2 className="font-semibold text-gray-800">Horario de Retiro</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Elige cuándo pasarás por tu comida. (Cupos limitados por aforo en cocina)</p>
          
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const isFull = slot.current_orders >= slot.capacity;
              const isSelected = selectedSlot === slot.id;
              
              return (
                <button
                  key={slot.id}
                  disabled={isFull}
                  onClick={() => {
                    setSelectedSlot(slot.id);
                    if (error) setError('');
                  }}
                  className={`
                    p-3 rounded-xl border flex flex-col items-center justify-center transition-all
                    ${isFull ? 'bg-gray-100 text-gray-400 border-gray-100 opacity-60 cursor-not-allowed' : 'bg-white hover:border-primary/50'}
                    ${isSelected ? 'border-primary ring-2 ring-primary bg-primary/5 text-primary font-bold' : 'border-gray-200'}
                  `}
                >
                  <span className={`${isSelected ? 'font-bold' : 'font-medium'}`}>{slot.id}</span>
                  <span className="text-[10px] mt-1 opacity-70">
                    {isFull ? 'Lleno' : `${slot.capacity - slot.current_orders} cupos`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">Resumen de Pedido</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex-1">
                  <span className="font-medium text-gray-800 mr-2">{item.quantity}x</span>
                  {item.product.name}
                </span>
                <span className="text-gray-900 font-medium">
                  ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">${totalPrice.toLocaleString('es-CL')}</span>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in">
            {error}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleCheckout}
            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2"
          >
            Confirmar Pedido <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
