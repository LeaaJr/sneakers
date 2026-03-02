// src/routes/my-orders.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router';
import OrdersPage from '@/components/OrdersPage';


export const Route = createLazyFileRoute('/my-orders')({
  component: OrdersPage,
});