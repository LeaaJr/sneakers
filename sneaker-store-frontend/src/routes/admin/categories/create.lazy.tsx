// src/routes/admin/categories/create.lazy.tsx

import { createLazyFileRoute } from '@tanstack/react-router';
import CategoryForm from './CategoryForm';

export const Route = createLazyFileRoute('/admin/categories/create')({
  component: () => <CategoryForm isEdit={false} />,
});