export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Menú del Día' | 'Comida Rápida' | 'Bebestibles';
  image_url: string;
  is_available: boolean;
};

export type TimeSlot = {
  id: string; // e.g., "13:00"
  capacity: number; // e.g., 20
  current_orders: number;
};

export type OrderStatus = 'Enviado' | 'Preparando' | 'Listo';

export type Order = {
  id: string;
  order_number: string;
  user_name: string;
  status: OrderStatus;
  total_price: number;
  pickup_time_slot: string;
  items: { product: Product; quantity: number }[];
  created_at: string;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Almuerzo Estudiantil',
    description: 'Pollo asado con arroz y ensalada mixta.',
    price: 3500,
    category: 'Menú del Día',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
    is_available: true,
  },
  {
    id: 'p2',
    name: 'Opción Vegetariana',
    description: 'Hamburguesa de lentejas con puré rústico.',
    price: 3200,
    category: 'Menú del Día',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    is_available: true,
  },
  {
    id: 'p3',
    name: 'Completo Italiano',
    description: 'Pan, salchicha, tomate, palta y mayonesa.',
    price: 2000,
    category: 'Comida Rápida',
    image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
    is_available: true,
  },
  {
    id: 'p4',
    name: 'Papas Fritas Grandes',
    description: 'Porción clásica de papas fritas.',
    price: 1500,
    category: 'Comida Rápida',
    image_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&auto=format&fit=crop&q=60',
    is_available: true,
  },
  {
    id: 'p5',
    name: 'Bebida Lata 350ml',
    description: 'Variedades de bebidas en lata.',
    price: 1000,
    category: 'Bebestibles',
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60',
    is_available: true,
  },
  {
    id: 'p6',
    name: 'Jugo Natural',
    description: 'Jugo de naranja exprimido fresco.',
    price: 1200,
    category: 'Bebestibles',
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=60',
    is_available: true,
  },
];

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: '13:00', capacity: 20, current_orders: 19 },
  { id: '13:15', capacity: 20, current_orders: 5 },
  { id: '13:30', capacity: 20, current_orders: 0 },
  { id: '13:45', capacity: 20, current_orders: 0 },
  { id: '14:00', capacity: 20, current_orders: 0 },
];

export const generateOrderNumber = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
