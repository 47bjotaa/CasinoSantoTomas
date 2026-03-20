'use client';

import { db } from '@/lib/db';
import { Order } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChefHat, Clock, Utensils } from 'lucide-react';

export default function OrderTracking({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial order
    const loadOrder = () => {
      const allOrders = db.getOrders();
      const found = allOrders.find(o => o.id === params.id);
      setOrder(found || null);
      setLoading(false);
    };
    
    loadOrder();

    // Subscribe to real-time changes
    const unsubscribe = db.subscribe(() => {
      loadOrder();
    });

    return unsubscribe;
  }, [params.id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando tu pedido...</div>;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
        <h2 className="text-xl font-bold mb-2">Pedido no encontrado</h2>
        <button onClick={() => router.push('/')} className="text-primary hover:underline">
          Volver al inicio
        </button>
      </div>
    );
  }

  const steps = [
    { status: 'Enviado', icon: <Clock size={24} />, label: 'Enviado' },
    { status: 'Preparando', icon: <ChefHat size={24} />, label: 'Preparando' },
    { status: 'Listo', icon: <CheckCircle2 size={24} />, label: 'Listo' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <main className="min-h-screen bg-gray-50 p-5 flex flex-col pt-12">
      <div className="max-w-md mx-auto w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-center p-8">
        <div className="mb-2 inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full">
          <Utensils size={32} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mt-4 tracking-tight">#{order.order_number}</h1>
        <p className="text-gray-500 mt-1">Este es tu código de retiro</p>
        
        <div className="bg-gray-50 rounded-2xl p-4 mt-6 mb-8 border border-gray-100 flex items-center justify-center gap-2">
          <Clock size={18} className="text-gray-400" />
          <span className="font-semibold text-gray-800">Retiro agendado: <span className="text-primary">{order.pickup_time_slot}</span></span>
        </div>

        {/* Status Tracker */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full">
            <div 
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>
          <div className="relative z-10 flex justify-between">
            {steps.map((step, index) => {
              const isPast = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step.status} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 border-4 border-white
                    ${isCurrent ? 'bg-primary text-white shadow-lg scale-110' : 
                      isPast ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {step.icon}
                  </div>
                  <span className={`text-xs font-bold ${isCurrent ? 'text-primary' :isPast ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {order.status === 'Listo' && (
          <div className="mt-10 animate-in slide-in-from-bottom-5">
            <p className="text-lg font-bold text-green-600">¡Tu comida está lista para retirar!</p>
            <p className="text-sm text-gray-500 mt-1">Muestra tu código <strong>#{order.order_number}</strong> en la barra.</p>
            <button
              onClick={() => router.push('/')}
              className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition-colors"
            >
              Hacer otro pedido
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
