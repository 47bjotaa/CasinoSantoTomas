'use client';

import { Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Star } from 'lucide-react';
import Image from 'next/image';

export default function ProductCard({ product }: { product: Product }) {
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  // Simulate a badge logic
  const isPopular = product.id === 'p1' || product.id === 'p3';

  return (
    <div className="relative flex flex-row items-center bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-4 p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-4 bg-amber-400 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-b-lg flex items-center gap-1 shadow-sm z-10">
          <Star size={10} fill="currentColor" /> Pop
        </div>
      )}

      {/* Image */}
      <div className="relative w-28 h-28 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 hover:scale-110"
          sizes="112px"
        />
      </div>

      {/* Content */}
      <div className="ml-4 flex-1 flex flex-col justify-between h-28 py-1">
        <div>
          <h3 className="font-bold text-gray-900 leading-tight text-base mt-2 pr-4">
            {product.name}
          </h3>
          <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 leading-relaxed pr-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="font-black text-gray-900 text-lg">
            ${product.price.toLocaleString('es-CL')}
          </span>

          {/* Add to Cart Actions */}
          {qty > 0 ? (
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1.5 border border-gray-200 outline outline-4 outline-gray-50/50">
              <button
                onClick={() => updateQuantity(product.id, qty - 1)}
                className="p-1.5 rounded-full text-gray-600 hover:bg-white hover:shadow-sm transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="text-sm font-bold w-5 text-center text-gray-900">{qty}</span>
              <button
                onClick={() => updateQuantity(product.id, qty + 1)}
                className="p-1.5 rounded-full text-white bg-primary shadow-md hover:bg-primary/90 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center justify-center bg-gray-50 text-gray-800 font-bold h-9 w-9 rounded-full hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
