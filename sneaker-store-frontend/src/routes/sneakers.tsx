// src/routes/sneakers.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/sneakers')({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});