'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartBar() {
  const { totalItems, totalPrice } = useCart();
  const router = useRouter();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent z-50 animate-in slide-in-from-bottom-5">
      <div 
        onClick={() => router.push('/checkout')}
        className="max-w-lg mx-auto bg-primary text-white p-4 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          </div>
          <p className="font-semibold">Ver Pedido</p>
        </div>
        <p className="font-bold text-lg">
          ${totalPrice.toLocaleString('es-CL')}
        </p>
      </div>
    </div>
  );
}
