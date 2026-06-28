import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_KEY = '@shialhos:orders';

export async function saveOrder(order) {
  const existing = await getOrders();
  const updated = [order, ...existing];
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  return order;
}

export async function getOrders() {
  try {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  const orders = await getOrders();
  const updated = orders.map((o) =>
    o.id === orderId ? { ...o, status } : o
  );
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
}

export function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SHI-${ts}-${rand}`;
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PREPARING: 'preparing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const STATUS_LABELS = {
  pending: { label: 'Aguardando Pagamento', color: '#C8960A', icon: 'time-outline' },
  paid: { label: 'Pagamento Confirmado', color: '#2D6A1A', icon: 'checkmark-circle-outline' },
  preparing: { label: 'Em Preparo', color: '#1E6B8A', icon: 'construct-outline' },
  shipped: { label: 'Enviado', color: '#7B3FA0', icon: 'car-outline' },
  delivered: { label: 'Entregue', color: '#2D6A1A', icon: 'home-outline' },
  cancelled: { label: 'Cancelado', color: '#DC2626', icon: 'close-circle-outline' },
};
