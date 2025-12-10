// src/routes/checkout.lazy.tsx

import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import CheckoutPage from '@/components/checkout/CheckoutPage'; // Ajusta la ruta si es necesario

// Define la ruta perezosa para '/checkout'
export const Route = createLazyFileRoute('/checkout')({
  component: CheckoutPage,
});