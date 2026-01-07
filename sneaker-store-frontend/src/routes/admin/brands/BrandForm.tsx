// src/routes/admin/brands/BrandForm.tsx

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createBrand, updateBrand } from '@/services/sneakerService';

interface BrandFormInput {
    name: string;
    logo_url: string;
}

interface BrandFormProps {
    initialData?: BrandFormInput;
    isEdit: boolean;
    brandId?: string;
}

const BrandForm: React.FC<BrandFormProps> = ({ initialData, isEdit, brandId }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<BrandFormInput>({ 
        defaultValues: initialData 
    });

    const onSubmit: SubmitHandler<BrandFormInput> = async (data) => {
        try {
            if (isEdit && brandId) {
                await updateBrand(brandId, data);
                console.log("✅ Marca actualizada con éxito");
            } else {
                await createBrand(data);
                console.log("✅ Marca creada con éxito");
            }
            navigate({ to: '/admin/brands' });
        } catch (error) {
            console.error("Error al guardar la marca:", error);
            alert("Hubo un error al conectar con el servidor.");
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10">
            <Link to="/admin/brands" className="flex items-center text-amber-600 mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la lista
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {isEdit ? `Editar Marca: ${initialData?.name}` : 'Crear Nueva Marca'}
            </h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-100">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la Marca*</Label>
                    <Input 
                        id="name" 
                        placeholder="Ej: Nike, Adidas..."
                        {...register("name", { required: "El nombre es obligatorio" })} 
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logo_url">URL del Logo</Label>
                    <Input 
                        id="logo_url" 
                        placeholder="https://ejemplo.com/logo.png"
                        {...register("logo_url")} 
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg"
                >
                    {isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar Marca' : 'Crear Marca')}
                </Button>
            </form>
        </div>
    );
};

export default BrandForm;