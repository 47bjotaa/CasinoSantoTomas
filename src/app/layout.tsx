import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Casino - Universidad Santo Tomás',
  description: 'Sistema de pedidos sin fila para el casino CST.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 pb-24`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
