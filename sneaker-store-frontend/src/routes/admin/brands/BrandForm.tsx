// src/routes/admin/brands/BrandForm.tsx

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Tipado del Formulario (basado en BrandBase)
interface BrandFormInput {
    name: string;
    logo_url: string;
}

interface BrandFormProps {
    initialData?: BrandFormInput; // Datos para la edición
    isEdit: boolean;
    brandId?: string;
}

const BrandForm: React.FC<BrandFormProps> = ({ initialData, isEdit, brandId }) => {
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState: { isSubmitting } 
    } = useForm<BrandFormInput>({ defaultValues: initialData });

    const onSubmit: SubmitHandler<BrandFormInput> = async (data) => {
        try {
            if (isEdit) {
                // ⚠️ TODO: Llamada PUT/PATCH a /api/v1/brands/{brandId}
                alert(`Updating brand ${brandId} (simulated)...`);
            } else {
                // ⚠️ TODO: Llamada POST a /api/v1/brands
                alert('Creating new brand (simulated)...');
            }
            navigate({ to: '/admin/brands' });
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <Link to="/admin/brands" className="flex items-center text-amber-600 mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Brand List
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {isEdit ? `Edit Brand: ${initialData?.name}` : 'Create New Brand'}
            </h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Brand Name*</Label>
                    <Input id="name" {...register("name", { required: "Name is required" })} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input id="logo_url" {...register("logo_url")} />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg">
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update Brand' : 'Create Brand')}
                </Button>
            </form>
        </div>
    );
};

export default BrandForm;