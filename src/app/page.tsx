'use client';

import { MOCK_PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import CartBar from '@/components/CartBar';
import Image from 'next/image';
import { Search } from 'lucide-react';

export default function StudentAppHome() {
  const categories = ['Menú del Día', 'Comida Rápida', 'Bebestibles'] as const;

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-32 font-sans selection:bg-primary/20">
      {/* Decorative Blur Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-96 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[80px]" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[90px]" />
      </div>

      {/* Hero Banner Section */}
      <header className="px-5 pt-10 pb-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500 font-medium tracking-wide pb-1 uppercase">📍 Campus San Joaquín</p>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Casino <span className="text-primary">UST</span>
            </h1>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f0f9ff" alt="User Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Search Mock */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="¿Qué se te antoja hoy?"
            className="w-full bg-white border border-gray-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl py-3.5 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>

        {/* AI Generated Hero Image Banner */}
        <div className="relative w-full h-44 rounded-3xl overflow-hidden shadow-lg shadow-black/5 mb-2 group">
          <Image
            src="/hero.png"
            alt="Especial del día"
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent flex flex-col justify-end p-5">
            <span className="bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest w-fit mb-2">Descuento</span>
            <h2 className="text-xl font-bold text-white leading-tight">Combo almuerzo ideal<br/>para seguir estudiando.</h2>
          </div>
        </div>
      </header>

      {/* Menu Categories */}
      <div className="px-5 max-w-lg mx-auto space-y-10 relative z-10">
        {categories.map((category) => {
          const products = MOCK_PRODUCTS.filter((p) => p.category === category);
          if (products.length === 0) return null;

          return (
            <section key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${categories.indexOf(category) * 150}ms` }}>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">{category}</h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} platos</span>
              </div>
              <div className="flex flex-col gap-0.5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <CartBar />
    </main>
  );
}
