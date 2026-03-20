'use client';

import { Order, TimeSlot, MOCK_TIME_SLOTS } from './data';

type Listener = () => void;

class MockDatabase {
  listeners: Set<Listener> = new Set();
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Listen to cross-tab storage events
      window.addEventListener('storage', (e) => {
        if (e.key === 'casino_orders' || e.key === 'casino_slots') {
          this.notify();
        }
      });

      // Initialize defaults if they don't exist
      if (!localStorage.getItem('casino_slots')) {
        localStorage.setItem('casino_slots', JSON.stringify(MOCK_TIME_SLOTS));
      }
      if (!localStorage.getItem('casino_orders')) {
        localStorage.setItem('casino_orders', JSON.stringify([]));
      }
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  getOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('casino_orders') || '[]');
    } catch {
      return [];
    }
  }

  getTimeSlots(): TimeSlot[] {
    if (typeof window === 'undefined') return MOCK_TIME_SLOTS;
    try {
      return JSON.parse(localStorage.getItem('casino_slots') || JSON.stringify(MOCK_TIME_SLOTS));
    } catch {
      return MOCK_TIME_SLOTS;
    }
  }

  createOrder(order: Order) {
    const slots = this.getTimeSlots();
    const slotIndex = slots.findIndex(t => t.id === order.pickup_time_slot);
    
    if (slotIndex === -1) throw new Error("Time slot not found");
    if (slots[slotIndex].current_orders >= slots[slotIndex].capacity) {
      throw new Error("El bloque horario elegido ya está lleno.");
    }
    
    // Increment current_orders
    slots[slotIndex].current_orders += 1;
    localStorage.setItem('casino_slots', JSON.stringify(slots));

    // Save order
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem('casino_orders', JSON.stringify(orders));

    // Notify current tab (storage event only notifies OTHER tabs)
    this.notify();
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      localStorage.setItem('casino_orders', JSON.stringify(orders));
      
      this.notify(); // purely for current tab
    }
  }
}

// Global instance 
export const db = new MockDatabase();
