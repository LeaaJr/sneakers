// src/routes/admin/sneakers/$sneakerId/edit.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router';
import { SneakerForm } from '../SneakerForm'; // Ajusta la ruta a tu componente real

export const Route = createLazyFileRoute('/admin/sneakers/$sneakerId/edit')({
  component: SneakerFormEditPage,
});

function SneakerFormEditPage() {
  const { sneakerData, brandOptions, categoryOptions } = Route.useLoaderData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Editando: {sneakerData.title}</h1>
      <SneakerForm
        isEdit={true}
        initialData={sneakerData}
        brandOptions={brandOptions}
        categoryOptions={categoryOptions}
      />
    </div>
  );
}